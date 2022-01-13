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
	case file.TypeAssetFolder:
		return []Validator{
			{Name: "Each asset folder has valid asset address and contains only allowed files", Run: s.ValidateAssetFolder},
		}
	case file.TypeChainFolder:
		return []Validator{
			{Name: "Chain folders are lowercase and contains only allowed files", Run: s.ValidateChainFolder},
		}
	case file.TypeChainInfoFolder:
		return []Validator{
			{Name: "Chain Info Folder (has files)", Run: s.ValidateInfoFolder},
		}
	case file.TypeDappsFolder:
		return []Validator{
			{Name: "Dapps folder contains only allowed png files in lowercase", Run: s.ValidateDappsFolder},
		}
	case file.TypeRootFolder:
		return []Validator{
			{Name: "Root folder contains only allowed files", Run: s.ValidateRootFolder},
		}
	case file.TypeValidatorsAssetFolder:
		return []Validator{
			{Name: "Validators asset folder has logo and valid asset address)", Run: s.ValidateValidatorsAssetFolder},
		}

	case file.TypeAssetLogoFile, file.TypeChainLogoFile, file.TypeDappsLogoFile, file.TypeValidatorsLogoFile:
		return []Validator{
			{Name: "Logos size and dimension are valid", Run: s.ValidateImage},
		}
	case file.TypeAssetInfoFile:
		return []Validator{
			jsonValidator,
			{Name: "Asset info file is valid", Run: s.ValidateAssetInfoFile},
		}
	case file.TypeChainInfoFile:
		return []Validator{
			{Name: "Chain info file is valid", Run: s.ValidateChainInfoFile},
		}
	case file.TypeTokenListFile:
		return []Validator{
			jsonValidator,
			{Name: "Tokenlist file is valid", Run: s.ValidateTokenListFile},
		}
	case file.TypeValidatorsListFile:
		return []Validator{
			jsonValidator,
			{Name: "Validators list file is valid", Run: s.ValidateValidatorsListFile},
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
	case file.TypeAssetFolder:
		return []Fixer{
			{Name: "Renaming EVM's asset folder to valid address checksum", Run: s.FixETHAddressChecksum},
		}
	case file.TypeAssetInfoFile:
		return []Fixer{
			jsonFixer,
			{Name: "Fixing asset info.json files", Run: s.FixAssetInfo},
		}
	case file.TypeChainInfoFile:
		return []Fixer{
			jsonFixer,
			{Name: "Fixing chain info.json files", Run: s.FixChainInfoJSON},
		}
	case file.TypeChainLogoFile, file.TypeAssetLogoFile, file.TypeValidatorsLogoFile, file.TypeDappsLogoFile:
		return []Fixer{
			{Name: "Resizing and compressing logo images", Run: s.FixLogo},
		}
	case file.TypeValidatorsListFile:
		return []Fixer{
			jsonFixer,
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
