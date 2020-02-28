import { toChecksum } from "../../src/test/helpers"
const BluebirbPromise = require("bluebird")
const axios = require("axios")
const chalk = require('chalk')
const fs = require("fs")
const path = require('path')
const constants = require('bip44-constants')
import { 
    readFileSync,
    getChainAssetLogoPath,
    isPathExistsSync,
    getChainName,
    makeDirSync,
    getChainAssetPath,
    ethSidechains,
    getChainBlacklist,
    getChainWhitelist,
} from "../../src/test/helpers";
import { TickerType, mapTiker, PlatformType } from "../../src/test/models";
import { CoinType } from "@trustwallet/types";

// Steps required to run this:
// 1. (Optional) CMC API key already setup, use yours if needed. Install script deps "npm i" if hasn't been run before. 
// 2. Pull down tokens repo https://github.com/trustwallet/assets and point COIN_IMAGE_BASE_PATH and TOKEN_IMAGE_BASE_PATH to it.
// 3. Run: `npm run gen:list`

const CMC_PRO_API_KEY = `df781835-e5f4-4448-8b0a-fe31402ab3af` // Free Basic Plan api key is enough to run script
const CMC_LATEST_BASE_URL = `https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest?`
const CONTRACTS_PATH = path.join(__dirname, 'mapping.json')
const wstream = fs.createWriteStream(CONTRACTS_PATH)
const typeToken = TickerType.Token
const typeCoin = TickerType.Coin
const mappedChainsBlacklistAssets = {} // {ethereum: {<0x...>: ""},}
const mappedChainsWhitelistAssets = {} // {ethereum: {<0x...>: ""},}

const custom: mapTiker[] = [
    {"coin": 60, "type": typeToken, "token_id": "0x6758B7d441a9739b98552B373703d8d3d14f9e62", "id": 2548}, // POA ERC20 on Foundation (POA20)
    // {"coin": 0, "type": typeCoin, "id": 825}, // Tether (OMNI)
    {"coin": 60, "type": typeToken, "token_id": "0xdAC17F958D2ee523a2206206994597C13D831ec7", "id": 825}, // Tether (ERC20)
    {"coin": 195, "type": typeToken, "token_id": "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t", "id": 825}, // Tether (TRC20)
    {"coin": 1023, "type": typeCoin, "id": 3945}, // Harmony ONE mainnet
    {"coin": 60, "type": typeToken, "token_id": "0x799a4202c12ca952cB311598a024C80eD371a41e", "id": 3945}, // Harmony ONE (ERC20)
    {"coin": 60, "type": typeToken, "token_id": "0xB8c77482e45F1F44dE1745F52C74426C631bDD52", "id": 1839}, // BNB (ERC20)
    {"coin": 304, "type": typeCoin, "id": 2777}, // IoTex coin
    {"coin": 1024, "type": typeToken, "token_id": "ong", "id": 3217}, // Ontology Gas (ONG)
    {"coin": 500, "type": typeToken, "token_id": "tfuel", "id": 3822}, // Theta Fuel (TFUEL)
    {"coin": 818, "type": typeToken, "token_id": "0x0000000000000000000000000000456E65726779", "id": 3012}, // VeThor Token (VTHO)
    {"coin": 459, "type": typeCoin, "id": 4846}, // KAVA coin
    {"coin": 60, "type": typeToken, "token_id": "0xFA1a856Cfa3409CFa145Fa4e20Eb270dF3EB21ab", "id": 2405}, // IOST (ERC20)
    //
    {"coin": 60, "type": typeToken, "token_id": "0x2fe39f22EAC6d3c1C86DD9D143640EbB94609FCE", "id": 4929}, // JDC Coin (ERC20)
    {"coin": 60, "type": typeToken, "token_id": "0xdfbc9050F5B01DF53512DCC39B4f2B2BBaCD517A", "id": 4287}, // new Jobchain (JOB)
    {"coin": 60, "type": typeToken, "token_id": "0x5Cf04716BA20127F1E2297AdDCf4B5035000c9eb", "id": 2780}, // NKN (NKN)
    {"coin": 714, "type": typeToken, "token_id": "CHZ-ECD", "id": 4066}, // Chiliz (BEP-2)
    {"coin": 60, "type": typeToken, "token_id": "0xdF1D6405df92d981a2fB3ce68F6A03baC6C0E41F", "id": 3816}, // VERA (VRA)
    {"coin": 60, "type": typeToken, "token_id": "0x467Bccd9d29f223BcE8043b84E8C8B282827790F", "id": 2394}, // Telcoin (TEL)
    // {"coin": 60, "type": typeToken, "token_id": "XXX", "id": XXX}, // XXX (XXX)
]

