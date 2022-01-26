package manager

import (
	"encoding/json"
	"fmt"
	"time"

	log "github.com/sirupsen/logrus"

	libFile "github.com/trustwallet/assets-go-libs/file"
	"github.com/trustwallet/assets-go-libs/path"
	"github.com/trustwallet/assets-go-libs/validation/info"
	"github.com/trustwallet/assets-go-libs/validation/tokenlist"
	"github.com/trustwallet/assets/internal/config"
	"github.com/trustwallet/go-primitives/asset"
	"github.com/trustwallet/go-primitives/coin"
)

func CreateAssetInfoJSONTemplate(token string) error {
	c, tokenID, err := asset.ParseID(token)
	if err != nil {
		return fmt.Errorf("failed to parse token id: %v", err)
	}

	chain, ok := coin.Coins[c]
	if !ok {
		return fmt.Errorf("invalid token")
	}

	assetInfoPath := path.GetAssetInfoPath(chain.Handle, tokenID)

	var emptyStr string
	var emptyInt int
	assetInfoModel := info.AssetModel{
		Name:     &emptyStr,
		Type:     &emptyStr,
		Symbol:   &emptyStr,
		Decimals: &emptyInt,
		Website:  &emptyStr,
		Explorer: &emptyStr,
		Status:   &emptyStr,
		ID:       &tokenID,
		Links: []info.Link{
			{
				Name: &emptyStr,
				URL:  &emptyStr,
			},
		},
		Tags: []string{""},
	}

	bytes, err := json.Marshal(&assetInfoModel)
	if err != nil {
		return fmt.Errorf("failed to marshal json: %v", err)
	}

	f, err := libFile.CreateFileWithPath(assetInfoPath)
	if err != nil {
		return fmt.Errorf("failed to create file: %v", err)
	}
	defer f.Close()

	_, err = f.Write(bytes)
	if err != nil {
		return fmt.Errorf("failed to write bytes to file")
	}

	err = libFile.FormatJSONFile(assetInfoPath)
	if err != nil {
		return fmt.Errorf("failed to format json file")
	}

	return nil
}

func AddTokenToTokenListJSON(token, tokenID, tokenListPath string, chain coin.Coin) error {
	setup()

	var oldTokenList tokenlist.Model
	err := libFile.ReadJSONFile(tokenListPath, &oldTokenList)
	if err != nil {
		log.Debug(err)
		oldTokenList.Tokens = make([]tokenlist.Token, 0)
	}

	oldTokenList.Tokens = append(oldTokenList.Tokens, tokenlist.Token{
		Asset:   token,
		Address: tokenID,
		Pairs:   make([]tokenlist.Pair, 0),
	})

	return libFile.CreateJSONFile(tokenListPath, &tokenlist.Model{
		Name:      fmt.Sprintf("Trust Wallet: %s", coin.Coins[chain.ID].Name),
		LogoURI:   config.Default.URLs.Logo,
		Timestamp: time.Now().Format(config.Default.TimeFormat),
		Tokens:    oldTokenList.Tokens,
		Version:   tokenlist.Version{Major: oldTokenList.Version.Major + 1},
	})
}

func GetChainAndTokenID(token string) (string, coin.Coin, error) {
	c, tokenID, err := asset.ParseID(token)
	if err != nil {
		return "", coin.Coin{}, fmt.Errorf("failed to parse token id: %v", err)
	}

	chain, ok := coin.Coins[c]
	if !ok {
		return "", coin.Coin{}, fmt.Errorf("invalid token")
	}

	return tokenID, chain, nil
}
