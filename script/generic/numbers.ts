import BigNumber from "bignumber.js";

export function toSatoshis(value: string, decimals: number): string {
    return new BigNumber(value).multipliedBy(new BigNumber(10).exponentiatedBy(decimals)).toFixed()
}

export function fromSatoshis(value: string, decimals: number): string {
    return new BigNumber(value).dividedBy(new BigNumber(10).exponentiatedBy(decimals)).toFixed()
}