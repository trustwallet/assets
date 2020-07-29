import { readDirSync } from "../common/filesystem";
import * as config from "../common/config";

const defaultRootDirAllowedFiles = [".github", "blockchains", "dapps", "media", "script", "src", ".gitignore", "LICENSE", "package-lock.json", "package.json", "README.md", ".git", "Gemfile", "Gemfile.lock"];
const rootDirAllowedFiles = config.getConfig("folders_rootdir_allowed_files", defaultRootDirAllowedFiles);

export function check(): {name: string, error: string} {
    var error: string = "";
    const dirActualFiles = readDirSync(".");
    dirActualFiles.forEach(file => {
        if (!(rootDirAllowedFiles.indexOf(file) >= 0)) {
            error += `File "${file}" should not be in root or added to predifined list\n`;
        }
    });
    return {
        name: "Check repository root dir",
        error
    };
}
