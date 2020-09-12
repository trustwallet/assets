import * as fs from "fs"
const isImage = require("is-image");
import { rootDirAllowedFiles } from "../script/common/repo-structure";
import { ethForkChains, Ethereum } from "../script/common/blockchains";
import {
    getFileExt,
    getFileName
} from "../script/common/filesystem";
import {
    chainsFolderPath,
    getChainAssetPath,
    getChainAssetsPath,
    getChainPath,
    getRootDirFilesList,
    logo,
    logoExtension,
    readDirSync,
    isDirContainLogo
} from "./helpers"
import { isEthereumAddress, toChecksum, isChecksum } from "../script/common/eth-web3";

async function makeDirIfDoestExist(dirPath: string, dirName: string) {
    const path = `${dirPath}/${dirName}`
    await fs.mkdir(path, {recursive: true}, (err) => {
        if (err) {
            console.error(`Error creating dir at path ${path} with result ${err}`)
        } else {
            console.log(`Created direcotry at ${path}`)
        }
    })
}

function isPathDir(path: string): boolean {
    try {
        return fs.lstatSync(path).isDirectory()
    } catch (e) {
        console.log(`Path: ${path} is not a directory with error: ${e.message}`)
        return false
    }
}

ethForkChains.forEach(chain => {
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


