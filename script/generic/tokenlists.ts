import { readJsonFile, writeJsonFile } from "../generic/json";
import { diff } from "jsondiffpatch";

class Version {
    major: number
    minor: number
    patch: number

    constructor(major: number, minor: number, patch: number) {
        this.major = major
        this.minor = minor
        this.patch = patch
    }
}

export class List {
    name: string
    logoURI: string
    timestamp: string
    tokens: TokenItem[]
    pairs: Pair[]
    version: Version

    constructor(name: string, logoURI: string, timestamp: string, tokens: TokenItem[], version: Version) {
        this.name = name
        this.logoURI = logoURI
        this.timestamp = timestamp;
        this.tokens = tokens
        this.version = version
    }
}

export class TokenItem {
    asset: string;
    type: string;
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    logoURI: string;
    pairs: Pair[];

    constructor(asset: string, type: string, address: string, name: string, symbol: string, decimals: number, logoURI: string, pairs: Pair[]) {
        this.asset = asset
        this.type = type
        this.address = address
        this.name = name;
        this.symbol = symbol
        this.decimals = decimals
        this.logoURI = logoURI
        this.pairs = pairs
    }
}

export class Pair {
    base: string;
    lotSize?: string;
    tickSize?: string;

    constructor(base: string, lotSize?: string, tickSize?: string) {
        this.base = base
        this.lotSize = lotSize
        this.tickSize = tickSize
    }
}

export function generateTokensList(titleCoin: string, tokens: TokenItem[], time: string, versionMajor: number, versionMinor = 1, versionPatch = 0): List {
    if (!time) {
        time = (new Date()).toISOString();
    }
    const list = new List(
        `Trust Wallet: ${titleCoin}`,
        "https://trustwallet.com/assets/images/favicon.png",
        time,
        tokens,
        new Version(versionMajor, versionMinor, versionPatch)
    );
    sort(list);
    return list;
}

function totalPairs(list: List): number {
    let c = 0;
    list.tokens.forEach(t => c += (t.pairs || []).length);
    return c;
}

export function writeToFile(filename: string, list: List): void {
    writeJsonFile(filename, list);
    console.log(`Tokenlist: list with ${list.tokens.length} tokens and ${totalPairs(list)} pairs written to ${filename}.`);
}

// Write out to file, updating version+timestamp if there was change
export function writeToFileWithUpdate(filename: string, list: List): void {
    let listOld: List = undefined;
    let oldVersion: Version = new Version(0, 0, 0);
    try {
        listOld = readJsonFile(filename) as List;
    } catch (err) {
        listOld = undefined;
    }
    let changed = false;
    if (listOld === undefined) {
        changed = true;
    } else {
        oldVersion = listOld.version;
        const diffs = diffTokenlist(list, listOld);
        if (diffs != undefined) {
            //console.log("List has Changed", JSON.stringify(diffs));
            changed = true;
        }
    }
    if (changed) {
        // update version and time
        list.version.major = oldVersion.major + 1;
        list.version.minor = 0;
        list.version.patch = 0;
        list.timestamp = (new Date()).toISOString();
        console.log(`Version and timestamp updated, ${list.version.major}.${list.version.minor}.${list.version.patch} timestamp ${list.timestamp}`);
    }
    writeToFile(filename, list);
}

function sort(list: List) {
    list.tokens.sort((t1, t2) => {
        const t1pairs = (t1.pairs || []).length;
        const t2pairs = (t2.pairs || []).length;
        if (t1pairs != t2pairs) { return t2pairs - t1pairs; }
        return t1.address.localeCompare(t2.address);
    });
    list.tokens.forEach(t => {
        t.pairs.sort((p1, p2) => p1.base.localeCompare(p2.base));
    });
}

function clearUnimportantFields(list: List) {
    list.timestamp = "";
    list.version = new Version(0, 0, 0);
}

export function diffTokenlist(listOrig1: List, listOrig2: List): unknown {
    // deep copy, to avoid changes
    const list1 = JSON.parse(JSON.stringify(listOrig1));
    const list2 = JSON.parse(JSON.stringify(listOrig2));
    clearUnimportantFields(list1);
    clearUnimportantFields(list2);
    sort(list1);
    sort(list2);
    // compare
    const diffs = diff(list1, list2);
    return diffs;
}
