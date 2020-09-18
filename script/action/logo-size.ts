import * as bluebird from "bluebird";
import {
    chainsPath,
    getChainLogoPath,
    getChainAssetsPath,
    getChainAssetLogoPath,
    getChainValidatorsListPath,
    getChainValidatorAssetLogoPath
} from "../common/repo-structure";
import {
    readDirSync,
    readFileSync,
    isPathExistsSync
} from "../common/filesystem";
import { checkResizeIfTooLarge } from "../common/image";
import { ActionInterface, CheckStepInterface } from "./interface";

// return name of large logo, or empty
async function checkDownsize(chains, checkOnly: boolean): Promise<string[]> {
    console.log(`Checking all logos for size ...`);
    let totalCountChecked: number = 0;
    let totalCountTooLarge: number = 0;
    let totalCountUpdated: number = 0;
    let largePaths: string[] = [];
    await bluebird.map(chains, async chain => {
        let countChecked: number = 0;
        let countTooLarge: number = 0;
        let countUpdated: number = 0;

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
                countChecked++;
                const [tooLarge, updated] = await checkResizeIfTooLarge(path, checkOnly);
                if (tooLarge) { largePaths.push(path); }
                countTooLarge += tooLarge ? 1 : 0;
                countUpdated += updated ? 1 : 0;
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
            })
        }

        totalCountChecked += countChecked;
        totalCountTooLarge += countTooLarge;
        totalCountUpdated += countUpdated;
        if (countTooLarge > 0 || countUpdated > 0) {
            console.log(`Checking logos on chain ${chain} completed, ${countChecked} checked, ${countTooLarge} too large, ${largePaths}, ${countUpdated} logos updated`);
        }
    });
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
                    const foundChains = readDirSync(chainsPath);
                    const largePaths = await checkDownsize(foundChains, true);
                    const errors: string[] = largePaths.map(p => `Logo too large: ${p}`);
                    return [errors, []];
                }
            },
        ];
    }

    getConsistencyChecks = null;

    async sanityFix(): Promise<void> {
        const foundChains = readDirSync(chainsPath);
        await checkDownsize(foundChains, false);
    }

    consistencyFix = null;

    update = null;
}
