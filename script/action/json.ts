import { chainsPath, pricingFolderPath } from "../common/repo-structure";
import { findFiles } from "../common/filesystem";
import { ActionInterface, CheckStepInterface } from "./interface";
import { isValidJSON } from "../common/json";
import * as bluebird from "bluebird";

export class JsonAction implements ActionInterface {
    getName(): string { return "Json files"; }

    getChecks(): CheckStepInterface[] {
        return [
            {
                getName: () => { return "Check all JSON files to have valid content"},
                check: async () => {
                    var error: string = "";
                    const files = [
                        ...findFiles(chainsPath, 'json'),
                        ...findFiles(pricingFolderPath, 'json')
                    ];

                    await bluebird.each(files, async file => { 
                        if (!isValidJSON(file)) {
                            error += `${file} path contains invalid JSON\n`;
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
