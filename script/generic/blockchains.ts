import { CoinType } from "@trustwallet/wallet-core";

export const getChainName = (id: CoinType): string =>  CoinType.id(id); // 60 => ethereum
export const Binance = getChainName(CoinType.binance);
export const Callisto = getChainName(CoinType.callisto);
export const Classic = getChainName(CoinType.classic);
export const Cosmos = getChainName(CoinType.cosmos);
export const EOS = getChainName(CoinType.eos);
export const Ethereum = getChainName(CoinType.ethereum);
export const GoChain = getChainName(CoinType.gochain);
export const IoTeX = getChainName(CoinType.iotex);
export const NEO = getChainName(CoinType.neo);
export const NULS = getChainName(CoinType.nuls);
export const Ontology = getChainName(CoinType.ontology);
export const POA = getChainName(CoinType.poa);
export const Tezos = getChainName(CoinType.tezos);
export const ThunderCore = getChainName(CoinType.thundertoken);
export const Terra = getChainName(CoinType.terra);
export const Theta = getChainName(CoinType.theta);
export const TomoChain = getChainName(CoinType.tomochain);
export const Tron = getChainName(CoinType.tron);
export const Kava = getChainName(CoinType.kava);
export const Vechain = getChainName(CoinType.vechain);
export const Wanchain = getChainName(CoinType.wanchain);
export const Waves = getChainName(CoinType.waves);
export const Solana = getChainName(CoinType.solana);
export const SmartChain = getChainName(CoinType.smartchain);
export const Polygon = getChainName(CoinType.polygon);
export const Optimism = "optimism";
export const xDAI = "xdai";
export const Avalanche = "avalanchec";

export const ethForkChains = [
    Ethereum,
    Classic,
    POA,
    TomoChain,
    GoChain,
    Wanchain,
    ThunderCore,
    SmartChain,
    Polygon,
    Optimism,
    xDAI,
    Avalanche,
];
export const stakingChains = [
    Tezos,
    Cosmos,
    IoTeX,
    Tron,
    Waves,
    Kava,
    Terra,
    Binance
];
export const chainsWithDenylist = ethForkChains.concat(
    Binance,
    Tron,
    Terra,
    NEO,
    NULS,
    Vechain,
    Ontology,
    Theta,
    EOS,
    Solana,
);
