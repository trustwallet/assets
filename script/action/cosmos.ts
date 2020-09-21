import { Cosmos } from "../common/blockchains";
import { getChainValidatorsAssets } from "../common/repo-structure";
import { ActionInterface, CheckStepInterface } from "./interface";
import { isLowerCase } from "../common/types";

export class CosmosAction implements ActionInterface {
    getName(): string { return "Cosmos chain"; }

    getSanityChecks(): CheckStepInterface[] {
        return [
            {
                getName: () => { return "Cosmos validator assets must have correct format"},
                check: async () => {
                    const errors: string[] = [];
                    const assets = getChainValidatorsAssets(Cosmos);
                    const prefix = "cosmosvaloper1";
                    const expLength = 52;
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
