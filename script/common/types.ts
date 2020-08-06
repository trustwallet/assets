export const mapList = arr => {
    return arr.reduce((acm, val) => {
        acm[val] = "";
        return acm;
    }, {});
}

// Sort: treat numbers as number, strings as case-insensitive
export const sortElements = (arr: any[]): any[] => {
    arr.sort((a, b) => {
        if (!isNaN(a) && !isNaN(b)) {
            // numerical comparison
            return a - b;
        }
        if ((typeof a === 'string' || a instanceof String) && (typeof b === 'string' || b instanceof String)) {
            return a.toLowerCase() > b.toLowerCase() ? 1 : -1;
        }
        return 0;
    });
    return arr;
}

export const makeUnique = (arr: any[]): any[] => Array.from(new Set(arr));

// Remove from set a elements of set b.
export function arrayDiff(a: string[], b: string[]): string[] {
    const mappedB = mapList(b);
    return a.filter(e => !mappedB.hasOwnProperty(e));
}
