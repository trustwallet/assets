import { readDirSync } from "../common/filesystem";
import * as config from "../common/config";
import { ActionInterface } from "./interface";

const defaultRootDirAllowedFiles = [".github", "blockchains", "dapps", "media", "script", "src", ".gitignore", "LICENSE", "package-lock.json", "package.json", "README.md", ".git", "Gemfile", "Gemfile.lock"];
const rootDirAllowedFiles = config.getConfig("folders_rootdir_allowed_files", defaultRootDirAllowedFiles);

export class FoldersFiles implements ActionInterface {
    getName(): string { return "Folders and Files"; }
    check(): string {
        var error: string = "";
        const dirActualFiles = readDirSync(".");
        dirActualFiles.forEach(file => {
            if (!(rootDirAllowedFiles.indexOf(file) >= 0)) {
                error += `File "${file}" should not be in root or added to predifined list\n`;
            }
        });
        //name: "Check repository root dir",
        return error;
    }
    fix = null;
    update = null;
}
