import {
    assetID
} from "../script/generic/asset";

describe("Test eth-address helpers", () => {
    test(`Test coin`, () => {
        expect(assetID(714)).toEqual('c714');
        expect(assetID(714, '')).toEqual('c714');
    });
    test(`Test token`, () => {
        expect(assetID(714, 'TWT-8C2')).toEqual('c714_tTWT-8C2');
    });
});