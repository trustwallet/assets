import { Waves } from "../common/blockchains";
import { getChainValidatorsAssets } from "../common/repo-structure";
import { ActionInterface, CheckStepInterface } from "./interface";
import { isLowerCase, isUpperCase } from "../common/types";

export function isWavesAddress(address: string): boolean {
    return address.length == 35 &&
        address.startsWith("3P") &&
        isLowerCase(address) == false &&
        isUpperCase(address) == false;
}

export class WavesAction implements ActionInterface {
    getName(): string { return "Waves chain"; }

    getSanityChecks(): CheckStepInterface[] {
        return [
            {
                getName: () => { return "Waves validator assets must have correct format"},
                check: async () => {
                    var errors: string[] = [];
                    const assets = getChainValidatorsAssets(Waves);
                    assets.forEach(addr => {
                        if (!(isWavesAddress(addr))) {
                            errors.push(`Address ${addr} should be a Waves address'`);
                        }
                    });
                    return [errors, []];
                }
            },
        ];
    }
    
    getConsistencyChecks = null;

    sanityFix = null;

    consistencyFix = null;
    
    update = null;
}
