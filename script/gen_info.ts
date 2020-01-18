const bluebird = require("bluebird")
import {
    chainsFolderPath,
    getChainInfoPath,
    isChainInfoExistSync,
    writeFileSync,
    readDirSync
} from "../src/test/helpers"

const dafaultInfoTemplate = 
{
    "name": "",
    "website": "",
    "source_code": "",
    "whitepaper": "",
    "explorers": [
        {
            "name": "",
            "url": ""
        }
    ],
    "socials": [
        {
            "name": "Twitter",
            "url": ""
        },
        {
            "name": "Reddit",
            "url": ""
        }
    ],
    "details": [
        {
            "language": "en",
            "description": ""
        }
    ],
    "data_source": "crowd"
}

bluebird.mapSeries(readDirSync(chainsFolderPath), (chain: string) => {
    const chainInfoPath = getChainInfoPath(chain)

    // Create intial info.json file if doesn't exist
    if (isChainInfoExistSync(chain)) {
        writeFileSync(chainInfoPath, JSON.stringify(dafaultInfoTemplate, null, 4))
    }

    // const infoList = JSON.parse(readFileSync(chainInfoPath))
})