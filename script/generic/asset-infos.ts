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
import * as bluebird from "bluebird";

const requiredKeys = ["explorer", "name", "website", "short_description"];

function isAssetInfoHasAllKeys(path: string): [boolean, string] {
    const info = JSON.parse(readFileSync(path));
    const infoKeys = Object.keys(info);

    const hasAllKeys = requiredKeys.every(k => Object.prototype.hasOwnProperty.call(info, k));

    if (!hasAllKeys) {
        return [false, `Info at path '${path}' missing next key(s): ${arrayDiff(requiredKeys, infoKeys)}`];
    }

    const isKeysCorrentType = 
        typeof info.explorer === "string" && info.explorer != ""
        && typeof info.name === "string" && info.name != ""
        && typeof info.website === "string"
        && typeof info.short_description === "string";
    
    return [isKeysCorrentType, `Check keys '${requiredKeys}' vs. '${infoKeys}'`];
}

function isAssetInfoOK(chain: string, address: string): [boolean, string] {
    const assetInfoPath = getChainAssetInfoPath(chain, address);
    if (!isPathExistsSync(assetInfoPath)) {
        return [true, `Info file doesn't exist, no need to check`]
    }

    if (!isValidJSON(assetInfoPath)) {
        console.log(`JSON at path: '${assetInfoPath}' is invalid`);
        return [false, `JSON at path: '${assetInfoPath}' is invalid`];
    }

    const [hasAllKeys, msg] = isAssetInfoHasAllKeys(assetInfoPath);
    if (!hasAllKeys) {
        console.log(msg);
        return [false, msg];
    }

    return [true, ''];
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
                            const assetsList = getChainAssetsList(chain);
                            //console.log(`     Found ${assetsList.length} assets for chain ${chain}`);
                            await bluebird.each(assetsList, async (address) => {
                                const [isInfoOK, infoMsg] = isAssetInfoOK(chain, address);
                                if (!isInfoOK) {
                                    errors.push(infoMsg);
                                }
                            });
                            return [errors, []];
                        }    
                    }
                );
            }
        });
        return steps;
    }
}
