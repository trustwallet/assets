const fs = require('fs')
const axios = require('axios')
const path = require('path')
const Web3 = require('web3')
const web3 = new Web3('ws://localhost:8546');
// import {
//     getBinanceTokenSymbols
// } from "./helpers";
// jest.mock('./helpers');
const readDirSync = path => fs.readdirSync(path)
const isPathExistsSync = path => fs.existsSync(path)
const isLowerCase = str => str.toLowerCase() === str
const isUpperCase = str => str.toUpperCase() === str
const isChecksum = address => web3.utils.checkAddressChecksum(address)
async function getBinanceTokenSymbols() {
    return axios.get(`https://dex-atlantic.binance.org/api/v1/tokens?limit=1000`).then(res => res.data.map(token => token.symbol))
}

const isTRC10 = id => (/^\d+$/.test(id))
const isTRC20 = address => address.length == 34


describe("Check repository root dir", () => {
    const rootDirAllowedFiles = [
        "blockchains",
        "dapps",
        "media",
        "node_modules",
        "script",
        "test",
        "LICENSE",
        "package-lock.json",
        "package.json",
        "README.md",
        ".git",
        ".github",
        ".gitignore",
        ".travis.yml"
    ]
    const dirActualFiles = readDirSync(".")

    test("Root should contains only predifined files", () => {
        rootDirAllowedFiles.forEach(file => {
            expect(dirActualFiles.indexOf(file)).not.toBe(-1)
        })
    })
})

describe(`Test "blockchains" folder`, () => {
    const blockchainsFolderPath = './blockchains'
    const foundBlockchains = readDirSync(blockchainsFolderPath)

    test("Check number of existing chains", () => {
        const supportedChains = 64
        expect(supportedChains).toBe(foundBlockchains.length)
    })

    test(`Chain should have "logo.png" image`, () => {
        foundBlockchains.forEach(chain => {
            const chainLogoPath = `${blockchainsFolderPath}/${chain}/info/logo.png`
            expect(isPathExistsSync(chainLogoPath), `File missing at path "${chainLogoPath}"`).toBe(true)
        })
    });

    test("Chain folder must have lowercase naming", () => {
        foundBlockchains.forEach(chain => {
            expect(isLowerCase(chain), `Chain folder must be in lowercase "${chain}"`).toBe(true)
        })
    });

    describe("Check Ethereum side-chain folders", () => {
        const ethSidechains = ["ethereum", "classic", "poa", "tomochain", "gochain", "wanchain", "thundertoken"]
        const ethSidechainSupportedBlacklist = ["ethereum"]


        ethSidechains.forEach(chain => {
            test(`Test chain ${chain} folder`, () => {
                const assetsPath = `./blockchains/${chain}/assets`

                readDirSync(assetsPath).forEach(addr => {
                    expect(isChecksum(addr), `Address ${addr} on chain ${chain} must be in checksum`).toBe(true)

                    const assetsLogoPath = `${assetsPath}/${addr}/logo.png`
                    expect(isPathExistsSync(assetsLogoPath), `Missing file at path "${assetsLogoPath}"`).toBe(true)
                })
            })
        })
    })

    describe(`Check "binace" folder`, () => {
        it("Asset must exist on chain and", async () => {
            const tokenSymbols = await getBinanceTokenSymbols()
            const assets = readDirSync(`./blockchains/binance/assets`)

            assets.forEach(asset => {
                expect(tokenSymbols.indexOf(asset), `Asset ${asset} missing on chain`).not.toBe(-1)
            })
        })
    })

    describe.only(`Check "tron" folder`, () => {
        const path = `./blockchains/tron/assets`

        test("Expect asset to be TRC10 or TRC20", () => {
            readDirSync(path).forEach(asset => {
                expect(isTRC10(asset) || isTRC20(asset), `Asset ${asset} non TRC10 nor TRC20`).toBe(true)

                const assetsLogoPath = `${path}/${asset}/logo.png`
                expect(isPathExistsSync(assetsLogoPath), `Missing file at path "${assetsLogoPath}"`).toBe(true)
            });
        })
    })
})