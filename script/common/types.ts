export const isLowerCase = (str: string): boolean => str.toLowerCase() === str;
export const isUpperCase = (str: string): boolean => str.toUpperCase() === str;

export const mapList = arr => {
    return arr.reduce((acm, val) => {
        acm[val] = "";
        return acm;
    }, {});
}

export function mapListTolower(arr: string[]): {} {
    return arr.reduce((acm, val) => {
        acm[val.toLowerCase()] = "";
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

// Remove from set A elements of set B.
export function arrayDiff(a: string[], b: string[]): string[] {
    const mappedB = mapList(b);
    return a.filter(e => !mappedB.hasOwnProperty(e));
}

// Remove from set A elements of set B, case insensitive
export function arrayDiffNocase(a: string[], b: string[]): string[] {
    const mappedB = mapListTolower(b);
    return a.filter(e => !mappedB.hasOwnProperty(e.toLowerCase()));
}

export function findDuplicates(list: string[]): string[] {
    let m = new Map<string, number>();
    let duplicates: string[] = [];
    list.forEach(val => {
        if (m.has(val.toLowerCase())) {
            duplicates.push(val);
        } else {
            m.set(val.toLowerCase(), 0);
        }
    });
    return makeUnique(duplicates);
}

// Check that two lists have no common elements, and no duplicates in either.
// Do a single check: checking for duplicates in the concatenated list.
export function findCommonElementsOrDuplicates(list1: string[], list2: string[]): string[] {
    return findDuplicates(list1.concat(list2));
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

export function reverseCase(s: string): string {
    const n = s.length;
    var out: string = "";
    for (var i = 0; i < n; ++i) {
        const c = s[i];
        if (isLowerCase(c)) {
            out += c.toUpperCase();
        } else if (isUpperCase(s[i])) {
            out += c.toLowerCase();
        } else {
            out += c;
        }
    }
    return out;
}
