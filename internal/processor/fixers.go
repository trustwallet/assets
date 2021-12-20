package processor

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"

	fileLib "github.com/trustwallet/assets-go-libs/file"
	"github.com/trustwallet/assets-go-libs/image"
	"github.com/trustwallet/assets-go-libs/path"
	"github.com/trustwallet/assets-go-libs/validation"
	"github.com/trustwallet/assets-go-libs/validation/info"
	"github.com/trustwallet/assets/internal/file"
	"github.com/trustwallet/go-primitives/address"
	"github.com/trustwallet/go-primitives/coin"
	"github.com/trustwallet/go-primitives/types"

	log "github.com/sirupsen/logrus"
)

func (s *Service) FixJSON(f *file.AssetFile) error {
	return fileLib.FormatJSONFile(f.Path())
}

func (s *Service) FixETHAddressChecksum(f *file.AssetFile) error {
	if !coin.IsEVM(f.Chain().ID) {
		return nil
	}

	assetDir := filepath.Base(f.Path())

	err := validation.ValidateETHForkAddress(f.Chain(), assetDir)
	if err != nil {
		checksum, e := address.EIP55Checksum(assetDir)
		if e != nil {
			return fmt.Errorf("failed to get checksum: %s", e)
		}

		newName := path.GetAssetPath(f.Chain().Handle, checksum)

		if e = os.Rename(f.Path(), newName); e != nil {
			return fmt.Errorf("failed to rename dir: %s", e)
		}

		s.fileService.UpdateFile(f, checksum)

		log.WithField("from", assetDir).
			WithField("to", checksum).
			Debug("Renamed asset")
	}

	return nil
}

func (s *Service) FixLogo(f *file.AssetFile) error {
	width, height, err := image.GetPNGImageDimensions(f.Path())
	if err != nil {
		return err
	}

	var isLogoTooLarge bool
	if width > validation.MaxW || height > validation.MaxH {
		isLogoTooLarge = true
	}

	if isLogoTooLarge {
		log.WithField("path", f.Path()).Debug("Fixing too large image")

		targetW, targetH := calculateTargetDimension(width, height)

		err = image.ResizePNG(f.Path(), targetW, targetH)
		if err != nil {
			return err
		}
	}

	err = validation.ValidateLogoFileSize(f.Path())
	if err != nil { // nolint:staticcheck
		// TODO: Compress images.
	}

	return nil
}

func calculateTargetDimension(width, height int) (targetW, targetH int) {
	widthFloat := float32(width)
	heightFloat := float32(height)

	maxEdge := widthFloat
	if heightFloat > widthFloat {
		maxEdge = heightFloat
	}

	ratio := validation.MaxW / maxEdge

	targetW = int(widthFloat * ratio)
	targetH = int(heightFloat * ratio)

	return targetW, targetH
}

func (s *Service) FixChainInfoJSON(f *file.AssetFile) error {
	chainInfo := info.CoinModel{}

	err := fileLib.ReadJSONFile(f.Path(), &chainInfo)
	if err != nil {
		return err
	}

	expectedType := string(types.Coin)
	if chainInfo.Type == nil || *chainInfo.Type != expectedType {
		chainInfo.Type = &expectedType

		return fileLib.CreateJSONFile(f.Path(), &chainInfo)
	}

	return nil
}

func (s *Service) FixAssetInfoJSON(file *file.AssetFile) error {
	assetInfo := info.AssetModel{}

	err := fileLib.ReadJSONFile(file.Path(), &assetInfo)
	if err != nil {
		return err
	}

	var isModified bool

	// Fix asset type.
	var assetType string
	if assetInfo.Type != nil {
		assetType = *assetInfo.Type
	}

	// We need to skip error check to fix asset type if it's incorrect or empty.
	chain, _ := types.GetChainFromAssetType(assetType)

	expectedTokenType, ok := types.GetTokenType(file.Chain().ID, file.Asset())
	if !ok {
		expectedTokenType = strings.ToUpper(assetType)
	}

	if chain.ID != file.Chain().ID || !strings.EqualFold(assetType, expectedTokenType) {
		assetInfo.Type = &expectedTokenType
		isModified = true
	}

	// Fix asset id.
	assetID := file.Asset()
	if assetInfo.ID == nil || *assetInfo.ID != assetID {
		assetInfo.ID = &assetID
		isModified = true
	}

	expectedExplorerURL, err := coin.GetCoinExploreURL(file.Chain(), file.Asset())
	if err != nil {
		return err
	}

	// Fix asset explorer url.
	if assetInfo.Explorer == nil || !strings.EqualFold(expectedExplorerURL, *assetInfo.Explorer) {
		assetInfo.Explorer = &expectedExplorerURL
		isModified = true
	}

	if isModified {
		return fileLib.CreateJSONFile(file.Path(), &assetInfo)
	}

	return nil
}
