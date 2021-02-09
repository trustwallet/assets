import {
    allChains,
    getChainAssetsList,
    getChainAssetsPath,
    getChainAssetInfoPath
} from "./repo-structure";
import {
    readFileSync,
    isPathExistsSync
} from "./filesystem";
import { arrayDiff } from "./types";
import { isValidJSON } from "../generic/json";
import { ActionInterface, CheckStepInterface } from "../generic/interface";
import { CoinType } from "@trustwallet/wallet-core";
import * as bluebird from "bluebird";

const requiredKeys = ["name", "type", "symbol", "decimals", "description", "website", "explorer", "status", "id"];

function isAssetInfoHasAllKeys(info: unknown, path: string): [boolean, string] {
    const infoKeys = Object.keys(info);

    const hasAllKeys = requiredKeys.every(k => Object.prototype.hasOwnProperty.call(info, k));

    return [hasAllKeys, `Info at path '${path}' missing next key(s): ${arrayDiff(requiredKeys, infoKeys)}`];
}

function isAssetInfoValid(info: unknown, path: string, address: string, chain: string): [string, string] {
    const isKeys1CorrectType = 
        typeof info['name'] === "string" && info['name'] !== "" &&
        typeof info['type'] === "string" && info['type'] !== "" &&
        typeof info['symbol'] === "string" && info['symbol'] !== "" &&
        typeof info['decimals'] === "number" && //(info['description'] === "-" || info['decimals'] !== 0) &&
        typeof info['status'] === "string" && info['status'] !== ""
        ;
    if (!isKeys1CorrectType) {
        return [`Check keys1 '${info['name']}' '${info['type']}' '${info['symbol']}' '${info['decimals']}' '${info['id']}' ${path}`, ""];
    }

    if (typeof info['type'] !== "string" || chainFromAssetType(info['type']) !== chain ) {
        return [`Incorrect type '${info['type']}' '${chain}' '${path}`, ""];
    }

    if (typeof info['id'] !== "string" || info['id'] !== address ) {
        return [`Incorrect id '${info['id']}' '${path}`, ""];
    }

    const isKeys2CorrectType = 
        typeof info['description'] === "string" && info['description'] !== "" &&
        // website should be set (exception description='-' marks empty infos)
        typeof info['website'] === "string" && (info['description'] === "-" || info['website'] !== "") &&
        typeof info['explorer'] === "string" && info['explorer'] != "";
    if (!isKeys2CorrectType) {
        return [`Check keys2 '${info['description']}' '${info['website']}' '${info['explorer']}' ${path}`, ""];
    }

    if (info['description'].length > 500) {
        const msg = `Description too long, ${info['description'].length}, ${path}`;
        return ["", msg];
    }

    return ["", ""];
}

export function chainFromAssetType(type: string): string {
    switch (type.toUpperCase()) {
        case "ERC20": return "ethereum";
        case "BEP2": return "binance";
        case "BEP20": return "smartchain";
        case "ETC20": return "classic";
        case "TRC10":
        case "TRC20":
            return "tron";
        case "WAN20": return "wanchain";
        case "TRC21": return "tomochain";
        case "TT20": return "thundertoken";
        case "SPL": return "solana";
        case "GO20": return "gochain";
        case "KAVA": return "kava";
        case "NEP5": return "neo";
        case "NRC20": return "nuls";
        case "VET": return "vechain";
        case "ONTOLOGY": return "ontology";
    }
}

export function explorerUrl(chain: string, contract: string): string {
    if (contract) {
        switch (chain.toLowerCase()) {
            case CoinType.name(CoinType.ethereum).toLowerCase():
                return `https://etherscan.io/token/${contract}`;

            case CoinType.name(CoinType.tron).toLowerCase():
                if (contract.startsWith("10")) {
                    // trc10
                    return `https://tronscan.io/#/token/${contract}`;
                }
                // trc20
                return `https://tronscan.io/#/token20/${contract}`;

            case CoinType.name(CoinType.binance).toLowerCase():
                return `https://explorer.binance.org/asset/${contract}`;

            case CoinType.name(CoinType.smartchain).toLowerCase():
            case "smartchain":
                return `https://bscscan.com/token/${contract}`;

            case CoinType.name(CoinType.neo).toLowerCase():
                return `https://neo.tokenview.com/en/token/0x${contract}`;

            case CoinType.name(CoinType.nuls).toLowerCase():
                return `https://nulscan.io/token/info?contractAddress=${contract}`;

            case CoinType.name(CoinType.wanchain).toLowerCase():
                return `https://www.wanscan.org/token/${contract}`;

            case CoinType.name(CoinType.solana).toLowerCase():
                return `https://explorer.solana.com/address/${contract}`;

            case CoinType.name(CoinType.tomochain).toLowerCase():
                return `https://scan.tomochain.com/address/${contract}`;

            case CoinType.name(CoinType.kava).toLowerCase():
                return "https://www.mintscan.io/kava";

            case CoinType.name(CoinType.ontology).toLowerCase():
                return "https://explorer.ont.io";

            case CoinType.name(CoinType.gochain).toLowerCase():
                    return `https://explorer.gochain.io/addr/${contract}`;

            case CoinType.name(CoinType.thundertoken).toLowerCase():
            case "thundertoken":
                    return `https://scan.thundercore.com/`;

            case CoinType.name(CoinType.classic).toLowerCase():
            case "classic":
                            return `https://blockscout.com/etc/mainnet/tokens/${contract}`;
        }
    }
    return "";
}

