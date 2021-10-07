import { ActionInterface, CheckStepInterface } from "../generic/interface";
import {
    checkTradingPair,
    getTradingPairsBitquery,
    PairInfoBitquery,
    PairInfo,
    primaryTokenIndex,
    TokenInfo,
    TokenInfoBitquery
} from "../generic/subgraph";
import { Polygon } from "../generic/blockchains";
import {
    parseForceList,
    rebuildTokenlist,
    TokenItem
} from "../generic/tokenlists";
import { toChecksum } from "../generic/eth-address";
import { assetID, logoURI } from "../generic/asset";
import * as config from "../config"

const PrimaryTokens: string[] = ["WMATIC", "MATIC", "WETH", "USDC", "USDT", "DAI"];

function convertTokenInfo(token: TokenInfoBitquery): TokenInfo {
    return {
        id: token.address,
        symbol: token.symbol,
        name: token.name,
        decimals: token.decimals
    } as TokenInfo;
}

function convertPairInfo(pair: PairInfoBitquery): PairInfo {
    return {
        id: '?',
        reserveUSD: 1,
        volumeUSD: pair.tradeAmount,
        txCount: pair.trade,
        token0: convertTokenInfo(pair.buyCurrency),
        token1: convertTokenInfo(pair.sellCurrency)
    } as PairInfo;
}

// Return the date 1,5 days ago in the form 2021-10-06
function dateOfYesterday() {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 36*3600*1000);
    return yesterday.toISOString().substr(0, 10);
}

async function retrievePolygonSwapPairs(): Promise<PairInfo[]> {
    console.log(`Retrieving pairs from Polygon, limit  volume ${config.PolygonSwap_MinVol24}  txcount ${config.PolygonSwap_MinTxCount24}`);

    console.log(`  forceIncludeList: ${config.PolygonSwap_ForceInclude}`);
    const includeList = parseForceList(config.PolygonSwap_ForceInclude);

    const query = config.PolygonSwap_TradingPairsQuery;
    const date = dateOfYesterday();
    const queryReplaced = query.replace("$DATE$", date);

    const pairs = await getTradingPairsBitquery(config.PolygonSwap_TradingPairsUrl, queryReplaced);
    const filtered: PairInfo[] = [];
    pairs.forEach(x => {
        try {
            if (typeof(x) === "object") {
                const pairInfo = convertPairInfo(x as PairInfoBitquery);
                if (pairInfo) {
                    if (checkTradingPair(pairInfo, 0, config.PolygonSwap_MinVol24, config.PolygonSwap_MinTxCount24, PrimaryTokens, includeList)) {
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
        assetID(966, idChecksum),
        "POLYGON",
        idChecksum, token.name, token.symbol, parseInt(token.decimals.toString()),
        logoURI(idChecksum, "polygon", "--"),
        []);
}

// Retrieve trading pairs from Polygon
async function generateTokenlist(): Promise<void> {
    // note: if [] is returned here for some reason, all pairs will be *removed*.  In case of error (e.g. timeout) it should throw
    const tradingPairs = await retrievePolygonSwapPairs();
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
    await rebuildTokenlist(Polygon, pairs2, "Polygon", config.PolygonSwap_ForceExclude);
}

export class PolygonAction implements ActionInterface {
    getName(): string { return "Polygon"; }

    getSanityChecks(): CheckStepInterface[] { return []; }

    async updateManual(): Promise<void> {
        await generateTokenlist();
    }
}
