// Interfacing with TheGraph subgraph APIs

import axios from "axios";

export interface TokenInfo {
    id: string;
    symbol: string;
    name: string;
    decimals: number;
}

export interface PairInfo {
    id: string;
    reserveUSD: number;
    token0: TokenInfo;
    token1: TokenInfo;
}

export async function getTradingPairs(apiUrl: string, subgraphQuery: string): Promise<unknown[]> {
    const postData = '{"operationName":"pairs", "variables":{}, "query":"' + subgraphQuery + '"}';

    console.log(`Retrieving trading pair infos from: ${apiUrl}`);
    const result = await axios.post(apiUrl, postData).then(r => r.data);
    if (!result || !result.data || !result.data.pairs) {
        return [];
    }
    const pairs = result.data.pairs;
    console.log(`Retrieved ${pairs.length} trading pair infos`);
    console.log(pairs[0]);
    return pairs;
}
