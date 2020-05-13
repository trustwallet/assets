import {
    ethSidechains,
    readDirSync,
    getChainAssetsPath,
    getChainAssetFilesList,
    isChecksum,
    toChecksum,
    getFileName,
    getFileExt,
    getMoveCommandFromTo,
    execRename,
    logoName,
    logoExtension,
    logo,
    getChainAssetPath
} from "../src/test/helpers"

ethSidechains.forEach(chain => {
    const assetsPath = getChainAssetsPath(chain)

    readDirSync(assetsPath).forEach(address => {
        getChainAssetFilesList(chain, address).forEach(file => {
            if (getFileName(file) == logoName && getFileExt(file) !== logoExtension) {
                console.log(`Renaming incorrect asset logo extension ${file} ...`)
                renameAndMove(getChainAssetPath(chain, address), file, logo)
            }
        })
        checksumAssetsFolder(assetsPath, address)
    })
})

export function checksumAssetsFolder(assetsFolderPath: string, addr: string) {
    if (!isChecksum(addr)) {
        renameAndMove(assetsFolderPath, addr, toChecksum(addr))
    }
}

export function renameAndMove(path: string, oldName: string, newName: string) {
    console.log(`   Renaming file or folder at path ${path}: ${oldName} => ${newName}`)
    execRename(path, getMoveCommandFromTo(oldName, newName))
}

