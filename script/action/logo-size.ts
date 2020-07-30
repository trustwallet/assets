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
import { resizeIfTooLarge } from "../common/image";
import { ActionInterface } from "./interface";

async function downsize(chains) {
    console.log(`Checking all logos for downsizing ...`);
    let totalCountChecked: number = 0;
    let totalCountUpdated: number = 0;
    await bluebird.map(chains, async chain => {
        let countChecked: number = 0;
        let countUpdated: number = 0;

        const path = getChainLogoPath(chain);
        countChecked++;
        countUpdated += await resizeIfTooLarge(path) ? 1 : 0;
                
        // Check and resize if needed chain assets
        const assetsPath = getChainAssetsPath(chain);
        if (isPathExistsSync(assetsPath)) {
            await bluebird.mapSeries(readDirSync(assetsPath), async asset => {
                const path = getChainAssetLogoPath(chain, asset);
                countChecked++;
                countUpdated += await resizeIfTooLarge(path) ? 1 : 0;
            })
        }

        // Check and resize if needed chain validators image
        const chainValidatorsList = getChainValidatorsListPath(chain);
        if (isPathExistsSync(chainValidatorsList)) {
            const validatorsList = JSON.parse(readFileSync(getChainValidatorsListPath(chain)));
            await bluebird.mapSeries(validatorsList, async ({ id }) => {
                const path = getChainValidatorAssetLogoPath(chain, id);
                countChecked++;
                countUpdated += await resizeIfTooLarge(path) ? 1 : 0;
            })
        }

        totalCountChecked += countChecked;
        totalCountUpdated += countUpdated;
        if (countUpdated > 0) {
            console.log(`Checking logos on chain ${chain} completed, ${countChecked} checked, ${countUpdated} logos updated`);
        }
    });
    console.log(`Checking logos completed, ${totalCountChecked} logos checked, ${totalCountUpdated} logos updated`);
}

export class LogoSize implements ActionInterface {
    getName(): string { return "Logo sizes"; }
    getChecks = null;
    async fix(): Promise<void> {
        const foundChains = readDirSync(chainsPath);
        await downsize(foundChains);
    }
    update = null;
}
