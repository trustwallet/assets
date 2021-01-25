import { ActionInterface, CheckStepInterface } from "../generic/interface";
import {
    checkTradingPair,
    getTradingPairs,
    PairInfo,
    primaryTokenIndex,
    TokenInfo
} from "../generic/subgraph";
import {
    getChainAllowlistPath,
    getChainTokenlistBasePath,
    getChainTokenlistPath
} from "../generic/repo-structure";
import { Ethereum } from "../generic/blockchains";
import { readJsonFile } from "../generic/json";
import {
    addPairIfNeeded,
    generateTokensList,
    List,
    TokenItem,
    writeToFileWithUpdate
} from "../generic/tokenlists";
import { toChecksum } from "../generic/eth-address";
import { assetID, logoURI } from "../generic/asset";

// see https://thegraph.com/explorer/subgraph/uniswap/uniswap-v2
const Uniswap_TradingPairsUrl = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2";
const Uniswap_TradingPairsQuery = "query pairs {\\n  pairs(first: 400, orderBy: reserveUSD, orderDirection: desc) {\\n id\\n reserveUSD\\n trackedReserveETH\\n volumeUSD\\n txCount \\n   untrackedVolumeUSD\\n __typename\\n token0 {\\n id\\n symbol\\n name\\n decimals\\n __typename\\n }\\n token1 {\\n id\\n symbol\\n name\\n decimals\\n __typename\\n }\\n }\\n}\\n";
const Uniswap_MinLiquidity = 2000000;
const Uniswap_MinVol24 = 1000000;
const Uniswap_TxCount24 = 480;
const PrimaryTokens: string[] = ["WETH", "ETH"];

// Retrieve trading pairs from Uniswap
async function retrieveUniswapPairs(): Promise<PairInfo[]> {
    console.log(`Retrieving pairs from Uniswap, limit liquidity USD ${Uniswap_MinLiquidity}  volume ${Uniswap_MinVol24}  txcount ${Uniswap_TxCount24}`);

    // prepare phase, read allowlist
    const allowlist: string[] = readJsonFile(getChainAllowlistPath(Ethereum)) as string[];

    const pairs = await getTradingPairs(Uniswap_TradingPairsUrl, Uniswap_TradingPairsQuery);
    const filtered: PairInfo[] = [];
    pairs.forEach(x => {
        try {
            if (typeof(x) === "object") {
                const pairInfo = x as PairInfo;
                if (pairInfo) {
                    if (checkTradingPair(pairInfo, Ethereum, Uniswap_MinLiquidity, Uniswap_MinVol24, Uniswap_TxCount24, allowlist, PrimaryTokens)) {
                        filtered.push(pairInfo);
                    }
                }
            }
        } catch (err) {
            console.log("Exception:", err);
        }
    });

    console.log("Retrieved & filtered", filtered.length, "pairs:");
    filtered.forEach(p => {
        console.log(`pair:  ${p.token0.symbol} -- ${p.token1.symbol} \t USD ${Math.round(p.reserveUSD)} ${Math.round(p.volumeUSD)} ${p.txCount}`);
    });

    return filtered;
}

function tokenInfoFromSubgraphToken(token: TokenInfo): TokenItem {
    const idChecksum = toChecksum(token.id);
    return new TokenItem(
        assetID(60, idChecksum),
        "ERC20",
        idChecksum, token.name, token.symbol, parseInt(token.decimals.toString()),
        logoURI(idChecksum, "ethereum", "--"),
        []);
}

// Retrieve trading pairs from PancakeSwap
async function generateTokenlist(): Promise<void> {
    const tokenlistFile = getChainTokenlistBasePath(Ethereum);
    const json = readJsonFile(tokenlistFile);
    const list: List = json as List;
    console.log(`Tokenlist base, ${list.tokens.length} tokens`);
    
    const tradingPairs = await retrieveUniswapPairs();
    tradingPairs.forEach(p => {
        let tokenItem0 = tokenInfoFromSubgraphToken(p.token0);
        let tokenItem1 = tokenInfoFromSubgraphToken(p.token1);
        if (primaryTokenIndex(p, PrimaryTokens) == 2) {
            // reverse
            const tmp = tokenItem1; tokenItem1 = tokenItem0; tokenItem0 = tmp;
        }
        addPairIfNeeded(tokenItem0, tokenItem1, list);
    });
    console.log(`Tokenlist updated, ${list.tokens.length} tokens`);

    const newList = generateTokensList("Ethereum", list.tokens,
        "2020-10-03T12:37:57.000+00:00", // use constant here to prevent changing time every time
        0, 1, 0);
    writeToFileWithUpdate(getChainTokenlistPath(Ethereum), newList);
}

export class EthereumAction implements ActionInterface {
    getName(): string { return "Ethereum"; }

    getSanityChecks(): CheckStepInterface[] { return []; }

    async update(): Promise<void> {
        await generateTokenlist();
    }
}
