import {
    readFileSync,
    writeFileSync
} from "./filesystem";
import { sortElements } from "./types";

export function formatJsonFile(filename: string, silent: boolean = false) {
    const jsonContent = JSON.parse(readFileSync(filename));
    writeFileSync(filename, JSON.stringify(jsonContent, null, 4));
    if (!silent) {
        console.log(`Formatted json file ${filename}`);
    }
}

export function formatSortJsonFile(filename: string) {
    const jsonContent = JSON.parse(readFileSync(filename));
    writeFileSync(filename, JSON.stringify(sortElements(jsonContent), null, 4));
    console.log(`Formatted json file ${filename}`);
}

export function writeJsonFile(path: string, data: any) {
    writeFileSync(path, JSON.stringify(data, null, 4));
}
