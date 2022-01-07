package processor

import (
	"fmt"
	"reflect"
	"sort"
	"strconv"
	"time"

	log "github.com/sirupsen/logrus"

	fileLib "github.com/trustwallet/assets-go-libs/file"
	"github.com/trustwallet/assets-go-libs/image"
	"github.com/trustwallet/assets-go-libs/path"
	"github.com/trustwallet/assets-go-libs/validation/info"
	"github.com/trustwallet/assets/internal/config"
	"github.com/trustwallet/go-libs/blockchain/binance"
	"github.com/trustwallet/go-libs/blockchain/binance/explorer"
	assetlib "github.com/trustwallet/go-primitives/asset"
	"github.com/trustwallet/go-primitives/coin"
	"github.com/trustwallet/go-primitives/numbers"
	"github.com/trustwallet/go-primitives/types"
)

const (
	assetsPage       = 1
	assetsRows       = 1000
	marketPairsLimit = 1000
	tokensListLimit  = 10000

	twLogoURL       = "https://trustwallet.com/assets/images/favicon.png"
	timestampFormat = "2006-01-02T15:04:05.000000"
)

func (s *Service) UpdateBinanceTokens() error {
	explorerClient := explorer.InitClient(config.Default.ClientURLs.Binance.Explorer, nil)

	bep2AssetList, err := explorerClient.FetchBep2Assets(assetsPage, assetsRows)
	if err != nil {
		return err
	}

	dexClient := binance.InitClient(config.Default.ClientURLs.Binance.Dex, "", nil)

	marketPairs, err := dexClient.FetchMarketPairs(marketPairsLimit)
	if err != nil {
		return err
	}

	tokenList, err := dexClient.FetchTokens(tokensListLimit)
	if err != nil {
		return err
	}

	chain, err := types.GetChainFromAssetType(string(types.BEP2))
	if err != nil {
		return err
	}

	err = fetchMissingAssets(chain, bep2AssetList.AssetInfoList)
	if err != nil {
		return err
	}

	tokens, err := generateTokenList(marketPairs, tokenList)
	if err != nil {
		return err
	}

	return createTokenListJSON(chain, tokens)
}

func fetchMissingAssets(chain coin.Coin, assets []explorer.Bep2Asset) error {
	for _, a := range assets {
		if a.AssetImg == "" || a.Decimals == 0 {
			continue
		}

		assetLogoPath := path.GetAssetLogoPath(chain.Handle, a.Asset)
		if fileLib.FileExists(assetLogoPath) {
			continue
		}

		if err := createLogo(assetLogoPath, a); err != nil {
			return err
		}

		if err := createInfoJSON(chain, a); err != nil {
			return err
		}
	}

	return nil
}

func createLogo(assetLogoPath string, a explorer.Bep2Asset) error {
	err := fileLib.CreateDirPath(assetLogoPath)
	if err != nil {
		return err
	}

	return image.CreatePNGFromURL(a.AssetImg, assetLogoPath)
}

func createInfoJSON(chain coin.Coin, a explorer.Bep2Asset) error {
	explorerURL, err := coin.GetCoinExploreURL(chain, a.Asset)
	if err != nil {
		return err
	}

	assetType := string(types.BEP2)
	website := ""
	description := "-"
	status := "active"

	assetInfo := info.AssetModel{
		Name:        &a.Name,
		Type:        &assetType,
		Symbol:      &a.MappedAsset,
		Decimals:    &a.Decimals,
		Website:     &website,
		Description: &description,
		Explorer:    &explorerURL,
		Status:      &status,
		ID:          &a.Asset,
	}

	assetInfoPath := path.GetAssetInfoPath(chain.Handle, a.Asset)

	return fileLib.CreateJSONFile(assetInfoPath, &assetInfo)
}

func createTokenListJSON(chain coin.Coin, tokens []TokenItem) error {
	tokenListPath := path.GetTokenListPath(chain.Handle)

	var oldTokenList TokenList
	err := fileLib.ReadJSONFile(tokenListPath, &oldTokenList)
	if err != nil {
		return nil
	}

	sortTokens(tokens)

	if reflect.DeepEqual(oldTokenList.Tokens, tokens) {
		return nil
	}

	if len(tokens) == 0 {
		return nil
	}

	log.Debugf("Tokenlist: list with %d tokens and %d pairs written to %s.",
		len(tokens), countTotalPairs(tokens), tokenListPath)

	return fileLib.CreateJSONFile(tokenListPath, &TokenList{
		Name:      fmt.Sprintf("Trust Wallet: %s", coin.Coins[chain.ID].Name),
		LogoURI:   twLogoURL,
		Timestamp: time.Now().Format(timestampFormat),
		Tokens:    tokens,
		Version:   Version{Major: oldTokenList.Version.Major + 1},
	})
}

