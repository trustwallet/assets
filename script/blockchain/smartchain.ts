import { ActionInterface, CheckStepInterface } from "../generic/interface";
import {
    checkTradingPair,
    getTradingPairs,
    PairInfo,
    primaryTokenIndex,
    TokenInfo
} from "../generic/subgraph";
import {
    getChainAllowlistPath,
    getChainTokenlistBasePath,
    getChainTokenlistPath
} from "../generic/repo-structure";
import { SmartChain } from "../generic/blockchains";
import {
    addPairIfNeeded,
    generateTokensList,
    List,
    TokenItem,
    writeToFileWithUpdate
} from "../generic/tokenlists";
import { readJsonFile } from "../generic/json";
import { toChecksum } from "../generic/eth-address";
import { assetID, logoURI } from "../generic/asset";

const PancakeSwap_TradingPairsUrl = "https://api.bscgraph.org/subgraphs/name/wowswap";
const PancakeSwap_TradingPairsQuery = "query pairs {\\n  pairs(first: 400, orderBy: reserveUSD, orderDirection: desc) {\\n id\\n reserveUSD\\n trackedReserveETH\\n volumeUSD\\n    untrackedVolumeUSD\\n __typename\\n token0 {\\n id\\n symbol\\n name\\n decimals\\n __typename\\n }\\n token1 {\\n id\\n symbol\\n name\\n decimals\\n __typename\\n }\\n }\\n}\\n";
const PancakeSwap_MinLiquidity = 1000000;
const PrimaryTokens: string[] = ["WBNB", "BNB"];

async function retrievePancakeSwapPairs(): Promise<PairInfo[]> {
    console.log(`Retrieving pairs from PancakeSwap, liquidity limit USD ${PancakeSwap_MinLiquidity}`);

    // prepare phase, read allowlist
    const allowlist: string[] = readJsonFile(getChainAllowlistPath(SmartChain)) as string[];

    const pairs = await getTradingPairs(PancakeSwap_TradingPairsUrl, PancakeSwap_TradingPairsQuery);
    const filtered: PairInfo[] = [];
    pairs.forEach(x => {
        try {
            if (typeof(x) === "object") {
                const pairInfo = x as PairInfo;
                if (pairInfo) {
                    if (checkTradingPair(pairInfo, SmartChain, PancakeSwap_MinLiquidity, allowlist, PrimaryTokens)) {
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
        assetID(20000714, idChecksum),
        "BEP20",
        idChecksum, token.name, token.symbol, parseInt(token.decimals.toString()),
        logoURI(idChecksum, "smartchain", "--"),
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
        let tokenItem0 = tokenInfoFromSubgraphToken(p.token0);
        let tokenItem1 = tokenInfoFromSubgraphToken(p.token1);
        if (primaryTokenIndex(p, PrimaryTokens) == 2) {
            // reverse
            const tmp = tokenItem1; tokenItem1 = tokenItem0; tokenItem0 = tmp;
        }
        addPairIfNeeded(tokenItem0, tokenItem1, list);
    });
    console.log(`Tokenlist updated, ${list.tokens.length} tokens`);

    const newList = generateTokensList("Smart Chain", list.tokens,
        "2020-10-03T12:37:57.000+00:00", // use constant here to prevent changing time every time
        0, 1, 0);
    writeToFileWithUpdate(getChainTokenlistPath(SmartChain), newList);
}

export class SmartchainAction implements ActionInterface {
    getName(): string { return "Binance Smartchain"; }

    getSanityChecks(): CheckStepInterface[] { return []; }

    async update(): Promise<void> {
        await generateTokenlist();
    }
}
