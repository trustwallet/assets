const Web3 = require('web3');

const web3 = new Web3('ws://localhost:8546');

export const isChecksum = (address: string): boolean => web3.utils.checkAddressChecksum(address);
export const toChecksum = (address: string): string => web3.utils.toChecksumAddress(address);
