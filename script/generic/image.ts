import * as sharp from "sharp";
import * as tinify from "tinify";
import * as image_size from "image-size";
import {
    writeFileSync,
    getFileSizeInKilobyte
} from "./filesystem";
import * as chalk from 'chalk';
import * as config from "../config";

export const minLogoWidth = config.imageMinLogoWidth;
export const minLogoHeight = config.imageMinLogoHeight;
export const maxLogoWidth = config.imageMaxLogoWidth;
export const maxLogoHeight = config.imageMaxLogoHeight;
export const maxLogoSizeInKilobyte = config.imageMaxLogoSizeKb;

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

// check logo dimensions (pixel) and size (kilobytes)
export async function isLogoOK(path: string): Promise<[boolean, string]> {
    let [isOK, msg] = await isLogoDimensionOK(path);
    if (!isOK) {
        return [false, msg];
    }
    [isOK, msg] = await isLogoSizeOK(path);
    if (!isOK) {
        return [false, msg];
    }
    return [true, ""];
}

const getImageDimensions = (path: string) => image_size.imageSize(path);

async function isLogoDimensionOK(path: string): Promise<[boolean,  string]> {
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

async function isLogoSizeOK(path: string): Promise<[boolean, string]> {
    const sizeKilobyte = getFileSizeInKilobyte(path);
    if (sizeKilobyte > maxLogoSizeInKilobyte) {
        return [false, `Logo ${path} is too large, ${sizeKilobyte} kB instead of ${maxLogoSizeInKilobyte}`];
    }
    return [true, ''];
}

// return if image if too large, and if image has been updated
export async function checkResizeIfTooLarge(path: string, checkOnly: boolean): Promise<[boolean, boolean]> {
    let tooLarge = false;
    let updated = false;

    const { width: srcWidth, height: srcHeight } = getImageDimensions(path);

    if (!isDimensionOK(srcWidth, srcHeight)) {
        tooLarge = true; // may be too small as well
        console.log(`Wrong image dimensions, ${srcWidth}x${srcHeight}, ${path}`);
    }

    if (isDimensionTooLarge(srcWidth, srcHeight)) {
        tooLarge = true;
        console.log(`Image too large, ${srcWidth}x${srcHeight}, ${path}`);
        if (!checkOnly) {
            // resize
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
    }

    // If file size > max limit, compress with tinypng
    const sizeKilobyte = getFileSizeInKilobyte(path);
    if (sizeKilobyte > maxLogoSizeInKilobyte) {
        tooLarge = true;
        console.log(`Image too big, ${sizeKilobyte} kb, ${path}`);
        if (!checkOnly) {
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
    }

   return [tooLarge, updated];
}
