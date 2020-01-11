const fs = require('fs')
import { getOpenseaCollectionAddresses } from "./opesea_contrats"

import {
    Ethereum, Classic, POA, TomoChain, GoChain, Wanchain, ThunderCore, Terra,
    getChainAssetsPath,
    readDirSync,
    readFileSync,
    isChainWhitelistExistSync,
    isChainBlacklistExistSync,
    getChainWhitelistPath,
    getChainBlacklistPath,
    writeFileSync,
    sortDesc,
    getUnique,
    mapList
} from '../src/test/helpers'

const assetsChains = [Ethereum, Classic, POA, TomoChain, GoChain, Wanchain, ThunderCore, Terra]

assetsChains.forEach(async chain => {
    const assets = readDirSync(getChainAssetsPath(chain))

    const whitelistPath = getChainWhitelistPath(chain)
    const blacklistPath = getChainBlacklistPath(chain)

    //Create inital lists if they do not exists 
    if (!isChainWhitelistExistSync(chain)) {
        writeFileSync(whitelistPath, `[]`)
    }

    if (!isChainBlacklistExistSync(chain)) {
        writeFileSync(blacklistPath, `[]`)
    }

    const currentWhitelist = JSON.parse(readFileSync(whitelistPath))
    const currentBlacklist = JSON.parse(readFileSync(blacklistPath))

    let newBlackList = []
    // Some chains required pulling lists from other sources
    switch (chain) {
        case Ethereum:
            const nftList = await getOpenseaCollectionAddresses()
            newBlackList = currentBlacklist.concat(nftList)
            break;
        default:
            newBlackList = newBlackList.concat(currentBlacklist)
            break;
    }
 
    const removedAssets = getRemovedAddressesFromAssets(assets, currentWhitelist)
    newBlackList = newBlackList.concat(removedAssets)

    fs.writeFileSync(whitelistPath, JSON.stringify(sortDesc(assets), null, 4))
    fs.writeFileSync(blacklistPath, JSON.stringify(getUnique(sortDesc(newBlackList)), null, 4))
})

function getRemovedAddressesFromAssets(assets: string[], whiteList: string[]): string[] {
    const mappedAssets = mapList(assets)
    const removed = whiteList.filter(a => !mappedAssets.hasOwnProperty(a))
    return removed
}
