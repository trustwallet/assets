package external

import (
	"fmt"
	"math/big"
	"strconv"
	"strings"
	"time"

	"github.com/trustwallet/assets-go-libs/http"
)

const ethAPIURL = "https://api.ethplorer.io/getTokenInfo/%s?apiKey=freekey"

type TokenInfoERC20 struct {
	Name           *string          `json:"name"`
	Symbol         *string          `json:"symbol"`
	Decimals       string           `json:"decimals"`
	HoldersCount   int              `json:"holdersCount"`
	TotalSupply    *string          `json:"totalSupply"`
	TransfersCount *int             `json:"transfersCount"`
	Price          *tokenPriceERC20 `json:"price"`
}

type tokenPriceERC20 struct {
	Rate            *float64 `json:"rate"`
	Diff            *float64 `json:"diff"`
	Diff7d          *float64 `json:"diff7d"`
	MarketCapUSD    *float64 `json:"marketCapUsd"`
	AvailableSupply *float64 `json:"availableSupply"`
	Volume24h       *float64 `json:"volume24h"`
	Timestamp       *int64   `json:"ts"`
}

func GetTokenInfoForERC20(tokenID string) (*TokenInfo, error) {
	url := fmt.Sprintf(ethAPIURL, tokenID)

	var result TokenInfoERC20
	err := http.GetHTTPResponse(url, &result)
	if err != nil {
		return nil, err
	}

	decimals, err := strconv.Atoi(result.Decimals)
	if err != nil {
		return nil, err
	}

	totalSupply, err := parseBigInt(result.TotalSupply)
	if err != nil {
		return nil, err
	}

	var transfersCount int
	if result.TransfersCount != nil {
		transfersCount = *result.TransfersCount
	}

	var symbol string
	if result.Symbol != nil {
		symbol = *result.Symbol
	}

	var name string
	if result.Name != nil {
		name = *result.Name
	}

	return &TokenInfo{
		Symbol:         symbol,
		Name:           name,
		Decimals:       decimals,
		HoldersCount:   result.HoldersCount,
		TotalSupply:    totalSupply,
		TransfersCount: transfersCount,
		Price:          convertTokenPrice(result.Price),
	}, nil
}

func parseBigInt(value *string) (*big.Int, error) {
	if value == nil {
		return nil, nil
	}

	trimmed := strings.TrimSpace(*value)
	if trimmed == "" {
		return nil, nil
	}

	b := new(big.Int)
	if _, ok := b.SetString(trimmed, 10); !ok {
		return nil, fmt.Errorf("invalid integer value: %s", trimmed)
	}

	return b, nil
}

func convertTokenPrice(raw *tokenPriceERC20) *TokenPrice {
	if raw == nil {
		return nil
	}

	price := &TokenPrice{}

	if raw.Rate != nil {
		price.Rate = *raw.Rate
	}

	if raw.Diff != nil {
		price.Diff = *raw.Diff
	}

	if raw.Diff7d != nil {
		price.Diff7d = *raw.Diff7d
	}

	if raw.MarketCapUSD != nil {
		price.MarketCapUSD = *raw.MarketCapUSD
	}

	if raw.AvailableSupply != nil {
		price.AvailableSupply = *raw.AvailableSupply
	}

	if raw.Volume24h != nil {
		price.Volume24h = *raw.Volume24h
	}

	if raw.Timestamp != nil && *raw.Timestamp > 0 {
		price.UpdatedAt = time.Unix(*raw.Timestamp, 0).UTC()
	}

	return price
}
