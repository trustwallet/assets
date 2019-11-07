
const fs = require('fs')
const axios = require('axios')
const path = require('path')
const Web3 = require('web3')
const web3 = new Web3('ws://localhost:8546');

export const BNB = 'binance'
export const Cosmos = 'cosmos'
export const Tezos = 'tezos'
export const TRON = 'tron'
export const IoTeX = 'iotex'
export const Waves = 'waves'

export const logo = `logo.png`
export const chainsFolderPath = './blockchains'
export const getChainLogoPath = chain => `${chainsFolderPath}/${chain}/info/${logo}`
export function getChainAssetsPath (chain) {
    return `${chainsFolderPath}/${chain}/assets`
}
export const getChainAssetLogoPath = (chain, address) => `${getChainAssetsPath(chain)}/${address}/${logo}`
export const getChainValidatorsPath = chain => `${chainsFolderPath}/${chain}/validators`
export const getChainValidatorsAssets = chain => readDirSync(getChainValidatorsAssetsPath(chain))
export const getChainValidatorsListPath = chain => `${(getChainValidatorsPath(chain))}/list.json`
export const getChainValidatorsAssetsPath = chain => `${getChainValidatorsPath(chain)}/assets`
export const getChainValidatorAssetLogoPath = (chain, asset) => `${getChainValidatorsAssetsPath(chain)}/${asset}/${logo}`

export const readDirSync = path => fs.readdirSync(path)
export const isPathExistsSync = path => fs.existsSync(path)
export const readFileSync = path => fs.readFileSync(path, (err, data) => {
    if (err) throw err
    return data
}) 
export const isLowerCase = str => str.toLowerCase() === str
export const isUpperCase = str => str.toUpperCase() === str
export const isChecksum = address => web3.utils.checkAddressChecksum(address)
export const getBinanceBEP2Symbols = async () => axios.get(`https://dex-atlantic.binance.org/api/v1/tokens?limit=1000`).then(res => res.data.map(({symbol}) => symbol))

export const isTRC10 = id => (/^\d+$/.test(id))
export const isTRC20 = address => {
    return address.length == 34 &&
    address.startsWith("T") &&
    isLowerCase(address) == false &&
    isUpperCase(address) == false
}