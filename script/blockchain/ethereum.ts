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
import * as bluebird from "bluebird";
import * as config from "../config"

const PrimaryTokens: string[] = ["WETH", "ETH"];

// Retrieve trading pairs from Uniswap
async function retrieveUniswapPairs(): Promise<PairInfo[]> {
    console.log(`Retrieving pairs from Uniswap, limit liquidity USD ${config.Uniswap_MinLiquidity}  volume ${config.Uniswap_MinVol24}  txcount ${config.Uniswap_MinTxCount24}`);

    // prepare phase, read allowlist
    const allowlist: string[] = readJsonFile(getChainAllowlistPath(Ethereum)) as string[];

    const pairs = await getTradingPairs(config.Uniswap_TradingPairsUrl, config.Uniswap_TradingPairsQuery);
    const filtered: PairInfo[] = [];
    pairs.forEach(x => {
        try {
            if (typeof(x) === "object") {
                const pairInfo = x as PairInfo;
                if (pairInfo) {
                    if (checkTradingPair(pairInfo, Ethereum, config.Uniswap_MinLiquidity, config.Uniswap_MinVol24, config.Uniswap_MinTxCount24, allowlist, PrimaryTokens)) {
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
    await bluebird.each(tradingPairs, async (p) => {
        let tokenItem0 = tokenInfoFromSubgraphToken(p.token0);
        let tokenItem1 = tokenInfoFromSubgraphToken(p.token1);
        if (primaryTokenIndex(p, PrimaryTokens) == 2) {
            // reverse
            const tmp = tokenItem1; tokenItem1 = tokenItem0; tokenItem0 = tmp;
        }
        await addPairIfNeeded(tokenItem0, tokenItem1, list);
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
