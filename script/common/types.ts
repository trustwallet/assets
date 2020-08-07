export const isLowerCase = (str: string): boolean => str.toLowerCase() === str;
export const isUpperCase = (str: string): boolean => str.toUpperCase() === str;

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

export function findDuplicate(list: string[]): string {
    let m = new Map<string, number>();
    let duplicate: string = null;
    list.forEach(val => {
        if (m.has(val)) {
            duplicate = val;
        } else {
            m.set(val, 0);
        }
    });
    return duplicate;
}

// Check that two lists have no common elements, and no duplicates in either.
// Do a single check: checking for duplicates in the concatenated list.
export function findCommonElementOrDuplicate(list1: string[], list2: string[]): string {
    return findDuplicate(list1.concat(list2));
}

// Compare two arrays, order does not matter
export function arrayEqual(a1: any[], a2: any[]): boolean {
    if (a1.length != a2.length) {
        return false;
    }
    if (!(arrayDiff(a1, a2).length == 0)) {
        return false;
    }
    if (!(arrayDiff(a2, a1).length == 0)) {
        return false;
    }
    return true;
}
