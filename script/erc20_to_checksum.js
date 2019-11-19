const { execSync } = require('child_process');
const fs = require('fs')
const path = require('path')
const Web3 = require('web3')
const web3 = new Web3('ws://localhost:8546');

const readdirSync = path => fs.readdirSync(path)

const cheinsAddressesToChecksum = ["classic", "poa", "tomochain", "gochain", "wanchain", "thundertoken", "ethereum"]

cheinsAddressesToChecksum.forEach(chain => {
    const assetsPath = path.resolve(`${__dirname}/../blockchains/${chain}/assets`) 
    const chainAddresses = readdirSync(assetsPath)

    chainAddresses.forEach(addr => {
        isChecksum = web3.utils.checkAddressChecksum(addr)

        if (!isChecksum) {
            console.log(`Address ${addr} not in checksum`)
            const checksum = web3.utils.toChecksumAddress(addr)
            const moveToChecksum = `git mv ${addr} ${checksum}-temp && git mv ${checksum}-temp ${checksum}`
            const renamed = execSync(`cd ${assetsPath} && ${moveToChecksum}`, {encoding: "utf-8"})
            console.log(`Result renaming ${addr} : ${renamed}`)
        }
    })
});