const permanentRemove = [
    "0x17280DA053596E097604839C61A2eF5efb7d493f", // old Jobchain (JOB)
    "0x85e076361cc813A908Ff672F9BAd1541474402b2", // old Telcoin (TEL)
]

const allContracts: mapTiker[] = [] // Temp storage for mapped assets
let bip44Constants = {}
let bnbOwnerToSymbol = {} // e.g: bnb1tawge8u97slduhhtumm03l4xl4c46dwv5m9yzk: WISH-2D5
let bnbOriginalSymbolToSymbol = {} // e.g: WISH: WISH-2D5

run()
async function run() {
    await initState()
    try {
        const totalCrypto = await getTotalActiveCryptocurrencies()
        await setBinanceTokens()
        // setBIP44Constants()
        log(`Found ${totalCrypto} on CMC`, chalk.yellowBright)
        const maxLimit = 200
        // for (let start = 1; start < totalCrypto; start += maxLimit) {
            // const coins =  await getTickers({start, limit: maxLimit})
            const coins =  await getTickers()
            // log(`Processgin range ${start} - ${start +  maxLimit} of ${totalCrypto}`, chalk.yellow)
            await BluebirbPromise.mapSeries(coins, processCoin)
        // }
        addCustom()
        printContracts()

    } catch (error) {
        log(`Error at the end ${error.message}`)
        wstream.write(`}`)
    }
}

async function processCoin(coin) {
    const { id, symbol, name, platform } = coin
    const platformType: PlatformType = platform == null ? "" : platform.name
    
    log(`${symbol}:${platformType}`)
    // await BluebirbPromise.mapSeries(types, async type => {
        switch (platformType) {
            case PlatformType.Ethereum:
                // log(`Ticker ${name}(${symbol}) is a token with address ${address} and CMC id ${id}`)
                if (platform.token_address) {
                    const checksum = toChecksum(platform.token_address)
                    if (permanentRemove.indexOf(checksum) == -1) {
                        log(`Added ${checksum}`)
                        addToContractsList({
                            coin: 60,
                            type: typeToken,
                            token_id: checksum,
                            id
                        })
                    }
                    await getImageIfMissing(getChainName(CoinType.ethereum), checksum, id)
                }
                break
            case PlatformType.Binance:
                if (symbol === "BNB") {
                    break
                }
                const ownerAddress = platform.token_address.trim()
                log(`Symbol ${symbol}:${ownerAddress}:${id}`)
                if (ownerAddress && (ownerAddress in bnbOwnerToSymbol)) {
                    log(`Added ${bnbOwnerToSymbol[ownerAddress]}`)
                    addToContractsList({
                        coin: 714,
                        type: typeToken,
                        token_id: bnbOwnerToSymbol[ownerAddress],
                        id
                    })
                    break
                }

                if (symbol in bnbOriginalSymbolToSymbol) {
                    log(`Added Binance ${bnbOriginalSymbolToSymbol[symbol]}`)
                    addToContractsList({
                        coin: 714,
                        type: typeToken,
                        token_id: bnbOriginalSymbolToSymbol[symbol].trim(),
                        id
                    })
                    break
                }
                break
            case PlatformType.TRON:
                    if (symbol === "TRX") {
                        break
                    }
                    const tokenAddr = platform.token_address.trim()
                    log(`tron: ${tokenAddr}`)
                    addToContractsList({
                        coin: 195,
                        type: typeToken,
                        token_id: tokenAddr,
                        id
                    })
                    break
            // case PlatformType.VeChain:
            //         if (symbol === "VET") {
            //             break
            //         }

            //         const addr = platform.token_address.trim()
            //         log(`vechain: ${tokenAddr}`)
            //         addToContractsList({
            //             coin: 0,
            //             type: typeCoin,
            //             token_id: addr,
            //             id
            //         })
            //         break
            default:
                const coinIndex = getSlip44Index(symbol, name)

                if (coinIndex >= 0) {
                    log(`Ticker ${name}(${symbol}) is a coin with id ${coinIndex}`)
                    addToContractsList({
                        coin: coinIndex,
                        type: typeCoin,
                        id
                    })
                } else {
                    log(`Coin ${coinIndex} ${name}(${symbol}) not listed in slip44`)
                } 
                break
        }
    // })
}

// Iniitalize state necessary for faster data looup during script run
async function initState () {
    await mapChainsAssetsLists()
}

async function mapChainsAssetsLists() {
    ethSidechains.forEach(chain => {
        Object.assign(mappedChainsWhitelistAssets, {[chain]: {}})
        Object.assign(mappedChainsBlacklistAssets, {[chain]: {}})

        const whiteList = getChainWhitelist(chain)
        const blackList = getChainBlacklist(chain)
        
        whiteList.forEach(addr => {
            Object.assign(mappedChainsWhitelistAssets[chain], {[addr]: ""})
        })
        blackList.forEach(addr => {
            Object.assign(mappedChainsBlacklistAssets[chain], {[addr]: ""})
        })
    })
}

