const eztz = require('eztz-lib')

import {
    Cosmos, Tezos, Tron, Waves, Kava, Terra,
    chainsFolderPath,
    findFiles,
    getBinanceBEP2Symbols,
    getChainAssetsPath,
    getChainBlacklistPath,
    getChainValidatorAssetLogoPath,
    getChainValidatorsAssets,
    getChainValidatorsListPath,
    getChainWhitelistPath,
    getChainValidatorsList,
    findDuplicate,
    findCommonElementOrDuplicate,
    isLogoDimensionOK,
    isLowerCase,
    isPathExistsSync,
    isTRC10, isTRC20, isWavesAddress,
    isValidJSON,
    isValidatorHasAllKeys,
    pricingFolderPath,
    readDirSync,
    readFileSync,
    stakingChains,
} from "./helpers"
import { ValidatorModel, mapTiker, TickerType } from "./models";
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

describe(`Test "blockchains" folder`, () => {
    describe("Check Staking chains", () => {
        test("Make sure tests added for new staking chain", () => {
            expect(stakingChains.length).toBe(7)
        })

        stakingChains.forEach(chain => {
            const validatorsListPath = getChainValidatorsListPath(chain)
            const validatorsList = getChainValidatorsList(chain)

            test(`Chain ${chain} validator must have correct structure and valid JSON format`, () => {
                validatorsList.forEach((val: ValidatorModel) => {
                    expect(isValidatorHasAllKeys(val), `Some key and/or type missing for validator ${JSON.stringify(val)}`).toBe(true)
                    expect(isValidJSON(validatorsListPath), `Not valid json file at path ${validatorsListPath}`).toBe(true)
                })
            })

            
            test(`Chain ${chain} validator must have corresponding asset logo`, () => {
                validatorsList.forEach(({ id }) => {
                    const path = getChainValidatorAssetLogoPath(chain, id)
                    expect(isPathExistsSync(path), `Chain ${chain} asset ${id} logo must be present at path ${path}`).toBe(true)
                    
                    const [isOk, msg] = isLogoDimensionOK(path)
                    expect(isOk, msg).toBe(true)
                })
            })

            const chainValidatorsAssetsList = getChainValidatorsAssets(chain)
            switch (chain) {
                case Cosmos:
                    testCosmosValidatorsAddress(chainValidatorsAssetsList)
                    break;
                case Kava:
                    testKavaValidatorsAddress(chainValidatorsAssetsList)
                    break;
                case Terra:
                    testTerraValidatorsAddress(chainValidatorsAssetsList)
                    break;
                case Tezos:
                    testTezosValidatorsAssets(chainValidatorsAssetsList)
                    break;
                case Tron:
                    testTronValidatorsAssets(chainValidatorsAssetsList)
                    break;
                case Waves:
                    testWavesValidatorsAssets(chainValidatorsAssetsList)
                    break;
                // case Solana:
                //     testSolanaValidatorsAssets(chainValidatorsAssetsList)
                //     break;
                // TODO Add IoTex when taking suported by Trust
                default:
                    break;
            }
            
            test("Make sure validator has corresponding logo", () => {
                validatorsList.forEach(val => {
                    expect(chainValidatorsAssetsList.indexOf(val.id), `Expecting image asset for validator ${val.id} on chain ${chain}`)
                        .toBeGreaterThanOrEqual(0)
                })
            })

            test("Make sure validator asset logo has corresponding info", () => {
                chainValidatorsAssetsList.forEach(valAssetLogoID => {
                    expect(validatorsList.filter(v => v.id === valAssetLogoID).length, `Expect validator logo ${valAssetLogoID} to have info`)
                        .toBe(1)
                })
            })
        })
    })
})

function testTezosValidatorsAssets(assets: string[]) {
    test("Tezos assets must be correctly formated tz1 address", () => {
        assets.forEach(addr => {
            expect(eztz.crypto.checkAddress(addr), `Ivalid Tezos address: ${addr}`).toBe(true)
        })
    })
}

function testTronValidatorsAssets(assets: string[]) {
    test("TRON assets must be correctly formated", () => {
        assets.forEach(addr => {
            expect(isTRC20(addr), `Address ${addr} should be TRC20`).toBe(true)
        })
    })
}
function testWavesValidatorsAssets(assets: string[]) {
    test("WAVES assets must have correct format", () => {
        assets.forEach(addr => {
            expect(isWavesAddress(addr), `Address ${addr} should be WAVES formated`).toBe(true)
        })
    })
}

// function testSolanaValidatorsAssets(assets: string[]) {
//     test("Solana assets must have correct format", () => {
//         assets.forEach(addr => {
//             expect(isSolanaAddress(addr), `Address ${addr} should be Solana formated`).toBe(true)
//         })
//     })
// }

