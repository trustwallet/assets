import axios from "axios";
import * as bluebird from "bluebird";
import * as fs from "fs";
import * as path from "path";
import * as chalk from 'chalk';
import * as config from "../config";
import { ActionInterface, CheckStepInterface } from "../generic/interface";
import { Binance } from "../generic/blockchains";
import { readDirSync } from "../generic/filesystem";
import { readJsonFile, writeJsonFile } from "../generic/json";
import { TokenItem, Pair, createTokensList, writeToFileWithUpdate } from "../generic/tokenlists";
import {
    getChainAssetLogoPath,
    getChainAssetsPath,
    getChainAssetInfoPath,
    getChainTokenlistPath
} from "../generic/repo-structure";
import { CoinType } from "@trustwallet/wallet-core";
import { toSatoshis } from "../generic/numbers";
import { assetIdSymbol, logoURI, tokenType } from "../generic/asset";
import { TokenType } from "../generic/tokentype";
import { explorerUrl } from "../generic/asset-infos";

const binanceChain = "binance";
const binanceUrlTokenAssets = config.binanceUrlTokenAssets;
let cachedAssets = [];

export class BinanceTokenInfo {
    asset: string
    name: string
    assetImg: string
    mappedAsset: string
    decimals: number
}

async function retrieveBep2AssetList(): Promise<BinanceTokenInfo[]> {
    console.log(`Retrieving token asset infos from: ${binanceUrlTokenAssets}`);
    const { assetInfoList } = await axios.get(binanceUrlTokenAssets)
        .then(r => r.data)
        .catch(function (error) {
            console.log(JSON.stringify(error))
        });
    console.log(`Retrieved ${assetInfoList.length} token asset infos`);
    return assetInfoList
}

async function retrieveAssets(): Promise<unknown[]> {
    // cache results because of rate limit, used more than once
    if (cachedAssets.length == 0) {
        console.log(`Retrieving token infos`);
        const bep2assets = await axios.get(`${config.binanceDexURL}/v1/tokens?limit=1000`);
        const bep8assets = await axios.get(`${config.binanceDexURL}/v1/mini/tokens?limit=1000`);
        cachedAssets = bep2assets.data.concat(bep8assets.data);
    }
    console.log(`Using ${cachedAssets.length} assets`);
    return cachedAssets;
}

export async function retrieveAssetSymbols(): Promise<string[]> {
    const assets = await retrieveAssets();
    const symbols = assets.map(({ symbol }) => symbol);
    return symbols;
}

async function fetchImage(url) {
    return axios.get(url, { responseType: "stream" })
        .then(r => r.data)
        .catch(err => {
            throw `Error fetchImage: ${url} ${err.message}`;
        });
}

/// Return: array with images to fetch; {asset, assetImg}
export function findImagesToFetch(assetInfoList: BinanceTokenInfo[]): BinanceTokenInfo[] {
    const toFetch: BinanceTokenInfo[] = [];
    console.log(`Checking for asset images to be fetched`);
    assetInfoList.forEach((tokenInfo) => {
        process.stdout.write(`.${tokenInfo.asset} `);
        // pick assets only if img and decimals is present
        if (tokenInfo.assetImg && tokenInfo.decimals) {
            const imagePath = getChainAssetLogoPath(binanceChain, tokenInfo.asset);
            if (!fs.existsSync(imagePath)) {
                console.log(chalk.red(`Missing image: ${tokenInfo.asset}`));
                toFetch.push(tokenInfo);
            }
        }
    });
    console.log();
    console.log(`${toFetch.length} asset image(s) to be fetched`);
    return toFetch;
}

async function createInfoJson(tokenInfo: BinanceTokenInfo): Promise<void> {
    //console.log(tokenInfo);
    const info = {
        name: tokenInfo.name,
        type: "BEP2",
        symbol: tokenInfo.mappedAsset,
        decimals: tokenInfo.decimals,
        website: '',
        description: '-',
        explorer: explorerUrl(binanceChain, tokenInfo.asset),
        status: 'active',
        id: tokenInfo.asset
    };
    const infoPath = getChainAssetInfoPath(binanceChain, tokenInfo.asset);
    writeJsonFile(infoPath, info);
}

