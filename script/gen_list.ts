const fs = require('fs')
import { getOpenseaCollectionAddresses } from "./opesea_contrats"

import {
    Ethereum, Terra, Tron,
    getChainAssetsPath,
    ethSidechains,
    readDirSync,
    readFileSync,
    isChainWhitelistExistSync,
    isChainBlacklistExistSync,
    getChainWhitelistPath,
    getChainBlacklistPath,
    getChainValidatorsListPath,
    writeFileSync,
    sortDesc,
    getUnique,
    mapList,
    stakingChains
} from '../src/test/helpers'

formatWhiteBlackList()
formatValidators()

function formatWhiteBlackList() {
    ethSidechains.forEach(async chain => {
        const assets = readDirSync(getChainAssetsPath(chain))
    
        const whitelistPath = getChainWhitelistPath(chain)
        const blacklistPath = getChainBlacklistPath(chain)
        const validatorsPath = getChainValidatorsListPath(chain)
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
}

function formatValidators() {
    stakingChains.forEach(chain => {    
        const validatorsPath = getChainValidatorsListPath(chain)
        const currentValidatorsList = JSON.parse(readFileSync(validatorsPath))

        fs.writeFileSync(validatorsPath, JSON.stringify(currentValidatorsList, null, 4))
    })
}

function getRemovedAddressesFromAssets(assets: string[], whiteList: string[]): string[] {
    const mappedAssets = mapList(assets)
    const removed = whiteList.filter(a => !mappedAssets.hasOwnProperty(a))
    return removed
}
