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
    const currentBlockchains = 60
    
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
                    exitWithMsg(`Invalid asset naming "${assetsPath}"`)
                }

                // Check if asset folder contains logo.png image
                const assetLogoPath = `${assetsPath}/${asset}/logo.png`
                if (!isPathExistsSync(assetLogoPath)) {
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

        // Check staking supported chains
        const stakingChains = ["cosmos"]
        if (stakingChains.indexOf(folder) !== -1) {
            const folderPath = `${blockchainsFolderPath}/${folder}`
            checkValidatorsFolder(folderPath)
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
    const assets = readDirSync(path)

    assets.forEach(asset => {
        if (!(/^\d+$/.test(asset))) {
            exitWithMsg(`${asset} folder must contain only digits`)
        }

        const assetLogoPath = `${path}/${asset}/logo.png`
        if (!isPathExistsSync(assetLogoPath)) {
            exitWithMsg(`Path ${assetLogoPath} mush have logo.png`)
        }
    })
}

function checkValidatorsFolder(networkPath) {
    const validatorsFolderPath = `${networkPath}/validators`

    if (!isPathExistsSync(validatorsFolderPath)) {
        exitWithMsg(`Validators folder doesn't exists at path ${networkPath}`)
    }

    const validatorsAssetsFolderPath = validatorsFolderPath + `/assets`
    if (!isPathExistsSync(validatorsAssetsFolderPath)) {
        exitWithMsg(`Validators assets folder doesn't exists at path ${validatorsAssetsFolderPath}`)
    }

    readDirSync(validatorsAssetsFolderPath).forEach(address => {
        testCosmosAddress(address)

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
        exitWithMsg(`${address} folder must be in lowercase`)
    }
}

function isPathExistsSync(path) {
    return fs.existsSync(path)
}

async function getBinanceTokenSymbols() {
    return axios.get(`https://dex-atlantic.binance.org/api/v1/tokens?limit=1000`).then(res => res.data.map(token => token.symbol))
}

function exitWithMsg (msg) {
    console.log(msg)
    process.exit(1)
}

console.log(`\nPassed all tests`)