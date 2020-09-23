import { Kava } from "../generic/blockchains";
import { getChainValidatorsAssets } from "../generic/repo-structure";
import { ActionInterface, CheckStepInterface } from "../generic/interface";
import { isLowerCase } from "../generic/types";

export class KavaAction implements ActionInterface {
    getName(): string { return "Kava chain"; }

    getSanityChecks(): CheckStepInterface[] {
        return [
            {
                getName: () => { return "Kava validator assets must have correct format"},
                check: async () => {
                    const errors: string[] = [];
                    const assets = getChainValidatorsAssets(Kava);
                    const prefix = "kavavaloper1";
                    const expLength = 50;
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
