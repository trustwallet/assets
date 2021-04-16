// npx ts-node adam/complete/complete.ts 

import {
    allChains,
    getChainAssetsPath,
    getChainAssetsList,
    getChainAssetInfoPath,
    getChainPath
} from "../../script/generic/repo-structure";
import {
    isPathExistsSync,
    readFileSync
} from "../../script/generic/filesystem";
import {
    assetID
    //tokenInfoFromTwApi,
    //TokenTwInfo
} from "../../script/generic/asset";
import { readJsonFile, writeJsonFile } from "../../script/generic/json";
import { CoinType } from "@trustwallet/wallet-core";
import { explorerUrl } from "../../script/generic/asset-infos";
import * as bluebird from "bluebird";
import axios from "axios";

class Info {
    name: string;
    type: string;
    symbol: string;
    decimals: number;
    description: string;
    website: string;
    explorer: string;
    status: string;
    id: string;
    asset_id: string;
};

const IndexName = 7;
const IndexSymbol = 8;
const IndexType = 9;
const IndexId = 11;
const IndexDecimals = 5;
const IndexAssetId = 14;

const backendInfos: Map<string, Info> = new Map<string, Info>();

function readCsv(file: string) {
    const txt = readFileSync(file);
    const lines = txt.split('\n');
    console.log(`${lines.length} lines, header: ${lines[0]}`);

    console.log(` name       \t ${lines[0].split(',')[IndexName]}`);
    console.log(` symbol     \t ${lines[0].split(',')[IndexSymbol]}`);
    console.log(` type       \t ${lines[0].split(',')[IndexType]}`);
    console.log(` decimals   \t ${lines[0].split(',')[IndexDecimals]}`);
    console.log(` id         \t ${lines[0].split(',')[IndexId]}`);
    console.log(` asset_id   \t ${lines[0].split(',')[IndexAssetId]}`);

    let idx = 0;
    lines.forEach(l => {
        if (idx > 0) {
            const fields = l.split(',');
            const info: Info = new Info();
            const assetId = fields[IndexAssetId];
            info.asset_id = assetId;
            info.name = fields[IndexName];
            info.symbol = fields[IndexSymbol];
            info.type = fields[IndexType];
            info.decimals = parseInt(fields[IndexDecimals]);
            info.id = fields[IndexId];
            backendInfos.set(assetId, info);
        }
        ++idx;
    });

    console.log(`${backendInfos.size} entries read from ${file}.`);
}

function getBackendInfo(assetId: string): Info {
    if (!backendInfos.has(assetId)) {
        console.log(`ERROR: info not found for id ${assetId} !`);
        return undefined;
    }
    return backendInfos.get(assetId);
}

///// Ethexplorer

const ethexplorerApiUrl = "https://api.ethplorer.io"
const ethexplorerApiKey = "EK-4pw9Q-8fLs5oW-1Cb1U"
const ethexplRateLimitWait = 520;  // make calls not more often than each this (msec)
let ethexplNextCallTime = Date.now() + ethexplRateLimitWait;

// wait for some time, before making api calls, in order to rate-limit
async function ethexplRateLimit() {
    while (Date.now() < ethexplNextCallTime) {
        const toSleep = ethexplNextCallTime - Date.now() + 1;
        //console.log("sleeping...", toSleep);
        await new Promise(r => setTimeout(r, toSleep));
        //console.log("...slept");
    }
    ethexplNextCallTime += ethexplRateLimitWait;
}

async function callEthExplApi(url) {
    await ethexplRateLimit();
    let resp = await axios.get(url);
    if (resp.status != 200) {
        console.log("ERROR: Non-OK status", resp.status, resp.statusText, url);
        return {};
    }
    //console.log(url, resp.status);
    const data = resp.data
    //console.log(data);
    return data;
}

async function getTokenInfoEthExpl(token) {
    const url = `${ethexplorerApiUrl}/getTokenInfo/${token}?apiKey=${ethexplorerApiKey}`;
    const data = await callEthExplApi(url);
    return data;
}

/////

async function initializeInfo(backendInfo: Info, chain: string): Promise<Info> {
    const info2: Info = new Info();
    info2.name = backendInfo.name;
    info2.symbol = backendInfo.symbol;
    info2.type = backendInfo.type;
    info2.decimals = backendInfo.decimals;
    info2.description = "-";

    info2.website = "";
    if (chain === "ethereum") {
        const ethplorerInfo = await getTokenInfoEthExpl(backendInfo.id);
        //console.log("ethplorerInfo", ethplorerInfo);
        if (ethplorerInfo && ethplorerInfo.website) {
            info2.website = ethplorerInfo.website;
            console.log(`Ethplorer website:  ${info2.website}`);
        }
    }
    const expl: string = explorerUrl(chain, backendInfo.id);
    info2.explorer = expl;
    info2.status = "active";
    info2.id = backendInfo.id;
    return info2;
}

