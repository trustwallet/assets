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
    logoFullName,
    getChainAssetLogoPath
} from "../common/repo-structure";
import { formatJsonFile } from "../common/json";
import {
    getFileName,
    getFileExt,
    gitMove,
    readDirSync,
    isPathExistsSync,
} from "../common/filesystem";
import { isChecksum, toChecksum } from "../common/eth-web3";
import { ActionInterface, CheckStepInterface } from "./interface";
import { isLogoOK } from "../common/image";
import { isAssetInfoOK } from "../common/asset-info";
import * as bluebird from "bluebird";

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
    
    getChecks(): CheckStepInterface[] {
        return [
            {
                getName: () => { return "Ethereum fork folder structure"},
                check: async () => {
                    var error: string = "";
                    await bluebird.each(ethForkChains, async (chain) => {
                        const assetsFolder = getChainAssetsPath(chain);
                        const assetsList = getChainAssetsList(chain);
                        console.log(`     Found ${assetsList.length} assets for chain ${chain}`);
                        await bluebird.each(assetsList, async (address) => {
                            const assetPath = `${assetsFolder}/${address}`;
                            if (!isPathExistsSync(assetPath)) {
                                error += `Expect directory at path: ${assetPath}\n`;
                            }
                            if (!isChecksum(address)) {
                                error += `Expect asset at path ${assetPath} in checksum\n`;
                            }
                            const assetLogoPath = getChainAssetLogoPath(chain, address);
                            if (!isPathExistsSync(assetLogoPath)) {
                                error += `Missing file at path '${assetLogoPath}'\n`;
                            }
                            const [isOK, dimensionMsg] = await isLogoOK(assetLogoPath);
                            if (!isOK) {
                                error += dimensionMsg + "\n";
                            }
                            const [isInfoOK, infoMsg] = isAssetInfoOK(chain, address);
                            if (!isInfoOK) {
                                error += infoMsg + "\n";
                            }
                        });
                    });
                    return error;
                }
            },
        ];
    }
    
    async fix(): Promise<void> {
        formatInfos();
        checkAddressChecksums();
    }
    
    update = null;
}
