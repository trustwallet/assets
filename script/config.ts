export const imageMaxLogoWidth = 512;
export const imageMaxLogoHeight =  512;
export const imageMinLogoWidth =  64;
export const imageMinLogoHeight =  64;
export const imageMaxLogoSizeKb =  100;
export const foldersRootdirAllowedFiles: string[] =  [".github", "blockchains", "dapps", "media", "node_modules", "script-old", "script", "test", ".gitignore", "azure-pipelines.yml", "jest.config.js", "LICENSE", "package-lock.json", "package.json", "README.md", ".git", "dangerfile.ts", "Gemfile", "Gemfile.lock", ".eslintignore", ".eslintrc.js"];
export const binanceUrlTokenAssets =  "https://explorer.binance.org/api/v1/assets?page=1&rows=1000";
export const binanceDexURL = 'https://dex-atlantic.binance.org/api'
export const assetsURL = 'https://raw.githubusercontent.com/trustwallet/assets/master'

export const PancakeSwap_TradingPairsUrl = "https://api.bscgraph.org/subgraphs/name/wowswap";
export const PancakeSwap_TradingPairsQuery = `
    query pairs {
        pairs(first: 200, orderBy: reserveUSD, orderDirection: desc) {
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
export const PancakeSwap_MinLiquidity = 1000000;
export const PancakeSwap_MinVol24 = 500000;
export const PancakeSwap_MinTxCount24 = 288;
export const Uniswap_TradingPairsUrl = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2"; // see https://thegraph.com/explorer/subgraph/uniswap/uniswap-v2
export const Uniswap_TradingPairsQuery = `
    query pairs {
        pairs(first: 400, orderBy: reserveUSD, orderDirection: desc) {
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
