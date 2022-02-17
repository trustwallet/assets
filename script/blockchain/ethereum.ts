import { ActionInterface, CheckStepInterface } from "../generic/interface";
import {
    checkTradingPair,
    getTradingPairs,
    PairInfo,
    primaryTokenIndex,
    TokenInfo
} from "../generic/subgraph";
import { Ethereum } from "../generic/blockchains";
import {
    parseForceList,
    rebuildTokenlist,
    TokenItem
} from "../generic/tokenlists";
import { toChecksum } from "../generic/eth-address";
import { assetID, logoURI } from "../generic/asset";
import * as config from "../config"

const PrimaryTokens: string[] = ["WETH", "ETH"];

// Retrieve trading pairs from Uniswap
async function retrieveUniswapPairs(): Promise<PairInfo[]> {
    console.log(`Retrieving pairs from Uniswap, limit liquidity USD ${config.Uniswap_MinLiquidity}  volume ${config.Uniswap_MinVol24}  txcount ${config.Uniswap_MinTxCount24}`);

    console.log(`  forceIncludeList: ${config.Uniswap_ForceInclude}`);
    const includeList = parseForceList(config.Uniswap_ForceInclude);

    const pairs = await getTradingPairs(config.Uniswap_TradingPairsUrl, config.Uniswap_TradingPairsQuery);
    const filtered: PairInfo[] = [];
    pairs.forEach(x => {
        try {
            if (typeof(x) === "object") {
                const pairInfo = x as PairInfo;
                if (pairInfo) {
                    if (checkTradingPair(pairInfo, config.Uniswap_MinLiquidity, config.Uniswap_MinVol24, config.Uniswap_MinTxCount24, PrimaryTokens, includeList)) {
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
    // note: if [] is returned here for some reason, all pairs will be *removed*.  In case of error (e.g. timeout) it should throw
    const tradingPairs = await retrieveUniswapPairs();
    // convert
    const pairs2: [TokenItem, TokenItem][] = [];
    tradingPairs.forEach(p => {
        let tokenItem0 = tokenInfoFromSubgraphToken(p.token0);
        let tokenItem1 = tokenInfoFromSubgraphToken(p.token1);
        if (primaryTokenIndex(p, PrimaryTokens) == 2) {
            // reverse
            const tmp = tokenItem1; tokenItem1 = tokenItem0; tokenItem0 = tmp;
        }
        pairs2.push([tokenItem0, tokenItem1]);
    });
    await rebuildTokenlist(Ethereum, pairs2, "Ethereum", config.Uniswap_ForceExclude);
}

export class EthereumAction implements ActionInterface {
    getName(): string { return "Ethereum"; }

    getSanityChecks(): CheckStepInterface[] { return []; }

    async updateManual(): Promise<void> {
        await generateTokenlist();
    }
}
