import { chainsWithDenylist } from "../common/blockchains";
import {
    getChainAssetsList,
    getChainAllowlistPath,
    getChainDenylistPath,
    getChainPath
} from "../common/repo-structure";
import { readFileSync, writeFileSync } from "../common/filesystem";
import {
    arrayDiff,
    arrayDiffNocase,
    findCommonElementsOrDuplicates,
    makeUnique
} from "../common/types";
import { ActionInterface, CheckStepInterface } from "./interface";
import { formatSortJson } from "../common/json";
import * as bluebird from "bluebird";
import { copyFile } from "fs";

async function checkUpdateAllowDenyList(chain: string, checkOnly: boolean ): Promise<[boolean, string]> {
    let wrongMsg = "";
    const assets = getChainAssetsList(chain);

    const allowlistPath = getChainAllowlistPath(chain);
    const denylistPath = getChainDenylistPath(chain);

    const currentAllowlistText = readFileSync(allowlistPath);
    const currentDenylistText = readFileSync(denylistPath);
    const currentAllowlist = JSON.parse(currentAllowlistText);
    const currentDenylist = JSON.parse(currentDenylistText);

    const commonElementsOrDuplicates = findCommonElementsOrDuplicates(currentAllowlist, currentDenylist);
    if (commonElementsOrDuplicates && commonElementsOrDuplicates.length > 0) {
        wrongMsg += `Denylist and allowlist for chain ${chain} should have no common elements or duplicates, found ${commonElementsOrDuplicates.length} ${commonElementsOrDuplicates[0]}\n`;
    }
    const allowlistOrphan = arrayDiff(currentAllowlist, assets);
    if (allowlistOrphan && allowlistOrphan.length > 0) {
        wrongMsg += `Allowlist for chain ${chain} contains non-exitent assets, found ${allowlistOrphan.length}, ${allowlistOrphan[0]}\n`;
    }

    const newDeny = makeUnique(currentDenylist.concat(allowlistOrphan));
    const newAllow = makeUnique(arrayDiffNocase(assets, newDeny));
    //console.log(currentAllowlist.length, "vs.", newAllow.length);
    //console.log(currentDenylist.length, "vs.", newDeny.length);

    const wDiff1 = arrayDiffNocase(newAllow, currentAllowlist);
    if (wDiff1.length > 0) {
        wrongMsg += `Some elements are missing from allowlist for chain ${chain}: ${wDiff1.length} ${wDiff1[0]}\n`;
    }
    const wDiff2 = arrayDiffNocase(currentAllowlist, newAllow);
    if (wDiff2.length > 0) {
        wrongMsg += `Some elements should be removed from allowlist for chain ${chain}: ${wDiff2.length} ${wDiff2[0]}\n`;
    }

    const bDiff1 = arrayDiffNocase(newDeny, currentDenylist);
    if (bDiff1.length > 0) {
        wrongMsg += `Some elements are missing from denylist for chain ${chain}: ${bDiff1.length} ${bDiff1[0]}\n`;
    }
    const bDiff2 = arrayDiffNocase(currentDenylist, newDeny);
    if (bDiff2.length > 0) {
        wrongMsg += `Some elements should be removed from denylist for chain ${chain}: ${bDiff2.length} ${bDiff2[0]}\n`;
    }

    // additionally check for nice formatting, sorting:
    const newAllowText = formatSortJson(newAllow);
    const newDenyText = formatSortJson(newDeny);
    if (newAllowText !== currentAllowlistText) {
        wrongMsg += `Allowlist for chain ${chain}: not formatted nicely \n`;
    }
    if (newDenyText !== currentDenylistText) {
        wrongMsg += `Denylist for chain ${chain}: not formatted nicely \n`;
    }

    if (wrongMsg.length > 0) {
        // sg wrong, may need to fix
        if (!checkOnly) {
            // update
            writeFileSync(allowlistPath, newAllowText);
            writeFileSync(denylistPath, newDenyText);
            writeFileSync(allowlistPath.replace("allow", "white"), newAllowText); // interim
            writeFileSync(denylistPath.replace("deny", "black"), newDenyText); // interim
            console.log(`Updated allow and denylists for chain ${chain}`);
        }
    }
    return [(wrongMsg.length == 0), wrongMsg];
}

async function copyAllowListsTemp() {
    // clone allow/denylist.txt to white/blacklist.txt, for backward compatibility
    chainsWithDenylist.forEach(chain => {
        copyFile(`${getChainPath(chain)}/allowlist.json`, `${getChainPath(chain)}/whitelist.json`, (err) => {
            if (err) throw err;
        });
        copyFile(`${getChainPath(chain)}/denylist.json`, `${getChainPath(chain)}/blacklist.json`, (err) => {
            if (err) throw err;
        });
    });
    console.log("allowlist/blakclist files duplicated for backwards compatibility.");
}

export class Allowlist implements ActionInterface {
    getName(): string { return "Allowlists"; }

    getSanityChecks = null;

    getConsistencyChecks(): CheckStepInterface[] {
        const steps: CheckStepInterface[] = [];
        chainsWithDenylist.forEach(chain => {
            steps.push(
                {
                    getName: () => { return `Allowlist and denylist for ${chain} should be consistent with assets`},
                    check: async () => {
                        const [isOK, msg] = await checkUpdateAllowDenyList(chain, true);
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

    async sanityFix(): Promise<void> {
        await copyAllowListsTemp(); 
    }

    async consistencyFix(): Promise<void> {
        await bluebird.each(chainsWithDenylist, async (chain) => await checkUpdateAllowDenyList(chain, false));
    }

    update = null;
}
