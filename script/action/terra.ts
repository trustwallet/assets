import { Terra } from "../common/blockchains";
import { getChainValidatorsAssets } from "../common/repo-structure";
import { ActionInterface, CheckStepInterface } from "./interface";
import { isLowerCase } from "../common/types";

export class TerraAction implements ActionInterface {
    getName(): string { return "Terra chain"; }

    getChecks(): CheckStepInterface[] {
        return [
            {
                getName: () => { return "Terra validator assets must have correct format"},
                check: async () => {
                    var error: string = "";
                    const assets = getChainValidatorsAssets(Terra);
                    const prefix = "terravaloper1";
                    const expLength = 51;
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
