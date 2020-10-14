export function assetID(coin: number, token_id = ``): string {
    if (token_id.length > 0) {
        return `c${coin}_t${token_id}`
    } 
    return `c${coin}`
}