// Interfacing with TheGraph subgraph APIs

import axios from "axios";
import { ForceListPair, matchPairToForceList, TokenItem } from "./tokenlists";

export interface TokenInfo {
    id: string;
    symbol: string;
    name: string;
    decimals: number;
}

export interface PairInfo {
    id: string;
    reserveUSD: number;
    volumeUSD: number;
    txCount: number;
    token0: TokenInfo;
    token1: TokenInfo;
}

export interface TokenInfoBitquery {
    address: string;
    symbol: string;
    name: string;
    decimals: number;
}

export interface PairInfoBitquery {
    sellCurrency: TokenInfoBitquery;
    buyCurrency: TokenInfoBitquery;
    trade: number; // trade count
    tradeAmount: number; // trade volume usd
}

export async function getTradingPairs(apiUrl: string, subgraphQuery: string): Promise<unknown[]> {
    // compact the query string
    const compactQuery = subgraphQuery.replace(/(?:\r\n|\r|\n)/g, ' ').replace(/\s[\s]+/g, ' ');
    const postData = '{"operationName":"pairs", "variables":{}, "query":"' + compactQuery + '"}';

    console.log(`Retrieving trading pair infos from: ${apiUrl}`);
    try {
        const result = await axios.post(apiUrl, postData).then(r => r.data);
        if (!result || !result.data || !result.data.pairs) {
            throw `Unexpected result: ${JSON.stringify(result)}`;
        }
        const pairs = result.data.pairs;
        console.log(`Retrieved ${pairs.length} trading pair infos`);
        return pairs;
    } catch (err) {
        console.log("Exception from graph api:", err, apiUrl, JSON.stringify(postData));
        throw err;
    }
}

export async function getTradingPairsBitquery(apiUrl: string, subgraphQuery: string): Promise<unknown[]> {
    // compact the query string
    const compactQuery = subgraphQuery.replace(/(?:\r\n|\r|\n)/g, ' ').replace(/\s[\s]+/g, ' ');
    const postData = {"query": compactQuery, "variables":{}};

    console.log(`Retrieving trading pair infos from: ${apiUrl}`);
    try {
        const result = await axios.post(apiUrl, postData).then(r => r.data);
        if (!result || !result.data || !result.data.ethereum || !result.data.ethereum.dexTrades) {
            throw `Unexpected result: ${JSON.stringify(result)}`;
        }
        const pairs = result.data.ethereum.dexTrades;
        console.log(`Retrieved ${pairs.length} trading pair infos`);
        return pairs;
    } catch (err) {
        console.log("Exception from graph api:", err, apiUrl, JSON.stringify(postData));
        throw err;
    }
}

function isTokenPrimary(token: TokenInfo, primaryTokens: string[]): boolean {
    return (primaryTokens.find(t => (t === token.symbol.toUpperCase())) != undefined);
}

// check which token of the pair is the primary token, 1st, or 2nd, or 0 for none
export function primaryTokenIndex(pair: PairInfo, primaryTokens: string[]): number {
    if (isTokenPrimary(pair.token0, primaryTokens)) {
        return 1;
    }
    if (isTokenPrimary(pair.token1, primaryTokens)) {
        return 2;
    }
    return 0;
}

function tokenItemFromInfo(tokenInfo: TokenInfo): TokenItem {
    return new TokenItem(tokenInfo.id, '', tokenInfo.id, tokenInfo.name, tokenInfo.symbol, tokenInfo.decimals, '', []);
}

// Verify a trading pair, whether we support the tokens, has enough liquidity, etc.
export function checkTradingPair(pair: PairInfo, minLiquidity: number, minVol24: number, minTxCount24: number, primaryTokens: string[], forceIncludeList: ForceListPair[]): boolean {
    if (!pair.id || !pair.reserveUSD || !pair.volumeUSD || !pair.txCount || !pair.token0 || !pair.token1) {
        return false;
    }
    if (primaryTokenIndex(pair, primaryTokens) == 0) {
        console.log("pair with no primary coin:", pair.token0.symbol, "--", pair.token1.symbol);
        return false;
    }

    if (matchPairToForceList(tokenItemFromInfo(pair.token0), tokenItemFromInfo(pair.token1), forceIncludeList)) {
        console.log("pair included due to FORCE INCLUDE:", pair.token0.symbol, "--", pair.token1.symbol, "  ", Math.round(pair.reserveUSD));
        return true;
    }

    if (pair.reserveUSD < minLiquidity) {
        console.log("pair with low liquidity:", pair.token0.symbol, "--", pair.token1.symbol, "  ", Math.round(pair.reserveUSD));
        return false;
    }
    if (pair.volumeUSD < minVol24) {
        console.log("pair with low volume:", pair.token0.symbol, "--", pair.token1.symbol, "  ", Math.round(pair.volumeUSD));
        return false;
    }
    if (pair.txCount < minTxCount24) {
        console.log("pair with low tx count:", pair.token0.symbol, "--", pair.token1.symbol, "  ", pair.txCount);
        return false;
    }
    //console.log("pair:", pair.token0.symbol, "--", pair.token1.symbol, "  ", pair.reserveUSD);
    return true;
}
