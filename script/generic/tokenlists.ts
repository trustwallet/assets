// Handling of tokenlist.json files, tokens and trading pairs.

import { readJsonFile, writeJsonFile } from "../generic/json";
import { diff } from "jsondiffpatch";
import { tokenInfoFromTwApi, TokenTwInfo } from "../generic/asset";
import {
    getChainAssetLogoPath,
    getChainTokenlistPath,
} from "../generic/repo-structure";
import * as bluebird from "bluebird";
import { isPathExistsSync } from "../generic/filesystem";

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

///// Exclude/Include list token/pair matching

// A token or pair in the force exclude/include list
export class ForceListPair {
    token1: string;
    // second is optional, if empty --> token only, if set --> pair
    token2: string;
}

export function parseForceListEntry(rawForceListEntry: string): ForceListPair {
    const pair: ForceListPair = new ForceListPair();
    const tokens: string[] = rawForceListEntry.split("-");
    pair.token1 = tokens[0];
    pair.token2 = "";
    if (tokens.length >= 2) {
        pair.token2 = tokens[1];
    }
    return pair;
}

export function parseForceList(rawForceList: string[]): ForceListPair[] {
    return rawForceList.map(e => parseForceListEntry(e));
}

export function matchTokenToForceListEntry(token: TokenItem, forceListEntry: string): boolean {
    if (forceListEntry.toLowerCase() === token.symbol.toLowerCase() ||
        forceListEntry.toLowerCase() === token.asset.toLowerCase() ||
        forceListEntry.toLowerCase() === token.name.toLowerCase()) {
        return true;
    }
    return false;
}

export function matchPairToForceListEntry(token1: TokenItem, token2: TokenItem, forceListEntry: ForceListPair): boolean {
    if (!forceListEntry.token2) {
        // entry is token only
        if (matchTokenToForceListEntry(token1, forceListEntry.token1) || 
            (token2 && matchTokenToForceListEntry(token2, forceListEntry.token1))) {
            return true;
        }
        return false;
    }
    // entry is pair
    if (!token2) {
        return false;
    }
    if (matchTokenToForceListEntry(token1, forceListEntry.token1) && matchTokenToForceListEntry(token2, forceListEntry.token2)) {
        return true;
    }
    // reverse
    if (matchTokenToForceListEntry(token1, forceListEntry.token2) && matchTokenToForceListEntry(token2, forceListEntry.token1)) {
        return true;
    }
    return false;
}

export function matchTokenToForceList(token: TokenItem, forceList: ForceListPair[]): boolean {
    let matched = false;
    forceList.forEach(e => {
        if (matchTokenToForceListEntry(token, e.token1)) {
            matched = true;
        }
        if (matchTokenToForceListEntry(token, e.token2)) {
            matched = true;
        }
    });
    return matched;
}

export function matchPairToForceList(token1: TokenItem, token2: TokenItem, forceList: ForceListPair[]): boolean {
    let matched = false;
    forceList.forEach(p => {
        if (matchPairToForceListEntry(token1, token2, p)) {
            matched = true;
        }
    });
    return matched;
}

/////

export function createTokensList(titleCoin: string, tokens: TokenItem[], time: string, versionMajor: number, versionMinor = 1, versionPatch = 0): List {
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
    try {
        listOld = readJsonFile(filename) as List;
    } catch (err) {
        listOld = undefined;
    }
    if (listOld !== undefined) {
        list.version = listOld.version; // take over
        list.timestamp = listOld.timestamp; // take over
        const diffs = diffTokenlist(list, listOld);
        if (diffs != undefined) {
            //console.log("List has Changed", JSON.stringify(diffs));
            list.version = new Version(list.version.major + 1, 0, 0);
            list.timestamp = (new Date()).toISOString();
            console.log(`Version and timestamp updated, ${list.version.major}.${list.version.minor}.${list.version.patch} timestamp ${list.timestamp}`);
        }
    }
    writeToFile(filename, list);
}

async function addTokenIfNeeded(token: TokenItem, list: List): Promise<void> {
    if (list.tokens.map(t => t.address.toLowerCase()).includes(token.address.toLowerCase())) {
        return;
    }
    token = await updateTokenInfo(token);
    list.tokens.push(token);
}

