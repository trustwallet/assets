import {
    getChainAssetPath,
    getChainAssetsPath,
    isPathDir,
    isPathDirEmpthy,
    readDirSync,
    removeDir,
    getAllChainsList,
} from "../src/test/helpers"

getAllChainsList().forEach(async chain => {
    const chainAssetsPath = getChainAssetsPath(chain)

    if (isPathDir(chainAssetsPath)) {
        readDirSync(chainAssetsPath).forEach(async (asset) => {
            const assetPath = getChainAssetPath(chain, asset);
            const isDir = await isPathDir(assetPath);
            const isPathEmpthy = await isPathDirEmpthy(assetPath);
    
            if (isDir && isPathEmpthy) {
                removeDir(assetPath)
                console.log(`Removed empty folder at path ${assetPath}`);
            }
        }) 
    }
})
