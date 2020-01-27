const bluebird = require("bluebird")
const nestedProperty = require("nested-property");
import {
    chainsFolderPath,
    getChainInfoPath,
    isChainInfoExistSync,
    writeFileSync,
    readDirSync,
    readFileSync
} from "../src/test/helpers"
import { InfoList } from "../src/test/models";

const dafaultInfoTemplate: InfoList = 
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
            "url": "",
            "username": ""
        },
        {
            "name": "Reddit",
            "url": "",
            "username": ""
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

    // Create intial info.json file base off template if doesn't exist
    if (!isChainInfoExistSync(chain)) {
        writeToInfo(chainInfoPath, dafaultInfoTemplate)
    }

    const infoList: InfoList = JSON.parse(readFileSync(chainInfoPath))

    // Add "username" property to each social element
    let newSocials = []
    infoList.socials.forEach(social => {
        const usernameProp = "username"
        if (!nestedProperty.isIn(social, usernameProp, { own: true})) {
            nestedProperty.set(social, usernameProp, infoList.name)
            newSocials.push(social)
        }
    })
    nestedProperty.set(infoList, "socials", newSocials)
    writeToInfo(chainInfoPath, infoList)
})

function writeToInfo(path: string, info: InfoList) {
    writeFileSync(path, JSON.stringify(info, null, 4))
}