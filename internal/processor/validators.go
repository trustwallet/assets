package processor

import (
	"bytes"
	"fmt"
	"os"

	filelib "github.com/trustwallet/assets-go-libs/file"
	"github.com/trustwallet/assets-go-libs/path"
	"github.com/trustwallet/assets-go-libs/validation"
	"github.com/trustwallet/assets-go-libs/validation/info"
	"github.com/trustwallet/assets-go-libs/validation/list"
	"github.com/trustwallet/assets-go-libs/validation/tokenlist"
	"github.com/trustwallet/assets/internal/config"
	"github.com/trustwallet/assets/internal/file"
	"github.com/trustwallet/go-primitives/coin"
)

func (s *Service) ValidateJSON(f *file.AssetFile) error {
	file, err := os.Open(f.Path())
	if err != nil {
		return err
	}
	defer file.Close()

	buf := bytes.NewBuffer(nil)
	_, err = buf.ReadFrom(file)
	if err != nil {
		return err
	}

	err = validation.ValidateJSON(buf.Bytes())
	if err != nil {
		return err
	}

	return nil
}

func (s *Service) ValidateRootFolder(f *file.AssetFile) error {
	dirFiles, err := filelib.ReadDir(f.Path())
	if err != nil {
		return err
	}

	err = validation.ValidateAllowedFiles(dirFiles, config.Default.ValidatorsSettings.RootFolder.AllowedFiles)
	if err != nil {
		return err
	}

	return nil
}

func (s *Service) ValidateChainFolder(f *file.AssetFile) error {
	file, err := os.Open(f.Path())
	if err != nil {
		return err
	}
	defer file.Close()

	fileInfo, err := file.Stat()
	if err != nil {
		return err
	}

	var compErr = validation.NewErrComposite()

	err = validation.ValidateLowercase(fileInfo.Name())
	if err != nil {
		compErr.Append(err)
	}

	dirFiles, err := file.ReadDir(0)
	if err != nil {
		return err
	}

	err = validation.ValidateAllowedFiles(dirFiles, config.Default.ValidatorsSettings.ChainFolder.AllowedFiles)
	if err != nil {
		compErr.Append(err)
	}

	if compErr.Len() > 0 {
		return compErr
	}

	return nil
}

func (s *Service) ValidateImage(f *file.AssetFile) error {
	var compErr = validation.NewErrComposite()

	err := validation.ValidateLogoFileSize(f.Path())
	if err != nil {
		compErr.Append(err)
	}

	// TODO: Replace it with validation.ValidatePngImageDimension when "assets" repo is fixed.
	// Read comments in ValidatePngImageDimensionForCI.
	err = validation.ValidatePngImageDimensionForCI(f.Path())
	if err != nil {
		compErr.Append(err)
	}

	if compErr.Len() > 0 {
		return compErr
	}

	return nil
}

func (s *Service) ValidateAssetFolder(f *file.AssetFile) error {
	dirFiles, err := filelib.ReadDir(f.Path())
	if err != nil {
		return err
	}

	var compErr = validation.NewErrComposite()

	err = validation.ValidateAllowedFiles(dirFiles, config.Default.ValidatorsSettings.AssetFolder.AllowedFiles)
	if err != nil {
		compErr.Append(err)
	}

	err = validation.ValidateAssetAddress(f.Chain(), f.Asset())
	if err != nil {
		compErr.Append(err)
	}

	errInfo := validation.ValidateHasFiles(dirFiles, []string{"info.json"})
	errLogo := validation.ValidateHasFiles(dirFiles, []string{"logo.png"})

	if errLogo != nil || errInfo != nil {
		assetInfoPath := path.GetAssetInfoPath(f.Chain().Handle, f.Asset())

		var infoJson info.AssetModel
		if err = filelib.ReadJSONFile(assetInfoPath, &infoJson); err != nil {
			return err
		}

		if infoJson.GetStatus() != "spam" && infoJson.GetStatus() != "abandoned" {
			compErr.Append(fmt.Errorf("%w: logo.png for non-spam assest", validation.ErrMissingFile))
		}
	}

	if compErr.Len() > 0 {
		return compErr
	}

	return nil
}

func (s *Service) ValidateDappsFolder(f *file.AssetFile) error {
	dirFiles, err := filelib.ReadDir(f.Path())
	if err != nil {
		return err
	}

	var compErr = validation.NewErrComposite()

	for _, dirFile := range dirFiles {
		err = validation.ValidateExtension(dirFile.Name(), config.Default.ValidatorsSettings.DappsFolder.Ext)
		if err != nil {
			compErr.Append(err)
		}

		err = validation.ValidateLowercase(dirFile.Name())
		if err != nil {
			compErr.Append(err)
		}
	}

	if compErr.Len() > 0 {
		return compErr
	}

	return nil
}

