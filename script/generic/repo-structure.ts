import * as path from "path";
import {
    isPathExistsSync,
    readDirSync
} from "./filesystem";
import * as config from "../config";

export const logoName = `logo`;
export const infoName = `info`;
export const listName = `list`
export const logoExtension = "png";
export const jsonExtension = "json";
export const logoFullName = `${logoName}.${logoExtension}`;
export const infoFullName = `${infoName}.${jsonExtension}`;
const tokenList = `tokenlist.${jsonExtension}`;
export const validatorsList = `${listName}.${jsonExtension}`

export const assetFolderAllowedFiles = [logoFullName, infoFullName];
export const chainFolderAllowedFiles = [
    "assets",
    tokenList,
    "validators",
    infoName
]
export const chainsPath: string = path.join(process.cwd(), '/blockchains');
export const getChainPath = (chain: string): string => `${chainsPath}/${chain}`;
export const allChains = readDirSync(chainsPath);
export const getChainInfoPath = (chain: string): string => `${getChainPath(chain)}/info`;
export const getChainLogoPath = (chain: string): string => `${getChainInfoPath(chain)}/${logoFullName}`;
export const getChainCoinInfoPath = (chain: string): string => `${getChainInfoPath(chain)}/${infoFullName}`;
export const getChainAssetsPath = (chain: string): string => `${getChainPath(chain)}/assets`;
export const getChainAssetPath = (chain: string, asset: string): string => `${getChainAssetsPath(chain)}/${asset}`;
export const getChainAssetLogoPath = (chain: string, asset: string): string => `${getChainAssetPath(chain, asset)}/${logoFullName}`;
export const getChainAssetInfoPath = (chain: string, asset: string): string => `${getChainAssetPath(chain, asset)}/${infoFullName}`;
export const getChainTokenlistPath = (chain: string): string => `${getChainPath(chain)}/${tokenList}`;
export const pricingFolderPath = path.join(process.cwd(), '/pricing');

export const getChainValidatorsPath = (chain: string): string => `${getChainPath(chain)}/validators`;
export const getChainValidatorsListPath = (chain: string): string => `${getChainValidatorsPath(chain)}/${validatorsList}`;
export const getChainValidatorsAssetsPath = (chain: string): string => `${getChainValidatorsPath(chain)}/assets`
export const getChainValidatorAssetLogoPath = (chain: string, asset: string): string => `${getChainValidatorsAssetsPath(chain)}/${asset}/${logoFullName}`

export const isChainAssetInfoExistSync = (chain: string, address: string): boolean => isPathExistsSync(getChainAssetInfoPath(chain, address));

export const getChainFolderFilesList = (chain: string): string[] => readDirSync(getChainPath(chain))
export const getChainAssetsList = (chain: string): string[] => readDirSync(getChainAssetsPath(chain));
export const getChainAssetFilesList = (chain: string, address: string): string[] => readDirSync(getChainAssetPath(chain, address));
export const getChainValidatorsAssets = (chain: string): string[] => readDirSync(getChainValidatorsAssetsPath(chain));

export const dappsPath: string = path.join(process.cwd(), '/dapps');

export const rootDirAllowedFiles = config.foldersRootdirAllowedFiles;
