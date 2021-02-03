import * as eztz from "eztz-lib";
import {
    validatorsList,
    getChainValidatorsPath,
    getChainValidatorsAssets
} from "../generic/repo-structure";
import { Tezos } from "../generic/blockchains";
import { readFileSync } from "../generic/filesystem";
import { ActionInterface, CheckStepInterface } from "../generic/interface";
import { ValidatorModel } from "../generic/validator-models";

interface BakingBadBaker {
    address: string,
    freeSpace: number
    // serviceHealth: string // active or Dead is a working baker who was a public baker but for some reason stopped paying his delegators, Closed is a permanently closed service (we store them for historical purposes only
    fee: number
    minDelegation: number
    openForDelegation: boolean
    payoutDelay: number
    payoutPeriod: number
    serviceHealth: string
}

function getChainValidatorsList(chain: string): ValidatorModel[] {
    return JSON.parse(readFileSync(`${(getChainValidatorsPath(chain))}/${validatorsList}`));
}

export class TezosAction implements ActionInterface {
    getName(): string { return "Tezos"; }

    getSanityChecks(): CheckStepInterface[] {
        return [
            {
                getName: () => { return "Tezos validator assets must have correct format"},
                check: async () => {
                    const errors: string[] = [];
                    const assets = getChainValidatorsAssets(Tezos);
                    assets.forEach(addr => {
                        if (!(eztz.crypto.checkAddress(addr))) {
                            errors.push(`Address ${addr} must be valid Tezos address'`);
                        }
                    });
                    return [errors, []];
                }
            },
        ];
    }
}
