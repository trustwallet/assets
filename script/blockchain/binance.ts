import axios from "axios";
import * as bluebird from "bluebird";
import * as fs from "fs";
import * as path from "path";
import * as chalk from 'chalk';
import * as config from "../config";
import { ActionInterface, CheckStepInterface } from "../generic/interface";
import { getChainAssetsPath } from "../generic/repo-structure";
import { Binance } from "../generic/blockchains";
import { readDirSync } from "../generic/filesystem";
import { readJsonFile } from "../generic/json";

import {
    getChainAssetLogoPath,
    getChainDenylistPath
} from "../generic/repo-structure";

const binanceChain = "binance";
const binanceUrlTokenAssets = config.binanceUrlTokenAssets;
let cachedAssets = [];

async function retrieveBep2AssetList(): Promise<unknown[]> {
    console.log(`Retrieving token asset infos from: ${binanceUrlTokenAssets}`);
    const { assetInfoList } = await axios.get(binanceUrlTokenAssets).then(r => r.data);
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

function fetchImage(url) {
    return axios.get(url, { responseType: "stream" })
        .then(r => r.data)
        .catch(err => {
            throw `Error fetchImage: ${url} ${err.message}`;
        });
}

/// Return: array with images to fetch; {asset, assetImg}
export function findImagesToFetch(assetInfoList: unknown[], denylist: string[]): unknown[] {
    const toFetch: unknown[] = [];
    console.log(`Checking for asset images to be fetched`);
    assetInfoList.forEach(({asset, assetImg}) => {
        process.stdout.write(`.${asset} `);
        if (assetImg) {
            if (denylist.indexOf(asset) != -1) {
                console.log();
                console.log(`${asset} is denylisted`);
            } else {
                const imagePath = getChainAssetLogoPath(binanceChain, asset);
                if (!fs.existsSync(imagePath)) {
                    console.log(chalk.red(`Missing image: ${asset}`));
                    toFetch.push({asset, assetImg});
                }
            }
        }
    });
    console.log();
    console.log(`${toFetch.length} asset image(s) to be fetched`);
    return toFetch;
}


async function fetchMissingImages(toFetch: unknown[]): Promise<string[]> {
    console.log(`Attempting to fetch ${toFetch.length} asset image(s)`);
    const fetchedAssets: string[] = [];
    await bluebird.each(toFetch, async ({ asset, assetImg }) => {
        if (assetImg) {
            const imagePath = getChainAssetLogoPath(binanceChain, asset);
            fs.mkdir(path.dirname(imagePath), err => {
                if (err && err.code != `EEXIST`) throw err;
            });
            await fetchImage(assetImg).then(buffer => {
                buffer.pipe(fs.createWriteStream(imagePath));
                fetchedAssets.push(asset)
                console.log(`Fetched image ${asset} ${imagePath} from ${assetImg}`)
            });
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
    
    async update(): Promise<void> {
        // retrieve missing token images; BEP2 (bep8 not supported)
        const bep2InfoList = await retrieveBep2AssetList();
        const denylist: string[] = readJsonFile(getChainDenylistPath(binanceChain)) as string[];

        const toFetch = findImagesToFetch(bep2InfoList, denylist);
        const fetchedAssets = await fetchMissingImages(toFetch);

        if (fetchedAssets.length > 0) {
            console.log(`Fetched ${fetchedAssets.length} asset(s):`);
            fetchedAssets.forEach(asset => console.log(`  ${asset}`));
        }
    }
}
