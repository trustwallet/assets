import { ActionInterface, CheckStepInterface } from "./interface";
import { getChainAssetsPath } from "../common/repo-structure";
import { Tron } from "../common/blockchains";
import { readDirSync, isPathExistsSync } from "../common/filesystem";
import { getChainAssetLogoPath } from "../common/repo-structure";
import { isLowerCase, isUpperCase } from "../common/types";
import { isLogoOK } from "../common/image";
import * as bluebird from "bluebird";

export function isTRC10(str: string): boolean {
    return (/^\d+$/.test(str));
}

export function isTRC20(address: string): boolean {
    return address.length == 34 &&
        address.startsWith("T") &&
        isLowerCase(address) == false &&
        isUpperCase(address) == false;
}

export class TronAction implements ActionInterface {
    getName(): string { return "Tron chain"; }

    getChecks(): CheckStepInterface[] {
        return [
            {
                getName: () => { return "Tron assets should be TRC10 or TRC20, logo of correct size"; },
                check: async () => {
                    var error: string = "";
                    const path = getChainAssetsPath(Tron);
                    const assets = readDirSync(path);
                    await bluebird.each(assets, async (asset) => {
                        if (!isTRC10(asset) && !isTRC20(asset)) {
                            error += `Asset ${asset} at path '${path}' is not TRC10 nor TRC20\n`;
                        }
                        const assetsLogoPath = getChainAssetLogoPath(Tron, asset);
                        if (!isPathExistsSync(assetsLogoPath)) {
                            error += `Missing file at path '${assetsLogoPath}'\n`;
                        }
                        const [isOk, sizeMsg] = await isLogoOK(assetsLogoPath);
                        if (!isOk) {
                            error += sizeMsg + "\n";
                        }
                    });
                    return error;
                }
            },
        ];
    }
    
    fix = null;

    update = null;
}
