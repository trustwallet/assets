import * as fs from "fs"
const axios = require('axios')
const Web3 = require('web3')
const web3 = new Web3('ws://localhost:8546');
import { CoinTypeUtils, CoinType } from "@trustwallet/types";

export const Binance = getChainName(CoinType.binance)
export const Cosmos = getChainName(CoinType.cosmos)
export const Ethereum = getChainName(CoinType.ethereum)
export const Tezos = getChainName(CoinType.tezos)
export const Tron = getChainName(CoinType.tron)
export const IoTeX = getChainName(CoinType.iotex)
export const Waves = getChainName(CoinType.waves)
export const Classic = getChainName(CoinType.classic)
export const POA = getChainName(CoinType.poa)
export const TomoChain = getChainName(CoinType.tomochain)
export const GoChain = getChainName(CoinType.gochain)
export const Wanchain = getChainName(CoinType.wanchain)
export const ThunderCore = getChainName(CoinType.thundertoken)

const whiteList = 'whitelist.json'
const blackList = 'blacklist.json'

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
export const getChainWhitelistPath = chain => `${chainsFolderPath}/${chain}/${whiteList}`
export const getChainBlacklistPath = chain => `${chainsFolderPath}/${chain}/${blackList}`

export const readDirSync = path => fs.readdirSync(path)
export const isPathExistsSync = path => fs.existsSync(path)
export const isChainWhitelistExistSync = chain => isPathExistsSync(getChainWhitelistPath(chain))
export const isChainBlacklistExistSync = chain => isPathExistsSync(getChainBlacklistPath(chain))
export const readFileSync = path => fs.readFileSync(path, 'utf8')
export const writeFileSync = (path, str) => fs.writeFileSync(path, str)

export const isLowerCase = str => str.toLowerCase() === str
export const isUpperCase = str => str.toUpperCase() === str
export const isChecksum = address => web3.utils.checkAddressChecksum(address)
export const toChecksum = address => web3.utils.toChecksumAddress(address)
export const getBinanceBEP2Symbols = async () => axios.get(`https://dex-atlantic.binance.org/api/v1/tokens?limit=1000`).then(res => res.data.map(({symbol}) => symbol))

export const isTRC10 = id => (/^\d+$/.test(id))
export const isTRC20 = address => {
    return address.length == 34 &&
    address.startsWith("T") &&
    isLowerCase(address) == false &&
    isUpperCase(address) == false
}

export const sortDesc = arr => arr.sort((a, b) => a - b)
export const getUnique = arr => Array.from(new Set(arr))
export const mapList = arr => {
    return arr.reduce((acm, val) => {
        acm[val] = ""
        return acm
    }, {})
}

function getChainName(id: CoinType): string {
    return CoinTypeUtils.id(id)
}
