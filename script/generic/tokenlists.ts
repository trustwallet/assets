import { writeJsonFile } from "../generic/json";

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
    return new List(
        `Trust Wallet: ${titleCoin}`,
        "https://trustwallet.com/assets/images/favicon.png",
        time,
        tokens.sort((t1,t2) => {
            const t1pairs = (t1.pairs || []).length;
            const t2pairs = (t2.pairs || []).length;
            if (t1pairs != t2pairs) { return t2pairs - t1pairs; }
            return t1.address.localeCompare(t2.address);
        }),
        new Version(versionMajor, versionMinor, versionPatch)
    )
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

// return number of additions
function addTokenIfNeeded(token: TokenItem, list: List): number {
    if (list.tokens.map(t => t.address.toLowerCase()).includes(token.address.toLowerCase())) {
        return 0;
    }
    list.tokens.push(token);
    return 1;
}

// return number of changes
function addPairToToken(pairToken: TokenItem, token: TokenItem, list: List): number {
    const tokenInList = list.tokens.find(t => t.address === token.address);
    if (!tokenInList) {
        return 0;
    }
    if (!tokenInList.pairs) {
        tokenInList.pairs = [];
    }
    if (tokenInList.pairs.map(p => p.base).includes(pairToken.asset)) {
        return 0;
    }
    tokenInList.pairs.push(new Pair(pairToken.asset));
    return 1;
}

// return the number of additions
export function addPairIfNeeded(token0: TokenItem, token1: TokenItem, list: List): number {
    let changed = 0;
    changed += addTokenIfNeeded(token0, list);
    changed += addTokenIfNeeded(token1, list);
    changed += addPairToToken(token0, token1, list);
    changed += addPairToToken(token1, token0, list);
    return changed;
}
