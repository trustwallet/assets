import { ActionInterface, CheckStepInterface } from "../generic/interface";
import { getTradingPairs, PairInfo, TokenInfo } from "../generic/subgraph";
import { getChainAssetLogoPath, getChainTokenlistBasePath, getChainTokenlistPath } from "../generic/repo-structure";
import { SmartChain } from "../generic/blockchains";
import { isPathExistsSync, writeFileSync } from "../generic/filesystem";
import { TokenItem, List, generateTokensList, addPairIfNeeded, writeToFile } from "../generic/tokenlists";
import { readJsonFile } from "../generic/json";
import { toChecksum } from "../generic/eth-address";

const PancakeSwap_TradingPairsUrl = "https://api.bscgraph.org/subgraphs/name/wowswap";
const PancakeSwap_TradingPairsQuery = "query pairs {\\n  pairs(first: 200, orderBy: reserveUSD, orderDirection: desc) {\\n id\\n reserveUSD\\n trackedReserveETH\\n volumeUSD\\n    untrackedVolumeUSD\\n __typename\\n token0 {\\n id\\n symbol\\n name\\n decimals\\n __typename\\n }\\n token1 {\\n id\\n symbol\\n name\\n decimals\\n __typename\\n }\\n }\\n}\\n";
const PancakeSwap_MinLiquidity = 1000000;

function checkBSCTokenExists(id: string): boolean {
    const logoPath = getChainAssetLogoPath(SmartChain, id);
    const exists = isPathExistsSync(logoPath);
    //console.log("logoPath", exists, logoPath);
    return exists;
}

// Verify a trading pair, whether we support the tokens, has enough liquidity, etc.
function checkTradingPair(pair: PairInfo, minLiquidity: number): boolean {
    if (!pair.id && !pair.reserveUSD && !pair.token0 && !pair.token1) {
        return false;
    }
    if (pair.reserveUSD < minLiquidity) {
        console.log("pair with low liquidity:", pair.token0.symbol, "--", pair.token1.symbol, "  ", Math.round(pair.reserveUSD));
        return false;
    }
    if (!checkBSCTokenExists(pair.token0.id)) {
        console.log("pair with unsupported 1st coin:", pair.token0.symbol, "--", pair.token1.symbol);
        return false;
    }
    if (!checkBSCTokenExists(pair.token1.id)) {
        console.log("pair with unsupported 2nd coin:", pair.token0.symbol, "--", pair.token1.symbol);
        return false;
    }
    //console.log("pair:", pair.token0.symbol, "--", pair.token1.symbol, "  ", pair.reserveUSD);
    return true;
}

async function retrievePancakeSwapPairs(): Promise<PairInfo[]> {
    const pairs = await getTradingPairs(PancakeSwap_TradingPairsUrl, PancakeSwap_TradingPairsQuery);
    const filtered: PairInfo[] = [];
    pairs.forEach(x => {
        try {
            if (typeof(x) === "object") {
                const pairInfo = x as PairInfo;
                if (pairInfo) {
                    if (checkTradingPair(pairInfo, PancakeSwap_MinLiquidity)) {
                        filtered.push(pairInfo);
                    }
                }
            }
        } catch (err) {
            console.log("Exception:", err);
        }
    });

    console.log("Retrieved & filtered", filtered.length, "pairs:");
    filtered.forEach(p => {
        console.log(`pair:  ${p.token0.symbol} -- ${p.token1.symbol} \t USD ${Math.round(p.reserveUSD)}`);
    });

    return filtered;
}

function tokenInfoFromSubgraphToken(token: TokenInfo): TokenItem {
    const idChecksum = toChecksum(token.id);
    return new TokenItem(
        "c20000714_t" + idChecksum, "BEP20",
        idChecksum, token.name, token.symbol, token.decimals,
        `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/${idChecksum}/logo.png`,
        []);
}

// Retrieve trading pairs from PancakeSwap
async function generateTokenlist(): Promise<void> {
    const tokenlistFile = getChainTokenlistBasePath(SmartChain);
    const json = readJsonFile(tokenlistFile);
    const list: List = json as List;
    console.log(`Tokenlist base, ${list.tokens.length} tokens`);
    
    const tradingPairs = await retrievePancakeSwapPairs();
    tradingPairs.forEach(p => {
        const tokenItem0 = tokenInfoFromSubgraphToken(p.token0);
        const tokenItem1 = tokenInfoFromSubgraphToken(p.token1);
        addPairIfNeeded(tokenItem0, tokenItem1, list);
    });
    console.log(`Tokenlist updated, ${list.tokens.length} tokens`);

    writeToFile(getChainTokenlistPath(SmartChain), generateTokensList("Smart Chain", list.tokens));
}

export class SmartchainAction implements ActionInterface {
    getName(): string { return "Binance Smartchain"; }

    getSanityChecks(): CheckStepInterface[] { return []; }

    async update(): Promise<void> {
        await generateTokenlist();
    }
}
