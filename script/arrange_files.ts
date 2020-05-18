import * as fs from "fs"
const isImage = require("is-image");
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
    getRootDirFilesList,
    rootDirAllowedFiles,
    isEthereumAddress
} from "../src/test/helpers"

ethSidechains.forEach(chain => {
    const chainAssetsPath = getChainAssetsPath(chain)

    readDirSync(chainAssetsPath).forEach(async asset => {
        const assetPath = getChainAssetPath(chain, asset)
        const isDir = await isPathDir(assetPath)

        if (!isDir) {
            const checksum = toChecksum(getFileName(asset))

            if (isChecksum(checksum) && getFileExt(asset).toLocaleLowerCase() === logoExtension) {
                // Moves file like  blockchains/<chain>/assets/0x..XX.png => blockchains/<chain>/asstes/0x..XX/logo.png
                await makeDirIfDoestExist(chainAssetsPath, checksum)
                const newPath = `${chainAssetsPath}/${checksum}/${logo}`
                fs.renameSync(assetPath, newPath)
            }
        }
    })
})

// Moves assets/0xXX...XX.png => assets/blockchains/assets/0xXX...XX/logo.png
getRootDirFilesList().forEach(async file => {
    const fileName = getFileName(file)
    if(isImage(file) && !rootDirAllowedFiles.includes(file) && isEthereumAddress(fileName)) {
        console.log({file})
        const checksum =  toChecksum(fileName)
        const ethreumAssetsPath = getChainAssetsPath("ethereum")
        await makeDirIfDoestExist(ethreumAssetsPath, checksum)
        fs.renameSync(`./${file}`, `${ethreumAssetsPath}/${checksum}/${logo}`)
    }
});
