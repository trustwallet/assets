package service

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/trustwallet/assets-go-libs/file"
	"github.com/trustwallet/go-primitives/coin"

	log "github.com/sirupsen/logrus"
)

const stagingDirectory = "staging/assets"

var supportedChains = map[uint]bool{
	coin.ETHEREUM:   true,
	coin.POLYGON:    true,
	coin.OPTIMISM:   true,
	coin.ARBITRUM:   true,
	coin.SMARTCHAIN: true,
}

func (s *Service) CopyLogoToStagingFolder(f *file.AssetFile) {
	if err := s.CopyLogoToStagingFolderForChain(f); err != nil {
		s.handleError(err, f, "copyLogoToStaging")
	}
}

func (s *Service) CopyLogoToStagingFolderForChain(f *file.AssetFile) error {
	if f.Type() == file.TypeAssetFolder {
		if !supportedChains[f.Chain().ID] {
			return nil
		}

		logoPath := fmt.Sprintf("%s/logo.png", f.Path())

		if _, err := os.Stat(logoPath); err != nil {
			// Logo doesn't exist for this asset so we move on
			// nolint: nilerr
			return nil
		}

		path, err := os.Getwd()
		if err != nil {
			return err
		}

		chainName := f.Chain().Handle
		stagingPath := fmt.Sprintf("%s/%s/%s", path, stagingDirectory, chainName)
		err = os.MkdirAll(stagingPath, 0755)
		if err != nil {
			return err
		}

		assetAddress := filepath.Base(f.Path())

		// {WORKING_DIR}/staging/assets/ethereum/0xfoo.png
		stagingFilePath := fmt.Sprintf("%s/%s.png", stagingPath, strings.ToLower(assetAddress))
		err = os.Link(logoPath, stagingFilePath)
		if err != nil {
			return err
		}

		log.WithField("from", logoPath).
			WithField("to", stagingFilePath).
			Debug("Copying to staging folder")

		return nil
	}

	return nil
}
