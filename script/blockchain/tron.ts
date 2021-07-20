import { ActionInterface, CheckStepInterface } from "../generic/interface";
import { getChainAssetsPath } from "../generic/repo-structure";
import { Tron } from "../generic/blockchains";
import { readDirSync } from "../generic/filesystem";
import { getChainValidatorsAssets } from "../generic/repo-structure";
import { isLowerCase, isUpperCase } from "../generic/types";
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

    getSanityChecks(): CheckStepInterface[] {
        return [
            {
                getName: () => { return "Tron assets should be TRC10 or TRC20, logo of correct size"; },
                check: async () => {
                    const errors: string[] = [];
                    const path = getChainAssetsPath(Tron);
                    const assets = readDirSync(path);
                    await bluebird.each(assets, async (asset) => {
                        if (!isTRC10(asset) && !isTRC20(asset)) {
                            errors.push(`Asset ${asset} at path '${path}' is not TRC10 nor TRC20`);
                        }
                    });
                    return [errors, []];
                }
            },
            {
                getName: () => { return "Tron validator assets must have correct format"},
                check: async () => {
                    const errors: string[] = [];
                    const assets = getChainValidatorsAssets(Tron);
                    assets.forEach(addr => {
                        if (!(isTRC20(addr))) {
                            errors.push(`Address ${addr} should be TRC20 address'`);
                        }
                    });
                    return [errors, []];
                }                
            }
        ];
    }
}
