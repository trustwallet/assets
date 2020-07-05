var axios = require("axios");
import { toChecksum } from "../src/test/helpers"

// Returns array of ERC-721, ERC-1155 contract addresses in checksum 
export const getOpenseaCollectionAddresses = async () => {
    console.log(`Fetching assets from OpenSea`)
    const limit = 300 // max limit
    let offset = 0
    const erc20Addresses = []
    const nftList = []

    while(true) {
        const url = `https://api.opensea.io/api/v1/collections?limit=${limit}&offset=${offset}`
        console.log({url})
        const collections = await axios.get(url)
            .then(res => res.data.collections)
            .catch(e => console.log(e.message))
        collections.forEach(c => {
            c.primary_asset_contracts.forEach(a => {
                const checksum = toChecksum(a.address)
                if (a.schema_name === "ERC20") {
                    erc20Addresses.push(checksum)
                } else {
                    nftList.push(checksum)
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