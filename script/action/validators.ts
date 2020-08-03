import { stakingChains } from "../common/blockchains";
import {
    getChainValidatorsListPath,
    getChainValidatorAssetLogoPath,
    getChainValidatorsAssets
} from "../common/repo-structure";
import { isPathExistsSync } from "../common/filesystem";
import { formatSortJsonFile, readJsonFile } from "../common/json";
import { ActionInterface, CheckStepInterface } from "./interface";
import { isValidJSON } from "../common/json";
import { ValidatorModel } from "../../src/test/models";
import { isLogoOK } from "../common/image";
import * as bluebird from "bluebird";

function formatValidators() {
    stakingChains.forEach(chain => {    
        const validatorsPath = getChainValidatorsListPath(chain);
        formatSortJsonFile(validatorsPath);
    })
}

function getChainValidatorsList(chain: string): ValidatorModel[] {
    return readJsonFile(getChainValidatorsListPath(chain));
}

function isValidatorHasAllKeys(val: ValidatorModel): boolean {
    return typeof val.id === "string"
        && typeof val.name === "string"
        && typeof val.description === "string"
        && typeof val.website === "string";
}

export class Validators implements ActionInterface {
    getName(): string { return "Validators"; }

    getChecks(): CheckStepInterface[] {
        var steps = [
            {
                getName: () => { return "Make sure tests added for new staking chain"},
                check: async () => {
                    if (stakingChains.length != 7) {
                        return `Wrong number of staking chains ${stakingChains.length}`;
                    }
                    return "";
                }
            },
        ];
        stakingChains.forEach(chain => {
            steps.push(
                {
                    getName: () => { return `Make sure chain ${chain} has valid list file, has logo`},
                    check: async () => {
                        const validatorsListPath = getChainValidatorsListPath(chain);
                        if (!isValidJSON(validatorsListPath)) {
                            return `Not valid Json file at path ${validatorsListPath}`;
                        }

                        var error: string = "";
                        const validatorsList = getChainValidatorsList(chain);
                        const chainValidatorsAssetsList = getChainValidatorsAssets(chain);
                        await bluebird.each(validatorsList, async (val: ValidatorModel) => {
                            if (!isValidatorHasAllKeys(val)) {
                                error += `Some key and/or type missing for validator ${JSON.stringify(val)}\n`;
                            }

                            const id = val.id;
                            const path = getChainValidatorAssetLogoPath(chain, id);
                            if (!isPathExistsSync(path)) {
                                error += `Chain ${chain} asset ${id} logo must be present at path ${path}\n`;
                            }
                            const [isOk, logoMsg] = await isLogoOK(path);
                            if (!isOk) {
                                error += logoMsg + "\n";
                            }
                        
                            // Make sure validator has corresponding logo
                            if (!(chainValidatorsAssetsList.indexOf(id) >= 0)) {
                                error += `Expecting image asset for validator ${id} on chain ${chain}\n`;
                            }
                        });

                        // Make sure validator asset logo has corresponding info
                        chainValidatorsAssetsList.forEach(valAssetLogoID => {
                            if (validatorsList.filter(v => v.id === valAssetLogoID).length != 1) {
                                error += `Expect validator logo ${valAssetLogoID} to have info\n`;
                            }
                        });

                        return error;
                    }
                }
            );
        });
        return steps;
    }

    async fix(): Promise<void> {
        formatValidators();
    }

    update = null;
}
