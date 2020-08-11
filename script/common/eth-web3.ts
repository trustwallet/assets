import { reverseCase } from "./types";

const Web3 = require('web3');

const web3 = new Web3('ws://localhost:8546');

export const isChecksumEthereum = (address: string): boolean => web3.utils.checkAddressChecksum(address);
export const toChecksumEthereum = (address: string): string => web3.utils.toChecksumAddress(address);

export function toChecksum(address: string, chain: string = "ethereum"): string {
    var checksumEthereum = toChecksumEthereum(address);
    
    // special handling for Wanchain
    if (chain.toLowerCase() === "wanchain") {
        const checksumWanchain = reverseCase(checksumEthereum).replace("X", "x");
        return checksumWanchain;
    }
    
    return checksumEthereum;
}

export function isChecksum(address: string, chain: string = "ethereum"): boolean {
    // special handling for Wanchain
    if (chain.toLowerCase() === "wanchain") {
        const addressEthereum = reverseCase(address).replace("X", "x");
        return isChecksumEthereum(addressEthereum);
    }

    return isChecksumEthereum(address);
}

