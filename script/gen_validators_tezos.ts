const axios = require('axios')
import { 
    getChainValidatorsList,
    getChainValidatorsListPath,
    Tezos, 
    writeJSONToPath
} from "../src/test/helpers";
import { BakingBadBaker } from "../src/test/models";

(async function(){
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

    writeJSONToPath(getChainValidatorsListPath(Tezos), newbakers)
})()
