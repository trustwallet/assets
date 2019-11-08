var axios = require("axios");
import { toChecksum } from "../src/test/helpers"

export const getOpenseaCollectionAddresses = async () => {
    const limit = 300 // max limit
    let offset = 0
    const erc20Addresses = []
    const nftList = []

    while(true) {
        const collections = await axios.get(`https://api.opensea.io/api/v1/collections?limit=${limit}&offset=${offset}`)
            .then(res => res.data.collections)
            .catch(e => console.log(e.message))

        collections.forEach(c => {
            c.primary_asset_contracts.forEach(a => {
                if (a.schema_name === "ERC20") {
                    erc20Addresses.push(toChecksum(a.address))
                } else {
                    nftList.push(a.address)
                }
            })
        })

        if(collections.length < limit) {
            return nftList
        } else {
            offset += limit
        }
    }
}