import * as path from "path";

export const logoName = `logo`
export const logoExtension = "png"
export const jsonExtension = "json"
export const logoFullName = `${logoName}.${logoExtension}`
const whiteList = `whitelist.${jsonExtension}`
const blackList = `blacklist.${jsonExtension}`

export const chainsPath: string = path.join(process.cwd(), '/blockchains')
export const getChainPath = (chain: string): string => `${chainsPath}/${chain}`
export const getChainAssetsPath = (chain: string): string => `${getChainPath(chain)}/assets`
export const getChainAssetLogoPath = (chain: string, address: string): string => `${getChainAssetsPath(chain)}/${address}/${logoFullName}`
export const getChainWhitelistPath = (chain: string): string => `${getChainPath(chain)}/${whiteList}`
export const getChainBlacklistPath = (chain: string): string => `${getChainPath(chain)}/${blackList}`

export const getChainValidatorsPath = (chain: string): string => `${getChainPath(chain)}/validators`
export const getChainValidatorsListPath = (chain: string): string => `${getChainValidatorsPath(chain)}/list.${jsonExtension}`
