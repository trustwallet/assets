import {
    chainsFolderPath,
    findFiles,
    findDuplicate,
    findCommonElementOrDuplicate,
    isValidJSON,
    pricingFolderPath,
} from "./helpers"
import { getHandle } from "../../script-old/gen_info";

import {
    isChecksum,
    toChecksum
} from "../../script/common/eth-web3";
import {
    isDimensionTooLarge,
    isDimensionOK,
    calculateTargetSize
} from "../../script/common/image";
import {
    mapList,
    sortElements,
    makeUnique,
    arrayDiff
} from "../../script/common/types";
import { findImagesToFetch } from "../../script/action/binance";

describe("Test all JSON files to have valid content", () => {
    const files = [
        ...findFiles(chainsFolderPath, 'json'),
        ...findFiles(pricingFolderPath, 'json')
    ]

    files.forEach(file => { 
        expect(isValidJSON(file), `${file} path contains invalid JSON`).toBe(true)
    });
})

describe("Test helper functions", () => {
    test(`Test getHandle`, () => {
        const urls = [
            {
                url: "https://twitter.com/aeternity",
                expected: "aeternity"
            },
            {
                url: "https://www.reddit.com/r/Aeternity",
                expected: "Aeternity"
            }
        ]

        urls.forEach(u => {
            expect(getHandle(u.url), `Getting handle from url ${u}`).toBe(u.expected)
        })
    })

    test(`Test findDuplicate`, () => {
        expect(findDuplicate(["a", "bb", "ccc"]), `No duplicates`).toBe(null)
        expect(findDuplicate(["a", "bb", "ccc", "bb"]), `One double duplicate`).toBe("bb")
        expect(findDuplicate([]), `Empty array`).toBe(null)
        expect(findDuplicate(["a"]), `One element`).toBe(null)
        expect(findDuplicate(["a", "bb", "ccc", "bb", "d", "bb"]), `One trip[le duplicate`).toBe("bb")
        expect(findDuplicate(["a", "bb", "ccc", "bb", "a"]), `Two double duplicates`).toBe("a")
    })

    test(`Test findCommonElementOrDuplicate`, () => {
        expect(findCommonElementOrDuplicate(["a", "bb", "ccc"], ["1", "22", "333"]), `No intersection or duplicates`).toBe(null)
        expect(findCommonElementOrDuplicate(["a", "bb", "ccc"], ["1", "bb", "333"]), `Common element`).toBe("bb")
        expect(findCommonElementOrDuplicate(["a", "bb", "ccc", "bb"], ["1", "22", "333"]), `Duplicate in first`).toBe("bb")
        expect(findCommonElementOrDuplicate(["a", "bb", "ccc"], ["1", "22", "333", "22"]), `Duplicate in second`).toBe("22")
        expect(findCommonElementOrDuplicate(["a", "bb", "ccc", "1", "bb"], ["1", "22", "333", "22"]), `Intersection and duplicates`).toBe("22")
        expect(findCommonElementOrDuplicate([], []), `Empty lists`).toBe(null)
    })
});

describe("Test eth-web3 helpers", () => {
    test(`Test isChecksum`, () => {
        expect(isChecksum("0x7Bb09bC8aDE747178e95B1D035ecBeEBbB18cFee"), `checksum`).toBe(true);
        expect(isChecksum("0x7bb09bc8ade747178e95b1d035ecbeebbb18cfee"), `lowercase`).toBe(false);
        expect(isChecksum("0x7Bb09bC8aDE747178e95B1D035ecBe"), `too short`).toBe(false);
    });
    test(`Test toChecksum`, () => {
        expect(toChecksum("0x7bb09bc8ade747178e95b1d035ecbeebbb18cfee"), `from lowercase`).toEqual("0x7Bb09bC8aDE747178e95B1D035ecBeEBbB18cFee");
        expect(toChecksum("0x7Bb09bC8aDE747178e95B1D035ecBeEBbB18cFee"), `from checksum`).toEqual("0x7Bb09bC8aDE747178e95B1D035ecBeEBbB18cFee");
    });
});

