const { execSync } = require('child_process');
const path = require('path')
const axios = require('axios')
import { readDirSync } from "../src/test/helpers";

const assetsPath = path.resolve(`${__dirname}/../blockchains/tron/assets`) 
const chainAddresses = readDirSync(assetsPath)

chainAddresses.forEach(async addr => {
    const trc20Info = await axios.get(`https://apilist.tronscan.org/api/token_trc20?contract=${addr}&showAll=1`).then(({ data }) => data)

    if (!isChecksum) {
        console.log(`Address ${addr} not in checksum`)
        const checksum = web3.utils.toChecksumAddress(addr)
        const moveToChecksum = `git mv ${addr} ${checksum}-temp && git mv ${checksum}-temp ${checksum}`
        const renamed = execSync(`cd ${assetsPath} && ${moveToChecksum}`, {encoding: "utf-8"})
        console.log(`Result renaming ${addr} : ${renamed}`)
    }
})