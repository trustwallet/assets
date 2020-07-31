import { chainsWithBlacklist } from "../common/blockchains";
import { getChainAssetsList, getChainWhitelistPath, getChainBlacklistPath } from "../common/repo-structure";
import { readFileSync, writeFileSync } from "../common/filesystem";
import { arrayDiff } from "../common/types";
import { ActionInterface, CheckStepInterface } from "./interface";
import { formatSortJson, formatUniqueSortJson } from "../common/json";
import * as bluebird from "bluebird";

async function checkUpdateWhiteBlackList(chain: string, checkOnly: boolean ): Promise<[boolean, string]> {
    let wrongMsg = "";
    const assets = getChainAssetsList(chain);

    const whitelistPath = getChainWhitelistPath(chain);
    const blacklistPath = getChainBlacklistPath(chain);

    const currentWhitelistText = readFileSync(whitelistPath);
    const currentBlacklistText = readFileSync(blacklistPath);
    const currentWhitelist = JSON.parse(currentWhitelistText);
    const currentBlacklist = JSON.parse(currentBlacklistText);

    const removedAssets = arrayDiff(currentWhitelist, assets);
    if (removedAssets.length > 0) {
        wrongMsg += `Blacklist and whitelist for chain ${chain} should have no common elements or duplicates, found ${removedAssets.length}, ${removedAssets[0]}\n`;
    }

    const niceWhite = formatSortJson(assets);
    if (niceWhite !== currentWhitelistText) {
        wrongMsg += `Whitelist for chain ${chain} has inconsistent content of formatting\n`;
    }
    const newBlackList = currentBlacklist.concat(removedAssets);
    const niceBlack = formatUniqueSortJson(newBlackList);
    if (niceBlack !== currentBlacklistText) {
        wrongMsg += `Blacklist for chain ${chain} has inconsistent content of formatting\n`;
    }

    if (wrongMsg.length > 0) {
        if (!checkOnly) {
            // update
            writeFileSync(whitelistPath, niceWhite);
            writeFileSync(blacklistPath, niceBlack);
            console.log(`Updated white and blacklists for chain ${chain}`);
        }
    }
    return [(wrongMsg.length == 0), wrongMsg];
}

export class Whitelist implements ActionInterface {
    getName(): string { return "Whitelists"; }

    getChecks(): CheckStepInterface[] {
        const steps: CheckStepInterface[] = [];
        chainsWithBlacklist.forEach(chain => {
            steps.push(
                {
                    getName: () => { return `Whitelist and blacklist for ${chain} should be consistent with assets`},
                    check: async () => {
                        const [isOK, msg] = await checkUpdateWhiteBlackList(chain, true);
                        if (!isOK) {
                            return msg;
                        }
                        return "";
                    }
                }
            );
        });
        return steps;
    }


    async fix(): Promise<void> {
        await bluebird.each(chainsWithBlacklist, async (chain) => await checkUpdateWhiteBlackList(chain, false));
    }

    update = null;
}
