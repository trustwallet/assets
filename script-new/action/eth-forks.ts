import { ethForkChains } from "../common/blockchains";
import { getChainAssetsList, getChainAssetInfoPath, isChainAssetInfoExistSync } from "../common/repo-structure";
import { formatJsonFile } from "../common/json";

function formatInfos() {
    console.log(`Formatting info files...`);
    ethForkChains.forEach(chain => {
        let count: number = 0;
        const chainAssets = getChainAssetsList(chain);
        chainAssets.forEach(address => {
            if (isChainAssetInfoExistSync(chain, address)) {
                const chainAssetInfoPath = getChainAssetInfoPath(chain, address);
                formatJsonFile(chainAssetInfoPath, true);
                ++count;
            }
        })
        console.log(`Formatted ${count} info files for chain ${chain} (total ${chainAssets.length})`);
    })
}

export async function fix() {
    formatInfos();
}
