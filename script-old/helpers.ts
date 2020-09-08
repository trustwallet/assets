import * as fs from "fs"
import * as path from "path"

export const logoName = `logo`
export const infoName = `info`

export const logoExtension = "png"
export const jsonExtension = "json"

export const logo = `${logoName}.${logoExtension}`
export const info = `${infoName}.${jsonExtension}`

export const root = './'
export const chainsFolderPath = path.join(process.cwd(), '/blockchains')
export const getChainInfoPath = (chain: string): string => `${chainsFolderPath}/${chain}/info/${info}`
export const getChainAssetsPath = (chain: string): string => `${chainsFolderPath}/${chain}/assets`
export const getChainPath = (chain: string): string => `${chainsFolderPath}/${chain}`

export const getChainAssetPath = (chain: string, address: string) => `${getChainAssetsPath(chain)}/${address}`
export const getRootDirFilesList = (): string[] => readDirSync(root)

export const readDirSync = (path: string): string[] => fs.readdirSync(path)
export const isPathExistsSync = (path: string): boolean => fs.existsSync(path)
export const isDirContainLogo = (path: string): boolean => fs.existsSync(`${path}/${logo}`)
export const isChainInfoExistSync = (chain: string): boolean => isPathExistsSync(getChainInfoPath(chain))
export const readFileSync = (path: string) => fs.readFileSync(path, 'utf8')
