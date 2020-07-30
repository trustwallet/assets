import axios from "axios";
import {
    validatorsList,
    getChainValidatorsPath,
    getChainValidatorsListPath
} from "../common/repo-structure";
import { Tezos } from "../common/blockchains";
import { readFileSync } from "../common/filesystem";
import { writeJsonFile } from "../common/json";
import { ActionInterface } from "./interface";

import {
    BakingBadBaker,
    ValidatorModel
} from "../../src/test/models";

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
        if (freeSpace > 0 && val.hasOwnProperty("status")) {
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
    getChecks = null;
    fix = null;
    async update(): Promise<void> {
        await gen_validators_tezos();
    }
}
