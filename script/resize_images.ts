import { 
    maxLogoWidth,
    maxLogoHeight,
    readDirSync,
    chainsFolderPath,
    getChainLogoPath,
    calculateAspectRatioFit,
    getImageDimentions,
    getChainAssetsPath,
    getChainAssetLogoPath,
    isPathExistsSync,
    writeFileSync,
    readFileSync,
    getChainValidatorsListPath,
    getChainValidatorAssetLogoPath
} from "../src/test/helpers"
const sharp = require('sharp')
const bluebird = require("bluebird")
const foundChains = readDirSync(chainsFolderPath)

function downsize() {
    console.log(`Start resizing`)
    bluebird.mapSeries(foundChains, async chain => {
        const chainLogoPath = getChainLogoPath(chain)
        const { width: srcWidth, heigth: srcHeight } = getImageDimentions(chainLogoPath)
        
        // Check and resize if needed chain logo
        if (isDownsizing(srcWidth, srcHeight)) {
            await resize(srcWidth, srcHeight, chainLogoPath)
        }
        
        // Check and resize if needed chain assets
        const assetsPath = getChainAssetsPath(chain)
        if (isPathExistsSync(assetsPath)) {
            bluebird.mapSeries(readDirSync(assetsPath), async asset => {
                const assetPath = getChainAssetLogoPath(chain, asset)
                const { width: srcWidth, height: srcHeight } = getImageDimentions(assetPath)
                if (isDownsizing(srcWidth, srcHeight)) {
                    await resize(srcWidth, srcHeight, assetPath)
                }
            })
        }

        // Check and resize if needed chain validators image
        const chainValidatorsList = getChainValidatorsListPath(chain)
        if (isPathExistsSync(chainValidatorsList)) {
            const validatorsList = JSON.parse(readFileSync(getChainValidatorsListPath(chain)))
            bluebird.mapSeries(validatorsList, async ({ id }) => {
                const path = getChainValidatorAssetLogoPath(chain, id)
                const { width: srcWidth, height: srcHeight } = getImageDimentions(path)
                    if (isDownsizing(srcWidth, srcHeight)) {
                        await resize(srcWidth, srcHeight, path)
                    }
            })
        }
    })
}

downsize()

function isDownsizing(srcWidth: number, srcHeight: number): boolean {
    return (srcWidth > maxLogoWidth) || (srcHeight > maxLogoHeight)
}

async function resize(srcWidth: number, srcHeight: number, path: string) {
    const { width, height } = calculateAspectRatioFit(srcWidth, srcHeight, maxLogoWidth, maxLogoHeight)
    console.log(`   Resizing image at ${path} from ${srcWidth}x${srcHeight} => ${width}x${height}`)
    await sharp(path).resize(width, height).toBuffer()
        .then(data => writeFileSync(path, data))
        .catch(e => console.log(e))
}