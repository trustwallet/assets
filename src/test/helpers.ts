import * as fs from "fs"
import * as path from "path"
import { ValidatorModel } from "./models";
const axios = require('axios')
const Web3 = require('web3')
const web3 = new Web3('ws://localhost:8546');
import { CoinTypeUtils, CoinType } from "@trustwallet/types";
const sizeOf = require("image-size");
const { execSync } = require('child_process');

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
export const Kava = "kava" // TODO add to kava to tw types
export const Wanchain = getChainName(CoinType.wanchain)
export const Waves = getChainName(CoinType.waves)
export const Solana = "solana"

export const ethSidechains = [Ethereum, Classic, POA, TomoChain, GoChain, Wanchain, ThunderCore]
export const stakingChains = [Tezos, Cosmos, IoTeX, Tron, Waves, Kava, Terra]

export const logoName = `logo`
export const infoName = `info`
export const listName = `list`

export const logoExtension = "png"
export const jsonExtension = "json"

const whiteList = `whitelist.${jsonExtension}`
const blackList = `blacklist.${jsonExtension}`

const validatorsList = `${listName}.${jsonExtension}`

export const logo = `${logoName}.${logoExtension}`
export const info = `${infoName}.${jsonExtension}`


export const root = './'
export const chainsFolderPath = path.join(process.cwd(), '/blockchains')
export const pricingFolderPath = path.join(process.cwd(), '/pricing')
export const getChainLogoPath = (chain: string): string => `${chainsFolderPath}/${chain}/info/${logo}`
export const getChainInfoPath = (chain: string): string => `${chainsFolderPath}/${chain}/info/${info}`
export const getChainAssetInfoPath = (chain: string, address: string): string => `${chainsFolderPath}/${chain}/assets/${address}/${info}`
export const getChainAssetsPath = (chain: string): string => `${chainsFolderPath}/${chain}/assets`

export const minLogoWidth = 64
export const minLogoHeight = 64
export const maxLogoWidth = 512
export const maxLogoHeight = 512

export const maxAssetLogoSizeInKilobyte = 100

export const getChainAssetPath = (chain: string, address: string) => `${getChainAssetsPath(chain)}/${address}`
export const getAllChainsList = (): string[] => readDirSync(chainsFolderPath)
export const getChainAssetLogoPath = (chain: string, address: string) => `${getChainAssetsPath(chain)}/${address}/${logo}`
export const getChainAssetFilesList = (chain: string, address: string) => readDirSync(getChainAssetPath(chain, address))
export const getChainAssetsList = (chain: string): string[] => readDirSync(getChainAssetsPath(chain))
export const getChainValidatorsPath = (chain: string): string => `${chainsFolderPath}/${chain}/validators`
export const getChainValidatorsAssets = (chain: string): string[] => readDirSync(getChainValidatorsAssetsPath(chain))
export const getChainValidatorsListPath = (chain: string): string => `${(getChainValidatorsPath(chain))}/list.${jsonExtension}`
export const getChainValidatorsList = (chain: string): ValidatorModel[] => JSON.parse(readFileSync(`${(getChainValidatorsPath(chain))}/${validatorsList}`))
export const getChainValidatorsAssetsPath = (chain: string): string => `${getChainValidatorsPath(chain)}/assets`
export const getChainValidatorAssetLogoPath = (chain: string, asset: string): string => `${getChainValidatorsAssetsPath(chain)}/${asset}/${logo}`
export const getChainWhitelistPath = (chain: string): string => `${chainsFolderPath}/${chain}/${whiteList}`
export const getChainBlacklistPath = (chain: string): string => `${chainsFolderPath}/${chain}/${blackList}`
export const getChainWhitelist = (chain: string): string[] => {
    if (isChainWhitelistExistSync(chain)) {
        return JSON.parse(readFileSync(getChainWhitelistPath(chain)))
    }
    return []
}
export const getChainBlacklist = (chain: string): string[] => {
    if (isChainBlacklistExistSync(chain)) {
        return JSON.parse(readFileSync(getChainBlacklistPath(chain)))
    }
    return []
}
export const getRootDirFilesList = (): string[] => readDirSync(root)

export const readDirSync = (path: string): string[] => fs.readdirSync(path)
export const makeDirSync = (path: string) => fs.mkdirSync(path)
export const isPathExistsSync = (path: string): boolean => fs.existsSync(path)
export const isChainWhitelistExistSync = (chain: string): boolean => isPathExistsSync(getChainWhitelistPath(chain))
export const isChainBlacklistExistSync = (chain: string): boolean => isPathExistsSync(getChainBlacklistPath(chain))
export const isChainInfoExistSync = (chain: string): boolean => isPathExistsSync(getChainInfoPath(chain))
export const isChainAssetInfoExistSync = (chain: string, address: string) => isPathExistsSync(getChainAssetInfoPath(chain, address))
export const readFileSync = (path: string) => fs.readFileSync(path, 'utf8')
export const writeFileSync = (path: string, str: string) => fs.writeFileSync(path, str)
export const writeJSONToPath = (path: string, data: any) => fs.writeFileSync(path, JSON.stringify(data, null, 4))

export const isLowerCase = (str: string): boolean => str.toLowerCase() === str
export const isUpperCase = (str: string): boolean => str.toUpperCase() === str
export const isChecksum = (address: string): boolean => web3.utils.checkAddressChecksum(address)
export const toChecksum = (address: string): string => web3.utils.toChecksumAddress(address)
export const getBinanceBEP2Symbols = async () => axios.get(`https://dex-atlantic.binance.org/api/v1/tokens?limit=1000`).then(res => res.data.map(({ symbol }) => symbol))

export const getFileName = (fileName: string): string => path.basename(fileName, path.extname(fileName))
export const getFileExt = (name: string): string => name.slice((Math.max(0, name.lastIndexOf(".")) || Infinity) + 1)

