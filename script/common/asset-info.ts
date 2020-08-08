import { getChainAssetInfoPath } from "./repo-structure";
import { readFileSync, isPathExistsSync } from "./filesystem";
import { arrayDiff } from "./types";
import { isValidJSON } from "../common/json";

const requiredKeys = ["explorer", "name", "website", "short_description"];

function isAssetInfoHasAllKeys(path: string): [boolean, string] {
    const info = JSON.parse(readFileSync(path));
    const infoKeys = Object.keys(info);

    const hasAllKeys = requiredKeys.every(k => info.hasOwnProperty(k));

    if (!hasAllKeys) {
        return [false, `Info at path '${path}' missing next key(s): ${arrayDiff(requiredKeys, infoKeys)}`];
    }

    const isKeysCorrentType = 
        typeof info.explorer === "string" && info.explorer != ""
        && typeof info.name === "string" && info.name != ""
        && typeof info.website === "string"
        && typeof info.short_description === "string";
    
    return [isKeysCorrentType, `Check keys '${requiredKeys}' vs. '${infoKeys}'`];
}

export function isAssetInfoOK(chain: string, address: string): [boolean, string] {
    const assetInfoPath = getChainAssetInfoPath(chain, address);
    if (!isPathExistsSync(assetInfoPath)) {
        return [true, `Info file doesn't exist, no need to check`]
    }

    if (!isValidJSON(assetInfoPath)) {
        console.log(`JSON at path: '${assetInfoPath}' is invalid`);
        return [false, `JSON at path: '${assetInfoPath}' is invalid`];
    }

    const [hasAllKeys, msg] = isAssetInfoHasAllKeys(assetInfoPath);
    if (!hasAllKeys) {
        console.log(msg);
        return [false, msg];
    }

    return [true, ''];
}
