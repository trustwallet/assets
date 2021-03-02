import axios from "axios";
import { TokenType } from "../generic/tokentype";
import * as config from "../config";

// Asset ID from coin symbol (diff between native and token coins)
export function assetIdSymbol(tokenId: string, nativeCoinId: string, coinType: number): string {
    if (tokenId == nativeCoinId) {
        return assetID(coinType)
    }
    return assetID(coinType, tokenId)
}

// Asset ID from coin number and ID
export function assetID(coinType: number, tokenId = ``): string {
    if (tokenId.length > 0) {
        return `c${coinType}_t${tokenId}`
    } 
    return `c${coinType}`
}

// Token type from token symbol (diff between native and token coins)
export function tokenType(symbol: string, nativeCoinSymbol: string, tokenType: string): string {
    if (symbol == nativeCoinSymbol) {
        return TokenType.COIN
    }
    return tokenType;
}

// Github logo URL for coin.
export function logoURI(id: string, githubChainFolder: string, nativeCoinSymbol: string): string {
    if (id == nativeCoinSymbol) {
        return `${config.assetsURL}/blockchains/${githubChainFolder}/info/logo.png`
    }
    return `${config.assetsURL}/blockchains/${githubChainFolder}/assets/${id}/logo.png`
}

// Token info from TW api
// e.g. {"name":"Binance-Peg Cosmos","symbol":"ATOM","type":"BEP20","decimals":18,"asset_id":"c20000714_t0x0Eb3..."}
export class TokenTwInfo {
    name: string;
    symbol: string;
    type: string;
    decimals: number;
    asset_id: string;
}

export async function tokenInfoFromTwApi(assetID: string): Promise<TokenTwInfo> {
    try {
        const apiUrl = `https://api.trustwallet.com/v1/assets/${assetID}`;
        const result = await axios.get(apiUrl).then(r => r.data);
        if (!result || !result.asset_id) {
            console.log("Unexpected result", result);
            return undefined;
        }
        const info = result as TokenTwInfo;
        return info;
    } catch (err) {
        console.log("Exception:", err);
        return undefined;
    }
}
