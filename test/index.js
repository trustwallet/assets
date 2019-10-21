const fs = require('fs')
const axios = require('axios')
const path = require('path')
const assert = require('assert')

const pngExp = /\.png$/
const uppercaseExp = /[A-F]/

const isEthereumAddress = address => /^(0x)?[0-9a-f]{40}$/i.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)
const isFilePng = name => pngExp.test(name)
const readDirSync = path => fs.readdirSync(path)
const isLowerCase = str => str.toLowerCase() === str
const isPathExistsSync = path => fs.existsSync(path)
const blockchainsFolderPath = './blockchains'

checkRootDir()
function checkRootDir () {
    readDirSync('.').forEach(file => {
        if(isFilePng(file)) {
            exitWithMsg(`Move ${file} to ./tokens folder`)
        }
    })

    if(isPathExistsSync(`./images`)) {
        exitWithMsg(`Adding to ./image folder is restricted, please update your fork`)
    }
}

checkBlockhainsFolder()

function checkBlockhainsFolder(){
    const currentBlockchains = 64;

    const foundBlockchains = readDirSync(blockchainsFolderPath)

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
                if (uppercaseExp.test(asset)) {
                    exitWithMsg(`${asset} folder must be in lowercase`)
                }

                if (!isEthereumAddress(asset)) {
                    exitWithMsg(`Invalid asset ${asset} naming "${assetsPath}"`)
                }

                // Check if asset folder contains logo.png image
                const assetLogoPath = `${assetsPath}/${asset}/logo.png`
                if (!isPathExistsSync(assetLogoPath)) {
                    exitWithMsg(`${assetLogoPath} mush have logo.png`)
                }
            })
        }

        if (folder === "bnb") {
            checkBinance()
        }

        if (folder === "tron") {
            checkTron()
        }

        // Check POS chains
        const posChains = ["cosmos", "tezos"]
        if (posChains.indexOf(folder) !== -1) {
            checkValidatorFolder(folder)
        }


        console.log(`Folder ${folder} passed all checks`)
    })
}

function commonChainCheck(folder) {
    if (uppercaseExp.test(folder)) {
        exitWithMsg(`"${folder}" must be in lowercase register`)
    }

    const pathToInfo = path.join(__dirname, '..', `blockchains/${folder}/info/logo.png`)
    if (!isPathExistsSync(pathToInfo)) {
        exitWithMsg(`Can't find coin image inside "${pathToInfo}"`)
    }
}

async function checkBinance() {
    const tokenSymbols = await getBinanceTokenSymbols()
    const path = `./blockchains/binance/assets`
    const assets = readDirSync(path)

    assets.forEach(asset => {
        if (uppercaseExp.test(asset)) {
            exitWithMsg(`${asset} folder must be in lowercase`)
        }

        if (tokenSymbols.indexOf(asset.toUpperCase()) == -1) {
            exitWithMsg(`${asset} does not exist on chain`)
        }

        const assetLogoPath = `${path}/${asset}/logo.png`
        if (!isPathExistsSync(assetLogoPath)) {
            exitWithMsg(`Path ${assetLogoPath} mush have logo.png`)
        }
    })
}

function checkTron() {
    const path = `./blockchains/tron/assets`

    readDirSync(path).forEach(asset => {
        if (isTRC10(asset)) {
        } else {
            isTRC20(asset)
        }

        const assetLogoPath = `${path}/${asset}/logo.png`
        if (!isPathExistsSync(assetLogoPath)) {
            exitWithMsg(`Path ${assetLogoPath} mush have logo.png`)
        }
    })
}

function isTRC10(id) {
    return (/^\d+$/.test(id))
}

// Check address to match TRC20 criteria
function isTRC20(address) {
    if (!isLowerCase(address) ||
       address.length !== 34
    ) {
        exitWithMsg(`TRC20 ${address} fail to match criteria`)
    }

}

function checkValidatorFolder(folder) {
    const folderPath = `${blockchainsFolderPath}/${folder}`
    const validatorsFolderPath = `${folderPath}/validators`

    // Check validators folder existence
    if (!isPathExistsSync(validatorsFolderPath)) {
        exitWithMsg(`Validators folder doesn't exists at path ${networkPath}`)
    }

    const validatorsAssetsFolderPath = validatorsFolderPath + `/assets`
    if (!isPathExistsSync(validatorsAssetsFolderPath)) {
        exitWithMsg(`Validators assets folder doesn't exists at path ${validatorsAssetsFolderPath}`)
    }

    readDirSync(validatorsAssetsFolderPath).forEach(address => {
        switch (folder) {
            case "cosmos":
                testCosmosAddress(address)
            case "tezos":
                testTezosAddress(address)
            default:
        }

        const validatoAssetLogo = `${validatorsAssetsFolderPath}/${address}/logo.png`
        if (!isPathExistsSync(validatoAssetLogo)) {
            exitWithMsg(`Path ${validatoAssetLogo} mush have logo.png`)
        }
    })

    fs.readFile(validatorsFolderPath + `/list.json`, (err, data) => {
        if (err) throw err
       const validators = JSON.parse(data)

       validators.forEach(validator => {
           const keys = Object.keys(validator)
            if (keys.length !== 4) {
                exitWithMsg(`Add test for new validator object key: ${keys.length}`)
            }

            keys.forEach(key => {
                const keyType = typeof key
                if (keyType !== "string") {
                    exitWithMsg(`Key ${key} must be "string" type, actual ${keyType}`)
                }
            })
       })

    })

}

function testCosmosAddress(address) {
    if (!isLowerCase(address)) {
        exitWithMsg(`Cosmos ${address} folder must be in lowercase`)
    }
}

function testTezosAddress(address) {
    if (!isLowerCase(address)) {
        exitWithMsg(`Tezos ${address} folder must be in lowercase`)
    }
}

async function getBinanceTokenSymbols() {
    return axios.get(`https://dex-atlantic.binance.org/api/v1/tokens?limit=1000`).then(res => res.data.map(token => token.symbol))
}

function exitWithMsg (msg) {
    console.log(msg)
    process.exit(1)
}

console.log(`\nPassed all tests`)
