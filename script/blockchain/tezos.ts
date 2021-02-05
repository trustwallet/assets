import * as eztz from "eztz-lib";
import { getChainValidatorsAssets } from "../generic/repo-structure";
import { Tezos } from "../generic/blockchains";
import { ActionInterface, CheckStepInterface } from "../generic/interface";

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
