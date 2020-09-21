import { chainsPath } from "../common/repo-structure";
import { findFiles } from "../common/filesystem";
import { ActionInterface, CheckStepInterface } from "./interface";
import { isValidJSON } from "../common/json";
import * as bluebird from "bluebird";

export class JsonAction implements ActionInterface {
    getName(): string { return "Json files"; }

    getSanityChecks(): CheckStepInterface[] {
        return [
            {
                getName: () => { return "Check all JSON files to have valid content"},
                check: async () => {
                    const errors: string[] = [];
                    const files = [
                        ...findFiles(chainsPath, 'json'),
                    ];

                    await bluebird.each(files, async file => { 
                        if (!isValidJSON(file)) {
                            errors.push(`${file} path contains invalid JSON`);
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
