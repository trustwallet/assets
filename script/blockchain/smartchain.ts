import { ActionInterface, CheckStepInterface } from "../generic/interface";
import { getTradingPairs, PairInfo } from "../generic/subgraph";
import { getChainAssetLogoPath } from "../generic/repo-structure";
import { SmartChain } from "../generic/blockchains";
import { isPathExistsSync } from "../generic/filesystem";


const PancakeSwap_TradingPairsUrl = "https://api.bscgraph.org/subgraphs/name/wowswap";
const PancakeSwap_TradingPairsQuery = "query pairs {\\n  pairs(first: 200, orderBy: reserveUSD, orderDirection: desc) {\\n id\\n reserveUSD\\n trackedReserveETH\\n volumeUSD\\n    untrackedVolumeUSD\\n __typename\\n token0 {\\n id\\n symbol\\n name\\n __typename\\n }\\n token1 {\\n id\\n symbol\\n name\\n __typename\\n }\\n }\\n}\\n";
const PancakeSwap_MinLiquidity = 1000000;

function checkBSCTokenExists(id: string): boolean {
    const logoPath = getChainAssetLogoPath(SmartChain, id);
    const exists = isPathExistsSync(logoPath);
    //console.log("logoPath", exists, logoPath);
    return exists;
}

// Verify a trading pair, whether we support the tokens, has enough liquidity, etc.
function checkPair(pair: PairInfo, minLiquidity: number): boolean {
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
    var filtered: PairInfo[] = [];
    pairs.forEach(x => {
        try {
            if (typeof(x) === "object") {
                const pairInfo = x as PairInfo;
                if (pairInfo) {
                    if (checkPair(pairInfo, PancakeSwap_MinLiquidity)) {
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
}

export class SmartchainAction implements ActionInterface {
    getName(): string { return "Binance Smartchain"; }

    getSanityChecks(): CheckStepInterface[] { return []; }

    async update(): Promise<void> {
        await retrievePancakeSwapPairs();
    }
}