func (s *Service) ValidateChainInfoFile(f *file.AssetFile) error {
	var coinInfo info.CoinModel
	if err := filelib.ReadJSONFile(f.Path(), &coinInfo); err != nil {
		return err
	}

	receivedTags, err := s.assetsManager.GetTagValues()
	if err != nil {
		return fmt.Errorf("failed to get tag values: %w", err)
	}

	tags := make([]string, len(receivedTags.Tags))
	for i, t := range receivedTags.Tags {
		tags[i] = t.ID
	}

	err = info.ValidateCoin(coinInfo, tags)
	if err != nil {
		return err
	}

	return nil
}

func (s *Service) ValidateAssetInfoFile(f *file.AssetFile) error {
	var assetInfo info.AssetModel
	if err := filelib.ReadJSONFile(f.Path(), &assetInfo); err != nil {
		return err
	}

	err := info.ValidateAsset(assetInfo, f.Chain(), f.Asset())
	if err != nil {
		return err
	}

	return nil
}

func (s *Service) ValidateValidatorsListFile(f *file.AssetFile) error {
	if !isStackingChain(f.Chain()) {
		return nil
	}

	var model []list.Model
	if err := filelib.ReadJSONFile(f.Path(), &model); err != nil {
		return err
	}

	err := list.ValidateList(model)
	if err != nil {
		return err
	}

	listIDs := make([]string, len(model))
	for i, listItem := range model {
		listIDs[i] = *listItem.ID
	}

	assetsPath := path.GetValidatorAssetsPath(f.Chain().Handle)
	assetFolder := s.fileService.GetAssetFile(assetsPath)

	dirFiles, err := filelib.ReadDir(assetFolder.Path())
	if err != nil {
		return err
	}

	err = validation.ValidateAllowedFiles(dirFiles, listIDs)
	if err != nil {
		return err
	}

	return nil
}

func isStackingChain(c coin.Coin) bool {
	for _, stackingChain := range config.StackingChains {
		if c.ID == stackingChain.ID {
			return true
		}
	}

	return false
}

func (s *Service) ValidateTokenListFile(f *file.AssetFile) error {
	tokenListPath := f.Path()
	tokenListExtendedPath := path.GetTokenListPath(f.Chain().Handle, path.TokenlistExtended)

	return validateTokenList(tokenListPath, tokenListExtendedPath, f.Chain())
}

func (s *Service) ValidateTokenListExtendedFile(f *file.AssetFile) error {
	tokenListPathExtended := f.Path()
	tokenListPath := path.GetTokenListPath(f.Chain().Handle, path.TokenlistDefault)

	return validateTokenList(tokenListPathExtended, tokenListPath, f.Chain())
}

func validateTokenList(path1, path2 string, chain1 coin.Coin) error {
	var tokenList1 tokenlist.Model
	err := filelib.ReadJSONFile(path1, &tokenList1)
	if err != nil {
		return err
	}

	if filelib.Exists(path2) {
		var tokenList2 tokenlist.Model
		err = filelib.ReadJSONFile(path2, &tokenList2)
		if err != nil {
			return err
		}

		tokensMap := make(map[string]bool)
		for _, token := range tokenList2.Tokens {
			tokensMap[token.Asset] = true
		}

		for _, token := range tokenList1.Tokens {
			if _, exists := tokensMap[token.Asset]; exists {
				return fmt.Errorf("duplicate asset: %s from %s, already exist in %s",
					token.Asset, path1, path2)
			}
		}
	}

	err = tokenlist.ValidateTokenList(tokenList1, chain1, path1)
	if err != nil {
		return err
	}

	return nil
}

func (s *Service) ValidateInfoFolder(f *file.AssetFile) error {
	dirFiles, err := filelib.ReadDir(f.Path())
	if err != nil {
		return err
	}

	err = validation.ValidateHasFiles(dirFiles, config.Default.ValidatorsSettings.ChainInfoFolder.HasFiles)
	if err != nil {
		return err
	}

	return nil
}

func (s *Service) ValidateValidatorsAssetFolder(f *file.AssetFile) error {
	dirFiles, err := filelib.ReadDir(f.Path())
	if err != nil {
		return err
	}

	compErr := validation.NewErrComposite()
	err = validation.ValidateValidatorsAddress(f.Chain(), f.Asset())
	if err != nil {
		compErr.Append(err)
	}

	err = validation.ValidateHasFiles(dirFiles, config.Default.ValidatorsSettings.ChainValidatorsAssetFolder.HasFiles)
	if err != nil {
		compErr.Append(err)
	}

	if compErr.Len() > 0 {
		return compErr
	}

	return nil
}
