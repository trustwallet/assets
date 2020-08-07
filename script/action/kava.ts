import { Kava } from "../common/blockchains";
import { getChainValidatorsAssets } from "../common/repo-structure";
import { ActionInterface, CheckStepInterface } from "./interface";
import { isLowerCase } from "../common/types";

export class KavaAction implements ActionInterface {
    getName(): string { return "Kava chain"; }

    getChecks(): CheckStepInterface[] {
        return [
            {
                getName: () => { return "Kava validator assets must have correct format"},
                check: async () => {
                    var error: string = "";
                    const assets = getChainValidatorsAssets(Kava);
                    const prefix = "kavavaloper1";
                    const expLength = 50;
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
