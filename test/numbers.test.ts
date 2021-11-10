import {
    toSatoshis,
    fromSatoshis
} from "../script/generic/numbers";

describe("Test eth-address helpers", () => {
    test(`Test to satoshis`, () => {
        expect(toSatoshis('43523.423423432112321234', 18)).toEqual('43523423423432112321234');
        expect(toSatoshis('0.123', 3)).toEqual('123');
        expect(toSatoshis('0.00000001', 8)).toEqual('1');
    });
    test(`Test from Satoshis`, () => {
        expect(fromSatoshis('123', 3)).toEqual('0.123');
        expect(fromSatoshis('1234', 3)).toEqual('1.234');
        expect(fromSatoshis('43523423423432112321234', 18)).toEqual('43523.423423432112321234');
        expect(fromSatoshis('1', 8)).toEqual('0.00000001');
    });
});