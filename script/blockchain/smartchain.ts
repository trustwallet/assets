import { ActionInterface, CheckStepInterface } from "../generic/interface";
import { getTradingPairs, PairInfo } from "../generic/subgraph";
import { getChainAssetLogoPath } from "../generic/repo-structure";
import { SmartChain } from "../generic/blockchains";
import { isPathExistsSync } from "../generic/filesystem";
//import { TokenItem, List, Version, Pair } from "../generic/tokenlists";


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
        console.log("pair with low liquidity:", pair.token0.symbol, "--", pair.token1.symbol, "  ", pair.reserveUSD);
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

// Retrieve trading pairs from PancakeSwap
async function retrievePancakeSwapPairs(): Promise<void> {
    const pairs = await getTradingPairs(PancakeSwap_TradingPairsUrl, PancakeSwap_TradingPairsQuery);
    const filtered: PairInfo[] = [];
    pairs.forEach(x => {
        try {
            if (typeof(x) === "object") {
                const pairInfo = x as PairInfo;
                if (pairInfo) {
                    if (checkTradingPair(pairInfo, PancakeSwap_MinLiquidity)) {
                        filtered.push(pairInfo);
                        console.log("pair:", pairInfo.token0.symbol, "--", pairInfo.token1.symbol, "  ", pairInfo.reserveUSD);
                    }
                }
            }
        } catch (err) {
            console.log("Exception:", err);
        }
    });

    console.log("Retrieved & filtered", filtered.length, "pairs:");
    filtered.forEach(p => {
        console.log(`pair:  ${p.token0.symbol} -- ${p.token1.symbol} \t USD ${Math.round(p.reserveUSD)} \t ${p.token0.id} ${p.token1.id}`);
    });

    /*
    const tokens: TokenItem[] = [];
    filtered.forEach(p => {
        tokens.push(new TokenItem("c20000714_t" + p.token0.id, "BEP20", p.token0.id, p.token0.name, p.token0.symbol, p.token0.decimals,
            `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/${p.token0.id}/logo.png`,
            <[Pair]>{}));
        tokens.push(new TokenItem("c20000714_t" + p.token1.id, "BEP20", p.token1.id, p.token1.name, p.token1.symbol, p.token1.decimals,
            `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/${p.token1.id}/logo.png`,
            <[Pair]>{}));
    });
    const tokenList: List = new List(
        "Trust Wallet: BNB",
        "https://trustwallet.com/assets/images/favicon.png",
        "2020-10-03T12:37:57.000+00:00",
        <[TokenItem]>tokens.sort((n1,n2) => (n2.pairs || []).length - (n1.pairs || []).length),
        new Version(0, 1, 0)
    );
    console.log(tokenList);
    */
}

export class SmartchainAction implements ActionInterface {
    getName(): string { return "Binance Smartchain"; }

    getSanityChecks(): CheckStepInterface[] { return []; }

    async update(): Promise<void> {
        await retrievePancakeSwapPairs();
    }
}
