import { chainsWithDenylist } from "./blockchains";
import {
    getChainAssetInfoPath,
    getChainAssetLogoPath,
    //getChainAssetsList,
    getChainAssetsPath,
    getChainAllowlistPath,
    getChainDenylistPath
} from "./repo-structure";
import {
    isPathExistsSync,
    readDirSync,
    readFileSync,
    writeFileSync
} from "./filesystem";
import {
    //arrayDiff,
    arrayDiffNocase,
    findCommonElementsOrDuplicates,
    makeUnique
} from "./types";
import { ActionInterface, CheckStepInterface } from "./interface";
import { formatSortJson } from "./json";
import * as bluebird from "bluebird";

// Find assets for which full info is available -- logo+info -- and is not in the allowlist
async function findFullAssetsWithNoAllow(chain: string, allowlist: string[]): Promise<string[]> {
    const list: string[] = [];
    const assetsPath = getChainAssetsPath(chain);
    if (!isPathExistsSync(assetsPath)) {
        return list;
    }
    await bluebird.mapSeries(readDirSync(assetsPath), async asset => {
        if (allowlist.includes(asset)) {
            // present in allowlist, skip
            return;
        }
        const logoPath = getChainAssetLogoPath(chain, asset);
        if (!isPathExistsSync(logoPath)) {
            return;
        }
        const infoPath = getChainAssetInfoPath(chain, asset);
        if (!isPathExistsSync(infoPath)) {
            return;
        }
        // both files exist, not in allowlist
        list.push(asset);
    });
    return list;
}

async function checkUpdateAllowDenyList(chain: string, checkOnly: boolean ): Promise<[boolean, string[], string[]]> {
    const errorMsgs: string[] = [];
    const warningMsgs: string[] = [];

    const allowlistPath = getChainAllowlistPath(chain);
    const denylistPath = getChainDenylistPath(chain);

    const currentAllowlistText = readFileSync(allowlistPath);
    const currentDenylistText = readFileSync(denylistPath);
    const currentAllowlist = JSON.parse(currentAllowlistText);
    const currentDenylist = JSON.parse(currentDenylistText);

    const commonElementsOrDuplicates = findCommonElementsOrDuplicates(currentAllowlist, currentDenylist);
    if (commonElementsOrDuplicates && commonElementsOrDuplicates.length > 0) {
        errorMsgs.push(`Denylist and allowlist for chain ${chain} should have no common elements or duplicates, found ${commonElementsOrDuplicates.length} ${commonElementsOrDuplicates[0]}`);
    }
    //const assetsWithLogo = getChainAssetsList(chain);
    const assetsWithInfoNotInAllow = await findFullAssetsWithNoAllow(chain, currentAllowlist);
    /*
    const allowlistOrphan = arrayDiff(currentAllowlist, assetsWithLogo);
    if (allowlistOrphan && allowlistOrphan.length > 0) {
        // warning only
        warningMsgs.push(`Allowlist for chain ${chain} contains non-exitent assetsWithLogo, found ${allowlistOrphan.length}, ${allowlistOrphan[0]}`);
    }
    */

    //const newDeny = makeUnique(currentDenylist.concat(allowlistOrphan));
    const tempAssetsOrAllow = makeUnique(currentAllowlist.concat(assetsWithInfoNotInAllow));
    const newAllow = makeUnique(arrayDiffNocase(tempAssetsOrAllow, currentDenylist));
    //console.log(currentAllowlist.length, "vs.", newAllow.length);
    //console.log(currentDenylist.length, "vs.", newDeny.length);

    const wDiff1 = arrayDiffNocase(newAllow, currentAllowlist);
    if (wDiff1.length > 0) {
        // warning only
        warningMsgs.push(`Some elements are missing from allowlist for chain ${chain}: ${wDiff1.length} ${wDiff1[0]}`);
    }
    const wDiff2 = arrayDiffNocase(currentAllowlist, newAllow);
    if (wDiff2.length > 0) {
        // warning only
        warningMsgs.push(`Some elements should be removed from allowlist for chain ${chain}: ${wDiff2.length} ${wDiff2[0]}`);
    }

    /*
    const bDiff1 = arrayDiffNocase(newDeny, currentDenylist);
    if (bDiff1.length > 0) {
        warningMsgs.push(`Some elements are missing from denylist for chain ${chain}: ${bDiff1.length} ${bDiff1[0]}`);
    }
    const bDiff2 = arrayDiffNocase(currentDenylist, newDeny);
    if (bDiff2.length > 0) {
        warningMsgs.push(`Some elements should be removed from denylist for chain ${chain}: ${bDiff2.length} ${bDiff2[0]}`);
    }
    */

    // additionally check for nice formatting, sorting:
    const newAllowText = formatSortJson(newAllow);
    if (newAllowText !== currentAllowlistText) {
        warningMsgs.push(`Allowlist for chain ${chain}: not formatted nicely `);
    }
    const newDenyText = formatSortJson(currentDenylist); // formatSortJson(newDeny);
    if (newDenyText !== currentDenylistText) {
        warningMsgs.push(`Denylist for chain ${chain}: not formatted nicely `);
    }

    if (errorMsgs.length > 0 || warningMsgs.length > 0) {
        // sg wrong, may need to fix
        if (!checkOnly) {
            // update
            writeFileSync(allowlistPath, newAllowText);
            writeFileSync(denylistPath, newDenyText);
            console.log(`Updated allow and denylists for chain ${chain}`);
        }
    }
    return [(errorMsgs.length == 0 && warningMsgs.length == 0), errorMsgs, warningMsgs];
}

export class Allowlists implements ActionInterface {
    getName(): string { return "Allowlists"; }

    getSanityChecks = null;

    getConsistencyChecks(): CheckStepInterface[] {
        const steps: CheckStepInterface[] = [];
        chainsWithDenylist.forEach(chain => {
            steps.push(
                {
                    getName: () => { return `Allowlist and denylist for ${chain} should be consistent with assets`},
                    check: async () => {
                        const [isOK, errorMsgs, warningMsgs] = await checkUpdateAllowDenyList(chain, true);
                        if (!isOK) {
                            return [errorMsgs, warningMsgs];
                        }
                        return [[], []];
                    }
                }
            );
        });
        return steps;
    }

    async consistencyFix(): Promise<void> {
        await bluebird.each(chainsWithDenylist, async (chain) => await checkUpdateAllowDenyList(chain, false));
    }
}