function explorerUrlAlternatives(chain: string, contract: string, name: string): string[] {
    const altUrls: string[] = [];
    if (name) {
        const nameNorm = name.toLowerCase().replace(' ', '').replace(')', '').replace('(', '');
        if (chain.toLowerCase() == CoinType.name(CoinType.ethereum)) {
            altUrls.push(`https://etherscan.io/token/${nameNorm}`);
        }
        altUrls.push(`https://explorer.${nameNorm}.io`);
        altUrls.push(`https://scan.${nameNorm}.io`);
    }
    return altUrls;
}

function isAssetInfoOK(chain: string, address: string, errors: string[], warnings: string[]): void {
    const assetInfoPath = getChainAssetInfoPath(chain, address);
    if (!isPathExistsSync(assetInfoPath)) {
        // Info file doesn't exist, no need to check
        return;
    }

    if (!isValidJSON(assetInfoPath)) {
        console.log(`JSON at path: '${assetInfoPath}' is invalid`);
        errors.push(`JSON at path: '${assetInfoPath}' is invalid`);
        return;
    }

    const info = JSON.parse(readFileSync(assetInfoPath));
    const [hasAllKeys, msg1] = isAssetInfoHasAllKeys(info, assetInfoPath);
    if (!hasAllKeys) {
        console.log(msg1);
        errors.push(msg1);
    }

    const [err2, warn2] = isAssetInfoValid(info, assetInfoPath, address, chain);
    if (err2) {
        errors.push(err2);
    }
    if (warn2) {
        warnings.push(warn2);
    }

    const hasExplorer = Object.prototype.hasOwnProperty.call(info, 'explorer');
    if (!hasExplorer) {
        errors.push(`Missing explorer key`);
    } else {
        const explorerActual = info['explorer'];
        const explorerActualLower = explorerActual.toLowerCase();
        const explorerExpected = explorerUrl(chain, address);
        if (explorerActualLower != explorerExpected.toLowerCase() && explorerExpected) {
            // doesn't match, check for alternatives
            const explorersAlt = explorerUrlAlternatives(chain, address, info['name']);
            if (explorersAlt && explorersAlt.length > 0) {
                let matchCount = 0;
                explorersAlt.forEach(exp => { if (exp.toLowerCase() == explorerActualLower) { ++matchCount; }});
                if (matchCount == 0) {
                    // none matches, this is warning/error
                    if (chain.toLowerCase() == CoinType.name(CoinType.ethereum) || chain.toLowerCase() == CoinType.name(CoinType.smartchain)) {
                        errors.push(`Incorrect explorer, ${explorerActual} instead of ${explorerExpected} (${explorersAlt.join(', ')})`);
                    } else {
                        warnings.push(`Unexpected explorer, ${explorerActual} instead of ${explorerExpected} (${explorersAlt.join(', ')})`);
                    }
                }
            }
        }
    }
}

export class AssetInfos implements ActionInterface {
    getName(): string { return "Asset Infos"; }
    
    getSanityChecks(): CheckStepInterface[] {
        const steps: CheckStepInterface[] = [];
        allChains.forEach(chain => {
            // only if there is no assets subfolder
            if (isPathExistsSync(getChainAssetsPath(chain))) {
                steps.push(
                    {
                        getName: () => { return `Info.json's for chain ${chain}`;},
                        check: async () => {
                            const errors: string[] = [];
                            const warnings: string[] = [];
                            const assetsList = getChainAssetsList(chain);
                            //console.log(`     Found ${assetsList.length} assets for chain ${chain}`);
                            await bluebird.each(assetsList, async (address) => {
                                isAssetInfoOK(chain, address, errors, warnings);
                            });
                            return [errors, warnings];
                        }    
                    }
                );
            }
        });
        return steps;
    }
}
