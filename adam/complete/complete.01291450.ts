// npx ts-node complete.ts 

import {
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
import * as bluebird from "bluebird";

class Info {
    asset_id: string;
    name: string;
    type: string;
    symbol: string;
    decimals: number;
};

const IndexName = 7;
const IndexSymbol = 8;
const IndexType = 9;
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
            backendInfos.set(assetId, info);
        }
        ++idx;
    });

    console.log(`${backendInfos.size} entries read.`);
}

function getBackendInfo(assetId: string): Info {
    if (!backendInfos.has(assetId)) {
        console.log(`ERROR: info not found for id ${assetId} !`);
        return undefined;
    }
    return backendInfos.get(assetId);
}

async function completeInfo(chain: string, chainNum: number, id: string) {
    console.log(id);
    const infoPath = getChainAssetInfoPath(chain, id);
    //console.log(infoPath);
    if (!isPathExistsSync(infoPath)) {
        console.log(`Info file does not exist, ${infoPath}`);
        return;
    }
    // read info file
    const info = readJsonFile(infoPath) as Info;
    console.log(info.name, info.symbol, info.decimals, infoPath);
    if (!info.symbol || !info.type || !info.decimals) {
        console.log(`Info file is incomplete ${info.name} ${JSON.stringify(info)}`);

        // retrieve info
        const assetId = assetID(chainNum, id);
        //const backendInfo: TokenTwInfo = await tokenInfoFromTwApi(assetId);
        const backendInfo: Info = getBackendInfo(assetId);
        if (!backendInfo) {
            console.log(`ERROR: missing backend info for assetId ${assetId}`);
        } else {
            console.log(`tokeninfo: ${JSON.stringify(backendInfo)}`);

            info.type = backendInfo.type;
            info.symbol = backendInfo.symbol;
            info.decimals = backendInfo.decimals;
            info.name = backendInfo.name;

            // write out
            writeJsonFile(infoPath, info);

            console.log(`Info file completed ${info.name} ${JSON.stringify(info)}`);
        }
    }
}

async function completeInfos(chain: string, chainNum: number) {
    const assetsList = getChainAssetsList(chain);
    console.log(`Found ${assetsList.length} assets for chain ${chain}`);
    await bluebird.each(assetsList, async (address) => {
        try {
            await completeInfo(chain, chainNum, address);
        } catch (err) {
            console.log(`ERROR: ${err}`);
        }
    });
}

async function run(): Promise<void> {
    const fromBackend = readCsv("backend_public_tokens.csv");

    await completeInfos("Smartchain", CoinType.smartchain);
    //await completeInfos("Ethereum", CoinType.ethereum);
}
console.log("Completing script");
run().catch(console.error);