async function completeInfo(chain: string, chainNum: number, id: string) {
    //console.log(id);

    // retrieve info from backend data
    const assetId = assetID(chainNum, id);
    //const backendInfo: TokenTwInfo = await tokenInfoFromTwApi(assetId);
    const backendInfo: Info = getBackendInfo(assetId);
    if (!backendInfo) {
        console.log(`ERROR: missing backend info for assetId ${assetId} ${JSON.stringify(backendInfo)}`);
        //return;
    }
    //console.log(`tokeninfo: ${JSON.stringify(backendInfo)}`);

    const infoPath = getChainAssetInfoPath(chain, id);
    //console.log(infoPath);
    let info: Info = new Info();
    let updated = false;

    if (!isPathExistsSync(infoPath)) {
        console.log(`WARNING: Info file does not exist, initializing.  ${infoPath}`);
        console.log(`git add ${infoPath}`);
        info = await initializeInfo(backendInfo, chain);
        updated = true;
    } else {
        // read info file
        info = readJsonFile(infoPath) as Info;
        //console.log(info.name, info.symbol, info.decimals, infoPath);

        if (!info.symbol || !info.type || !info.decimals) {
            console.log(`Info file is incomplete ${info.name} ${JSON.stringify(info)}`);

            if (backendInfo && backendInfo.type && backendInfo.symbol && backendInfo.decimals) {
                info.type = backendInfo.type;
                info.symbol = backendInfo.symbol;
                info.decimals = backendInfo.decimals;
                //info.name = backendInfo.name;
                updated = true;
            }
        }
        if (!info.id) {
            if (backendInfo && backendInfo.id) {
                info.id = backendInfo.id;
            } else {
                info.id = id;
            }
            updated = true;
        }
        if (!info.explorer) {
            const expl: string = explorerUrl(chain, info.id);
            info.explorer = expl;
            updated = true;
        }
        if (!info.status) {
            const oldId = info.id;
            delete info.id;
            info.status = "active";
            info.id = oldId;
            updated = true;
        }
    }

    if (updated) {
        // write out
        writeJsonFile(infoPath, info);

        console.log(`Info file completed ${info.name} ${JSON.stringify(info)}`);
    }
}

async function completeTokenInfosChain(chain: string, chainNum: number) {
    if (!isPathExistsSync(getChainAssetsPath(chain))) {
        return;
    }

    console.log(`=====  Chain ${chain}  =====`);
    const assetsList = getChainAssetsList(chain);
    console.log(`Found ${assetsList.length} assets for chain ${chain}`);
    await bluebird.each(assetsList, async (address) => {
        try {
            await completeInfo(chain, chainNum, address);
        } catch (err) {
            console.log(`ERROR: ${err}`);
        }
    });
    console.log(`Processed ${assetsList.length} assets for chain ${chain}`);
}

function isIndex(key):boolean {
    const n = ~~Number(key);
    return String(n) === key && n >= 0;
}

// find number of a chain from its name
function chainNumber(chain: string) {
    const values: number[] = Object.keys(CoinType).filter(key => isIndex(key)).map(index => Number(index));
    const value = values.filter(v => CoinType.name(v).toLowerCase() === chain.toLowerCase());
    if (value.length == 0) {
        console.log(chain);
        switch (chain.toLowerCase()) {
            case "smartchain": return 20000714;
            case "thundertoken": return 1001;
            case "classic": return 61;
            case "waves": return 5741564;
        }
    }
    if (value.length == 0) {
        console.log(`Could not find chain ${chain}`);
        return -1;
    }
    return value[0];
}

async function completeTokenInfos() {
    bluebird.each(allChains, async ch => {
    //allChains.forEach(async ch => {
        const num = chainNumber(ch);
        if (num < 0) {
            console.log(`ERROR processing chain ${ch}, ${num}`);
        } else {
            await completeTokenInfosChain(ch, num);
        }
    });
}

function completeCoinInfo(chain: string) {
    console.log(`Coin info file for ${chain}`);
    const filename = `${getChainPath(chain)}/info/info.json`;
    const info: Info = readJsonFile(filename) as Info;
    //console.log(info.name, info.symbol, info.decimals, filename);
    if (info.name && 
        info.type && info.type === "COIN" &&
        info.symbol &&
        info.decimals && info.decimals != 0) {
        console.log("  all fields already set  ", info.symbol, info.type, info.decimals);
        return;
    }
    const coinNum = chainNumber(chain);
    console.log(`coinNum ${coinNum}`);
    if (coinNum <= 0) {
        console.log(`ERROR: cannot determine coinNum for chain ${chain}`);
    } else {
        const symbol: string = CoinType.symbol(coinNum);
        const decimals: number = CoinType.decimals(coinNum);
        console.log(`symbol ${symbol}  decimals ${decimals}`);
        info.symbol = symbol;
        info.type = "COIN";
        info.decimals = decimals;
        info.status = "active";
        // Note: id is not applicable
    }
    writeJsonFile(filename, info);
}

async function completeCoinInfos() {
    //bluebird.each(allChains, async ch => {
    allChains.forEach(ch => {
        completeCoinInfo(ch);
    });
}

async function run(): Promise<void> {
    readCsv("./backend_public_tokens.csv");

    await completeTokenInfos();
    //await completeCoinInfos();
}
console.log("Completing script");
run().catch(console.error);
