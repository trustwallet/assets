import axios from "axios";
import * as bluebird from "bluebird";
import * as fs from "fs";
import * as path from "path";
import * as chalk from 'chalk';
import * as config from "../common/config";
import { ActionInterface, CheckStepInterface } from "./interface";
import { getChainAssetsPath } from "../common/repo-structure";
import { Binance } from "../common/blockchains";
import { readDirSync } from "../common/filesystem";

import {
    getChainAssetLogoPath,
    getChainBlacklistPath
} from "../common/repo-structure";

const binanceChain = "binance"
const binanceAssetsUrl = config.getConfig("binance_assets_url", "https://explorer.binance.org/api/v1/assets?page=1&rows=1000");

async function retrieveAssetList(): Promise<any[]>{
    console.log(`Retrieving assets info from: ${binanceAssetsUrl}`);
    const { assetInfoList } = await axios.get(binanceAssetsUrl).then(r => r.data);
    console.log(`Retrieved ${assetInfoList.length} asset infos`);
    return assetInfoList
}

export async function retrieveAssetSymbols(): Promise<string[]> {
    //axios.get(`https://dex-atlantic.binance.org/api/v1/tokens?limit=1000`).then(res => res.data.map(({ symbol }) => symbol))
    const assetInfoList = await retrieveAssetList();
    return assetInfoList.map(({ asset }) => asset);
}

function fetchImage(url) {
    return axios.get(url, { responseType: "stream" })
        .then(r => r.data)
        .catch(err => {
            throw `Error fetchImage: ${url} ${err.message}`;
        });
}

/// Return: array with images to fetch; {asset, assetImg}
export function findImagesToFetch(assetInfoList: any, blacklist: string[]): any[] {
    let toFetch: any[] = [];
    console.log(`Checking for asset images to be fetched`);
    assetInfoList.forEach(({asset, assetImg}) => {
        process.stdout.write(`.${asset} `);
        if (assetImg) {
            if (blacklist.indexOf(asset) != -1) {
                console.log();
                console.log(`${asset} is blacklisted`);
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


async function fetchMissingImages(toFetch: any[]): Promise<string[]> {
    console.log(`Attempting to fetch ${toFetch.length} asset image(s)`);
    let fetchedAssets: string[] = [];
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

    getChecks(): CheckStepInterface[] {
        return [
            {
                getName: () => { return "Binance chain; assets must exist on chain"},
                check: async () => {
                    var error: string = "";
                    const tokenSymbols = await retrieveAssetSymbols();
                    const assets = readDirSync(getChainAssetsPath(Binance));
                    assets.forEach(asset => {
                        if (!(tokenSymbols.indexOf(asset) >= 0)) {
                            error += `Asset ${asset} missing on chain\n`;
                        }
                    });
                    console.log(`     ${assets.length} assets checked.`);
                    return error;
                }
            },
        ];
    }
    
    fix = null;
    
    async update(): Promise<void> {
        const assetInfoList = await retrieveAssetList();
        const blacklist: string[] = require(getChainBlacklistPath(binanceChain));
    
        const toFetch = findImagesToFetch(assetInfoList, blacklist);
        const fetchedAssets = await fetchMissingImages(toFetch);
    
        if (fetchedAssets.length > 0) {
            console.log(`Fetched ${fetchedAssets.length} asset(s):`);
            fetchedAssets.forEach(asset => console.log(`  ${asset}`));
        }
    }
}
