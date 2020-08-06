import * as fs from "fs"
const isImage = require("is-image");
import {
    Ethereum,
    chainsFolderPath,
    ethSidechains,
    getChainAssetPath,
    getChainAssetsPath,
    getChainPath,
    getFileExt,
    getFileName,
    getRootDirFilesList,
    isChecksum,
    isEthereumAddress,
    isPathDir,
    logo,
    logoExtension,
    makeDirIfDoestExist,
    readDirSync,
    rootDirAllowedFiles,
    toChecksum,
    isDirContainLogo
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

readDirSync(chainsFolderPath).forEach(async chainDir => {
    const chainPath = getChainPath(chainDir)
    const isDir = isPathDir(chainPath)
    const ethereumAssetsPath = getChainAssetsPath(Ethereum)

    // Moves blockchains/0xXX...XX.png => assets/blockchains/ethereum/0xXX...XX/logo.png
    if (!isDir) {
        const checksum = toChecksum(getFileName(chainDir))
    
        if (isChecksum(checksum) && getFileExt(chainDir).toLocaleLowerCase() === logoExtension) {
            await makeDirIfDoestExist(ethereumAssetsPath, checksum)
            const newPath = `${ethereumAssetsPath}/${checksum}/${logo}`
            fs.renameSync(chainPath, newPath)
        }
    }

    // Moves blockchains/0xXX...XX/logo.png => assets/blockchains/ethereum/0xXX...XX/logo.png
    if (isDir && isDirContainLogo(chainPath)) {
        const checksum = toChecksum(getFileName(chainDir))
        await makeDirIfDoestExist(ethereumAssetsPath, checksum)
        const newPath = `${ethereumAssetsPath}/${checksum}`
        fs.renameSync(chainPath, newPath)
    }
})


