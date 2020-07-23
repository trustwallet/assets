import { CoinType } from "@trustwallet/wallet-core";

export const getChainName = (id: CoinType): string =>  CoinType.id(id) // 60 => ethereum
export const Binance = getChainName(CoinType.binance)
export const Classic = getChainName(CoinType.classic)
export const Cosmos = getChainName(CoinType.cosmos)
export const Ethereum = getChainName(CoinType.ethereum)
export const GoChain = getChainName(CoinType.gochain)
export const IoTeX = getChainName(CoinType.iotex)
export const POA = getChainName(CoinType.poa)
export const Tezos = getChainName(CoinType.tezos)
export const ThunderCore = getChainName(CoinType.thundertoken)
export const Terra = getChainName(CoinType.terra)
export const TomoChain = getChainName(CoinType.tomochain)
export const Tron = getChainName(CoinType.tron)
export const Kava = getChainName(CoinType.kava)
export const Wanchain = getChainName(CoinType.wanchain)
export const Waves = getChainName(CoinType.waves)
export const Solana = getChainName(CoinType.solana)

export const ethSidechains = [Ethereum, Classic, POA, TomoChain, GoChain, Wanchain, ThunderCore]
export const stakingChains = [Tezos, Cosmos, IoTeX, Tron, Waves, Kava, Terra]
