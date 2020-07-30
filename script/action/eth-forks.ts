import { ethForkChains } from "../common/blockchains";
import {
    getChainAssetsPath,
    getChainAssetsList,
    getChainAssetPath,
    getChainAssetInfoPath,
    getChainAssetFilesList,
    isChainAssetInfoExistSync,
    logoName,
    logoExtension,
    logoFullName
} from "../common/repo-structure";
import { formatJsonFile } from "../common/json";
import {
    getFileName,
    getFileExt,
    gitMove,
    readDirSync
} from "../common/filesystem";
import { isChecksum, toChecksum } from "../common/eth-web3";
import { ActionInterface } from "./interface";

function formatInfos() {
    console.log(`Formatting info files...`);
    ethForkChains.forEach(chain => {
        let count: number = 0;
        const chainAssets = getChainAssetsList(chain);
        chainAssets.forEach(address => {
            if (isChainAssetInfoExistSync(chain, address)) {
                const chainAssetInfoPath = getChainAssetInfoPath(chain, address);
                formatJsonFile(chainAssetInfoPath, true);
                ++count;
            }
        })
        console.log(`Formatted ${count} info files for chain ${chain} (total ${chainAssets.length})`);
    })
}

function checkAddressChecksum(assetsFolderPath: string, address: string) {
    if (!isChecksum(address)) {
        const checksumAddress = toChecksum(address);
        gitMove(assetsFolderPath, address, checksumAddress);
        console.log(`Renamed to checksum format ${checksumAddress}`);
    }
}

function checkAddressChecksums() {
    console.log(`Checking for checksum formats ...`);
    ethForkChains.forEach(chain => {
        const assetsPath = getChainAssetsPath(chain);

        readDirSync(assetsPath).forEach(address => {
            getChainAssetFilesList(chain, address).forEach(file => {
                if (getFileName(file) == logoName && getFileExt(file) !== logoExtension) {
                    console.log(`Renaming incorrect asset logo extension ${file} ...`);
                    gitMove(getChainAssetPath(chain, address), file, logoFullName);
                }
            });
            checkAddressChecksum(assetsPath, address);
        });
    });
}

export class EthForks implements ActionInterface {
    getName(): string { return "Ethereum forks"; }
    check = null;
    async fix(): Promise<void> {
        formatInfos();
        checkAddressChecksums();
    }
    update = null;
}
