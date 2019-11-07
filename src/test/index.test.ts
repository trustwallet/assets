const eztz = require('eztz-lib')

import {
    BNB,
    Cosmos,
    Tezos,
    TRON,
    IoTeX,
    Waves,
    chainsFolderPath,
    getChainLogoPath,
    getChainAssetsPath,
    getChainAssetLogoPath,
    getChainValidatorsAssets,
    getChainValidatorsListPath,
    getChainValidatorAssetLogoPath,
    readDirSync,
    isPathExistsSync,
    readFileSync,
    isLowerCase,
    isChecksum,
    getBinanceBEP2Symbols,
    isTRC10,
    isTRC20
} from "./helpers"

describe("Check repository root dir", () => {
    const rootDirAllowedFiles = [
        ".github",
        "blockchains",
        "dapps",
        "media",
        "node_modules",
        "script",
        "src",
        ".gitignore",
        ".travis.yml",
        "jest.config.js",
        "LICENSE",
        "package-lock.json",
        "package.json",
        "README.md",
        ".git",
    ]

    const dirActualFiles = readDirSync(".")
    test("Root should contains only predefined files", () => {
        dirActualFiles.forEach(file => {
            expect(rootDirAllowedFiles.indexOf(file), `File "${file}" should not be in root or added to predifined list`).not.toBe(-1)
        })
    })
})

describe(`Test "blockchains" folder`, () => {
    const foundChains = readDirSync(chainsFolderPath)

    test("Check number of existing chains", () => {
        const supportedChains = 64
        expect(supportedChains).toBe(foundChains.length)
    })

    test(`Chain should have "logo.png" image`, () => {
        foundChains.forEach(chain => {
            const chainLogoPath = getChainLogoPath(chain)
            expect(isPathExistsSync(chainLogoPath), `File missing at path "${chainLogoPath}"`).toBe(true)
        })
    });

    test("Chain folder must have lowercase naming", () => {
        foundChains.forEach(chain => {
            expect(isLowerCase(chain), `Chain folder must be in lowercase "${chain}"`).toBe(true)
        })
    });

    describe("Check Ethereum side-chain folders", () => {
        const ethSidechains = ["ethereum", "classic", "poa", "tomochain", "gochain", "wanchain", "thundertoken"]
        const ethSidechainSupportedBlacklist = ["ethereum"]

        ethSidechains.forEach(chain => {
            test(`Test chain ${chain} folder`, () => {
                const assetsPath = getChainAssetsPath(chain)

                readDirSync(assetsPath).forEach(addr => {
                    expect(isChecksum(addr), `Address ${addr} on chain ${chain} must be in checksum`).toBe(true)

                    const assetLogoPath = getChainAssetLogoPath(chain, addr)
                    expect(isPathExistsSync(assetLogoPath), `Missing file at path "${assetLogoPath}"`).toBe(true)
                })
            })
        })
    })

    describe(`Check "binace" folder`, () => {
        it("Asset must exist on chain and", async () => {
            const tokenSymbols = await getBinanceBEP2Symbols()
            const assets = readDirSync(getChainAssetsPath(BNB))

            assets.forEach(asset => {
                expect(tokenSymbols.indexOf(asset), `Asset ${asset} missing on chain`).not.toBe(-1)
            })
        })
    })

    describe(`Check "tron" folder`, () => {
        const path = getChainAssetsPath(TRON)

        test("Expect asset to be TRC10 or TRC20", () => {
            readDirSync(path).forEach(asset => {
                expect(isTRC10(asset) || isTRC20(asset), `Asset ${asset} non TRC10 nor TRC20`).toBe(true)

                const assetsLogoPath = getChainAssetLogoPath(TRON, asset)
                expect(isPathExistsSync(assetsLogoPath), `Missing file at path "${assetsLogoPath}"`).toBe(true)
            });
        })
    })

    describe("Check Staking chains", () => {
        const stakingChains = [Tezos, Cosmos, IoTeX, TRON, Waves]

        test("Make sure tests added for new staking chain", () => {
            expect(stakingChains.length).toBe(5)
        })

        stakingChains.forEach(chain => {
            const validatorsList = JSON.parse(readFileSync(getChainValidatorsListPath(chain)))

            test(`Make sure ${chain} validators list has correct structure`, () => {
                validatorsList.forEach(val => {
                    const keys = Object.keys(val)
                    expect(keys.length, `Wrong keys amount`).toBe(4)

                    keys.forEach(key => {
                        const type = typeof key
                        expect(type, `Wrong key type`).toBe("string")
                    })
                })
            })

            
            test(`Chain ${chain} validator must have coresponding asset logo`, () => {
                validatorsList.forEach(({ id }) => {
                    const path = getChainValidatorAssetLogoPath(chain, id)
                    expect(isPathExistsSync(path), `Chain ${chain} asset ${id} logo must be present at path ${path}`).toBe(true)
                })
            });

            const chainValidatorsAssetsList = getChainValidatorsAssets(chain)
            switch (chain) {
                case Cosmos:
                    testCosmosValidatorsAddress(chainValidatorsAssetsList)
                    break;
                case Tezos:
                    testTezosValidatorsAssets(chainValidatorsAssetsList)
                    break;
                case TRON:
                    testTronValidatorsAssets(chainValidatorsAssetsList)
                    break;
                case TRON:
                        testTronValidatorsAssets(chainValidatorsAssetsList)
                        break;
                // TODO Add LOOM
                default:
                    break;
            }
            
            test("Make sure number of validators in the list match validators assets", () => {
                expect(validatorsList.length).toBe(chainValidatorsAssetsList.length)
            });
        })

    });
})

function testTezosValidatorsAssets(assets) {
    test("Tezos assets must be correctly formated tz1 address", () => {
        assets.forEach(addr => {
            expect(eztz.crypto.checkAddress(addr), `Ivalid Tezos address: ${addr}`).toBe(true)
        });
    })
}

function testTronValidatorsAssets(assets) {
    test("TRON assets must be correctly formated", () => {
        assets.forEach(addr => {
            expect(isTRC20(addr), `Address ${addr} should be TRC20`).toBe(true)
        });
    })
}

function testCosmosValidatorsAddress(assets) {
    test("Cosmos assets must be correctly formated", () => {
        assets.forEach(addr => {
            expect(addr.startsWith("cosmosvaloper1"), `Address ${addr} should start from "cosmosvaloper1"`).toBe(true)
            expect(addr.length, `Address ${addr} should have length 52`).toBe(52)
            expect(isLowerCase(addr), `Address ${addr} should be in lowercase`).toBe(true)
        });
    })
}

// TODO test whitelist
