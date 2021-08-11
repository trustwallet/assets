import { ActionInterface, CheckStepInterface } from "./interface";
import axios from "axios";
import {
    getChainTokenlistPath
} from "./repo-structure";
import { Binance } from "./blockchains";
import { writeFileSync } from "./filesystem";
import { formatJson } from "./json";
import { assetID } from "./asset";
import * as config from "../config";
import { CoinType } from "@trustwallet/wallet-core";
import { toSatoshis } from "./numbers";
import { TokenType } from "./tokentype";

class BinanceMarket {
    base_asset_symbol: string
    quote_asset_symbol: string
    lot_size: string
    tick_size: string
}

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
    tokens: [TokenItem]
    pairs: [Pair]
    version: Version

    constructor(name: string, logoURI: string, timestamp: string, tokens: [TokenItem], version: Version) {
        this.name = name
        this.logoURI = logoURI
        this.timestamp = timestamp;
        this.tokens = tokens
        this.version = version
    }
}

class TokenItem {
    asset: string;
    type: string;
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    logoURI: string;
    pairs: [Pair];

    constructor(asset: string, type: string, address: string, name: string, symbol: string, decimals: number, logoURI: string, pairs: [Pair]) {
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

class Pair {
    base: string;
    lotSize: string;
    tickSize: string;

    constructor(base: string, lotSize: string, tickSize: string) {
        this.base = base
        this.lotSize = lotSize
        this.tickSize = tickSize
    }
}

export class TokenLists implements ActionInterface {
    getName(): string { return "TokenLists"; }

    getSanityChecks = null;

    getConsistencyChecks(): CheckStepInterface[] {
        const steps: CheckStepInterface[] = [];
        return steps;
    }

    async update(): Promise<void> {
        // binance chain list
        const list = await generateBinanceTokensList();
        writeFileSync(getChainTokenlistPath(Binance), formatJson(generateTokensList(list)));
    }
}

function generateTokensList(tokens: [TokenItem]): List {
    return new List(
        "Trust Wallet: BNB",
        "https://trustwallet.com/assets/images/favicon.png",
        "2020-10-03T12:37:57.000+00:00",
        tokens,
        new Version(0, 1, 0)
    )
}

async function generateBinanceTokensList(): Promise<[TokenItem]> {
    const decimals = CoinType.decimals(CoinType.binance)
    const BNBSymbol = CoinType.symbol(CoinType.binance)
    const markets: [BinanceMarket] = await axios.get(`${config.binanceDexURL}/v1/markets?limit=10000`).then(r => r.data);
    const tokens = await axios.get(`${config.binanceDexURL}/v1/tokens?limit=10000`).then(r => r.data);
    const tokensMap = Object.assign({}, ...tokens.map(s => ({[s.symbol]: s})));
    const pairsMap = {}
    const pairsList = new Set();

    markets.forEach(market => {
        const key = market.quote_asset_symbol

        function pair(market: BinanceMarket): Pair {
            return new Pair(
                asset(market.base_asset_symbol),
                toSatoshis(market.lot_size, decimals),
                toSatoshis(market.tick_size, decimals)
            )
        }

        if (pairsMap[key]) {
            const newList = pairsMap[key]
            newList.push(pair(market))
            pairsMap[key] = newList
        } else {
            pairsMap[key] = [
                pair(market)
            ]
        }
        pairsList.add(market.base_asset_symbol)
        pairsList.add(market.quote_asset_symbol)
    })

    function logoURI(symbol: string): string {
        if (symbol == BNBSymbol) {
            return `${config.assetsURL}/blockchains/binance/assets/${symbol}/logo.png`
        }
        return `${config.assetsURL}/blockchains/binance/assets/${symbol}/logo.png`
    }
    function asset(symbol: string): string {
        if (symbol == BNBSymbol) {
            return assetID(CoinType.binance)
        }
        return assetID(CoinType.binance, symbol)
    }
    function tokenType(symbol: string): string {
        if (symbol == BNBSymbol) {
            return TokenType.COIN
        }
        return TokenType.BEP2
    }
    const list = <[string]>Array.from(pairsList.values())
    return <[TokenItem]>list.map(item => {
        const token = tokensMap[item]
        return new TokenItem (
            asset(token.symbol),
            tokenType(token.symbol),
            token.symbol,
            token.name,
            token.original_symbol,
            decimals,
            logoURI(token.symbol),
            pairsMap[token.symbol] || []
    )
    }).sort((n1,n2) => (n2.pairs || []).length - (n1.pairs || []).length);
}