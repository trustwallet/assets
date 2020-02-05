import * as fs from "fs"
import * as path from "path"
import { ValidatorModel } from "./models";
const axios = require('axios')
const Web3 = require('web3')
const web3 = new Web3('ws://localhost:8546');
import { CoinTypeUtils, CoinType } from "@trustwallet/types";
const sizeOf = require("image-size");

export const getChainName = (id: CoinType): string =>  CoinTypeUtils.id(id) // 60 => ethereum
export const Binance = getChainName(CoinType.binance)
export const Classic = getChainName(CoinType.classic)
export const Cosmos = getChainName(CoinType.cosmos)
export const Ethereum = getChainName(CoinType.ethereum)
export const GoChain = getChainName(CoinType.gochain)
export const IoTeX = getChainName(CoinType.iotex)
export const POA = getChainName(CoinType.poa)
export const Tezos = getChainName(CoinType.tezos)
export const ThunderCore = getChainName(CoinType.thundertoken)
export const Terra = getChainName(CoinType.terra)
export const TomoChain = getChainName(CoinType.tomochain)
export const Tron = getChainName(CoinType.tron)
export const Wanchain = getChainName(CoinType.wanchain)
export const Waves = getChainName(CoinType.waves)

export const ethSidechains = [Ethereum, Classic, POA, TomoChain, GoChain, Wanchain, ThunderCore]

const whiteList = 'whitelist.json'
const blackList = 'blacklist.json'

export const logo = `logo.png`
export const info = `info.json`
export const root = './'
export const chainsFolderPath = './blockchains'
export const pricingFolderPath = './pricing'
export const getChainLogoPath = (chain: string): string => `${chainsFolderPath}/${chain}/info/${logo}`
export const getChainInfoPath = (chain: string): string => `${chainsFolderPath}/${chain}/info/${info}`
export const getChainAssetsPath = (chain: string): string => `${chainsFolderPath}/${chain}/assets`

export const minLogoWidth = 64
export const minLogoHeight = 64
export const maxLogoWidth = 512
export const maxLogoHeight = 512

export const getChainAssetPath = (chain: string, address: string) => `${getChainAssetsPath(chain)}/${address}`
export const getChainAssetLogoPath = (chain: string, address: string) => `${getChainAssetsPath(chain)}/${address}/${logo}`
export const getChainValidatorsPath = (chain: string): string => `${chainsFolderPath}/${chain}/validators`
export const getChainValidatorsAssets = (chain: string): string[] => readDirSync(getChainValidatorsAssetsPath(chain))
export const getChainValidatorsListPath = (chain: string): string => `${(getChainValidatorsPath(chain))}/list.json`
export const getChainValidatorsAssetsPath = (chain: string): string => `${getChainValidatorsPath(chain)}/assets`
export const getChainValidatorAssetLogoPath = (chain: string, asset: string): string => `${getChainValidatorsAssetsPath(chain)}/${asset}/${logo}`
export const getChainWhitelistPath = (chain: string): string => `${chainsFolderPath}/${chain}/${whiteList}`
export const getChainBlacklistPath = (chain: string): string => `${chainsFolderPath}/${chain}/${blackList}`

export const readDirSync = (path: string): string[] => fs.readdirSync(path)
export const makeDirSync = (path: string) => fs.mkdirSync(path)
export const isPathExistsSync = (path: string): boolean => fs.existsSync(path)
export const isChainWhitelistExistSync = (chain: string): boolean => isPathExistsSync(getChainWhitelistPath(chain))
export const isChainBlacklistExistSync = (chain: string): boolean => isPathExistsSync(getChainBlacklistPath(chain))
export const isChainInfoExistSync = (chain: string): boolean => isPathExistsSync(getChainInfoPath(chain))
export const readFileSync = (path: string) => fs.readFileSync(path, 'utf8')
export const writeFileSync = (path: string, str: string) => fs.writeFileSync(path, str)

export const isLowerCase = (str: string): boolean => str.toLowerCase() === str
export const isUpperCase = (str: string): boolean => str.toUpperCase() === str
export const isChecksum = (address: string): boolean => web3.utils.checkAddressChecksum(address)
export const toChecksum = (address: string): string => web3.utils.toChecksumAddress(address)
export const getBinanceBEP2Symbols = async () => axios.get(`https://dex-atlantic.binance.org/api/v1/tokens?limit=1000`).then(res => res.data.map(({symbol}) => symbol))

export const isTRC10 = (string: string): boolean => (/^\d+$/.test(string))
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

export const getImageDimentions = (path: string) => sizeOf(path)

export const isLogoOK = (path: string): [boolean,  string] => {
    const { width, height } =  getImageDimentions(path)
    if (((width >= minLogoWidth && width <= maxLogoWidth) && (height >= minLogoHeight && height <= maxLogoHeight))) {
        return [true, '']
    } else {
        return [false, `Image at path ${path} must have dimensions: min:${minLogoWidth}x${minLogoHeight} and max:${maxLogoWidth}x${maxLogoHeight} insted ${width}x${height}`]
    }
}

export const calculateAspectRatioFit = (srcWidth: number, srcHeight: number, maxWidth: number, maxHeight: number) => {
    const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight)
    return { width: Math.round(srcWidth * ratio), height: Math.round(srcHeight * ratio) }
 }
 
 export const findFiles = (base: string, ext: string, files: string[] = [], result: string[] = []) => {
    files = fs.readdirSync(base) || files
    result = result || result

    files.forEach( 
        function (file) {
            var newbase = path.join(base, file)
            if ( fs.statSync(newbase).isDirectory()) {
                result = findFiles(newbase, ext, fs.readdirSync(newbase), result)
            } else {
                if ( file.substr(-1*(ext.length+1)) == '.' + ext) {
                    result.push(newbase)
                }
            }
        }
    )
    return result
 }

 export const isValidJSON = (path: string) => {
    let rawdata = fs.readFileSync(path, 'utf8')
    try {
        JSON.parse(rawdata)
        return true
    } catch {
        return false
    }
 }

export const isValidatorHasAllKeys = (val: ValidatorModel): boolean => {
    return typeof val.id === "string"
        && typeof val.name === "string"
        && typeof val.description === "string"
        && typeof val.website === "string"
}
