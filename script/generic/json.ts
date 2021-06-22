import {
    readFileSync,
    writeFileSync
} from "./filesystem";
import { sortElements } from "./types";

export function isValidJSON(path: string): boolean {
    try {
        const rawdata = readFileSync(path);
        JSON.parse(rawdata);
        return true;
    } catch {
        return false;
    }
}

export function formatJson(content: unknown): string {
    return JSON.stringify(content, null, 4);
}

export function formatSortJson(content: unknown[]): string {
    return JSON.stringify(sortElements(content), null, 4);
}

// Return if updated
export function formatJsonFile(filename: string): boolean {
    const origText: string = readFileSync(filename);
    const newText: string = formatJson(JSON.parse(origText));
    if (newText == origText) {
        return false;
    }
    writeFileSync(filename, newText);
    console.log(`Formatted json file ${filename}`);
    return true;
}

export function formatSortJsonFile(filename: string): void {
    writeFileSync(filename, formatSortJson(JSON.parse(readFileSync(filename))));
    console.log(`Formatted json file ${filename}`);
}

export function readJsonFile(path: string): unknown {
    return JSON.parse(readFileSync(path));
}

export function writeJsonFile(path: string, data: unknown): void {
    writeFileSync(path, JSON.stringify(data, null, 4));
}