// Update/fix token info, with properties retrieved from TW API
async function updateTokenInfo(token: TokenItem): Promise<TokenItem> {
    const tokenInfo: TokenTwInfo = await tokenInfoFromTwApi(token.asset);
    if (tokenInfo) {
        if (token.name && token.name != tokenInfo.name) {
            console.log(`Token name adjusted: '${token.name}' -> '${tokenInfo.name}'`);
            token.name = tokenInfo.name;
        }
        if (token.symbol && token.symbol != tokenInfo.symbol) {
            console.log(`Token symbol adjusted: '${token.symbol}' -> '${tokenInfo.symbol}'`);
            token.symbol = tokenInfo.symbol;
        }
        if (token.decimals && token.decimals != tokenInfo.decimals) {
            console.log(`Token decimals adjusted: '${token.decimals}' -> '${tokenInfo.decimals}'`);
            token.decimals = parseInt(tokenInfo.decimals.toString());
        }
    }
    return token;
}

function addPairToToken(pairToken: TokenItem, token: TokenItem, list: List): void {
    const tokenInList = list.tokens.find(t => t.address === token.address);
    if (!tokenInList) {
        return;
    }
    if (!tokenInList.pairs) {
        tokenInList.pairs = [];
    }
    if (tokenInList.pairs.map(p => p.base).includes(pairToken.asset)) {
        return;
    }
    tokenInList.pairs.push(new Pair(pairToken.asset));
}

function checkTokenExists(id: string, chainName: string): boolean {
    const logoPath = getChainAssetLogoPath(chainName, id);
    if (!isPathExistsSync(logoPath)) {
        //console.log("logo file missing", logoPath);
        return false;
    }
    return true;
}

export async function addPairIfNeeded(token0: TokenItem, token1: TokenItem, list: List): Promise<void> {
    await addTokenIfNeeded(token0, list);
    await addTokenIfNeeded(token1, list);
    addPairToToken(token1, token0, list);
    // reverse direction not needed addPairToToken(token0, token1, list);
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

function removeAllPairs(list: List) {
    // remove all pairs
    list.pairs = [];
    list.tokens.forEach(t => t.pairs = []);
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

export async function rebuildTokenlist(chainName: string, pairs: [TokenItem, TokenItem][], listName: string, forceExcludeList: string[]): Promise<void> {
    // sanity check, prevent deletion of many pairs
    if (!pairs || pairs.length < 5) {
        console.log(`Warning: Only ${pairs.length} pairs returned, ignoring`);
        return;
    }
    
    const excludeList = parseForceList(forceExcludeList);
    // filter out pairs with missing and excluded tokens
    // prepare phase
    const pairs2: [TokenItem, TokenItem][] = [];
    pairs.forEach(p => {
        if (!checkTokenExists(p[0].address, chainName)) {
            console.log("pair with unsupported 1st coin:", p[0].symbol, "--", p[1].symbol);
            return;
        }
        if (!checkTokenExists(p[1].address, chainName)) {
            console.log("pair with unsupported 2nd coin:", p[0].symbol, "--", p[1].symbol);
            return;
        }
        if (matchPairToForceList(p[0], p[1], excludeList)) {
            console.log("pair excluded due to FORCE EXCLUDE:", p[0].symbol, "--", p[1].symbol);
            return;
        }
        pairs2.push(p);
    });
    const filteredCount: number = pairs.length - pairs2.length;
    console.log(`${filteredCount} unsupported tokens filtered out, ${pairs2.length} pairs`);

    const tokenlistFile = getChainTokenlistPath(chainName);
    const json = readJsonFile(tokenlistFile);
    const list: List = json as List;
    console.log(`Tokenlist original: ${list.tokens.length} tokens`);
    removeAllPairs(list);

    await bluebird.each(pairs2, async (p) => {
        await addPairIfNeeded(p[0], p[1], list);
    });
    console.log(`Tokenlist updated: ${list.tokens.length} tokens`);

    const newList = createTokensList(listName, list.tokens,
        "2021-01-29T01:02:03.000+00:00", // use constant here to prevent changing time every time
        0, 1, 0);
    writeToFileWithUpdate(tokenlistFile, newList);
}
