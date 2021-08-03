import { TagValues } from "../tags-config";

export function isValidTagValue(value: string): boolean {
    //console.log(`isValidTagValue ${value}`);
    if (!value) {
        return false;
    }
    const tag = TagValues.find(t => t.id === value);
    if (!tag) {
        return false;
    }
    //console.log(`TAG ${tag.name}`);
    return true;
}

export function isValidTagValues(values: string[]): boolean {
    return values.reduce((accum: boolean, value: string) => accum && isValidTagValue(value), true);
}
