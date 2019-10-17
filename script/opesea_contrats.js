var axios = require("axios");

const fetchOpnSeaCollectionsAddresses = async () => {
    const limit = 300
    let offset = 0

    while(true) {
        const collections = await axios.get(`https://api.opensea.io/api/v1/collections?limit=${limit}&offset=${offset}`)
            .then(res => res.data.collections)
            .catch(e => console.log(e.message))

        collections.forEach(c => {
            c.primary_asset_contracts.forEach(a => {
                console.log(`"${a.address}",`)
            })
        })

        if(collections.length < limit) {
            return
        } else {
            offset += limit
        }
    }
}

fetchOpnSeaCollectionsAddresses()