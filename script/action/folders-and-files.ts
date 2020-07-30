import {
    readDirSync,
    isPathExistsSync
} from "../common/filesystem";
import * as config from "../common/config";
import { CheckStepInterface, ActionInterface } from "./interface";
import {
    chainsPath,
    getChainLogoPath,
    getChainAssetsPath,
    getChainAssetPath,
    assetFolderAllowedFiles,
    getChainFolderFilesList,
    chainFolderAllowedFiles
} from "../common/repo-structure";
import { isLogoDimensionOK } from "../common/image";
import { isLowerCase } from "../common/types";

const defaultRootDirAllowedFiles = [".github", "blockchains", "dapps", "media", "script", "src", ".gitignore", "LICENSE", "package-lock.json", "package.json", "README.md", ".git", "Gemfile", "Gemfile.lock"];
const rootDirAllowedFiles = config.getConfig("folders_rootdir_allowed_files", defaultRootDirAllowedFiles);
const foundChains = readDirSync(chainsPath)

export class FoldersFiles implements ActionInterface {
    getName(): string { return "Folders and Files"; }
    
    getChecks(): CheckStepInterface[] {
        return [
            {
                getName: () => { return "Repository root dir"},
                check: async () => {
                    var error: string = "";
                    const dirActualFiles = readDirSync(".");
                    dirActualFiles.forEach(file => {
                        if (!(rootDirAllowedFiles.indexOf(file) >= 0)) {
                            error += `File "${file}" should not be in root or added to predifined list\n`;
                        }
                    });
                    return error;
                }
            },
            {
                getName: () => { return "Chain folders are lowercase, contain only predefined list of files"},
                check: async () => {
                    var error: string = "";
                    foundChains.forEach(chain => {
                        if (!isLowerCase(chain)) {
                            error += `Chain folder must be in lowercase "${chain}"\n`;
                        }
                        getChainFolderFilesList(chain).forEach(file => {
                            if (!(chainFolderAllowedFiles.indexOf(file) >= 0)) {
                                error += `File '${file}' not allowed in chain folder: ${chain}\n`;
                            }
                        });
                    });
                    return error;
                }
            },
            {
                getName: () => { return "Chain folders have logo, and correct size"},
                check: async () => {
                    var error: string = "";
                    foundChains.forEach(chain => {
                        const chainLogoPath = getChainLogoPath(chain);
                        if (!isPathExistsSync(chainLogoPath)) {
                            error += `File missing at path "${chainLogoPath}"\n`;
                        }
                        const [isOk, error1] = isLogoDimensionOK(chainLogoPath);
                        if (!isOk) {
                            error += error1 + "\n";
                        }
                    });
                    return error;
                }
            },
            {
                getName: () => { return "Asset folders contain only predefined set of files"},
                check: async () => {
                    var error: string = "";
                    foundChains.forEach(chain => {
                        const assetsPath = getChainAssetsPath(chain);
                        if (isPathExistsSync(assetsPath)) {
                            readDirSync(assetsPath).forEach(address => {
                                const assetFiles = getChainAssetPath(chain, address)
                                readDirSync(assetFiles).forEach(assetFolderFile => {
                                    if (!(assetFolderAllowedFiles.indexOf(assetFolderFile) >= 0)) {
                                        error += `File '${assetFolderFile}' not allowed at this path: ${assetsPath}\n`;
                                    }
                                });
                            }) ;
                        }
                    });
                    return error;
                }
            },
        ];
    }
    
    fix = null;
    
    update = null;
}
