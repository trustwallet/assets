package external

import (
	"fmt"
	"strconv"

	"github.com/trustwallet/assets-go-libs/http"
)

const ethAPIURL = "https://api.ethplorer.io/getTokenInfo/%s?apiKey=freekey"

type TokenInfoERC20 struct {
	Decimals     string `json:"decimals"`
	HoldersCount int    `json:"holdersCount"`
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

	return &TokenInfo{
		Decimals:     decimals,
		HoldersCount: result.HoldersCount,
	}, nil
}
