import { chainsWithBlacklist } from "../common/blockchains";
import { getChainAssetsList, getChainWhitelistPath, getChainBlacklistPath } from "../common/repo-structure";
import { readFileSync, writeFileSync } from "../common/filesystem";
import {
    arrayDiff,
    findCommonElementOrDuplicate,
    makeUnique
} from "../common/types";
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

    const commonElementsOrDuplicated = findCommonElementOrDuplicate(currentWhitelist, currentBlacklist);
    if (commonElementsOrDuplicated && commonElementsOrDuplicated.length > 0) {
        wrongMsg += `Blacklist and whitelist for chain ${chain} should have no common elements or duplicates, found ${commonElementsOrDuplicated}\n`;
    }
    const whitelistOrphan = arrayDiff(currentWhitelist, assets);
    if (whitelistOrphan && whitelistOrphan.length > 0) {
        wrongMsg += `Whitelist for chain ${chain} contains non-exitent assets, found ${whitelistOrphan.length}, ${whitelistOrphan[0]}\n`;
    }

    const newBlack = makeUnique(currentBlacklist.concat(whitelistOrphan));
    const newWhite = makeUnique(arrayDiff(assets, newBlack));
    //console.log(currentWhitelist.length, "vs.", newWhite.length);
    //console.log(currentBlacklist.length, "vs.", newBlack.length);

    const wDiff1 = arrayDiff(newWhite, currentWhitelist);
    if (wDiff1.length > 0) {
        wrongMsg += `Some elements are missing from whitelist for chain ${chain}: ${wDiff1.length} ${wDiff1[0]}\n`;
    }
    const wDiff2 = arrayDiff(currentWhitelist, newWhite);
    if (wDiff2.length > 0) {
        wrongMsg += `Some elements should be removed from whitelist for chain ${chain}: ${wDiff2.length} ${wDiff2[0]}\n`;
    }

    const bDiff1 = arrayDiff(newBlack, currentBlacklist);
    if (bDiff1.length > 0) {
        wrongMsg += `Some elements are missing from blacklist for chain ${chain}: ${bDiff1.length} ${bDiff1[0]}\n`;
    }
    const bDiff2 = arrayDiff(currentBlacklist, newBlack);
    if (bDiff2.length > 0) {
        wrongMsg += `Some elements should be removed from blacklist for chain ${chain}: ${bDiff2.length} ${bDiff2[0]}\n`;
    }

    if (wrongMsg.length > 0) {
        if (!checkOnly) {
            // update
            writeFileSync(whitelistPath, formatSortJson(newWhite));
            writeFileSync(blacklistPath, formatSortJson(newBlack));
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
