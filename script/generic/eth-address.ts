import { toChecksumAddress, checkAddressChecksum } from "ethereum-checksum-address";
import { reverseCase } from "./types";

export const isChecksumEthereum = (address: string): boolean => checkAddressChecksum(address);
export const toChecksumEthereum = (address: string): string => toChecksumAddress(address);

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
    if (!(address.length == 40 || (address.length == 42 && address.substring(0, 2) === '0x'))) {
        return false;
    }
    try {
        const check1 = toChecksum(address);
        if (toChecksum(check1) !== check1) {
            return false;
        }
        return true;
    } catch (error) {
        return false;
    }
}
