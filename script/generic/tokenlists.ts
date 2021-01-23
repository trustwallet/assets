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

class List {
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
    lotSize: string;
    tickSize: string;

    constructor(base: string, lotSize: string, tickSize: string) {
        this.base = base
        this.lotSize = lotSize
        this.tickSize = tickSize
    }
}

export function generateTokensList(titleCoin: string, tokens: TokenItem[]): List {
    return new List(
        `Trust Wallet: ${titleCoin}`,
        "https://trustwallet.com/assets/images/favicon.png",
        "2020-10-03T12:37:57.000+00:00",
        tokens,
        new Version(0, 1, 0)
    )
}