async function fetchMissingImages(toFetch: BinanceTokenInfo[]): Promise<string[]> {
    console.log(`Attempting to fetch ${toFetch.length} asset image(s)`);
    const fetchedAssets: string[] = [];
    await bluebird.each(toFetch, async (tokenInfo) => {
        if (tokenInfo && tokenInfo.asset && tokenInfo.assetImg) {
            const imagePath = getChainAssetLogoPath(binanceChain, tokenInfo.asset);
            fs.mkdir(path.dirname(imagePath), err => {
                if (err && err.code != `EEXIST`) throw err;
            });
            const buffer = await fetchImage(tokenInfo.assetImg);
            await buffer.pipe(fs.createWriteStream(imagePath));
            await createInfoJson(tokenInfo);
            fetchedAssets.push(tokenInfo.asset)
            console.log(`Token ${tokenInfo.asset} ${tokenInfo.mappedAsset}: Fetched image, created info.json (${tokenInfo.assetImg})`)
        }
    });
    console.log();
    return fetchedAssets;
}

export class BinanceAction implements ActionInterface {
    getName(): string { return "Binance chain"; }

    getSanityChecks(): CheckStepInterface[] {
        return [
            {
                getName: () => { return "Binance chain; assets must exist on chain"},
                check: async () => {
                    const errors = [];
                    const tokenSymbols = await retrieveAssetSymbols();
                    const assets = readDirSync(getChainAssetsPath(Binance));
                    assets.forEach(asset => {
                        if (!(tokenSymbols.indexOf(asset) >= 0)) {
                            errors.push(`Asset ${asset} missing on chain`);
                        }
                    });
                    console.log(`     ${assets.length} assets checked.`);
                    return [errors, []];
                }
            },
        ];
    }
    
    async updateAuto(): Promise<void> {
        // retrieve missing token images; BEP2 (bep8 not supported)
        const bep2InfoList = await retrieveBep2AssetList();
        if (bep2InfoList.length < 5) {
            console.log(`ERROR: No Binance token info is returned! ${bep2InfoList.length}`);
            return;
        }
        const toFetch = findImagesToFetch(bep2InfoList);
        const fetchedAssets = await fetchMissingImages(toFetch);

        if (fetchedAssets.length > 0) {
            console.log(`Fetched ${fetchedAssets.length} asset(s):`);
            fetchedAssets.forEach(asset => console.log(`  ${asset}`));
        }

        // binance chain list
        const tokenList = await generateBinanceTokensList();
        if (tokenList.length < 5) {
            console.log(`ERROR: no token pair info available from Binance DEX! ${tokenList.length}`);
            return;
        }
        const list = createTokensList("BNB", tokenList,
            "2020-10-03T12:37:57.000+00:00", // use constants here to prevent changing time every time
            0, 1, 0);
        if (tokenList.length > 0) {
            writeToFileWithUpdate(getChainTokenlistPath(Binance), list);
        }
    }
}

class BinanceMarket {
    base_asset_symbol: string
    quote_asset_symbol: string
    lot_size: string
    tick_size: string
}

async function generateBinanceTokensList(): Promise<TokenItem[]> {
    const decimals = CoinType.decimals(CoinType.binance)
    const BNBSymbol = CoinType.symbol(CoinType.binance)
    const markets: BinanceMarket[] = await axios.get(`${config.binanceDexURL}/v1/markets?limit=10000`)
        .then(r => r.data)
        .catch(function (error) {
            console.log(JSON.stringify(error))
        });
    if (markets.length < 5) {
        console.log(`ERROR: No markets info is returned from Binance DEX! ${markets.length}`);
        return [];
    }
    const tokens = await axios.get(`${config.binanceDexURL}/v1/tokens?limit=10000`)
        .then(r => r.data)
        .catch(function (error) {
            console.log(JSON.stringify(error))
        });
    if (tokens.length < 5) {
        console.log(`ERROR: No tokens info is returned from Binance DEX! ${tokens.length}`);
        return [];
    }
    const tokensMap = Object.assign({}, ...tokens.map(s => ({[s.symbol]: s})));
    const pairsMap = {}
    const pairsList = new Set();

    markets.forEach(market => {
        const key = market.quote_asset_symbol

        function pair(market: BinanceMarket): Pair {
            return new Pair(
                assetIdSymbol(market.base_asset_symbol, BNBSymbol, CoinType.binance),
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

    const list = <string[]>Array.from(pairsList.values())
    return <TokenItem[]>list.map(item => {
        const token = tokensMap[item]
        return new TokenItem (
            assetIdSymbol(token.symbol, BNBSymbol, CoinType.binance),
            tokenType(token.symbol, BNBSymbol, TokenType.BEP2),
            token.symbol,
            token.name,
            token.original_symbol,
            decimals,
            logoURI(token.symbol, 'binance', BNBSymbol),
            pairsMap[token.symbol] || []
    )
    });
}
