package config

import "github.com/trustwallet/go-primitives/coin"

// TODO: Move to go-libs.
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
