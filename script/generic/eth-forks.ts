import { ethForkChains } from "../generic/blockchains";
import {
    getChainAssetsPath,
    getChainAssetsList,
    getChainAssetPath,
    getChainAssetFilesList,
    logoName,
    logoExtension,
    logoFullName,
} from "../generic/repo-structure";
import {
    getFileName,
    getFileExt,
    gitMove,
    readDirSync,
    isPathExistsSync,
} from "../generic/filesystem";
import { toChecksum } from "../generic/eth-address";
import { ActionInterface, CheckStepInterface } from "../generic/interface";
import * as bluebird from "bluebird";

function checkAddressChecksum(assetsFolderPath: string, address: string, chain: string) {
    const checksumAddress = toChecksum(address, chain);
    if (checksumAddress !== address) {
        gitMove(assetsFolderPath, address, checksumAddress);
        console.log(`Renamed to checksum format ${checksumAddress}`);
    }
}

async function checkAddressChecksums() {
    console.log(`Checking for checksum formats ...`);
    await bluebird.each(ethForkChains, async (chain) => {
        const assetsPath = getChainAssetsPath(chain);

        await bluebird.each(readDirSync(assetsPath), async (address) => {
            await bluebird.each(getChainAssetFilesList(chain, address), async (file) => {
                if (getFileName(file) == logoName && getFileExt(file) !== logoExtension) {
                    console.log(`Renaming incorrect asset logo extension ${file} ...`);
                    gitMove(getChainAssetPath(chain, address), file, logoFullName);
                }
            });
            checkAddressChecksum(assetsPath, address, chain);
        });
    });
}

export class EthForks implements ActionInterface {
    getName(): string { return "Ethereum forks"; }
    
    getSanityChecks(): CheckStepInterface[] {
        const steps: CheckStepInterface[] = [];
        ethForkChains.forEach(chain => {
            steps.push(
                {
                    getName: () => { return `Folder structure for chain ${chain} (ethereum fork)`;},
                    check: async () => {
                        const errors: string[] = [];
                        const assetsFolder = getChainAssetsPath(chain);
                        if (!isPathExistsSync(assetsFolder)) {
                            console.log(`     Found 0 assets for chain ${chain}`);
                            return [errors, []];
                        }
                        const assetsList = getChainAssetsList(chain);
                        console.log(`     Found ${assetsList.length} assets for chain ${chain}`);
                        await bluebird.each(assetsList, async (address) => {
                            const assetPath = `${assetsFolder}/${address}`;
                            if (!isPathExistsSync(assetPath)) {
                                errors.push(`Expect directory at path: ${assetPath}`);
                            }
                            const inChecksum = toChecksum(address, chain);
                            if (address !== inChecksum) {
                                errors.push(`Expect asset at path ${assetPath} in checksum: '${inChecksum}'`);
                            }
                        });
                        return [errors, []];
                    }    
                }
            );
        });
        return steps;
    }
    
    async sanityFix(): Promise<void> {
        await checkAddressChecksums();
    }
}
