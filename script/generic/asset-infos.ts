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

const requiredKeys = ["explorer", "name", "website", "description"];

function isAssetInfoHasAllKeys(info: unknown, path: string): [boolean, string] {
    const infoKeys = Object.keys(info);

    const hasAllKeys = requiredKeys.every(k => Object.prototype.hasOwnProperty.call(info, k));

    if (!hasAllKeys) {
        return [false, `Info at path '${path}' missing next key(s): ${arrayDiff(requiredKeys, infoKeys)}`];
    }

    const isKeysCorrentType = 
        typeof info['explorer'] === "string" && info['explorer'] != ""
        && typeof info['name'] === "string" && info['name'] != ""
        && typeof info['website'] === "string"
        && typeof info['description'] === "string";
    
    return [isKeysCorrentType, `Check keys '${info['name']}' '${info['website']}' '${info['description']}' '${info['explorer']}'`];
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
    const [hasAllKeys, msg] = isAssetInfoHasAllKeys(info, assetInfoPath);
    if (!hasAllKeys) {
        console.log(msg);
        errors.push(msg);
    }

    if (info['description'].length > 500) {
        const msg = `Description too long, ${info['description'].length}, ${assetInfoPath}`;
        console.log(msg);
        warnings.push(msg);
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
