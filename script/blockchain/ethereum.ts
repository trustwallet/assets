import { ActionInterface, CheckStepInterface } from "../generic/interface";
import { getTradingPairs, PairInfo } from "../generic/subgraph";
import { getChainAssetLogoPath } from "../generic/repo-structure";
import { Ethereum } from "../generic/blockchains";
import { isPathExistsSync } from "../generic/filesystem";

// see https://thegraph.com/explorer/subgraph/uniswap/uniswap-v2
const Uniswap_TradingPairsUrl = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2";
const Uniswap_TradingPairsQuery = "query pairs {\\n  pairs(first: 200, orderBy: reserveUSD, orderDirection: desc) {\\n id\\n reserveUSD\\n trackedReserveETH\\n volumeUSD\\n    untrackedVolumeUSD\\n __typename\\n token0 {\\n id\\n symbol\\n name\\n __typename\\n }\\n token1 {\\n id\\n symbol\\n name\\n __typename\\n }\\n }\\n}\\n";
const Uniswap_MinLiquidity = 1000000;

function checkEthTokenExists(id: string): boolean {
    const logoPath = getChainAssetLogoPath(Ethereum, id);
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
    if (!checkEthTokenExists(pair.token0.id)) {
        console.log("pair with unsupported 1st coin:", pair.token0.symbol, "--", pair.token1.symbol);
        return false;
    }
    if (!checkEthTokenExists(pair.token1.id)) {
        console.log("pair with unsupported 2nd coin:", pair.token0.symbol, "--", pair.token1.symbol);
        return false;
    }
    //console.log("pair:", pair.token0.symbol, "--", pair.token1.symbol, "  ", pair.reserveUSD);
    return true;
}

// Retrieve trading pairs from Uniswap
async function retrieveUniswapPairs(): Promise<void> {
    const pairs = await getTradingPairs(Uniswap_TradingPairsUrl, Uniswap_TradingPairsQuery);
    const filtered: PairInfo[] = [];
    pairs.forEach(x => {
        try {
            if (typeof(x) === "object") {
                const pairInfo = x as PairInfo;
                if (pairInfo) {
                    if (checkTradingPair(pairInfo, Uniswap_MinLiquidity)) {
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
}

export class EthereumAction implements ActionInterface {
    getName(): string { return "Ethereum"; }

    getSanityChecks(): CheckStepInterface[] { return []; }

    async update(): Promise<void> {
        await retrieveUniswapPairs();
    }
}
