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
    getChainValidatorAssetLogoPath,
    maxAssetLogoSizeInKilobyte,
    getFileSizeInKilobyte
} from "../src/test/helpers"
const sharp = require('sharp')
const bluebird = require("bluebird")
const foundChains = readDirSync(chainsFolderPath)
const tinify = require("tinify");
tinify.key = "MXxhvmhjMkMM6CVccGrfyQm2RHpTf1G7"; // Key is free to get, gives 500 uploads per month

function downsize() {
    console.log(`Start resizing`)
    bluebird.map(foundChains, async chain => {
        console.log(`Resizing assets on chain ${chain}`)
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

                // If size still > max limit, compress with tinypng
                const sizeKilobyte = getFileSizeInKilobyte(assetPath)
                if (sizeKilobyte > maxAssetLogoSizeInKilobyte) {
                    await compressTinyPNG(assetPath)
                    console.log(`Successfully resized iamge at path ${assetPath} from ${sizeKilobyte} => ${getFileSizeInKilobyte(assetPath)}`)
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
                
                // If size still > max limit, compress with tinypng
                const sizeKilobyte = getFileSizeInKilobyte(path)
                if (sizeKilobyte > maxAssetLogoSizeInKilobyte) {
                    await compressTinyPNG(path)
                }
            })
        }

        console.log(`   Resizing assets on chain ${chain} completed`)
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
        .catch(e => {
            console.log(e.message)
        })
}

export async function compressTinyPNG(path: string) {
    console.log(`Compressing image via tinypng at path ${path}`)
    const source = await tinify.fromFile(path);
    await source.toFile(path);

}