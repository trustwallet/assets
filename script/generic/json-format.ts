import { chainsPath } from "../generic/repo-structure";
import { findFiles } from "../generic/filesystem";
import { ActionInterface, CheckStepInterface } from "../generic/interface";
import { formatJsonFile, isValidJSON } from "../generic/json";
import * as bluebird from "bluebird";

async function formatInfos(): Promise<void> {
    console.log(`Formatting json files...`);

    const files = [
        ...findFiles(chainsPath, 'json'),
    ];
    let count1 = 0;
    let count2 = 0;
    await bluebird.each(files, async (file) => {
        if (formatJsonFile(file)) {
            ++count2;
        }
        ++count1;
    });
    console.log(`Formatted ${count2} json files (total ${count1})`);
}

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

    async sanityFix(): Promise<void> {
        await formatInfos();
    }
}
