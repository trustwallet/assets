import {
    allChains,
    getChainAssetsList,
    getChainAssetsPath,
    getChainAssetInfoPath,
    getChainInfoPath,
    getChainCoinInfoPath
} from "./repo-structure";
import { isPathExistsSync } from "./filesystem";
import { arrayDiff } from "./types";
import { isValidJSON, readJsonFile, writeJsonFile } from "../generic/json";
import { ActionInterface, CheckStepInterface } from "../generic/interface";
import { CoinType } from "@trustwallet/wallet-core";
import { isValidStatusValue } from "../generic/status-values";
import { isValidTagValues } from "../generic/tag-values";
import * as bluebird from "bluebird";

const requiredKeysCoin = ["name", "type", "symbol", "decimals", "description", "website", "explorer", "status"];
const requiredKeysToken = [...requiredKeysCoin, "id"];

// Supported keys in links, and their mandatory prefix
const linksKeys = {
    //"explorer": "",
    "github": "https://github.com/",
    "whitepaper": "",
    "twitter": "https://twitter.com/",
    "telegram": "https://t.me/",
    "telegram_news": "https://t.me/", // read-only announcement channel
    "medium": "", // url contains 'medium.com'
    "discord": "https://discord.com/",
    "reddit": "https://reddit.com/",
    "facebook": "https://facebook.com/",
    "youtube": "https://youtube.com/",
    "coinmarketcap": "https://coinmarketcap.com/",
    "coingecko": "https://coingecko.com/",
    "blog": "", // blog, other than medium
    "forum": "", // community site
    "docs": "",
    "source_code": "" // other than github
};
const linksKeysString = Object.keys(linksKeys).reduce(function (agg, item) { return agg + item + ","; }, '');
const linksMediumContains = 'medium.com';

function isAssetInfoHasAllKeys(info: unknown, path: string, isCoin: boolean): [boolean, string] {
    const infoKeys = Object.keys(info);
    const requiredKeys = isCoin ? requiredKeysCoin : requiredKeysToken;

    const hasAllKeys = requiredKeys.every(k => Object.prototype.hasOwnProperty.call(info, k));

    return [hasAllKeys, `Info at path '${path}' missing next key(s): ${arrayDiff(requiredKeys, infoKeys)}`];
}

