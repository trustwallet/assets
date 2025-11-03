package external

import (
	"fmt"
	"math/big"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/trustwallet/assets-go-libs/http"
)

var (
	holdersRegexp  = regexp.MustCompile(`(\d+)\saddresses`)
	decimalsRegexp = regexp.MustCompile(`(\d+)\s+<\/div>`)
	symbolRegexp   = regexp.MustCompile(`<b>(\w+)<\/b>\s<span`)
)

type TokenInfo struct {
	Symbol         string
	Name           string
	Decimals       int
	HoldersCount   int
	TotalSupply    *big.Int
	TransfersCount int
	Price          *TokenPrice
}

type TokenPrice struct {
	Rate            float64
	Diff            float64
	Diff7d          float64
	MarketCapUSD    float64
	AvailableSupply float64
	Volume24h       float64
	UpdatedAt       time.Time
}

func GetTokenInfo(tokenID, tokentType string) (*TokenInfo, error) {
	switch strings.ToLower(tokentType) {
	case "erc20":
		return GetTokenInfoForERC20(tokenID)
	case "bep20":
		return GetTokenInfoByScraping(fmt.Sprintf("https://bscscan.com/token/%s", tokenID))
	case "fantom":
		return GetTokenInfoByScraping(fmt.Sprintf("https://ftmscan.com/token/%s", tokenID))
	case "polygon":
		return GetTokenInfoByScraping(fmt.Sprintf("https://polygonscan.com/token/%s", tokenID))
	case "avalanche":
		return GetTokenInfoByScraping(fmt.Sprintf("https://snowtrace.io/token/%s", tokenID))
	case "spl":
		return GetTokenInfoForSPL(tokenID)
	case "trc20":
		return GetTokenInfoForTRC20(tokenID)
	case "trc10":
		return GetTokenInfoForTRC10(tokenID)
	}

	return nil, nil
}

func GetTokenInfoByScraping(url string) (*TokenInfo, error) {
	data, err := http.GetHTTPResponseBytes(url)
	if err != nil {
		return nil, err
	}

	// Remove all "," from content.
	pageContent := strings.ReplaceAll(string(data), ",", "")

	var holders, decimals int
	var symbol string

	match := symbolRegexp.FindStringSubmatch(pageContent)
	if len(match) > 1 {
		symbol = match[1]
	}

	match = decimalsRegexp.FindStringSubmatch(pageContent)
	if len(match) > 1 {
		decimals, err = strconv.Atoi(match[1])
		if err != nil {
			return nil, err
		}
	}

	match = holdersRegexp.FindStringSubmatch(pageContent)
	if len(match) > 1 {
		holders, err = strconv.Atoi(match[1])
		if err != nil {
			return nil, err
		}
	}

	return &TokenInfo{
		Symbol:       symbol,
		Decimals:     decimals,
		HoldersCount: holders,
	}, nil
}
