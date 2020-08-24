import { chainsWithDenylist } from "../common/blockchains";
import {
    getChainAssetsList,
    getChainAllowlistPath,
    getChainDenylistPath
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

async function checkUpdateAllowDenyList(chain: string, checkOnly: boolean ): Promise<[boolean, string, string]> {
    let errorMsg = "";
    let warningMsg = "";
    const assets = getChainAssetsList(chain);

    const allowlistPath = getChainAllowlistPath(chain);
    const denylistPath = getChainDenylistPath(chain);

    const currentAllowlistText = readFileSync(allowlistPath);
    const currentDenylistText = readFileSync(denylistPath);
    const currentAllowlist = JSON.parse(currentAllowlistText);
    const currentDenylist = JSON.parse(currentDenylistText);

    const commonElementsOrDuplicates = findCommonElementsOrDuplicates(currentAllowlist, currentDenylist);
    if (commonElementsOrDuplicates && commonElementsOrDuplicates.length > 0) {
        errorMsg += `Denylist and allowlist for chain ${chain} should have no common elements or duplicates, found ${commonElementsOrDuplicates.length} ${commonElementsOrDuplicates[0]}\n`;
    }
    const allowlistOrphan = arrayDiff(currentAllowlist, assets);
    if (allowlistOrphan && allowlistOrphan.length > 0) {
        errorMsg += `Allowlist for chain ${chain} contains non-exitent assets, found ${allowlistOrphan.length}, ${allowlistOrphan[0]}\n`;
    }

    const newDeny = makeUnique(currentDenylist.concat(allowlistOrphan));
    const newAllow = makeUnique(arrayDiffNocase(assets, newDeny));
    //console.log(currentAllowlist.length, "vs.", newAllow.length);
    //console.log(currentDenylist.length, "vs.", newDeny.length);

    const wDiff1 = arrayDiffNocase(newAllow, currentAllowlist);
    if (wDiff1.length > 0) {
        errorMsg += `Some elements are missing from allowlist for chain ${chain}: ${wDiff1.length} ${wDiff1[0]}\n`;
    }
    const wDiff2 = arrayDiffNocase(currentAllowlist, newAllow);
    if (wDiff2.length > 0) {
        errorMsg += `Some elements should be removed from allowlist for chain ${chain}: ${wDiff2.length} ${wDiff2[0]}\n`;
    }

    const bDiff1 = arrayDiffNocase(newDeny, currentDenylist);
    if (bDiff1.length > 0) {
        errorMsg += `Some elements are missing from denylist for chain ${chain}: ${bDiff1.length} ${bDiff1[0]}\n`;
    }
    const bDiff2 = arrayDiffNocase(currentDenylist, newDeny);
    if (bDiff2.length > 0) {
        errorMsg += `Some elements should be removed from denylist for chain ${chain}: ${bDiff2.length} ${bDiff2[0]}\n`;
    }

    // additionally check for nice formatting, sorting:
    const newAllowText = formatSortJson(newAllow);
    const newDenyText = formatSortJson(newDeny);
    if (newAllowText !== currentAllowlistText) {
        errorMsg += `Allowlist for chain ${chain}: not formatted nicely \n`;
    }
    if (newDenyText !== currentDenylistText) {
        errorMsg += `Denylist for chain ${chain}: not formatted nicely \n`;
    }

    if (errorMsg.length > 0 || warningMsg.length > 0) {
        // sg wrong, may need to fix
        if (!checkOnly) {
            // update
            writeFileSync(allowlistPath, newAllowText);
            writeFileSync(denylistPath, newDenyText);
            console.log(`Updated allow and denylists for chain ${chain}`);
        }
    }
    return [(errorMsg.length == 0 && warningMsg.length == 0), errorMsg, warningMsg];
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
                        const [isOK, errorMsg, warningMsg] = await checkUpdateAllowDenyList(chain, true);
                        if (!isOK) {
                            return [errorMsg, warningMsg];
                        }
                        return ["", ""];
                    }
                }
            );
        });
        return steps;
    }

    sanityFix = null;

    async consistencyFix(): Promise<void> {
        await bluebird.each(chainsWithDenylist, async (chain) => await checkUpdateAllowDenyList(chain, false));
    }

    update = null;
}
