export const isLowerCase = (str: string): boolean => str.toLowerCase() === str;
export const isUpperCase = (str: string): boolean => str.toUpperCase() === str;

// Sort: treat numbers as number, strings as case-insensitive
export function sortElements (arr: unknown[]): unknown[] {
    arr.sort((a, b) => {
        if (typeof a === "number" && typeof b == "number") {
            // numerical comparison
            return a - b;
        }
        if ((typeof a === 'string' || a instanceof String) && (typeof b === 'string' || b instanceof String)) {
            if (!isNaN(Number(a)) && !isNaN(Number(b))) {
                // numerical comparison
                return Number(a) - Number(b);
            }
            return a.toLowerCase() > b.toLowerCase() ? 1 : -1;
        }
        return 0;
    });
    return arr;
}

export function makeUnique(arr: string[]): string[] {
    return Array.from(new Set(arr));
}

// Remove from set A elements of set B.
export function arrayDiff(a: string[], b: string[]): string[] {
    const setB = new Set(b);
    return a.filter(e => !setB.has(e));
}

// Remove from set A elements of set B, case insensitive
export function arrayDiffNocase(a: string[], b: string[]): string[] {
    const setB = new Set(b.map(e => e.toLowerCase()));
    return a.filter(e => !setB.has(e.toLowerCase()));
}

export function findDuplicates(list: string[]): string[] {
    const m = new Map<string, number>();
    const duplicates: string[] = [];
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
export function arrayEqual(a1: string[], a2: string[]): boolean {
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
    let out = "";
    for (let i = 0; i < n; ++i) {
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
