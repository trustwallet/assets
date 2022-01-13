package processor

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"os"

	"github.com/trustwallet/assets-go-libs/path"
	"github.com/trustwallet/assets-go-libs/validation"
	"github.com/trustwallet/assets-go-libs/validation/info"
	"github.com/trustwallet/assets-go-libs/validation/list"
	"github.com/trustwallet/assets/internal/config"
	"github.com/trustwallet/assets/internal/file"
	"github.com/trustwallet/go-primitives/coin"
	"github.com/trustwallet/go-primitives/types"
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

	err = validation.ValidateJson(buf.Bytes())
	if err != nil {
		return err
	}

	return nil
}

func (s *Service) ValidateRootFolder(f *file.AssetFile) error {
	file, err := os.Open(f.Path())
	if err != nil {
		return err
	}
	defer file.Close()

	dirFiles, err := file.ReadDir(0)
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
	file, err := os.Open(f.Path())
	if err != nil {
		return err
	}
	defer file.Close()

	dirFiles, err := file.ReadDir(0)
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
		file2, err := os.Open(path.GetAssetInfoPath(f.Chain().Handle, f.Asset()))
		if err != nil {
			return err
		}
		defer file2.Close()

		_, err = file2.Seek(0, io.SeekStart)
		if err != nil {
			return err
		}

		b, err := io.ReadAll(file2)
		if err != nil {
			return err
		}

		var infoJson info.AssetModel
		err = json.Unmarshal(b, &infoJson)
		if err != nil {
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
	file, err := os.Open(f.Path())
	if err != nil {
		return err
	}
	defer file.Close()

	dirFiles, err := file.ReadDir(0)
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

	_, err = file.Seek(0, io.SeekStart)
	if err != nil {
		return fmt.Errorf("%w: failed to seek reader", validation.ErrInvalidJson)
	}

	var payload info.CoinModel
	err = json.Unmarshal(buf.Bytes(), &payload)
	if err != nil {
		return fmt.Errorf("%w: failed to decode", err)
	}

	tags := make([]string, len(config.Default.ValidatorsSettings.CoinInfoFile.Tags))
	for i, t := range config.Default.ValidatorsSettings.CoinInfoFile.Tags {
		tags[i] = t.ID
	}

	err = info.ValidateCoin(payload, f.Chain(), f.Asset(), tags)
	if err != nil {
		return err
	}

	return nil
}

func (s *Service) ValidateAssetInfoFile(f *file.AssetFile) error {
	file, err := os.Open(f.Path())
	if err != nil {
		return err
	}
	defer file.Close()

	buf := bytes.NewBuffer(nil)
	if _, err = buf.ReadFrom(file); err != nil {
		return err
	}

	_, err = file.Seek(0, io.SeekStart)
	if err != nil {
		return fmt.Errorf("%w: failed to seek reader", validation.ErrInvalidJson)
	}

	var payload info.AssetModel
	err = json.Unmarshal(buf.Bytes(), &payload)
	if err != nil {
		return fmt.Errorf("%w: failed to decode", err)
	}

	err = info.ValidateAsset(payload, f.Chain(), f.Asset())
	if err != nil {
		return err
	}

	return nil
}

func (s *Service) ValidateValidatorsListFile(f *file.AssetFile) error {
	file, err := os.Open(f.Path())
	if err != nil {
		return err
	}
	defer file.Close()

	if !isStackingChain(f.Chain()) {
		return nil
	}

	buf := bytes.NewBuffer(nil)
	if _, err = buf.ReadFrom(file); err != nil {
		return err
	}

	var model []list.Model
	err = json.Unmarshal(buf.Bytes(), &model)
	if err != nil {
		return err
	}

	err = list.ValidateList(model)
	if err != nil {
		return err
	}

	listIDs := make([]string, len(model))
	for i, listItem := range model {
		listIDs[i] = *listItem.ID
	}

	assetsPath := path.GetValidatorAssetsPath(f.Chain().Handle)
	assetFolder := s.fileService.GetAssetFile(assetsPath)

	file2, err := os.Open(assetFolder.Path())
	if err != nil {
		return err
	}
	defer file2.Close()

	dirAssetFolderFiles, err := file2.ReadDir(0)
	if err != nil {
		return err
	}

	err = validation.ValidateAllowedFiles(dirAssetFolderFiles, listIDs)
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
	file, err := os.Open(f.Path())
	if err != nil {
		return err
	}
	defer file.Close()

	buf := bytes.NewBuffer(nil)
	if _, err = buf.ReadFrom(file); err != nil {
		return err
	}

	var model TokenList
	err = json.Unmarshal(buf.Bytes(), &model)
	if err != nil {
		return err
	}

	err = checkTokenListAssets(model, f)
	if err != nil {
		return err
	}

	err = checkTokenListPairs(model)
	if err != nil {
		return err
	}

	return nil
}

func checkTokenListAssets(model TokenList, f *file.AssetFile) error {
	compErr := validation.NewErrComposite()

	for _, token := range model.Tokens {
		var assetPath string

		if token.Type == types.Coin {
			assetPath = path.GetChainInfoPath(f.Chain().Handle)
		} else {
			assetPath = path.GetAssetInfoPath(f.Chain().Handle, token.Address)
		}

		infoFile, err := os.Open(assetPath)
		if err != nil {
			return err
		}

		buf := bytes.NewBuffer(nil)
		if _, err = buf.ReadFrom(infoFile); err != nil {
			return err
		}

		infoFile.Close()

		var infoAsset info.AssetModel
		err = json.Unmarshal(buf.Bytes(), &infoAsset)
		if err != nil {
			return err
		}

		if string(token.Type) != *infoAsset.Type {
			compErr.Append(fmt.Errorf("field type - '%s' differs from '%s' in %s",
				token.Type, *infoAsset.Type, assetPath))
		}

		if token.Symbol != *infoAsset.Symbol {
			compErr.Append(fmt.Errorf("field symbol - '%s' differs from '%s' in %s",
				token.Symbol, *infoAsset.Symbol, assetPath))
		}

		if token.Decimals != uint(*infoAsset.Decimals) {
			compErr.Append(fmt.Errorf("field decimals - '%d' differs from '%d' in %s",
				token.Decimals, *infoAsset.Decimals, assetPath))
		}

		if token.Name != *infoAsset.Name {
			compErr.Append(fmt.Errorf("field name - '%s' differs from '%s' in %s",
				token.Name, *infoAsset.Name, assetPath))
		}

		if infoAsset.GetStatus() != activeStatus {
			compErr.Append(fmt.Errorf("token '%s' is not active, remove it from %s", token.Address, f.Path()))
		}
	}

	if compErr.Len() > 0 {
		return compErr
	}

	return nil
}

func checkTokenListPairs(model TokenList) error {
	compErr := validation.NewErrComposite()

	tokensMap := make(map[string]struct{})
	for _, t := range model.Tokens {
		tokensMap[t.Asset] = struct{}{}
	}

	pairs := make(map[string]string)
	for _, t := range model.Tokens {
		for _, pair := range t.Pairs {
			pairs[pair.Base] = t.Address
		}
	}

	for pairToken, token := range pairs {
		if _, exists := tokensMap[pairToken]; !exists {
			compErr.Append(fmt.Errorf("token '%s' contains non-existing pair token '%s'", token, pairToken))
		}
	}

	if compErr.Len() > 0 {
		return compErr
	}

	return nil
}

func (s *Service) ValidateInfoFolder(f *file.AssetFile) error {
	file, err := os.Open(f.Path())
	if err != nil {
		return err
	}
	defer file.Close()

	dirFiles, err := file.ReadDir(0)
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
	file, err := os.Open(f.Path())
	if err != nil {
		return err
	}
	defer file.Close()

	dirFiles, err := file.ReadDir(0)
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
