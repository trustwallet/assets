import axios from "axios";
import * as eztz from "eztz-lib";
import {
    validatorsList,
    getChainValidatorsPath,
    getChainValidatorsListPath,
    getChainValidatorsAssets
} from "../generic/repo-structure";
import { Tezos } from "../generic/blockchains";
import { readFileSync } from "../generic/filesystem";
import { writeJsonFile } from "../generic/json";
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

async function gen_validators_tezos() {
    const bakers: BakingBadBaker[] = await axios.get(`https://api.baking-bad.org/v2/bakers`).then(res => res.data)
    const bakersMap: {[key: string]: BakingBadBaker} = bakers.reduce((acm, val) => {
        acm[val.address] = val
        return acm
    }, {})

    const newbakers = getChainValidatorsList(Tezos).reduce((acm, val) => {
        if (!(val.id in bakersMap)) {
            console.log(val.id)
            return acm
        }
        const bakerInfo = bakersMap[val.id]

        val.payout.commission = Number((bakerInfo.fee * 100).toFixed(2))
        val.payout.payoutDelay = bakerInfo.payoutDelay
        val.payout.payoutPeriod = bakerInfo.payoutPeriod
        val.staking.minDelegation = bakerInfo.minDelegation

        const freeSpace =  Number((bakerInfo.freeSpace).toFixed(0))
        // Disable baker if no more capacity
        if (freeSpace <= 0) {
            val.status = {
                "disabled": true,
                "note": `No more capacity: ${freeSpace}`
            }
        }

        // Enable baker if has capacity 
        if (freeSpace > 0 && Object.prototype.hasOwnProperty.call(val, "status")) {
            delete val.status
        }

        if (bakerInfo.serviceHealth !== "active") {
            val.status = {
                "disabled": true,
                "note": `According to Baking Bad API, baker is not active, current status ${bakerInfo.serviceHealth}, see: https://api.baking-bad.org/v2/bakers/${bakerInfo.address}`, 
            }
        }

        acm.push(val)
        return acm
    }, [])

    writeJsonFile(getChainValidatorsListPath(Tezos), newbakers)
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

    async update(): Promise<void> {
        await gen_validators_tezos();
    }
}
