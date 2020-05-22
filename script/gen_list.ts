const fs = require('fs')
import { getOpenseaCollectionAddresses } from "./opesea_contrats"

import {
    Ethereum, Terra, Tron,
    getChainAssetInfoPath,
    getChainAssetsList,
    ethSidechains,
    getChainBlacklistPath,
    getChainValidatorsListPath,
    getChainWhitelistPath,
    getUnique,
    isChainAssetInfoExistSync,
    isChainBlacklistExistSync,
    isChainWhitelistExistSync,
    mapList,
    readFileSync,
    sortDesc,
    stakingChains,
    writeFileSync,
} from '../src/test/helpers'

formatWhiteBlackList()
formatValidators()
formatInfo()

function formatWhiteBlackList() {
    ethSidechains.concat(Tron, Terra).forEach(async chain => {
        const assets = getChainAssetsList(chain)
    
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
        // switch (chain) {
        //     case Ethereum:
        //         const nftList = await getOpenseaCollectionAddresses()
        //         newBlackList = currentBlacklist.concat(nftList)
        //         break;
        //     default:
        //         newBlackList = newBlackList.concat(currentBlacklist)
        //         break;
        // }
     
        const removedAssets = getRemovedAddressesFromAssets(assets, currentWhitelist)
        newBlackList = currentBlacklist.concat(removedAssets)
    
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

function formatInfo() {
    ethSidechains.forEach(chain => {
        const chainAssets = getChainAssetsList(chain)
        chainAssets.forEach(address => {
            if (isChainAssetInfoExistSync(chain, address)) {
                const chainAssetInfoPath = getChainAssetInfoPath(chain, address)
                const currentAssetInfo = JSON.parse(readFileSync(chainAssetInfoPath))
                fs.writeFileSync(chainAssetInfoPath, JSON.stringify(currentAssetInfo, null, 4))
            }
        })
    })
}

function getRemovedAddressesFromAssets(assets: string[], whiteList: string[]): string[] {
    const mappedAssets = mapList(assets)
    const removed = whiteList.filter(a => !mappedAssets.hasOwnProperty(a))
    return removed
}
