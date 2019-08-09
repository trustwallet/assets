const fs = require('fs')
const axios = require('axios')
const path = require('path')

const pngExp = /\.png$/
const upperCaseExp = /[A-F]/

const isAddress = address => /^(0x)?[0-9a-f]{40}$/i.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)
const isFilePng = name => pngExp.test(name)
const readDirSync = path => fs.readdirSync(path)

checkRootDir()
function checkRootDir () {
    readDirSync('.').forEach(file => {
        if(isFilePng(file)) {
            exitWithMsg(`Move ${file} to ./tokens folder`)
        }
    })

    if(fs.existsSync("./images")) {
        exitWithMsg(`Adding to ./image folder is restricted, please update your fork`)
    }
}

checkBlockhainsFolder()

function checkBlockhainsFolder(){
    const currentBlockchains = 47
    const foundBlockchains = readDirSync('./blockchains')

    if (foundBlockchains.length !== currentBlockchains) {
        exitWithMsg(`Expected amount of chains in "./blockchains" = ${currentBlockchains}, found ${foundBlockchains.length}. Add tests for new folder`)
    }

    foundBlockchains.forEach(folder => {
        commonChainCheck(folder)

        //Check Ethereum sidechains folders
        const ethereumSidechains = ["ethereum", "classic", "poa", "tomochain", "gochain", "wanchain", "callisto", "thundertoken"]
        if (ethereumSidechains.indexOf(folder) !== -1) {
            const assetsPath = `./blockchains/${folder}/assets`
            const assets = readDirSync(assetsPath)

            assets.forEach(asset => {
                if (!isAddress(asset)) {
                    exitWithMsg(`Invalid asset naming "${assetsPath}"`)
                }

                // Check if asset folder contains logo.png image
                const assetLogoPath = `${assetsPath}/${asset}/logo.png`
                if (!fs.existsSync(assetLogoPath)) {
                    exitWithMsg(`${assetLogoPath} mush have logo.png`)
                }
            })
        }

        if (folder === "binance") {
            checkBinance()
        }

        if (folder === "tron") {
            checkTron()
        }


        console.log(`Folder ${folder} passed all checks`)
    })
}

function commonChainCheck(folder) {
    if (upperCaseExp.test(folder)) {
        exitWithMsg(`"${folder}" must be in lowercase register`)
    }

    const pathToInfo = path.join(__dirname, '..', `blockchains/${folder}/info/logo.png`)
    if (!fs.existsSync(pathToInfo)) {
        exitWithMsg(`Can't find coin image inside "${pathToInfo}"`)
    }
}

async function checkBinance() {
    const tokenSymbols = await getBinanceTokenSymbols()
    const path = `./blockchains/binance/assets`
    const assets = readDirSync(path)

    assets.forEach(asset => {
        if (upperCaseExp.test(asset)) {
            exitWithMsg(`${asset} folder must be in lowercase`)
        }

        if (tokenSymbols.indexOf(asset.toUpperCase()) == -1) {
            exitWithMsg(`${asset} does not exist on chain`)
        }

        const assetLogoPath = `${path}/${asset}/logo.png`
        if (!fs.existsSync(assetLogoPath)) {
            exitWithMsg(`Path ${assetLogoPath} mush have logo.png`)
        }
    })
}

function checkTron() {
    const path = `./blockchains/tron/assets`
    const assets = readDirSync(path)

    assets.forEach(asset => {
        if (!(/^\d+$/.test(asset))) {
            exitWithMsg(`${asset} folder must contain only digits`)
        }

        const assetLogoPath = `${path}/${asset}/logo.png`
        if (!fs.existsSync(assetLogoPath)) {
            exitWithMsg(`Path ${assetLogoPath} mush have logo.png`)
        }
    })
}

async function getBinanceTokenSymbols() {
    return axios.get(`https://dex-atlantic.binance.org/api/v1/tokens?limit=1000`).then(res => {
        return res.data.map(token => token.symbol)
    })
}

const exitWithMsg = msg => {
    console.log(msg)
    process.exit(1)
}

console.log(`\nPassed all tests`)