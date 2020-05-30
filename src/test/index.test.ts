const eztz = require('eztz-lib')

import {
    Binance, Cosmos, Tezos, Tron, IoTeX, Waves, Kava, Terra,
    assetFolderAllowedFiles,
    chainsFolderPath,
    ethSidechains,
    findFiles,
    getBinanceBEP2Symbols,
    getChainAssetLogoPath,
    getChainAssetPath,
    getChainAssetsPath,
    getChainBlacklistPath,
    getChainLogoPath,
    getChainValidatorAssetLogoPath,
    getChainValidatorsAssets,
    getChainValidatorsListPath,
    getChainWhitelistPath,
    getChainAssetsList,
    getChainValidatorsList,
    isChecksum,
    isLogoDimentionOK,
    isLogoSizeOK,
    isLowerCase,
    isPathDir,
    isPathExistsSync,
    isTRC10, isTRC20, isWavesAddress,
    isValidJSON,
    isAssetInfoOK,
    isValidatorHasAllKeys,
    mapList,
    pricingFolderPath,
    readDirSync,
    readFileSync,
    rootDirAllowedFiles,
    stakingChains,
} from "./helpers"
import { ValidatorModel, mapTiker, TickerType } from "./models";
import { getHandle } from "../../script/gen_info";

describe("Check repository root dir", () => {
    const dirActualFiles = readDirSync(".")
    test("Root should contains only predefined files", () => {
        dirActualFiles.forEach(file => {
            expect(rootDirAllowedFiles.indexOf(file), `File "${file}" should not be in root or added to predifined list`).not.toBe(-1)
        })
    })
})

describe(`Test "blockchains" folder`, () => {
    const foundChains = readDirSync(chainsFolderPath)

    test(`Chain should have "logo.png" image`, () => {
        foundChains.forEach(chain => {
            const chainLogoPath = getChainLogoPath(chain)
            expect(isPathExistsSync(chainLogoPath), `File missing at path "${chainLogoPath}"`).toBe(true)
            const [isOk, msg] = isLogoDimentionOK(chainLogoPath)
            expect(isOk, msg).toBe(true)
        })
    })

    test("Chain folder must have lowercase naming", () => {
        foundChains.forEach(chain => {
            expect(isLowerCase(chain), `Chain folder must be in lowercase "${chain}"`).toBe(true)
        })
    })

    describe(`Asset folder should contain only predefined list of files`, () => {
        readDirSync(chainsFolderPath).forEach(chain => {
            const assetsPath = getChainAssetsPath(chain)

            if (isPathExistsSync(assetsPath)) {
                test(`Test asset folder allowed files on chain: ${chain}`, () => {
                readDirSync(assetsPath).forEach(address => {
                    const assetFiles = getChainAssetPath(chain, address)
                    readDirSync(assetFiles).forEach(assetFolderFile => {
                        expect(assetFolderAllowedFiles.indexOf(assetFolderFile),`File "${assetFolderFile}" not allowed at this path: ${assetsPath}`).not.toBe(-1)
                    })
                }) 
            })
            }  
        })
    })

    describe("Check Ethereum side-chain folders", () => {
        ethSidechains.forEach(chain => {
            test(`Test chain ${chain} folder`, () => {

                getChainAssetsList(chain).forEach(address => {
                    const assetPath = getChainAssetPath(chain, address)
                    expect(isPathDir(assetPath), `Expect directory at path: ${assetPath}`).toBe(true)

                    const checksum = isChecksum(address)
                    expect(checksum, `Expect asset at path ${assetPath} in checksum`).toBe(true)
                    
                    const lowercase = isLowerCase(address)
                    if (lowercase) {
                        expect(checksum, `Lowercase address ${address} on chain ${chain} should be in checksum`).toBe(true)
                    }

                    const assetLogoPath = getChainAssetLogoPath(chain, address)
                    expect(isPathExistsSync(assetLogoPath), `Missing file at path "${assetLogoPath}"`).toBe(true)

                    const [isDimentionOK, dimensionMsg] = isLogoDimentionOK(assetLogoPath)
                    expect(isDimentionOK, dimensionMsg).toBe(true)

                    const [isLogoOK, sizeMsg] = isLogoSizeOK(assetLogoPath)
                    expect(isLogoOK, sizeMsg).toBe(true)

                    const [isInfoOK, InfoMsg] = isAssetInfoOK(chain, address)
                    expect(isInfoOK, InfoMsg).toBe(true)
                })
            })
        })
    })

    describe(`Check "binace" folder`, () => {
        it("Asset must exist on chain and", async () => {
            const tokenSymbols = await getBinanceBEP2Symbols()
            const assets = readDirSync(getChainAssetsPath(Binance))

            assets.forEach(asset => {
                expect(tokenSymbols.indexOf(asset), `Asset ${asset} missing on chain`).not.toBe(-1)
            })
        })
    })

    describe(`Check "tron" folder`, () => {
        const path = getChainAssetsPath(Tron)

        test("Expect asset to be TRC10 or TRC20", () => {
            readDirSync(path).forEach(asset => {
                expect(isTRC10(asset) || isTRC20(asset), `Asset ${asset} at path ${path} non TRC10 nor TRC20`).toBe(true)

                const assetsLogoPath = getChainAssetLogoPath(Tron, asset)
                expect(isPathExistsSync(assetsLogoPath), `Missing file at path "${assetsLogoPath}"`).toBe(true)
                const [isOk, msg] = isLogoDimentionOK(assetsLogoPath)
                expect(isOk, msg).toBe(true)
            })
        })
    })

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
                    
                    const [isOk, msg] = isLogoDimentionOK(path)
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

describe("Test blacklist and whitelist", () => {
    const assetsChains = readDirSync(chainsFolderPath).filter(chain => isPathExistsSync(getChainAssetsPath(chain)))

    assetsChains.forEach(chain => {
        const whiteList = JSON.parse(readFileSync(getChainWhitelistPath(chain)))
        const blackList = JSON.parse(readFileSync(getChainBlacklistPath(chain)))

        test(`Whitelist should not contain assets from blacklist on ${chain} chain`, () => {
            const blacklistMap = mapList(blackList)
            whiteList.forEach(a => {
                expect(a in blacklistMap, `Found whitelist asset ${a} in blacklist on chain ${chain}`).toBe(false)
            })
        })

        test(`Blacklist should not contain assets from whitelist on ${chain} chain`, () => {
            const whitelistMap = mapList(whiteList)
            blackList.forEach(a => {
                expect(a in whitelistMap, `Found blacklist asset ${a} in whitelist on chain ${chain}`).toBe(false)
            })
        })
    })
})

describe("Test coins info.json file", () => {
    
});

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
});
