import { ethSidechains, readDirSync, getChainAssetsPath } from "../src/test/helpers"
import { checksumAssetsFolder } from './format_files_name'

ethSidechains.forEach(chain => {
    const assetsPath = getChainAssetsPath(chain) 

    readDirSync(assetsPath).forEach(addr => {
        checksumAssetsFolder(assetsPath, addr)
    })
})