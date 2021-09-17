import {
    readDirSync,
    isPathExistsSync
} from "../generic/filesystem";
import { CheckStepInterface, ActionInterface } from "../generic/interface";
import {
    allChains,
    dappsPath,
    getChainLogoPath,
    getChainAssetInfoPath,
    getChainAssetsPath,
    getChainAssetPath,
    getChainAssetLogoPath,
    assetFolderAllowedFiles,
    getChainFolderFilesList,
    chainFolderAllowedFiles,
    rootDirAllowedFiles
} from "../generic/repo-structure";
import { isLogoOK } from "../generic/image";
import { isLowerCase } from "../generic/types";
import { readJsonFile } from "../generic/json";
import * as bluebird from "bluebird";

export class FoldersFiles implements ActionInterface {
    getName(): string { return "Folders and Files"; }
    
    getSanityChecks(): CheckStepInterface[] {
        return [
            {
                getName: () => { return "Repository root dir"},
                check: async () => {
                    const errors: string[] = [];
                    const dirActualFiles = readDirSync(".");
                    dirActualFiles.forEach(file => {
                        if (!(rootDirAllowedFiles.indexOf(file) >= 0)) {
                            errors.push(`File "${file}" should not be in root or added to predifined list`);
                        }
                    });
                    return [errors, []];
                }
            },
            {
                getName: () => { return "Chain folders are lowercase, contain only predefined list of files"},
                check: async () => {
                    const errors: string[] = [];
                    allChains.forEach(chain => {
                        if (!isLowerCase(chain)) {
                            errors.push(`Chain folder must be in lowercase "${chain}"`);
                        }
                        getChainFolderFilesList(chain).forEach(file => {
                            if (!(chainFolderAllowedFiles.indexOf(file) >= 0)) {
                                errors.push(`File '${file}' not allowed in chain folder: ${chain}`);
                            }
                        });
                    });
                    return [errors, []];
                }
            },
            {
                getName: () => { return "Chain folders have logo, and correct size"},
                check: async () => {
                    const errors: string[] = [];
                    await bluebird.each(allChains, async (chain) => {
                        const chainLogoPath = getChainLogoPath(chain);
                        if (!isPathExistsSync(chainLogoPath)) {
                            errors.push(`File missing at path "${chainLogoPath}"`);
                        }
                        const [isOk, error1] = await isLogoOK(chainLogoPath);
                        if (!isOk) {
                            errors.push(error1);
                        }
                    });
                    return [errors, []];
                }
            },
            {
                getName: () => { return "Asset folders contain logo and info"},
                check: async () => {
                    const errors: string[] = [];
                    const warnings: string[] = [];
                    allChains.forEach(chain => {
                        const assetsPath = getChainAssetsPath(chain);
                        if (isPathExistsSync(assetsPath)) {
                            readDirSync(assetsPath).forEach(address => {
                                const logoFullPath = getChainAssetLogoPath(chain, address);
                                const logoExists = isPathExistsSync(logoFullPath);
                                const infoFullPath = getChainAssetInfoPath(chain, address);
                                const infoExists = isPathExistsSync(infoFullPath);
                                // Assets should have a logo and an info file.  Exceptions:
                                // - status=spam tokens may have no logo 
                                // - on some chains some valid tokens have no info (should be fixed)
                                if (!infoExists || !logoExists) {
                                    if (!infoExists && logoExists) {
                                        const msg = `Missing info file for asset '${chain}/${address}' -- ${infoFullPath}`;
                                        // enforce that info must be present
                                        console.log(msg);
                                        errors.push(msg);
                                    }
                                    if (!logoExists && infoExists) {
                                        const info: unknown = readJsonFile(infoFullPath);
                                        if (!info['status'] || info['status'] !== 'spam') {
                                            const msg = `Missing logo file for non-spam asset '${chain}/${address}' -- ${logoFullPath}`;
                                            console.log(msg);
                                            errors.push(msg);
                                        }
                                    }
                                }
                            });
                        }
                    });
                    return [errors, warnings];
                }
            },
            /*
            {
                getName: () => { return "Asset folders contain info.json"},
                check: async () => {
                    const warnings: string[] = [];
                    allChains.forEach(chain => {
                        const assetsPath = getChainAssetsPath(chain);
                        if (isPathExistsSync(assetsPath)) {
                            readDirSync(assetsPath).forEach(address => {
                                const infoFullPath = getChainAssetInfoPath(chain, address);
                                if (!isPathExistsSync(infoFullPath)) {
                                    warnings.push(`Missing info file for asset '${chain}/${address}' -- ${infoFullPath}`);
                                }
                            });
                        }
                    });
                    return [[], warnings];
                }
            },
            */
            {
                getName: () => { return "Asset folders contain only predefined set of files"},
                check: async () => {
                    const errors: string[] = [];
                    allChains.forEach(chain => {
                        const assetsPath = getChainAssetsPath(chain);
                        if (isPathExistsSync(assetsPath)) {
                            readDirSync(assetsPath).forEach(address => {
                                const assetFiles = getChainAssetPath(chain, address);
                                readDirSync(assetFiles).forEach(assetFolderFile => {
                                    if (!(assetFolderAllowedFiles.indexOf(assetFolderFile) >= 0)) {
                                        errors.push(`File '${assetFolderFile}' not allowed at this path: ${assetsPath}`);
                                    }
                                });
                            });
                        }
                    });
                    return [errors, []];
                }
            },
            {
                getName: () => { return "Dapps folders contain only .png files, with all lowercase names"},
                check: async () => {
                    const errors: string[] = [];
                    if (isPathExistsSync(dappsPath)) {
                        readDirSync(dappsPath).forEach(filename => {
                            if (!filename.endsWith('.png')) {
                                errors.push(`File '${filename}' has invalid extension; ${dappsPath}`);
                            }
                            if (filename.toLowerCase() != filename) {
                                errors.push(`File '${filename}' is not all-lowercase; ${dappsPath}`);
                            }
                        });
                    }
                    return [errors, []];
                }
            }
        ];
    }
}
