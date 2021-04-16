// npx ts-node complete.ts 

import {
    allChains,
    getChainAssetsPath,
    getChainAssetsList,
    getChainAssetInfoPath
} from "./script/generic/repo-structure";
import {
    isPathExistsSync,
    readFileSync
} from "./script/generic/filesystem";
import {
    assetID
    //tokenInfoFromTwApi,
    //TokenTwInfo
} from "./script/generic/asset";
import { readJsonFile, writeJsonFile } from "./script/generic/json";
import { CoinType } from "@trustwallet/wallet-core";
import { explorerUrl } from "./script/generic/asset-infos";

import * as bluebird from "bluebird";

class Info {
    asset_id: string;
    id: string;
    name: string;
    website: string;
    short_description: string;
    explorer: string;
    type: string;
    symbol: string;
    decimals: number;
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

function initializeInfo(backendInfo: Info, chain: string): Info {
    const info2: Info = new Info();
    info2.name = backendInfo.name;
    info2.website = "https://missing";
    info2.short_description = "?";
    const expl: string = explorerUrl(chain, backendInfo.id);
    info2.explorer = expl;
    info2.type = backendInfo.type;
    info2.symbol = backendInfo.symbol;
    info2.decimals = backendInfo.decimals;
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
        return;
    }
    //console.log(`tokeninfo: ${JSON.stringify(backendInfo)}`);

    const infoPath = getChainAssetInfoPath(chain, id);
    //console.log(infoPath);
    let info: Info = new Info();
    let updated = false;

    if (!isPathExistsSync(infoPath)) {
        console.log(`WARNING: Info file does not exist, initializing.  ${infoPath}`);
        console.log(`git add ${infoPath}`);
        info = initializeInfo(backendInfo, chain);
        updated = true;
    } else {
        // read info file
        info = readJsonFile(infoPath) as Info;
        //console.log(info.name, info.symbol, info.decimals, infoPath);

        if (!info.symbol || !info.type || !info.decimals || info.short_description === '?') {
            console.log(`Info file is incomplete ${info.name} ${JSON.stringify(info)}`);

            info.type = backendInfo.type;
            info.symbol = backendInfo.symbol;
            info.decimals = backendInfo.decimals;
            //info.name = backendInfo.name;
            updated = true;
        }
    }

    if (updated) {
        // write out
        writeJsonFile(infoPath, info);

        console.log(`Info file completed ${info.name} ${JSON.stringify(info)}`);
    }
}

async function completeInfosChain(chain: string, chainNum: number) {
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
        return -1;
    }
    return value[0];
}

async function completeInfos() {
    bluebird.each(allChains, async ch => {
    //allChains.forEach(async ch => {
        const num = chainNumber(ch);
        if (num < 0) {
            console.log(`ERROR processing chain ${ch}, ${num}`);
        } else {
            await completeInfosChain(ch, num);
        }
    });
}

async function run(): Promise<void> {
    readCsv("backend_public_tokens.csv");

    //await completeInfosChain("Smartchain", CoinType.smartchain);
    //await completeInfos("Ethereum", CoinType.ethereum);
    await completeInfos();

}
console.log("Completing script");
run().catch(console.error);