export const isTRC10 = (str: string): boolean => (/^\d+$/.test(str))
export const isTRC20 = (address: string) => {
    return address.length == 34 &&
    address.startsWith("T") &&
    isLowerCase(address) == false &&
    isUpperCase(address) == false
}

export const isEthereumAddress = (address: string): boolean => {
    return web3.utils.isAddress(address)
}

export const isWavesAddress = (address: string) => {
    return address.length == 35 &&
    address.startsWith("3P") &&
    isLowerCase(address) == false &&
    isUpperCase(address) == false
}

export const isSolanaAddress = (address: string) => {
    // return address.length == 44
    return true
}

export const isPathDir = (path: string): boolean => {
    try {
        return fs.lstatSync(path).isDirectory()
    } catch (e) {
        console.log(`Path: ${path} is not a directory with error: ${e.message}`)
        return false
    }
}

export const isPathDirEmpthy = (path: string): boolean => {
    try {
        if (isPathDir(path)) {
            return fs.readdirSync(path).length == 0
        } else {
            false
        }
    } catch (error) {
        console.log(`Error isPathDirEmpthy`, error)
        process.exit(1)
    }
}

export const removeDir = (path: string) => {
    fs.rmdirSync(path, {recursive: true})
}

export const makeDirIfDoestExist = async (dirPath: string, dirName: string) => {
    const path = `${dirPath}/${dirName}`
    await fs.mkdir(path, {recursive: true}, (err) => {
        if (err) {
            console.error(`Error creating dir at path ${path} with result ${err}`)
        } else {
            console.log(`Created direcotry at ${path}`)
        }
    })
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

export function isLogoDimentionOK(path: string): [boolean,  string] {
    const { width, height } =  getImageDimentions(path)
    if (((width >= minLogoWidth && width <= maxLogoWidth) && (height >= minLogoHeight && height <= maxLogoHeight))) {
        return [true, '']
    } else {
        return [false, `Image at path ${path} must have dimensions: min:${minLogoWidth}x${minLogoHeight} and max:${maxLogoWidth}x${maxLogoHeight} insted ${width}x${height}`]
    }
}

export function isLogoSizeOK(path: string): [boolean, string, number] {
    const sizeInKylobyte = getFileSizeInKilobyte(path)

    if (sizeInKylobyte <= maxAssetLogoSizeInKilobyte) {
        return [true, ``, sizeInKylobyte]
    }
    return [false, `Logo at path ${path} with size ${sizeInKylobyte} exceeded max allowed size ${maxAssetLogoSizeInKilobyte} kB`, sizeInKylobyte]
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
            if (fs.statSync(newbase).isDirectory()) {
                result = findFiles(newbase, ext, fs.readdirSync(newbase), result)
            } else {
                if (file.substr(-1*(ext.length+1)) == '.' + ext) {
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

export function getMoveCommandFromTo(oldName: string, newName: string): string {
    return `git mv ${oldName} ${newName}-temp && git mv ${newName}-temp ${newName}`
}

export function execRename(path: string, command: string) {
    console.log(`Running command ${command}`)
    execSync(command, {encoding: "utf-8", cwd: path})
}

export const isValidatorHasAllKeys = (val: ValidatorModel): boolean => {
    return typeof val.id === "string"
        && typeof val.name === "string"
        && typeof val.description === "string"
        && typeof val.website === "string"
}

export function isAssetInfoOK(chain: string, address: string): [boolean, string] {
    if (!isChainAssetInfoExistSync(chain, address)) {
        return [true, `Info file doest exist, non eed to check`]
    }

    const assetInfoPath = getChainAssetInfoPath(chain, address)
    const isInfoJSONValid = isValidJSON(assetInfoPath)
    if (!isInfoJSONValid) {
        console.log(`JSON at path: ${assetInfoPath} is invalid`)
        return [false, `JSON at path: ${assetInfoPath} is invalid`]
    }

    const [hasAllKeys, msg] = isAssetInfoHasAllKeys(assetInfoPath)
    if (!hasAllKeys) {
        console.log({msg})
        return [false, msg]
    }

    return [true, ``]
}

export function isAssetInfoHasAllKeys(path: string): [boolean, string] {
    const info = JSON.parse(readFileSync(path))
    const infoKeys = Object.keys(info)
    const requiredKeys = ["explorer", "name", "website", "short_description"] // Find better solution getting AssetInfo interface keys

    const hasAllKeys = requiredKeys.every(k => info.hasOwnProperty(k))

    if (!hasAllKeys) {
        return [false, `Info at path ${path} missing next key(s): ${getArraysDiff(requiredKeys, infoKeys)}`]
    }

    const isKeysCorrentType = typeof info.explorer === "string" && info.explorer != ""
    && typeof info.name === "string" && info.name != ""
    && typeof info.website === "string"
    && typeof info.short_description === "string"
    
    return [isKeysCorrentType, `Check keys ${requiredKeys} vs ${infoKeys}`]
}

export const getArraysDiff = (arr1 :string[], arr2: string[]): string[] => arr1.filter(d => !arr2.includes(d))
export const getFileSizeInKilobyte = (path: string): number => fs.statSync(path).size / 1000

export const rootDirAllowedFiles = [
    ".github",
    "blockchains",
    "dapps",
    "media",
    "node_modules",
    "script",
    "src",
    ".gitignore",
    "azure-pipelines.yml",
    "jest.config.js",
    "LICENSE",
    "package-lock.json",
    "package.json",
    "README.md",
    ".git",
    "pricing",
    "Dangerfile",
    "Gemfile",
    "Gemfile.lock"
]

export const assetFolderAllowedFiles = [
    logo,
    info
]
