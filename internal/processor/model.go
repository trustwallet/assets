package processor

import (
	"github.com/trustwallet/assets-go-libs/file"
)

type (
	Validator struct {
		Name string
		Run  func(f *file.AssetFile) error
	}

	Fixer struct {
		Name string
		Run  func(f *file.AssetFile) error
	}

	Updater struct {
		Name string
		Run  func() error
	}
)

type (
	ForceListPair struct {
		Token0 string
		Token1 string
	}

	TradingPairs struct {
		Data struct {
			Pairs []TradingPair `json:"pairs"`
		} `json:"data"`
	}

	TradingPair struct {
		ID         string     `json:"id"`
		ReserveUSD string     `json:"reserveUSD"`
		VolumeUSD  string     `json:"volumeUSD"`
		TxCount    string     `json:"txCount"`
		Token0     *TokenInfo `json:"token0"`
		Token1     *TokenInfo `json:"token1"`
	}

	TokenInfo struct {
		ID       string `json:"id"`
		Symbol   string `json:"symbol"`
		Name     string `json:"name"`
		Decimals string `json:"decimals"`
	}
)
