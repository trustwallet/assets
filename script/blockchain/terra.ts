import { Terra } from "../generic/blockchains";
import { getChainValidatorsAssets } from "../generic/repo-structure";
import { ActionInterface, CheckStepInterface } from "../generic/interface";
import { isLowerCase } from "../generic/types";

export class TerraAction implements ActionInterface {
    getName(): string { return "Terra chain"; }

    getSanityChecks(): CheckStepInterface[] {
        return [
            {
                getName: () => { return "Terra validator assets must have correct format"},
                check: async () => {
                    const errors: string[] = [];
                    const assets = getChainValidatorsAssets(Terra);
                    const prefix = "terravaloper1";
                    const expLength = 51;
                    assets.forEach(addr => {
                        if (!(addr.startsWith(prefix))) {
                            errors.push(`Address ${addr} should start with '${prefix}'`);
                        }
                        if (addr.length != expLength) {
                            errors.push(`Address ${addr} should have length ${expLength}`);
                        }
                        if (!isLowerCase(addr)) {
                            errors.push(`Address ${addr} should be in lowercase`);
                        }
                    });
                    return [errors, []];
                }
            },
        ];
    }
}