describe("Test image helpers", () => {
    test(`Test isDimensionTooLarge`, () => {
        expect(isDimensionTooLarge(256, 256), `256x256`).toBe(false);
        expect(isDimensionTooLarge(64, 64), `64x64`).toBe(false);
        expect(isDimensionTooLarge(800, 800), `800x800`).toBe(true);
        expect(isDimensionTooLarge(256, 800), `256x800`).toBe(true);
        expect(isDimensionTooLarge(800, 256), `800x256`).toBe(true);
    });
    test(`Test isDimensionOK`, () => {
        expect(isDimensionOK(256, 256), `256x256`).toBe(true);
        expect(isDimensionOK(64, 64), `64x64`).toBe(true);
        expect(isDimensionOK(800, 800), `800x800`).toBe(false);
        expect(isDimensionOK(256, 800), `256x800`).toBe(false);
        expect(isDimensionOK(800, 256), `800x256`).toBe(false);
        expect(isDimensionOK(60, 60), `60x60`).toBe(false);
        expect(isDimensionOK(64, 60), `64x60`).toBe(false);
        expect(isDimensionOK(60, 64), `60x64`).toBe(false);
    });
    test(`Test calculateReducedSize`, () => {
        expect(calculateTargetSize(256, 256, 512, 512), `small 1.0`).toEqual({width: 512, height: 512});
        expect(calculateTargetSize(800, 800, 512, 512), `large 1.0`).toEqual({width: 512, height: 512});
        expect(calculateTargetSize(200, 100, 512, 512), `small 2.0`).toEqual({width: 512, height: 256});
        expect(calculateTargetSize(100, 200, 512, 512), `small 0.5`).toEqual({width: 256, height: 512});
        expect(calculateTargetSize(1200, 600, 512, 512), `small 2.0`).toEqual({width: 512, height: 256});
        expect(calculateTargetSize(600, 1200, 512, 512), `small 0.5`).toEqual({width: 256, height: 512});
        expect(calculateTargetSize(256, 0, 512, 512), `zero`).toEqual({width: 512, height: 512});
    });
});

describe("Test type helpers", () => {
    test(`Test mapList`, () => {
        expect(mapList(["a", "b", "c"]), `3 elems`).toEqual({"a": "", "b":"", "c": ""});
    });
    test(`Test sortElements`, () => {
        expect(sortElements(["c", "a", "b"]), `3 elems`).toEqual(["a", "b", "c"]);
        expect(sortElements(["C", "a", "b"]), `mixed case`).toEqual(["a", "b", "C"]);
        expect(sortElements(["1", "2", "11"]), `numerical`).toEqual(["1", "2", "11"]);
        expect(sortElements(["C", "a", "1", "b", "2", "11"]), `complex`).toEqual(["1", "2", "11", "a", "b", "C"]);
    });
    test(`Test makeUnique`, () => {
        expect(makeUnique(["a", "b", "c", "b"]), `4 elems with 1 duplicate`).toEqual(["a", "b", "c"]);
    });
    test(`Test arrayDiff`, () => {
        expect(arrayDiff(["a", "b", "c"], ["c"]), `4 elems with 1 duplicate`).toEqual(["a", "b"]);
    });
});

describe("Test action binance", () => {
    test(`Test findImagesToFetch`, () => {
        const assetsInfoListNonexisting: any[] = [{asset: "A1", assetImg: "imgurl1"}, {asset: "A2", assetImg: "imgurl2"}];
        const assetsInfoListExisting: any[] = [{asset: "BUSD-BD1", assetImg: "imgurlBUSD"}, {asset: "ETH-1C9", assetImg: "imgurlETH"}];
        const blackListEmpty: string[] = [];
        const blackListA1: string[] = ["A1"];
        expect(findImagesToFetch(assetsInfoListNonexisting, blackListEmpty), `2 nonexisting`).toEqual(assetsInfoListNonexisting);
        expect(findImagesToFetch(assetsInfoListNonexisting, blackListA1), `2 nonexisting with 1 blacklisted`).toEqual([{asset: "A2", assetImg: "imgurl2"}]);
        expect(findImagesToFetch(assetsInfoListExisting, blackListEmpty), `2 existing`).toEqual([]);
        expect(findImagesToFetch([], []), `empty`).toEqual([]);
    });
});
