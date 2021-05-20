import {
    allChains,
    getChainAssetsList,
    getChainAssetsPath,
    getChainAssetInfoPath
} from "./repo-structure";
import { isPathExistsSync } from "./filesystem";
import { arrayDiff } from "./types";
import { isValidJSON, readJsonFile, writeJsonFile } from "../generic/json";
import { ActionInterface, CheckStepInterface } from "../generic/interface";
import { CoinType } from "@trustwallet/wallet-core";
import { isValidStatusValue } from "../generic/status-values";
import { isValidTagValues } from "../generic/tag-values";
import * as bluebird from "bluebird";

const requiredKeys = ["name", "type", "symbol", "decimals", "description", "website", "explorer", "status", "id"];

function isAssetInfoHasAllKeys(info: unknown, path: string): [boolean, string] {
    const infoKeys = Object.keys(info);

    const hasAllKeys = requiredKeys.every(k => Object.prototype.hasOwnProperty.call(info, k));

    return [hasAllKeys, `Info at path '${path}' missing next key(s): ${arrayDiff(requiredKeys, infoKeys)}`];
}

// return error, warning, and fixed into if applicable
function isAssetInfoValid(info: unknown, path: string, address: string, chain: string, checkOnly: boolean): [string, string, unknown?] {
    let fixedInfo: unknown|null = null;
    const isKeys1CorrectType = 
        typeof info['name'] === "string" && info['name'] !== "" &&
        typeof info['type'] === "string" && info['type'] !== "" &&
        typeof info['symbol'] === "string" && info['symbol'] !== "" &&
        typeof info['decimals'] === "number" && //(info['description'] === "-" || info['decimals'] !== 0) &&
        typeof info['status'] === "string" && info['status'] !== "" &&
        typeof info['id'] === "string" && info['id'] !== ""
        ;
    if (!isKeys1CorrectType) {
        return [`Field missing or invalid; name '${info['name']}' type '${info['type']}' symbol '${info['symbol']}' decimals '${info['decimals']}' id '${info['id']}' ${path}`, "", fixedInfo];
    }

    // type
    if (chainFromAssetType(info['type'].toUpperCase()) !== chain ) {
        return [`Incorrect value for type '${info['type']}' '${chain}' ${path}`, "", fixedInfo];
    }
    if (info['type'] !== info['type'].toUpperCase()) {
        // type is correct value, but casing is wrong, fix
        if (checkOnly) {
           return [`Type should be ALLCAPS '${info['type'].toUpperCase()}' instead of '${info['type']}' '${chain}' ${path}`, "", fixedInfo];
        }
        // fix
        if (!fixedInfo) { fixedInfo = info; }
        fixedInfo['type'] = info['type'].toUpperCase();
    }

    // id, should match address
    if (info['id'] != address) {
        if (checkOnly) {
            if (info['id'].toUpperCase() != address.toUpperCase()) {
                return [`Incorrect value for id '${info['id']}' '${chain}' ${path}`, "", fixedInfo];
            }
            // is is correct value, but casing is wrong
            return [`Wrong casing for id '${info['id']}' '${chain}' ${path}`, "", fixedInfo];
        }
        // fix
        if (!fixedInfo) { fixedInfo = info; }
        fixedInfo['id'] = address;
    }

    // status
    if (!isValidStatusValue(info['status'])) {
        return [`Invalid value for status field, '${info['status']}'`, "", fixedInfo];
    }

    // tags
    if (info['tags']) {
        if (!isValidTagValues(info['tags'])) {
            return [`Invalid tags, '${info['tags']}'`, "", fixedInfo];
        }
    }

    const isKeys2CorrectType = 
        typeof info['description'] === "string" && info['description'] !== "" &&
        // website should be set (exception description='-' marks empty infos)
        typeof info['website'] === "string" && (info['description'] === "-" || info['website'] !== "") &&
        typeof info['explorer'] === "string" && info['explorer'] != "";
    if (!isKeys2CorrectType) {
        return [`Check keys2 '${info['description']}' '${info['website']}' '${info['explorer']}' ${path}`, "", fixedInfo];
    }

    if (info['description'].length > 500) {
        const msg = `Description too long, ${info['description'].length}, ${path}`;
        return [msg, "", fixedInfo];
    }

    return ["", "", fixedInfo];
}

