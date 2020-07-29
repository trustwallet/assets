import { readDirSync } from "../common/filesystem";

const rootDirAllowedFiles = [
    ".github", "blockchains", "dapps", "media", "node_modules", "script-old", "script", "src", ".gitignore", "azure-pipelines.yml", "jest.config.js", "LICENSE", "package-lock.json", "package.json", "README.md", ".git", "pricing", "Dangerfile", "Gemfile", "Gemfile.lock"
];

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
