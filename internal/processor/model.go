package processor

import "github.com/trustwallet/assets/internal/file"

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
	TokenList struct {
		Name      string      `json:"name"`
		LogoURI   string      `json:"logoURI"`
		Timestamp string      `json:"timestamp"`
		Tokens    []TokenItem `json:"tokens"`
		Version   Version     `json:"version"`
	}

	TokenItem struct {
		Asset    string `json:"asset"`
		Type     string `json:"type"`
		Address  string `json:"address"`
		Name     string `json:"name"`
		Symbol   string `json:"symbol"`
		Decimals uint   `json:"decimals"`
		LogoURI  string `json:"logoURI"`
		Pairs    []Pair `json:"pairs"`
	}

	Pair struct {
		Base     string `json:"base"`
		LotSize  string `json:"lotSize,omitempty"`
		TickSize string `json:"tickSize,omitempty"`
	}

	Version struct {
		Major int `json:"major"`
		Minor int `json:"minor"`
		Patch int `json:"patch"`
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
