import {
    findDuplicates,
    findCommonElementsOrDuplicates,
} from "../script/generic/types";
import {
    isChecksum,
    toChecksum,
    isEthereumAddress
} from "../script/generic/eth-address";
import {
    isDimensionTooLarge,
    isDimensionOK,
    calculateTargetSize
} from "../script/generic/image";
import {
    sortElements,
    makeUnique,
    arrayDiff,
    arrayDiffNocase,
    arrayEqual,
    reverseCase
} from "../script/generic/types";
import {
    BinanceTokenInfo,
    findImagesToFetch
} from "../script/blockchain/binance";
import { isValidStatusValue } from "../script/generic/status-values";
import { isValidTagValue, isValidTagValues } from "../script/generic/tag-values";

describe("Test eth-address helpers", () => {
    test(`Test isChecksum`, () => {
        expect(isChecksum("0x7Bb09bC8aDE747178e95B1D035ecBeEBbB18cFee", "ethereum"), `checksum`).toBe(true);
        expect(isChecksum("0x7bb09bc8ade747178e95b1d035ecbeebbb18cfee", "ethereum"), `lowercase`).toBe(false);
        expect(isChecksum("0x7Bb09bC8aDE747178e95B1D035ecBe", "ethereum"), `too short`).toBe(false);
        expect(isChecksum("7Bb09bC8aDE747178e95B1D035ecBeEBbB18cFee", "ethereum"), `checksum, no prefix`).toBe(true);
        expect(isChecksum("7bb09bc8ade747178e95b1d035ecbeebbb18cfee", "ethereum"), `lowercase, no prefix`).toBe(false);
        expect(isChecksum("0x7Bb09bC8aDE747178e95B1D035ecBeEBbB18cFee", "wanchain"), `wanchain wrong checksum`).toBe(false);
        expect(isChecksum("0x7bb09bc8ade747178e95b1d035ecbeebbb18cfee", "wanchain"), `wanchain lowercase`).toBe(false);
        expect(isChecksum("0x7bB09Bc8Ade747178E95b1d035ECbEebBb18CfEE", "wanchain"), `wanchain checksum`).toBe(true);
    });
    test(`Test toChecksum`, () => {
        expect(toChecksum("0x7bb09bc8ade747178e95b1d035ecbeebbb18cfee", "ethereum"), `from lowercase`).toEqual("0x7Bb09bC8aDE747178e95B1D035ecBeEBbB18cFee");
        expect(toChecksum("0x7Bb09bC8aDE747178e95B1D035ecBeEBbB18cFee", "ethereum"), `from checksum`).toEqual("0x7Bb09bC8aDE747178e95B1D035ecBeEBbB18cFee");
        expect(toChecksum("7bb09bc8ade747178e95b1d035ecbeebbb18cfee", "ethereum"), `from lowercase, no prefix`).toEqual("0x7Bb09bC8aDE747178e95B1D035ecBeEBbB18cFee");
        expect(toChecksum("0x7bb09bc8ade747178e95b1d035ecbeebbb18cfee", "wanchain"), `wanchain, from lowercase`).toEqual("0x7bB09Bc8Ade747178E95b1d035ECbEebBb18CfEE");
    });
    test(`Test isEthereumAddress`, () => {
        expect(isEthereumAddress("0x7bb09bc8ade747178e95b1d035ecbeebbb18cfee"), `valid, lowercase`).toBe(true);
        expect(isEthereumAddress("0x7Bb09bC8aDE747178e95B1D035ecBeEBbB18cFee"), `valid, checksum`).toBe(true);
        expect(isEthereumAddress("b09bc8ade747178e95b1d035ecbeebbb18cfee"), `invalid, short`).toBe(false);
        expect(isEthereumAddress("7bb09bc8ade747178e95b1d035ecbeebbb18cfee"), `valid, no prefix`).toBe(true);
        expect(isEthereumAddress("0x7bb09bc8qde747178e95b1d035ecbeebbb18cfee"), `invalid, length ok, invalid char`).toBe(false);
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
    test(`Test sortElements`, () => {
        expect(sortElements(["c", "a", "b"]), `3 elems`).toEqual(["a", "b", "c"]);
        expect(sortElements(["C", "a", "b"]), `mixed case`).toEqual(["a", "b", "C"]);
        expect(sortElements(["1", "2", "11"]), `numerical string`).toEqual(["1", "2", "11"]);
        expect(sortElements([1, 2, 11]), `numerical`).toEqual([1, 2, 11]);
        expect(sortElements(["C", "a", "1", "b", "2", "11"]), `complex`).toEqual(["1", "2", "11", "a", "b", "C"]);
    });
    test(`Test makeUnique`, () => {
        expect(makeUnique(["a", "b", "c", "b"]), `4 elems with 1 duplicate`).toEqual(["a", "b", "c"]);
    });
    test(`Test arrayDiff`, () => {
        expect(arrayDiff(["a", "b", "c"], ["c"]), `4 elems with 1 duplicate`).toEqual(["a", "b"]);
        expect(arrayDiff(["a", "b", "c"], ["d"]), `4 elems with 0 duplicate`).toEqual(["a", "b", "c"]);
        expect(arrayDiff(["a", "B", "c"], ["C"]), `4 elems with 0 duplicate`).toEqual(["a", "B", "c"]);
        expect(arrayDiffNocase(["a", "B", "c"], ["C"]), `4 elems with 0 duplicate`).toEqual(["a", "B"]);
    });
    test(`Test findDuplicates`, () => {
        expect(findDuplicates(["a", "bb", "ccc"]), `No duplicates`).toEqual([]);
        expect(findDuplicates(["a", "bb", "ccc", "bb"]), `One double duplicate`).toEqual(["bb"]);
        expect(findDuplicates([]), `Empty array`).toEqual([]);
        expect(findDuplicates(["a"]), `One element`).toEqual([]);
        expect(findDuplicates(["a", "bb", "ccc", "bb", "d", "bb"]), `One triple duplicate`).toEqual(["bb"]);
        expect(findDuplicates(["a", "bb", "ccc", "bb", "a"]), `Two double duplicates`).toEqual(["bb", "a"]);
    });
    test(`Test findCommonElementsOrDuplicates`, () => {
        expect(findCommonElementsOrDuplicates(["a", "bb", "ccc"], ["1", "22", "333"]), `No intersection or duplicates`).toEqual([]);
        expect(findCommonElementsOrDuplicates(["a", "bb", "ccc"], ["1", "bb", "333"]), `Common element`).toEqual(["bb"]);
        expect(findCommonElementsOrDuplicates(["a", "bb", "ccc", "bb"], ["1", "22", "333"]), `Duplicate in first`).toEqual(["bb"]);
        expect(findCommonElementsOrDuplicates(["a", "bb", "ccc"], ["1", "22", "333", "22"]), `Duplicate in second`).toEqual(["22"]);
        expect(findCommonElementsOrDuplicates(["a", "bb", "ccc", "1", "bb"], ["1", "22", "333", "22"]), `Intersection and duplicates`).toEqual(["bb", "1", "22"]);
        expect(findCommonElementsOrDuplicates([], []), `Empty lists`).toEqual([]);
    });
    test(`Test arrayEqual`, () => {
        expect(arrayEqual(["a", "b", "c"], ["a", "b", "c"]), `equal`).toBe(true);
        expect(arrayEqual(["a", "b", "c", "d"], ["a", "b", "c"]), `length mismatch`).toBe(false);
        expect(arrayEqual(["a", "b", "c"], ["a", "b", "b"]), `length mismatch`).toBe(false);
        expect(arrayEqual(["a", "b", "b"], ["a", "b", "c"]), `length mismatch`).toBe(false);
    });
    test(`Test reverseCase`, () => {
        expect(reverseCase("abCDef12+-"), `mixed`).toEqual("ABcdEF12+-");
        expect(reverseCase("ABcdEF12+-"), `mixed`).toEqual("abCDef12+-");
    });
});

describe("Test blockchain binance", () => {
    test(`Test findImagesToFetch`, () => {
        const infoA1: BinanceTokenInfo = {asset: "A1-11", name: "A 1", mappedAsset: "A1", assetImg: "imgurl1", decimals: 8};
        const infoA2: BinanceTokenInfo = {asset: "A2-12", name: "A 2", mappedAsset: "A2", assetImg: "imgurl2", decimals: 8};
        const assetsInfoListNonexisting: BinanceTokenInfo[] = [infoA1, infoA2];
        const assetsInfoListExisting: BinanceTokenInfo[] = [
            {asset: "BUSD-BD1", name: "Binance USD", mappedAsset: "BUSD", assetImg: "imgurlBUSD", decimals: 8},
            {asset: "ETH-1C9", name: "Binance Ethereum", mappedAsset: "BETH", assetImg: "imgurlETH", decimals: 8}
        ];
        const denyListEmpty: string[] = [];
        const denyListA1: string[] = ["A1-11"];
        expect(findImagesToFetch(assetsInfoListNonexisting, denyListEmpty), `2 nonexisting`).toEqual(assetsInfoListNonexisting);
        expect(findImagesToFetch(assetsInfoListNonexisting, denyListA1), `2 nonexisting with 1 denylisted`).toEqual([infoA2]);
        expect(findImagesToFetch(assetsInfoListExisting, denyListEmpty), `2 existing`).toEqual([]);
        expect(findImagesToFetch([], []), `empty`).toEqual([]);
    });
});

describe("Test status, tag values", () => {
    test(`Test status-values`, () => {
        expect(isValidStatusValue("active")).toEqual(true);
        expect(isValidStatusValue("abandoned")).toEqual(true);
        expect(isValidStatusValue("invalidvalue")).toEqual(false);
        expect(isValidStatusValue("ACTIVE")).toEqual(false);
        expect(isValidStatusValue("")).toEqual(false);
    });
    test(`Test tag-values`, () => {
        expect(isValidTagValue("defi")).toEqual(true);
        expect(isValidTagValue("staking")).toEqual(true);
        expect(isValidStatusValue("invalidvalue")).toEqual(false);
        expect(isValidStatusValue("STAKING")).toEqual(false);
        expect(isValidStatusValue("")).toEqual(false);

        expect(isValidTagValues(["defi"])).toEqual(true);
        expect(isValidTagValues(["staking"])).toEqual(true);
        expect(isValidTagValues(["defi", "staking"])).toEqual(true);
        expect(isValidTagValues(["invalid"])).toEqual(false);
        expect(isValidTagValues(["defi", "invalid"])).toEqual(false);
    });
});
