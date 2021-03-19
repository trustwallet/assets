import { readJsonFile } from "../generic/json";

const tags: any = readJsonFile("script/tags.json") as any;

export function isValidTagValue(value: string): boolean {
    //console.log(`isValidTagValue ${value}`);
    if (!value) {
        return false;
    }
    if (!(value in tags)) {
        return false;
    }
    //console.log(`TAG ${tags[value]['name']}`);
    return true;
}

export function isValidTagValues(values: string[]): boolean {
    return values.reduce((accum: boolean, value: string) => accum && isValidTagValue(value), true);
}
