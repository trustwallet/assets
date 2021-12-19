package config

import (
	"path/filepath"

	"github.com/trustwallet/go-libs/config/viper"
)

type (
	Config struct {
		App                App                `mapstructure:"app"`
		ClientURLs         ClientsURLs        `mapstructure:"client_urls"`
		URLs               URLs               `mapstructure:"urls"`
		ValidatorsSettings ValidatorsSettings `mapstructure:"validators_settings"`
	}

	App struct {
		LogLevel string `mapstructure:"log_level"`
	}

	ClientsURLs struct {
		Binance struct {
			Dex      string `mapstructure:"dex"`
			Explorer string `mapstructure:"explorer"`
		} `mapstructure:"binance"`
		BackendAPI string `mapstructure:"backend_api"`
	}

	URLs struct {
		TWAssetsApp string `mapstructure:"tw_assets_app"`
	}

	ValidatorsSettings struct {
		RootFolder                 RootFolder                 `mapstructure:"root_folder"`
		ChainFolder                ChainFolder                `mapstructure:"chain_folder"`
		AssetFolder                AssetFolder                `mapstructure:"asset_folder"`
		ChainInfoFolder            ChainInfoFolder            `mapstructure:"chain_info_folder"`
		ChainValidatorsAssetFolder ChainValidatorsAssetFolder `mapstructure:"chain_validators_asset_folder"`
		DappsFolder                DappsFolder                `mapstructure:"dapps_folder"`
		CoinInfoFile               CoinInfoFile               `mapstructure:"coin_info_file"`
	}
)

// Default is a configuration instance.
var Default = Config{} // nolint:gochecknoglobals // config must be global

// SetConfig reads a config file and returs an initialized config instance.
func SetConfig(confPath string) error {
	confPath, err := filepath.Abs(confPath)
	if err != nil {
		return err
	}

	viper.Load(confPath, &Default)

	return nil
}
