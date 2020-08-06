const bluebird = require("bluebird")
const nestedProperty = require("nested-property");
import {
    chainsFolderPath,
    getChainInfoPath,
    isChainInfoExistSync,
    writeFileSync,
    readDirSync,
    readFileSync,
    getChainAssetInfoPath,
    getChainAssetsPath,
    isPathExistsSync
} from "../src/test/helpers"
import { CoinInfoList } from "../src/test/models";

const dafaultInfoTemplate: CoinInfoList = 
{
    "name": "",
    "website": "",
    "source_code": "",
    "whitepaper": "",
    "short_description": "",
    "explorer": "",
    "socials": [
        {
            "name": "Twitter",
            "url": "",
            "handle": ""
        },
        {
            "name": "Reddit",
            "url": "",
            "handle": ""
        }
    ],
    "details": [
        {
            "language": "en",
            "description": ""
        }
    ]
}

bluebird.mapSeries(readDirSync(chainsFolderPath), (chain: string) => {
    const chainInfoPath = getChainInfoPath(chain)

    // Create intial info.json file base off template if doesn't exist
    if (!isChainInfoExistSync(chain)) {
        writeToInfo(chainInfoPath, dafaultInfoTemplate)
    }

    // const infoList: InfoList = JSON.parse(readFileSync(chainInfoPath))
    // delete infoList["data_source"]
    // const newExplorer = nestedProperty.get(infoList, "explorers")
    // console.log({newExplorer}, chain)
    // nestedProperty.set(infoList, "explorer", newExplorer)
    // delete infoList["explorers"]
    // writeToInfo(chainInfoPath, infoList)
    
    // if (isPathExistsSync(getChainAssetsPath(chain))) {
    //     readDirSync(getChainAssetsPath(chain)).forEach(asset => {
    //         const assetInfoPath = getChainAssetInfoPath(chain, asset)
    //         if (isPathExistsSync(assetInfoPath)) {
    //             const assetInfoList = JSON.parse(readFileSync(assetInfoPath))
    //             delete assetInfoList["data_source"]

    //             const newExplorers = nestedProperty.get(assetInfoList, "explorers.0.url")
    //             delete assetInfoList["explorers"]
    //             nestedProperty.set(assetInfoList, "explorer", newExplorers)

    //             writeToInfo(assetInfoPath, assetInfoList)
    //         }
    //     })
    // }
})

// Get handle from Twitter and Reddit url
export function getHandle(url: string): string {
    if (!url) return ""
    return url.slice(url.lastIndexOf("/") + 1, url.length)
}

function writeToInfo(path: string, info: CoinInfoList) {
    writeFileSync(path, JSON.stringify(info, null, 4))
}