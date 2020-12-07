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

const requiredKeys = ["explorer", "name", "website", "short_description"];

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
        && typeof info['short_description'] === "string";
    
    return [isKeysCorrentType, `Check keys '${requiredKeys}' vs. '${infoKeys}'`];
}

function explorerUrl(chain: string, contract: string): string {
    if (contract) {
        switch (chain.toLowerCase()) {
            case CoinType.name(CoinType.ethereum):
                return `https://etherscan.io/token/${contract}`;

            case CoinType.name(CoinType.tron):
                if (contract.startsWith("10")) {
                    // trc10
                    return `https://tronscan.io/#/token/${contract}`;
                }
                // trc20
                return `https://tronscan.io/#/token20/${contract}`;

            case CoinType.name(CoinType.binance):
                return `https://explorer.binance.org/asset/${contract}`;

            case CoinType.name(CoinType.smartchain):
                return `https://bscscan.com/token/${contract}`;

            case CoinType.name(CoinType.neo):
                return `https://neo.tokenview.com/en/token/0x${contract}`;

            case CoinType.name(CoinType.nuls):
                return `https://nulscan.io/token/info?contractAddress=${contract}`;

            case CoinType.name(CoinType.wanchain):
                return `https://www.wanscan.org/token/${contract}`;

            case CoinType.name(CoinType.solana):
                return `https://explorer.solana.com/address/${contract}`;
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
