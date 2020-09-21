import { reverseCase } from "./types";

const web3 = new (require('web3'))('ws://localhost:8546');

export const isChecksumEthereum = (address: string): boolean => web3.utils.checkAddressChecksum(address);
export const toChecksumEthereum = (address: string): string => web3.utils.toChecksumAddress(address);

export function toChecksum(address: string, chain = "ethereum"): string {
    const checksumEthereum = toChecksumEthereum(address);
    
    // special handling for Wanchain
    if (chain.toLowerCase() === "wanchain") {
        const checksumWanchain = reverseCase(checksumEthereum).replace("X", "x");
        return checksumWanchain;
    }
    
    return checksumEthereum;
}

export function isChecksum(address: string, chain = "ethereum"): boolean {
    // special handling for Wanchain
    if (chain.toLowerCase() === "wanchain") {
        const addressEthereum = reverseCase(address).replace("X", "x");
        return isChecksumEthereum(addressEthereum);
    }

    return isChecksumEthereum(address);
}

export function isEthereumAddress(address: string): boolean {
    return web3.utils.isAddress(address)
}
