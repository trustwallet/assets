import { ethSidechains, readDirSync, getChainAssetsPath } from "../src/test/helpers"
import { checksumAssetsFolder } from './format_files_name'

ethSidechains.forEach(chain => {
    const chainAssetsPath = getChainAssetsPath(chain) 

    readDirSync(chainAssetsPath).forEach(addr => {
        checksumAssetsFolder(chainAssetsPath, addr)
    })
})