func countTotalPairs(tokens []TokenItem) int {
	var counter int
	for _, token := range tokens {
		counter += len(token.Pairs)
	}

	return counter
}

func sortTokens(tokens []TokenItem) {
	sort.Slice(tokens, func(i, j int) bool {
		if len(tokens[i].Pairs) != len(tokens[j].Pairs) {
			return len(tokens[i].Pairs) > len(tokens[j].Pairs)
		}

		return tokens[i].Address < tokens[j].Address
	})

	for _, token := range tokens {
		sort.Slice(token.Pairs, func(i, j int) bool {
			return token.Pairs[i].Base < token.Pairs[j].Base
		})
	}
}

func generateTokenList(marketPairs []binance.MarketPair, tokenList binance.Tokens) ([]TokenItem, error) {
	if len(marketPairs) < 5 {
		return nil, fmt.Errorf("no markets info is returned from Binance DEX: %d", len(marketPairs))
	}

	if len(tokenList) < 5 {
		return nil, fmt.Errorf("no tokens info is returned from Binance DEX: %d", len(tokenList))
	}

	pairsMap := make(map[string][]Pair)
	pairsList := make(map[string]struct{})
	tokensMap := make(map[string]binance.Token)

	for _, token := range tokenList {
		tokensMap[token.Symbol] = token
	}

	for _, marketPair := range marketPairs {
		key := marketPair.QuoteAssetSymbol

		if val, exists := pairsMap[key]; exists {
			val = append(val, getPair(marketPair))
			pairsMap[key] = val
		} else {
			pairsMap[key] = []Pair{getPair(marketPair)}
		}

		pairsList[marketPair.BaseAssetSymbol] = struct{}{}
		pairsList[marketPair.QuoteAssetSymbol] = struct{}{}
	}

	tokenItems := make([]TokenItem, 0, len(pairsList))

	for pair := range pairsList {
		token := tokensMap[pair]

		var pairs []Pair
		pairs, exists := pairsMap[token.Symbol]
		if !exists {
			pairs = make([]Pair, 0)
		}

		tokenItems = append(tokenItems, TokenItem{
			Asset:    getAssetIDSymbol(token.Symbol, coin.Coins[coin.BINANCE].Symbol, coin.BINANCE),
			Type:     getTokenType(token.Symbol, coin.Coins[coin.BINANCE].Symbol, types.BEP2),
			Address:  token.Symbol,
			Name:     token.Name,
			Symbol:   token.OriginalSymbol,
			Decimals: coin.Coins[coin.BINANCE].Decimals,
			LogoURI:  getLogoURI(token.Symbol, coin.Coins[coin.BINANCE].Handle, coin.Coins[coin.BINANCE].Symbol),
			Pairs:    pairs,
		})
	}

	return tokenItems, nil
}

func getPair(marketPair binance.MarketPair) Pair {
	return Pair{
		Base:     getAssetIDSymbol(marketPair.BaseAssetSymbol, coin.Coins[coin.BINANCE].Symbol, coin.BINANCE),
		LotSize:  strconv.FormatInt(numbers.ToSatoshi(marketPair.LotSize), 10),
		TickSize: strconv.FormatInt(numbers.ToSatoshi(marketPair.TickSize), 10),
	}
}

func getAssetIDSymbol(tokenID string, nativeCoinID string, coinType uint) string {
	if tokenID == nativeCoinID {
		return assetlib.BuildID(coinType, "")
	}

	return assetlib.BuildID(coinType, tokenID)
}

func getTokenType(symbol string, nativeCoinSymbol string, tokenType types.TokenType) types.TokenType {
	if symbol == nativeCoinSymbol {
		return types.Coin
	}

	return tokenType
}

func getLogoURI(id, githubChainFolder, nativeCoinSymbol string) string {
	if id == nativeCoinSymbol {
		return path.GetChainLogoURL(config.Default.URLs.TWAssetsApp, githubChainFolder)
	}

	return path.GetAssetLogoURL(config.Default.URLs.TWAssetsApp, githubChainFolder, id)
}
