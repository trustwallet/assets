const axios = require("axios")
const fs = require('fs')

const TRUST_API_URL = process.env.TRUST_API_URL
const TOKEN_VERIFICATION_KEY = process.env.TOKEN_VERIFICATION_KEY
const ethereumSidechains = ["ethereum", "classic", "poa", "tomochain", "gochain", "wanchain", "callisto", "thundertoken"]

const addresses = []
ethereumSidechains.forEach(chain => {
    addresses.push(fs.readdirSync(`./blockchains/${chain}/assets`))
})

axios.post(TRUST_API_URL, {tokens: addresses.flat()}, {
    headers: {
        TOKEN_VERIFICATION_KEY
    }
})
.then(res => {
    if (res.status !== 200) {
        exitWithMsg(`Error verifying tokens`)
    }
    console.log(`Tokens were successfully verified`, res.data)
})
.catch(e => {
    exitWithMsg(`Failed to verify tokens ${e.message}`)
})

const exitWithMsg = (msg) => {
    console.log(msg)
    process.exit(1)
}