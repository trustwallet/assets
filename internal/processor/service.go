package processor

import (
	"github.com/trustwallet/assets/internal/file"
)

type Service struct {
	fileService *file.Service
}

func NewService(fileProvider *file.Service) *Service {
	return &Service{fileService: fileProvider}
}

func (s *Service) GetValidator(f *file.AssetFile) []Validator {
	jsonValidator := Validator{Name: "JSON validation", Run: s.ValidateJSON}

	switch f.Type() {
	case file.TypeRootFolder:
		return []Validator{
			{Name: "Root folder contains only allowed files", Run: s.ValidateRootFolder},
		}
	case file.TypeChainFolder:
		return []Validator{
			{Name: "Chain folders are lowercase and contains only allowed files", Run: s.ValidateChainFolder},
		}
	case file.TypeChainLogoFile, file.TypeAssetLogoFile, file.TypeValidatorsLogoFile, file.TypeDappsLogoFile:
		return []Validator{
			{Name: "Logos (size, dimension)", Run: s.ValidateImage},
		}
	case file.TypeAssetFolder:
		return []Validator{
			{Name: "Each asset folder has valid asset address and contains logo/info", Run: s.ValidateAssetFolder},
		}
	case file.TypeDappsFolder:
		return []Validator{
			{Name: "Dapps folder (allowed only png files, lowercase)", Run: s.ValidateDappsFolder},
		}
	case file.TypeAssetInfoFile:
		return []Validator{
			jsonValidator,
			{Name: "Asset info", Run: s.ValidateAssetInfoFile},
		}
	case file.TypeChainInfoFile:
		return []Validator{
			{Name: "Chain Info", Run: s.ValidateChainInfoFile},
		}
	case file.TypeValidatorsListFile:
		return []Validator{
			jsonValidator,
			{Name: "Validators list file", Run: s.ValidateValidatorsListFile},
		}
	case file.TypeTokenListFile:
		return []Validator{
			jsonValidator,
			{Name: "Token list (if assets from list present in chain)", Run: s.ValidateTokenListFile},
		}
	case file.TypeChainInfoFolder:
		return []Validator{
			{Name: "Chain Info Folder (has files)", Run: s.ValidateInfoFolder},
		}
	case file.TypeValidatorsAssetFolder:
		return []Validator{
			{Name: "Validators asset folder (has logo, valid asset address)", Run: s.ValidateValidatorsAssetFolder},
		}
	}

	return nil
}

func (s *Service) GetFixers(f *file.AssetFile) []Fixer {
	jsonFixer := Fixer{
		Name: "Formatting all json files",
		Run:  s.FixJSON,
	}

	switch f.Type() {
	case file.TypeChainInfoFile:
		return []Fixer{
			jsonFixer,
			{Name: "Fixing chain info.json files", Run: s.FixChainInfoJSON},
		}
	case file.TypeAssetInfoFile:
		return []Fixer{
			jsonFixer,
			{Name: "Fixing asset info.json files", Run: s.FixAssetInfoJSON},
		}
	case file.TypeValidatorsListFile:
		return []Fixer{
			jsonFixer,
		}
	case file.TypeAssetFolder:
		return []Fixer{
			{Name: "Renaming EVM's asset folder to valid address checksum", Run: s.FixETHAddressChecksum},
		}
	case file.TypeChainLogoFile, file.TypeAssetLogoFile, file.TypeValidatorsLogoFile, file.TypeDappsLogoFile:
		return []Fixer{
			{Name: "Resizing and compressing logo images", Run: s.FixLogo},
		}
	}

	return nil
}

func (s *Service) GetUpdatersAuto() []Updater {
	return []Updater{
		{Name: "Retrieving missing token images, creating binance token list.", Run: s.UpdateBinanceTokens},
	}
}

func (s *Service) GetUpdatersManual() []Updater {
	return []Updater{
		{Name: "Update tokenlist.json for Ethereum", Run: s.UpdateEthereumTokenlist},
		{Name: "Update tokenlist.json for Smartchain", Run: s.UpdateSmartchainTokenlist},
	}
}
