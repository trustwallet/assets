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

export class TokenLists implements ActionInterface {
    getName(): string { return "TokenLists"; }

    getSanityChecks = null;

    getConsistencyChecks(): CheckStepInterface[] {
        const steps: CheckStepInterface[] = [];
        return steps;
    }

    async consistencyFix(): Promise<void> {

        // binance chain list
        const list = await generateBinanceTokensList()
        writeFileSync(getChainTokenlistPath(Binance), formatJson(generateTokensList(list)));

        return 
    }
}

function generateTokensList(tokens: any[]): any {
    return {
        name: "Trust Wallet: BNB",
        logoURI: "https://trustwallet.com/assets/images/favicon.png",
        timestamp: "2020-10-03T12:37:57.000+00:00",
        keywords: [],
        tokens: tokens,
        version: {
            major: 0,
            minor: 1,
            patch: 0
        }
    }
}

async function generateBinanceTokensList(): Promise<any[]> {
    const markets = await axios.get(`${config.binanceDexURL}/v1/markets?limit=10000`).then(r => r.data);
    const tokens = await axios.get(`${config.binanceDexURL}/v1/tokens?limit=10000`).then(r => r.data);
    const tokensMap = Object.assign({}, ...tokens.map(s => ({[s.symbol]: s})));
    const pairsMap = {}
    const pairsList = new Set();

    markets.forEach(market => {
        const key = market.quote_asset_symbol

        function pair(market: any): any {
            return {
                base: asset(market.base_asset_symbol),
                lotSize: toSatoshis(market.lot_size, 8),
                tickSize: toSatoshis(market.tick_size, 8)
            }
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

    console.log('pairsMap', pairsMap)

    function logoURI(symbol: string): string {
        if (symbol == 'BNB') {
            return `${config.assetsURL}/blockchains/binance/assets/${symbol}/logo.png`
        }
        return `${config.assetsURL}/blockchains/binance/assets/${symbol}/logo.png`
    }
    function asset(symbol: string): string {
        if (symbol == 'BNB') {
            assetID(CoinType.binance)
        }
        return assetID(CoinType.binance, symbol)
    }
    const list: any[] = Array.from(pairsList.values())
    return list.map(item => {
        const token = tokensMap[item]
        return {
            asset: asset(token.symbol),
            address: token.symbol,
            name: token.name,
            symbol: token.symbol,
            decimals: 8,
            logoURI: logoURI(token.symbol),
            pairs: pairsMap[token.symbol] || []
        }
    }).sort((n1,n2) => (n2.pairs || []).length - (n1.pairs || []).length);
}