// return error, warning, and fixed into if applicable
function isAssetInfoValid(info: unknown, path: string, address: string, chain: string, isCoin: boolean, checkOnly: boolean): [string, string, unknown?] {
    let fixedInfo: unknown|null = null;
    const isKeys1CorrectType = 
        typeof info['name'] === "string" && info['name'] !== "" &&
        typeof info['type'] === "string" && info['type'] !== "" &&
        typeof info['symbol'] === "string" && info['symbol'] !== "" &&
        typeof info['decimals'] === "number" && //(info['description'] === "-" || info['decimals'] !== 0) &&
        typeof info['status'] === "string" && info['status'] !== ""
        ;
    if (!isKeys1CorrectType) {
        return [`Field missing or invalid; name '${info['name']}' type '${info['type']}' symbol '${info['symbol']}' decimals '${info['decimals']}' ${path}`, "", fixedInfo];
    }
    if (!isCoin) {
        const isIdKeyCorrectType = typeof info['id'] === "string" && info['id'] !== "";
        if (!isIdKeyCorrectType) {
            return [`Field 'id' missing or invalid, '${info['id']}' ${path}`, "", fixedInfo];
        }
    }

    // type
    if (!isCoin) { // token
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
    } else { // coin
         const expectedType = 'coin';
        if (info['type'] !== expectedType) {
            if (checkOnly) {
                return [`Incorrect value for type '${info['type']}', expected '${expectedType}' '${chain}' ${path}`, "", fixedInfo];
            }
            // fix
            if (!fixedInfo) { fixedInfo = info; }
            fixedInfo['type'] = expectedType;
        }
    }
    
    if (!isCoin) {
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
    }

    // extra checks on decimals
    if (info['decimals'] > 30 || info['decimals'] < 0) {
        return [`Incorrect value for decimals '${info['decimals']}' '${chain}' ${path}`, "", fixedInfo];
    }
    if (info['type'] === 'BEP2' && info['decimals'] != 8) {
        return [`Incorrect value for decimals, BEP2 tokens have 8 decimals. '${info['decimals']}' '${chain}' ${path}`, "", fixedInfo];
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

// return error, warning
function isInfoLinksValid(links: unknown, path: string, address: string, chain: string): [string, string] {
    if (!Array.isArray(links)) {
        return [`Links must be an array '${JSON.stringify(links)}' '${path}' '${address}' '${chain}'`, ""];
    }
    for (let idx = 0; idx < links.length; idx++) {
        const f = links[idx];
        const fname = f['name'];
        if (!fname) {
            return [`Field name missing '${JSON.stringify(f)}'`, ""];
        }
        const furl = f['url'];
        if (!fname) {
            return [`Field url missing '${JSON.stringify(f)}'`, ""];
        }
        // Check there are no other fields
        for (const f2 in f) {
            if (f2 !== 'name' && f2 !== 'url') {
                return [`Invalid field '${f2}' in links '${JSON.stringify(f)}', path ${path}`, ""];
            }
        }
        if (!Object.prototype.hasOwnProperty.call(linksKeys, fname)) {
            return [`Not supported field in links '${fname}'.  Supported keys: ${linksKeysString}`, ""];
        }
        const prefix = linksKeys[fname];
        if (prefix) {
            if (!furl.startsWith(prefix)) {
                return [`Links field '${fname}': '${furl}' must start with '${prefix}'.  Supported keys: ${linksKeysString}`, ""];
            }
        }
        if (!furl.startsWith('https://')) {
            return [`Links field '${fname}': '${furl}' must start with 'https://'.  Supported keys: ${linksKeysString}`, ""];
        }
        // special handling for medium
        if (fname === 'medium') {
            if (!furl.includes(linksMediumContains)) {
                return [`Links field '${fname}': '${furl}' must include '${linksMediumContains}'.  Supported keys: ${linksKeysString}`, ""];
            }
        }
    }
    return ["", ""];
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
        case "WAVES": return "waves";
        case "POA": return "poa";
        case "POLYGON": return "polygon";
        case "OPTIMISM": return "optimism";
        case "AVALANCHE": return "avalanchec";
        case "ARBITRUM": return "arbitrum";
        case "FANTOM": return "fantom";
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

            case CoinType.name(CoinType.waves).toLowerCase():
                return `https://wavesexplorer.com/assets/${contract}`;

            case "xdai":
                return `https://blockscout.com/xdai/mainnet/tokens/${contract}`;

            case CoinType.name(CoinType.poa).toLowerCase():
            case "poa":
                return `https://blockscout.com/poa/core/tokens/${contract}`;

            case CoinType.name(CoinType.polygon).toLowerCase():
            case "polygon":
                return `https://polygonscan.com/token/${contract}`;
            case "optimism":
                return `https://optimistic.etherscan.io/address/${contract}`;
            case "avalanchec":
                return `https://cchain.explorer.avax.network/address/${contract}`
            case "arbitrum":
                return `https://arbiscan.io/token/${contract}`
            case "fantom":
                return `https://ftmscan.com/token/${contract}`
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
function isAssetInfoOK(chain: string, isCoin: boolean, address: string, errors: string[], warnings: string[], checkOnly: boolean): void {
    const assetInfoPath = isCoin ? getChainCoinInfoPath(chain) : getChainAssetInfoPath(chain, address);

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

    const [hasAllKeys, msg1] = isAssetInfoHasAllKeys(info, assetInfoPath, isCoin);
    if (!hasAllKeys) {
        console.log(msg1);
        errors.push(msg1);
    }

    const [err2, warn2, fixedInfo2] = isAssetInfoValid(info, assetInfoPath, address, chain, isCoin, checkOnly);
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

    if (Object.prototype.hasOwnProperty.call(info, 'links') && info['links']) {
        const [err3, warn3] = isInfoLinksValid(info['links'], assetInfoPath, address, chain);
        if (err3) {
            errors.push(err3);
        }
        if (warn3) {
            warnings.push(warn3);
        }
    }
    // Fields moved to links section:
    ['socials', 'source_code', 'whitepaper', 'white_paper'].forEach(f => {
        if (Object.prototype.hasOwnProperty.call(info, f)) {
            errors.push(`Field ${f} is no longer used, use 'links' section instead. (${chain} ${address})`);
        }
    });

    if (!isCoin) {
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
        // tokens info.json's
        allChains.forEach(chain => {
            if (isPathExistsSync(getChainAssetsPath(chain))) {
                steps.push(
                    {
                        getName: () => { return `Token info.json's for chain ${chain}`;},
                        check: async () => {
                            const errors: string[] = [];
                            const warnings: string[] = [];
                            const assetsList = getChainAssetsList(chain);
                            //console.log(`     Found ${assetsList.length} assets for chain ${chain}`);
                            await bluebird.each(assetsList, async (address) => {
                                isAssetInfoOK(chain, false, address, errors, warnings, true);
                            });
                            return [errors, warnings];
                        }    
                    }
                );
            }
        });
        // coin info.json
        steps.push(
            {
                getName: () => { return `Coin info.json's`;},
                check: async () => {
                    const errors: string[] = [];
                    const warnings: string[] = [];
                    allChains.forEach(chain => {
                        if (isPathExistsSync(getChainInfoPath(chain))) {
                            isAssetInfoOK(chain, true, '../info', errors, warnings, true);
                        }
                    });
                    return [errors, warnings];
                }
            }
        );
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
                    isAssetInfoOK(chain, false, address, errors, warnings, false);
                });
            }
            if (isPathExistsSync(getChainInfoPath(chain))) {
                const errors: string[] = [];
                const warnings: string[] = [];
                isAssetInfoOK(chain, true, '[COIN]', errors, warnings, false);
            }
        });
    }
}
