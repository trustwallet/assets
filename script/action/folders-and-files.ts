import {
    readDirSync,
    isPathExistsSync
} from "../common/filesystem";
import * as config from "../common/config";
import { CheckStepInterface, ActionInterface } from "./interface";
import {
    chainsPath,
    getChainLogoPath
} from "../common/repo-structure";
import { isLogoDimensionOK } from "../common/image";

const defaultRootDirAllowedFiles = [".github", "blockchains", "dapps", "media", "script", "src", ".gitignore", "LICENSE", "package-lock.json", "package.json", "README.md", ".git", "Gemfile", "Gemfile.lock"];
const rootDirAllowedFiles = config.getConfig("folders_rootdir_allowed_files", defaultRootDirAllowedFiles);
const foundChains = readDirSync(chainsPath)

export class FoldersFiles implements ActionInterface {
    getName(): string { return "Folders and Files"; }
    getChecks(): CheckStepInterface[] {
        return [
            {
                getName: () => { return "Repository root dir"},
                check: () => {
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
                getName: () => { return "Chain folders have logo, and correct size"},
                check: () => {
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
        ];
    }
    fix = null;
    update = null;
}
