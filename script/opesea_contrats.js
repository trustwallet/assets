var axios = require("axios");
const { exec } = require('child_process');

const fetchOpenseaCollectionAddresses = async () => {
    const limit = 300
    let offset = 0
    const erc20AddressesLowercase = []
    const nftlist = []

    while(true) {
        const collections = await axios.get(`https://api.opensea.io/api/v1/collections?limit=${limit}&offset=${offset}`)
            .then(res => res.data.collections)
            .catch(e => console.log(e.message))

        collections.forEach(c => {
            c.primary_asset_contracts.forEach(a => {
                if (a.schema_name === "ERC20") {
                    erc20AddressesLowercase.push(a.address)
                } else {
                    nftlist.push(a.address)
                }
            })
        })

        if(collections.length < limit) {
            console.log(`[`)
            nftlist.forEach(addr => {
                exec(`ethereum_checksum_address ${addr}`, (err, checksum, stderr) => {
                    if (err) {
                      console.error(`exec error: ${err}`);
                      return;
                    }
                    console.log(`"${checksum.trim()}",`)
                  });
            })

            console.log(`]`)
            return
        } else {
            offset += limit
        }
    }
}

fetchOpenseaCollectionAddresses()