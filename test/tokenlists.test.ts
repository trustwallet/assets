import {
    ForceListPair,
    matchPairToForceList,
    matchPairToForceListEntry,
    matchTokenToForceList,
    matchTokenToForceListEntry,
    parseForceListEntry,
    parseForceList,
    TokenItem
} from "../script/generic/tokenlists";

describe("Test tokenlists", () => {
    test(`Test parseForceListEntry`, () => {
        let pair: ForceListPair;
        pair = parseForceListEntry("TOK1");
        expect(pair.token1).toEqual("TOK1");
        expect(pair.token2).toEqual("");
        pair = parseForceListEntry("TOK2-TOK3");
        expect(pair.token1).toEqual("TOK2");
        expect(pair.token2).toEqual("TOK3");
    });

    test(`Test parseForceList`, () => {
        const pair = parseForceList(["TOK1", "TOK2-TOK3"]);
        expect(pair.length).toEqual(2);
        expect(pair[0].token1).toEqual("TOK1");
        expect(pair[0].token2).toEqual("");
        expect(pair[1].token1).toEqual("TOK2");
        expect(pair[1].token2).toEqual("TOK3");
    });

    test(`Test matchTokenToForceListEntry`, () => {
        const token: TokenItem = new TokenItem("asset", "type", "address", "name", "symbol", 10, "logoUri", []);
        expect(matchTokenToForceListEntry(token, "symbol")).toEqual(true);
        expect(matchTokenToForceListEntry(token, "name")).toEqual(true);
        expect(matchTokenToForceListEntry(token, "asset")).toEqual(true);
        expect(matchTokenToForceListEntry(token, "NOS_SUCH")).toEqual(false);
        expect(matchTokenToForceListEntry(token, "NO_SUCH-symbol")).toEqual(false);
        expect(matchTokenToForceListEntry(token, "SYMBOL")).toEqual(true);
    });

    test(`Test matchPairToForceListEntry`, () => {
        const token1: TokenItem = new TokenItem("asset", "type", "address", "name", "symbol1", 10, "logoUri", []);
        const token2: TokenItem = new TokenItem("asset", "type", "address", "name", "symbol2", 10, "logoUri", []);
        expect(matchPairToForceListEntry(token1, undefined, parseForceListEntry("symbol1"))).toEqual(true);
        expect(matchPairToForceListEntry(token1, undefined, parseForceListEntry("s99"))).toEqual(false);
        expect(matchPairToForceListEntry(token2, undefined, parseForceListEntry("symbol2"))).toEqual(true);
        expect(matchPairToForceListEntry(token2, undefined, parseForceListEntry("s99"))).toEqual(false);
        expect(matchPairToForceListEntry(token1, token2, parseForceListEntry("symbol1-symbol2"))).toEqual(true);
        expect(matchPairToForceListEntry(token1, token2, parseForceListEntry("symbol2-symbol1"))).toEqual(true);
        expect(matchPairToForceListEntry(token1, undefined, parseForceListEntry("symbol1-symbol2"))).toEqual(false);
        expect(matchPairToForceListEntry(token1, token2, parseForceListEntry("s99-symbol2"))).toEqual(false);
        expect(matchPairToForceListEntry(token1, token2, parseForceListEntry("symbol1-s99"))).toEqual(false);
    });

    test(`Test matchTokenToForceList`, () => {
        const token: TokenItem = new TokenItem("asset", "type", "address", "name", "symbol1", 10, "logoUri", []);
        expect(matchTokenToForceList(token, parseForceList(["symbol1", "symbol2"]))).toEqual(true);
        expect(matchTokenToForceList(token, parseForceList(["s99", "symbol2"]))).toEqual(false);
        expect(matchTokenToForceList(token, parseForceList(["symbol4-symbol3", "symbol1-symbol2"]))).toEqual(true);
        expect(matchTokenToForceList(token, parseForceList(["s98", "s99"]))).toEqual(false);
        expect(matchTokenToForceList(token, parseForceList([]))).toEqual(false);
    });

    test(`Test matchPairToForceList`, () => {
        const token1: TokenItem = new TokenItem("asset", "type", "address", "name", "symbol1", 10, "logoUri", []);
        const token2: TokenItem = new TokenItem("asset", "type", "address", "name", "symbol2", 10, "logoUri", []);
        expect(matchPairToForceList(token1, token2, parseForceList(["symbol1-symbol2", "s99"]))).toEqual(true);
        expect(matchPairToForceList(token1, token2, parseForceList(["symbol1-s98", "s99"]))).toEqual(false);
        expect(matchPairToForceList(token1, token2, parseForceList(["symbol1", "s99"]))).toEqual(true);
        expect(matchPairToForceList(token1, token2, parseForceList(["symbol2-symbol1", "s99"]))).toEqual(true);
    });
});
