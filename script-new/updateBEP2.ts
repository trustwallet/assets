import axios from "axios";
import * as bluebird from "bluebird";
import * as fs from "fs";
import * as path from "path";
import * as chalk from 'chalk';

import {
    getChainAssetLogoPath,
    getChainBlacklistPath
} from "./repo-structure";

const binanceChain = "binance"
const binanceAssetsUrl = "https://explorer.binance.org/api/v1/assets?page=1&rows=1000";

async function retrieveAssetList() {
    console.log(`Retrieving asstest data from: ${binanceAssetsUrl}`);
    const { assetInfoList } = await axios.get(binanceAssetsUrl).then(r => r.data);
    console.log(`Retrieved ${assetInfoList.length} assets`);
    return assetInfoList
}

function fetchImage(url) {
    return axios.get(url, { responseType: "stream" }).then(r => r.data).catch(err => {
        throw `Error fetchImage: ${url} ${err.message}`;
    });
}

export async function update() {
    const blacklist = require(getChainBlacklistPath(binanceChain));
    const assetInfoList = await retrieveAssetList();

    await bluebird.each(assetInfoList, async ({ asset, assetImg }) => {
        process.stdout.write(`.${asset} `);
        if (assetImg) {
            if (blacklist.indexOf(asset) != -1) {
                console.log();
                console.log(`${asset} is blacklisted`);
            } else {
                const imagePath = getChainAssetLogoPath(binanceChain, asset);

                if (!fs.existsSync(imagePath)) {
                    console.log();
                    console.log(chalk.red(`Missing image: ${asset}`));
                    fs.mkdir(path.dirname(imagePath), err => {
                        if (err && err.code != `EEXIST`) throw err;
                    });

                    await fetchImage(assetImg).then(buffer => {
                        buffer.pipe(fs.createWriteStream(imagePath));
                        console.log(`Retrieved image ${imagePath} from ${assetImg}`)
                    });
                }
            }
        }
    });
    console.log();
}
