export const imageMaxLogoWidth = 512;
export const imageMaxLogoHeight =  512;
export const imageMinLogoWidth =  64;
export const imageMinLogoHeight =  64;
export const imageMaxLogoSizeKb =  100;
export const foldersRootdirAllowedFiles: string[] =  [".github", "blockchains", "dapps", "media", "node_modules", "script-old", "script", "test", "history", ".gitignore", "azure-pipelines.yml", "jest.config.js", "LICENSE", "package-lock.json", "package.json", "README.md", ".git", ".eslintignore", ".eslintrc.js"];
export const binanceUrlTokenAssets =  "https://explorer.binance.org/api/v1/assets?page=1&rows=1000";
export const binanceDexURL = 'https://dex-atlantic.binance.org/api'
export const assetsURL = 'https://assets.trustwalletapp.com'

// Force include & exclude config: list of token symbols, or symbol pairs (e.g. ["Cake", "DAI-WBNB"]).
export const PancakeSwap_ForceInclude: string[] = ["Cake", "DAI", "ETH", "TWT", "VAI", "USDT", "BLINK", "BTCB", "ALPHA", "INJ", "CTK", "UNI", "XVS", "BUSD", "HARD", "BIFI", "FRONT"];
export const PancakeSwap_ForceExclude: string[] = [];
export const PancakeSwap_TradingPairsUrl = "https://api.bscgraph.org/subgraphs/name/cakeswap";
export const PancakeSwap_TradingPairsQuery = `
    query pairs {
        pairs(first: 300, orderBy: reserveUSD, orderDirection: desc) {
            id reserveUSD volumeUSD txCount __typename
            token0 {
                id symbol name decimals __typename
            }
            token1 {
                id symbol name decimals __typename
            }
        }
    }
`;
export const PancakeSwap_MinLiquidity = 1000000;
export const PancakeSwap_MinVol24 = 500000;
export const PancakeSwap_MinTxCount24 = 288;

// Force include & exclude config: list of token symbols, or symbol pairs (e.g. ["BAT", "YFI-WETH"]).
export const Uniswap_ForceInclude: string[] = ["TUSD", "STAKE", "YFI", "BAT", "MANA", "1INCH", "REP", "KP3R", "UNI", "WBTC", "HEX", "CREAM", "SLP", "REN", "XOR", "Link", "sUSD", "HEGIC", "RLC", "DAI", "SUSHI", "FYZ", "DYT", "AAVE", "LEND", "UBT", "DIA", "RSR", "SXP", "OCEAN", "MKR", "USDC", "CEL", "BAL", "BAND", "COMP", "SNX", "OMG", "AMPL", "USDT", "KNC", "ZRX", "AXS", "ENJ", "STMX"];
export const Uniswap_ForceExclude: string[] = [];
export const Uniswap_TradingPairsUrl = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2"; // see https://thegraph.com/explorer/subgraph/uniswap/uniswap-v2
export const Uniswap_TradingPairsQuery = `
    query pairs {
        pairs(first: 800, orderBy: reserveUSD, orderDirection: desc) {
            id reserveUSD trackedReserveETH volumeUSD txCount untrackedVolumeUSD __typename
            token0 {
                id symbol name decimals __typename
            }
            token1 {
                id symbol name decimals __typename
            }
        }
    }
`;
export const Uniswap_MinLiquidity = 2000000;
export const Uniswap_MinVol24 = 1000000;
export const Uniswap_MinTxCount24 = 480;

