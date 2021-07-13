import * as bluebird from "bluebird";
import {
    allChains,
    getChainLogoPath,
    getChainAssetsPath,
    getChainAssetLogoPath,
    getChainValidatorsListPath,
    getChainValidatorAssetLogoPath,
    dappsPath
} from "../generic/repo-structure";
import {
    readDirSync,
    readFileSync,
    isPathExistsSync
} from "../generic/filesystem";
import { checkResizeIfTooLarge } from "../generic/image";
import { ActionInterface, CheckStepInterface } from "../generic/interface";

// return name of large logo, or empty
async function checkDownsize(chains: string[], checkOnly: boolean): Promise<string[]> {
    console.log(`Checking all logos for size ...`);
    let totalCountChecked = 0;
    let totalCountTooLarge = 0;
    let totalCountUpdated = 0;
    const largePaths: string[] = [];

    // Check asset logos, under given chains
    await bluebird.map(chains, async chain => {
        let countChecked = 0;
        let countTooLarge = 0;
        let countUpdated = 0;

        const path = getChainLogoPath(chain);
        countChecked++;
        const [tooLarge, updated] = await checkResizeIfTooLarge(path, checkOnly);
        if (tooLarge) { largePaths.push(path); }
        countTooLarge += tooLarge ? 1 : 0;
        countUpdated += updated ? 1 : 0;
                
        // Check and resize if needed chain assets
        const assetsPath = getChainAssetsPath(chain);
        if (isPathExistsSync(assetsPath)) {
            await bluebird.mapSeries(readDirSync(assetsPath), async asset => {
                const path = getChainAssetLogoPath(chain, asset);
                if (isPathExistsSync(path)) {
                    countChecked++;
                    const [tooLarge, updated] = await checkResizeIfTooLarge(path, checkOnly);
                    if (tooLarge) { largePaths.push(path); }
                    countTooLarge += tooLarge ? 1 : 0;
                    countUpdated += updated ? 1 : 0;
                }
            })
        }

        // Check and resize if needed chain validators image
        const chainValidatorsList = getChainValidatorsListPath(chain);
        if (isPathExistsSync(chainValidatorsList)) {
            const validatorsList = JSON.parse(readFileSync(getChainValidatorsListPath(chain)));
            await bluebird.mapSeries(validatorsList, async ({ id }) => {
                const path = getChainValidatorAssetLogoPath(chain, id);
                countChecked++;
                const [tooLarge, updated] = await checkResizeIfTooLarge(path, checkOnly);
                if (tooLarge) { largePaths.push(path); }
                countTooLarge += tooLarge ? 1 : 0;
                countUpdated += updated ? 1 : 0;
            });
        }

        totalCountChecked += countChecked;
        totalCountTooLarge += countTooLarge;
        totalCountUpdated += countUpdated;
        if (countTooLarge > 0 || countUpdated > 0) {
            console.log(`Checking logos on chain ${chain} completed, ${countChecked} checked, ${countTooLarge} too large, ${largePaths}, ${countUpdated} logos updated`);
        }
    });

    // Check dapps logos
    if (isPathExistsSync(dappsPath)) {
        let countChecked = 0;
        let countTooLarge = 0;
        let countUpdated = 0;

        await bluebird.mapSeries(readDirSync(dappsPath), async filename => {
            const path = dappsPath + `/` + filename;
            countChecked++;
            const [tooLarge, updated] = await checkResizeIfTooLarge(path, checkOnly);
            if (tooLarge) { largePaths.push(path); }
            countTooLarge += tooLarge ? 1 : 0;
            countUpdated += updated ? 1 : 0;
        });

        totalCountChecked += countChecked;
        totalCountTooLarge += countTooLarge;
        totalCountUpdated += countUpdated;
        if (countTooLarge > 0 || countUpdated > 0) {
            console.log(`Checking dapps logos completed, ${countChecked} checked, ${countTooLarge} too large, ${largePaths}, ${countUpdated} logos updated`);
        }
    }

    console.log(`Checking logos completed, ${totalCountChecked} logos checked, ${totalCountTooLarge} too large, ${totalCountUpdated} logos updated`);
    return largePaths;
}

export class LogoSize implements ActionInterface {
    getName(): string { return "Logo sizes"; }

    getSanityChecks(): CheckStepInterface[] {
        return [
            {
                getName: () => { return "Check that logos are not too large"},
                check: async () => {
                    const largePaths = await checkDownsize(allChains, true);
                    const errors: string[] = largePaths.map(p => `Logo too large: ${p}`);
                    return [errors, []];
                }
            },
        ];
    }

    async sanityFix(): Promise<void> {
        await checkDownsize(allChains, false);
    }
}
