import { Cosmos } from "../common/blockchains";
import { getChainValidatorsAssets } from "../common/repo-structure";
import { ActionInterface, CheckStepInterface } from "./interface";
import { isLowerCase } from "../common/types";

export class CosmosAction implements ActionInterface {
    getName(): string { return "Cosmos chain"; }

    getChecks(): CheckStepInterface[] {
        return [
            {
                getName: () => { return "Cosmos validator assets must have correct format"},
                check: async () => {
                    var error: string = "";
                    const assets = getChainValidatorsAssets(Cosmos);
                    const prefix = "cosmosvaloper1";
                    const expLength = 52;
                    assets.forEach(addr => {
                        if (!(addr.startsWith(prefix))) {
                            error += `Address ${addr} should start with '${prefix}'\n`;
                        }
                        if (addr.length != expLength) {
                            error += `Address ${addr} should have length ${expLength}\n`;
                        }
                        if (!isLowerCase(addr)) {
                            error += `Address ${addr} should be in lowercase\n`;
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
