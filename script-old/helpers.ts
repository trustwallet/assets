import * as fs from "fs"
import * as path from "path"
const Web3 = require('web3')
const web3 = new Web3('ws://localhost:8546');

export const logoName = `logo`
export const infoName = `info`

export const logoExtension = "png"
export const jsonExtension = "json"

const whiteList = `whitelist.${jsonExtension}`
const blackList = `blacklist.${jsonExtension}`

export const logo = `${logoName}.${logoExtension}`
export const info = `${infoName}.${jsonExtension}`

export const root = './'
export const chainsFolderPath = path.join(process.cwd(), '/blockchains')
export const getChainLogoPath = (chain: string): string => `${chainsFolderPath}/${chain}/info/${logo}`
export const getChainInfoPath = (chain: string): string => `${chainsFolderPath}/${chain}/info/${info}`
export const getChainAssetsPath = (chain: string): string => `${chainsFolderPath}/${chain}/assets`
export const getChainPath = (chain: string): string => `${chainsFolderPath}/${chain}`

export const getChainAssetPath = (chain: string, address: string) => `${getChainAssetsPath(chain)}/${address}`
export const getAllChainsList = (): string[] => readDirSync(chainsFolderPath)
export const getChainAssetLogoPath = (chain: string, address: string) => `${getChainAssetsPath(chain)}/${address}/${logo}`
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
export const isDirContainLogo = (path: string): boolean => fs.existsSync(`${path}/${logo}`)
export const isChainWhitelistExistSync = (chain: string): boolean => isPathExistsSync(getChainWhitelistPath(chain))
export const isChainBlacklistExistSync = (chain: string): boolean => isPathExistsSync(getChainBlacklistPath(chain))
export const isChainInfoExistSync = (chain: string): boolean => isPathExistsSync(getChainInfoPath(chain))
export const readFileSync = (path: string) => fs.readFileSync(path, 'utf8')

export const isChecksum = (address: string): boolean => web3.utils.checkAddressChecksum(address)
export const toChecksum = (address: string): string => web3.utils.toChecksumAddress(address)

export const isEthereumAddress = (address: string): boolean => {
    return web3.utils.isAddress(address)
}

export const isPathDir = (path: string): boolean => {
    try {
        return fs.lstatSync(path).isDirectory()
    } catch (e) {
        console.log(`Path: ${path} is not a directory with error: ${e.message}`)
        return false
    }
}

export const isPathDirEmpty = (path: string): boolean => {
    try {
        if (isPathDir(path)) {
            return fs.readdirSync(path).length == 0
        } else {
            false
        }
    } catch (error) {
        console.log(`Error isPathDirEmpty`, error)
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
