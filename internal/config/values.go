package config

import "github.com/trustwallet/go-primitives/coin"

var StackingChains = []coin.Coin{
	coin.Tezos(),
	coin.Cosmos(),
	coin.Iotex(),
	coin.Tron(),
	coin.Waves(),
	coin.Kava(),
	coin.Terra(),
	coin.Binance(),
}
