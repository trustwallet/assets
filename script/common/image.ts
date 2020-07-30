import * as sharp from "sharp";
import * as tinify from "tinify";
import * as image_size from "image-size";
import {
    writeFileSync,
    getFileSizeInKilobyte
} from "./filesystem";
import * as chalk from 'chalk';
import * as config from "../common/config";

export const minLogoWidth = config.getConfig("image_min_logo_width", 64);
export const minLogoHeight = config.getConfig("image_min_logo_height", 64);
export const maxLogoWidth = config.getConfig("image_max_logo_width", 512);
export const maxLogoHeight = config.getConfig("image_max_logo_height", 512);
export const maxLogoSizeInKilobyte = config.getConfig("image_logo_size_kb", 100);

export function isDimensionTooLarge(width: number, height: number): boolean {
    return (width > maxLogoWidth) || (height > maxLogoHeight);
}

export function isDimensionOK(width: number, height: number): boolean {
    return (width <= maxLogoWidth) && (height <= maxLogoHeight) &&
        (width >= minLogoWidth) && (height >= minLogoHeight);
}

export function calculateTargetSize(srcWidth: number, srcHeight: number, targetWidth: number, targetHeight: number): {width: number, height: number} {
    if (srcWidth == 0 || srcHeight == 0) {
        return {width: targetWidth, height: targetHeight};
    }
    const ratio = Math.min(targetWidth / srcWidth, targetHeight / srcHeight);
    return {
        width: Math.round(srcWidth * ratio),
        height: Math.round(srcHeight * ratio)
    };
}

const getImageDimensions = (path: string) => image_size.imageSize(path);

export function isLogoDimensionOK(path: string): [boolean,  string] {
    const { width, height } =  getImageDimensions(path)
    if (isDimensionOK(width, height)) {
        return [true, ""];
    }
    return [false, `Image at path ${path} must have dimensions: min: ${minLogoWidth}x${minLogoHeight} and max: ${maxLogoWidth}x${maxLogoHeight} instead ${width}x${height}`];
}

async function compressTinyPNG(path: string) {
    console.log(`Compressing image via tinypng at path ${path}`);
    const source = await tinify.fromFile(path);
    await source.toFile(path);
}

// return true if image updated
export async function resizeIfTooLarge(path: string): Promise<boolean> {
    let updated: boolean = false;
    
    const { width: srcWidth, height: srcHeight } = getImageDimensions(path);
    if (isDimensionTooLarge(srcWidth, srcHeight)) {
        const { width, height } = calculateTargetSize(srcWidth, srcHeight, maxLogoWidth, maxLogoHeight);
        console.log(`Resizing image at ${path} from ${srcWidth}x${srcHeight} => ${width}x${height}`)
        await sharp(path).resize(width, height).toBuffer()
            .then(data => {
                writeFileSync(path, data);
                updated = true;
            })
            .catch(e => {
                console.log(chalk.red(e.message));
            });
    }

    // If file size > max limit, compress with tinypng
    const sizeKilobyte = getFileSizeInKilobyte(path);
    if (sizeKilobyte > maxLogoSizeInKilobyte) {
        console.log(`Resizing image at path ${path} from ${sizeKilobyte} kB`);
        await compressTinyPNG(path)
            .then(() => {
                updated = true;
                console.log(`Resized image at path ${path} from ${sizeKilobyte} kB => ${getFileSizeInKilobyte(path)} kB`);
            })
            .catch(e => {
                console.log(chalk.red(e.message));
            });
    }

   return updated;
}