function testCosmosValidatorsAddress(assets: string[]) {
    test("Cosmos assets must have correct format", () => {
        assets.forEach(addr => {
            expect(addr.startsWith("cosmosvaloper1"), `Address ${addr} should start from "cosmosvaloper1"`).toBe(true)
            expect(addr.length, `Address ${addr} should have length 52`).toBe(52)
            expect(isLowerCase(addr), `Address ${addr} should be in lowercase`).toBe(true)
        })
    })
}

function testKavaValidatorsAddress(assets: string[]) {
    test("Kava assets must have correct format", () => {
        assets.forEach(addr => {
            expect(addr.startsWith("kavavaloper1"), `Address ${addr} should start from "kavavaloper1"`).toBe(true)
            expect(addr.length, `Address ${addr} should have length 50`).toBe(50)
            expect(isLowerCase(addr), `Address ${addr} should be in lowercase`).toBe(true)
        })
    })
}

function testTerraValidatorsAddress(assets: string[]) {
    test("Terra assets must have correct format", () => {
        assets.forEach(addr => {
            expect(addr.startsWith("terravaloper1"), `Address ${addr} should start from "terravaloper1"`).toBe(true)
            expect(addr.length, `Address ${addr} should have length 51`).toBe(51)
            expect(isLowerCase(addr), `Address ${addr} should be in lowercase`).toBe(true)
        })
    })
}

describe("Test Coinmarketcap mapping", () => {
    const cmcMap: mapTiker[] = JSON.parse(readFileSync("./pricing/coinmarketcap/mapping.json"))

    test("Must have items", () => {
        expect(cmcMap.length, `CMC map must have items`).toBeGreaterThan(0)
    })

    test(`Items must be sorted by "id" in ascending order`, () => {
        cmcMap.forEach((el, i) => {
            if (i > 0) {
                const prevID = cmcMap[i - 1].id
                const curID = el.id
                expect(curID, `Item ${curID} must be greather or equal to ${prevID}`)
                    .toBeGreaterThanOrEqual(prevID)
            }
        })
    })

    test(`Items must be sorted by "coin" in ascending order if have same "id"`, () => {
        cmcMap.forEach((el, i) => {
            if (i > 0) {
                const prevEl = cmcMap[i - 1]

                const prevCoin = prevEl.coin
                const prevID = cmcMap[i - 1].id

                const curCoin = el.coin
                const curID = el.id

                if (prevID == curID) {
                    expect(curCoin, `Item ${JSON.stringify(el)} must be greather or equal to ${JSON.stringify(prevEl)}`)
                        .toBeGreaterThanOrEqual(prevCoin)
                }

            }
        })
    })

    test("Properies value shoud not contain spaces", () => {
        cmcMap.forEach(el => {
            Object.keys(el).forEach(key => {
                const val = el[key]
                if (typeof val === "string") {
                    expect(val.indexOf(" ") >= 0, ` Property value "${val}" should not contain space`).toBe(false)
                }
            })
        })
    });
    
    test("Params should have value and correct type", () => {
        cmcMap.forEach(el => {
            const {coin, type, id, token_id} = el
            
            expect(typeof coin, `Coin ${coin} must be type "number"`).toBe("number")

            expect(["token", "coin"], `Element with id ${id} has wrong type: "${type}"`).toContain(type)
            if (type === "token") {
                expect(token_id, `token_id ${token_id} with id ${id} must be type not empty`).toBeTruthy()
            }

            if (type === "coin") {
                expect(el, `Element with id ${id} should not have property "token_id"`).not.toHaveProperty("token_id")
            }
        });
    });

    test(`"token_id" should be in correct format`, async () => {
        const bep2Symbols = await getBinanceBEP2Symbols()

        cmcMap.forEach(el => {
            const {coin, token_id, type, id} = el
            switch (coin) {
                case 60:
                    if (type === TickerType.Token) {
                        expect(isChecksum(token_id), `"token_id" ${token_id} with id ${id} must be in checksum`).toBe(true)
                        break;
                    }
                case 195:
                    if (type === TickerType.Token) {
                        expect(isTRC10(token_id) || isTRC20(token_id), `"token_id" ${token_id} with id ${id} must be in TRC10 or TRC20`).toBe(true)
                        break;
                    }
                case 714:
                    if (type === TickerType.Token) {
                        expect(bep2Symbols.indexOf(token_id), `"token_id" ${token_id} with id ${id} must be BEP2 symbol`).toBeGreaterThan(0)
                        break;
                    }
                default:
                    break;
            }
        })
    })

    test(`"token_id" shoud be unique`, () => {
        const mappedList = cmcMap.reduce((acm, val) => {
            if (val.hasOwnProperty("token_id")) {
                if (acm.hasOwnProperty(val.token_id)) {
                    acm[val.token_id] == ++acm[val.token_id]
                } else {
                    acm[val.token_id] = 0
                }
            }
            return acm
        }, {})

        cmcMap.forEach(el => {
            if (el.hasOwnProperty("token_id")) {
                expect(mappedList[el.token_id], `CMC map ticker with "token_id" ${el.token_id} shoud be unique`).toBeLessThanOrEqual(0)
            }
        })
    })
})

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
