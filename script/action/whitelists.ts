import { chainsWithBlacklist } from "../common/blockchains";
import { getChainAssetsList, getChainWhitelistPath, getChainBlacklistPath } from "../common/repo-structure";
import { readFileSync, writeFileSync } from "../common/filesystem";
import { sortElements, makeUnique, arrayDiff } from "../common/types";
import { ActionInterface } from "./interface";

function formatWhiteBlackList() {
    chainsWithBlacklist.forEach(async chain => {
        const assets = getChainAssetsList(chain);
    
        const whitelistPath = getChainWhitelistPath(chain);
        const blacklistPath = getChainBlacklistPath(chain);

        const currentWhitelist = JSON.parse(readFileSync(whitelistPath));
        const currentBlacklist = JSON.parse(readFileSync(blacklistPath));
    
        let newBlackList = [];
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
     
        const removedAssets = arrayDiff(currentWhitelist, assets);
        newBlackList = currentBlacklist.concat(removedAssets);
    
        writeFileSync(whitelistPath, JSON.stringify(sortElements(assets), null, 4));
        writeFileSync(blacklistPath, JSON.stringify(makeUnique(sortElements(newBlackList)), null, 4));
        console.log(`Updated white and blacklists for chain ${chain}`);
    })
}

export class Whitelist implements ActionInterface {
    getName(): string { return "Whitelists"; }
    check = null;
    async fix(): Promise<void> {
        formatWhiteBlackList();
    }
    update = null;
}