export function chainFromAssetType(type: string): string {
    switch (type) {
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
        case "EOS": return "eos";
        case "GO20": return "gochain";
        case "KAVA": return "kava";
        case "NEP5": return "neo";
        case "NRC20": return "nuls";
        case "VET": return "vechain";
        case "ONTOLOGY": return "ontology";
        case "THETA": return "theta";
        case "TOMO": return "tomochain";
        case "XDAI": return "xdai";
        default: return "";
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

            case CoinType.name(CoinType.eos).toLowerCase():
                return `https://bloks.io/account/${contract}`;

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

            case CoinType.name(CoinType.theta).toLowerCase():
                return 'https://explorer.thetatoken.org/';

            case CoinType.name(CoinType.thundertoken).toLowerCase():
            case "thundertoken":
                return `https://viewblock.io/thundercore/address/${contract}`;

            case CoinType.name(CoinType.classic).toLowerCase():
            case "classic":
                return `https://blockscout.com/etc/mainnet/tokens/${contract}`;

            case CoinType.name(CoinType.vechain).toLowerCase():
            case "vechain":
                return `https://explore.vechain.org/accounts/${contract}`;

            case "xdai":
                return `https://blockscout.com/xdai/mainnet/tokens/${contract}`;
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

// Check the an assets's info.json; for errors/warning.  Also does fixes in certain cases
function isAssetInfoOK(chain: string, address: string, errors: string[], warnings: string[], checkOnly: boolean): void {
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

    let info: unknown = readJsonFile(assetInfoPath);
    let fixedInfo: unknown|null = null;

    const [hasAllKeys, msg1] = isAssetInfoHasAllKeys(info, assetInfoPath);
    if (!hasAllKeys) {
        console.log(msg1);
        errors.push(msg1);
    }

    const [err2, warn2, fixedInfo2] = isAssetInfoValid(info, assetInfoPath, address, chain, checkOnly);
    if (err2) {
        errors.push(err2);
    }
    if (warn2) {
        warnings.push(warn2);
    }
    if (fixedInfo2 && !checkOnly) {
        info = fixedInfo2;
        fixedInfo = fixedInfo2;
    }

    const explorerExpected = explorerUrl(chain, address);
    const hasExplorer = Object.prototype.hasOwnProperty.call(info, 'explorer');
    const explorerActual = info['explorer'] || '';
    const explorerActualLower = explorerActual.toLowerCase();
    const explorerExpectedLower = explorerExpected.toLowerCase();
    if (checkOnly) {
        if (!hasExplorer) {
            errors.push(`Missing explorer key`);
        } else {
            if (explorerActualLower !== explorerExpectedLower && explorerExpected) {
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
    } else {
        // fix: simply replace with expected (case-only deviation is accepted)
        if (explorerActualLower !== explorerExpectedLower) {
            if (!fixedInfo) { fixedInfo = info; }
            fixedInfo['explorer'] = explorerExpected;
        }
    }

    if (fixedInfo && !checkOnly) {
        writeJsonFile(assetInfoPath, fixedInfo);
        console.log(`Done fixes to info.json, ${assetInfoPath}`);
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
                                isAssetInfoOK(chain, address, errors, warnings, true);
                            });
                            return [errors, warnings];
                        }    
                    }
                );
            }
        });
        return steps;
    }

    async consistencyFix(): Promise<void> {
        bluebird.each(allChains, async chain => {
            // only if there is no assets subfolder
            if (isPathExistsSync(getChainAssetsPath(chain))) {
                const errors: string[] = [];
                const warnings: string[] = [];
                const assetsList = getChainAssetsList(chain);
                await bluebird.each(assetsList, async (address) => {
                    isAssetInfoOK(chain, address, errors, warnings, false);
                });
            }
        });
    }
}
