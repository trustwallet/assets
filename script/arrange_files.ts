import * as fs from "fs"
import {
    ethSidechains,
    getChainAssetPath,
    getChainAssetsPath,
    getFileExt,
    getFileName,
    isChecksum,
    isPathDir,
    logo,
    logoExtension,
    makeDirIfDoestExist,
    readDirSync,
    toChecksum,
} from "../src/test/helpers"

ethSidechains.forEach(chain => {
    const assetsPath = getChainAssetsPath(chain)
    const chainAssets = readDirSync(assetsPath)

    chainAssets.forEach(async asset => {
        const assetPath = getChainAssetPath(chain, asset)
        const isDir = await isPathDir(assetPath)

        if (!isDir) {
            const assetName = getFileName(asset)
            const checksum = toChecksum(assetName)

            if (isChecksum(checksum) && getFileExt(asset).toLocaleLowerCase() === logoExtension) {
                // Moves file like  /assets/0x..XX.png => /asstes/0x..XX/logo.png
                await makeDirIfDoestExist(assetsPath, checksum)
                const newPath = `${assetsPath}/${checksum}/${logo}`
                fs.renameSync(assetPath, newPath)
            }
        }
    })
})

