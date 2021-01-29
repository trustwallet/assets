// Interfacing with TheGraph subgraph APIs

import axios from "axios";
import { getChainAssetLogoPath } from "../generic/repo-structure";
import { isPathExistsSync } from "../generic/filesystem";

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

export async function getTradingPairs(apiUrl: string, subgraphQuery: string): Promise<unknown[]> {
    // compact the query string
    const compactQuery = subgraphQuery.replace(/(?:\r\n|\r|\n)/g, ' ').replace(/\s[\s]+/g, ' ');
    const postData = '{"operationName":"pairs", "variables":{}, "query":"' + compactQuery + '"}';

    console.log(`Retrieving trading pair infos from: ${apiUrl}`);
    try {
        const result = await axios.post(apiUrl, postData).then(r => r.data);
        if (!result || !result.data || !result.data.pairs) {
            throw `Unexpected result: ${result}`;
        }
        const pairs = result.data.pairs;
        console.log(`Retrieved ${pairs.length} trading pair infos`);
        return pairs;
    } catch (err) {
        console.log("Exception from graph api:", err, apiUrl, JSON.stringify(postData));
        throw err;
    }
}

function checkBSCTokenExists(id: string, chainName: string, tokenAllowlist: string[]): boolean {
    const logoPath = getChainAssetLogoPath(chainName, id);
    if (!isPathExistsSync(logoPath)) {
        return false;
    }
    if (tokenAllowlist.find(t => (id.toLowerCase() === t.toLowerCase())) === undefined) {
        //console.log(`Token not found in allowlist, ${id}`);
        return false;
    }
    return true;
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

// Verify a trading pair, whether we support the tokens, has enough liquidity, etc.
export function checkTradingPair(pair: PairInfo, chainName: string, 
    minLiquidity: number, minVol24: number, minTxCount24: number,
    tokenAllowlist: string[], primaryTokens: string[]
): boolean {
    if (!pair.id || !pair.reserveUSD || !pair.volumeUSD || !pair.txCount || !pair.token0 || !pair.token1) {
        return false;
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
    if (!checkBSCTokenExists(pair.token0.id, chainName, tokenAllowlist)) {
        console.log("pair with unsupported 1st coin:", pair.token0.symbol, "--", pair.token1.symbol);
        return false;
    }
    if (!checkBSCTokenExists(pair.token1.id, chainName, tokenAllowlist)) {
        console.log("pair with unsupported 2nd coin:", pair.token0.symbol, "--", pair.token1.symbol);
        return false;
    }
    if (primaryTokenIndex(pair, primaryTokens) == 0) {
        console.log("pair with no primary coin:", pair.token0.symbol, "--", pair.token1.symbol);
        return false;
    }
    //console.log("pair:", pair.token0.symbol, "--", pair.token1.symbol, "  ", pair.reserveUSD);
    return true;
}
