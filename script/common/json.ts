import {
    readFileSync,
    writeFileSync
} from "./filesystem";
import { sortElements, makeUnique } from "./types";

export function isValidJSON(path: string): boolean {
    try {
        let rawdata = readFileSync(path);
        JSON.parse(rawdata);
        return true;
    } catch {
    }
    return false;
}

export function formatJson(content: any) {
    return JSON.stringify(content, null, 4);
}

export function formatSortJson(content: any) {
    return JSON.stringify(sortElements(content), null, 4);
}

export function formatUniqueSortJson(content: any) {
    return JSON.stringify(makeUnique(sortElements(content)), null, 4);
}

export function formatJsonFile(filename: string, silent: boolean = false) {
    writeFileSync(filename, formatJson(JSON.parse(readFileSync(filename))));
    console.log(`Formatted json file ${filename}`);
}

export function formatSortJsonFile(filename: string) {
    writeFileSync(filename, formatSortJson(JSON.parse(readFileSync(filename))));
    console.log(`Formatted json file ${filename}`);
}

export function readJsonFile(path: string): any {
    return JSON.parse(readFileSync(path));
}

export function writeJsonFile(path: string, data: any) {
    writeFileSync(path, JSON.stringify(data, null, 4));
}