function addCustom() {
    custom.forEach(c => {
        addToContractsList(c)
    })
}

function addToContractsList(ticker: mapTiker) {
    allContracts.push(ticker)
}

function printContracts() {
    const sortedById = allContracts.sort((a,b) => {
        if (a.id < b.id) return -1
        if (a.id > b.id) return 1

        if (a.hasOwnProperty("coin") && b.hasOwnProperty("coin")) {
            if (a.coin < b.coin) return -1
            if (a.coin > b.coin) return 1
        }

        if (a.token_id < b.token_id) return -1
        if (a.token_id > b.token_id) return 1
    })
    wstream.write(JSON.stringify(sortedById, null, 4))
}

function getSlip44Index(symbol: string, name: string): number {
    const coins = constants.filter(item =>  item[1] === symbol)
    if (coins.length == 0) return
    if (coins.length == 1) {
        const hex = '0x' + (coins[0][0]).toString(16)
        return parseInt(hex, 16) - ((1<<31)>>>0)
    }

    const coin = coins.filter(c => c[2] === name || c[2].includes(name))
    if (coin.length == 0) return
    const hex = '0x' + (coin[0][0]).toString(16)
    return parseInt(hex, 16) - ((1<<31)>>>0)
}

// id referes to cmc internal id
const getImageURL = (id: string | number): string => `https://s2.coinmarketcap.com/static/img/coins/128x128/${id}.png`

async function getImageIfMissing(chain: string, address: string, id: string) {
    try {
        const logoPath = getChainAssetLogoPath(chain, String(address))
        if (!isPathExistsSync(logoPath) && !isAddressInBlackList(chain, address)) {
            const imageStream = await fetchImage(getImageURL(id))
            
            if (imageStream) {
                const logoFolderPath = getChainAssetPath(chain, address)
                if(!isPathExistsSync(logoFolderPath)) {
                    makeDirSync(logoFolderPath)
                }   
                imageStream.pipe(fs.createWriteStream(logoPath))
                log(`Image saved to: ${logoPath}`, chalk.green)
            }
        }

    } catch (error) {
        log(`Failed getImage to save token image ${error.message}`)
        exit(2)
    }
}


function isAddressInBlackList(chain: string, address: string): boolean {
    return mappedChainsBlacklistAssets[chain].hasOwnProperty(address)
}

async function fetchImage(url: string) {
    try {
        return axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36'
            },
            responseType: "stream"
        }).then(res => res.data).catch(error => {
            console.log(`Error getRemoteResource ${error.message}`)
        })
    } catch (error) {
        log(`${error.message}`)
        exit(3)
        return false
    }
}

function exit(code?: number) {
    printContracts()
    process.exit(code ?? 1)
}

function getTotalActiveCryptocurrencies() {
    const url = `${CMC_LATEST_BASE_URL}CMC_PRO_API_KEY=${CMC_PRO_API_KEY}`
    return axios.get(url).then((res) => res.data.data.active_cryptocurrencies)
}

async function setBinanceTokens () {
    return axios.get(`https://dex.binance.org/api/v1/tokens?limit=1000`).then(({ data }) => {
        bnbOwnerToSymbol = data.reduce((acm, token) => {
            log(`Token owner ${token.owner}:${token.symbol}`)
            acm[token.owner] = token.symbol
            return acm
        }, {})
        bnbOriginalSymbolToSymbol = data.reduce((acm, token) => {
            acm[token.original_symbol] = token.symbol
            return acm
        }, {})
    }).catch(error => {throw Error(`Error fetching Binance markets : ${error.message}`)}) 
}

function readBEP2() {
    // Fetch https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=YOUR_KEYc&limit=5000 and store full response
    // in file
    const validatorsList = JSON.parse(readFileSync("./pricing/coinmarketcap/cryptocurrency_map.json"))
    return validatorsList.data
}

async function getTickers() {
    try {
        const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?&limit=3500&CMC_PRO_API_KEY=${CMC_PRO_API_KEY}`
        return await axios.get(url).then(res => res.data.data)
    } catch (error) {
        log(`Error gettin tickers ${error.message}`)
    }
}

function log(string, cb?) {
    if (cb) {
        console.log(cb(string))
    } else {
        console.log(string)
    }
    const saveToLogs = fs.createWriteStream(path.join(__dirname, '.syncTokensLog.txt')) // Uncomment to store script run logs in disk 
    saveToLogs.write(`${string}\n`)
}

// function setBIP44Constants() {
//     require('bip44-constants').forEach(row => {
//         bip44Constants[row[1]] = {
//             constant: row[0],
//             coinName: row[2]
//         }
//     })
// }