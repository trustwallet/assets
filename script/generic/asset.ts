import { TokenType } from "../generic/tokentype";
import * as config from "../config";

// Asset ID from coin symbol (diff between native and token coins)
export function assetIdSymbol(symbol: string, nativeCoinSymbol: string, coinType: number): string {
    if (symbol == nativeCoinSymbol) {
        return assetID(coinType)
    }
    return assetID(coinType, symbol)
}

// Asset ID from coin number and ID
export function assetID(coin: number, token_id = ``): string {
    if (token_id.length > 0) {
        return `c${coin}_t${token_id}`
    } 
    return `c${coin}`
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
