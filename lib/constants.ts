// OPM Token Contract Details - CORRECT ADDRESS from Etherscan
export const OPM_TOKEN_ADDRESS = "0xE430b07F7B168E77B07b29482DbF89EafA53f484"
export const OPM_TOKEN_DECIMALS = 18
export const OPM_TOKEN_SYMBOL = "OPM"
export const OPM_TOKEN_NAME = "One Premium"

// SolidityScan audit URL
export const SOLIDITYSCAN_AUDIT_URL = `https://solidityscan.com/quickscan/${OPM_TOKEN_ADDRESS}/etherscan/mainnet?ref=etherscan`

// Pool address for price fetching from CoinMarketCap DEX / DexScreener
export const OPM_POOL_ADDRESS = "0x1ddb29e16c6b0cc23fea7fd42cf3f6bd368b30c0"

// CoinMarketCap DEX URL
export const CMC_DEX_URL = `https://dex.coinmarketcap.com/token/ethereum/${OPM_TOKEN_ADDRESS.toLowerCase()}/`

// Total Supply
export const OPM_TOTAL_SUPPLY = 10000

// API Keys
export const INFURA_RPC_URL = `https://mainnet.infura.io/v3/9c92c4342f06467a9b4f2f16000ccc53`
export const ALCHEMY_RPC_URL = `https://eth-mainnet.g.alchemy.com/v2/bXZiur2MRzEUy6xNpd2Fl`
export const ETHERSCAN_API_KEY = "K7NFZ3QVDRHN2GGB9T8CB8IX3FNQA1928E"

// Web3Auth client ID
export const WEB3AUTH_CLIENT_ID =
  "BGulFmPBWvkKW0zOerAgF5w0OFUcuG3RVO6NS30YvsT6l7Cv7s_3sN-PD-mMmdDs4GTh_qoF97XpkJTacgULkyY"

// Contact
export const CONTACT_EMAIL = "kontakt@onepremium.de"
export const WEBSITE_URL = "https://onepremium.de"
export const TWITTER_URL = "https://x.com/onepremiumtoken"
export const TELEGRAM_URL = "https://t.me/onepremiumcoin"

// Uniswap URLs
export const UNISWAP_BUY_URL = `https://app.uniswap.org/swap?outputCurrency=${OPM_TOKEN_ADDRESS}`
export const DEXTOOLS_URL = `https://www.dextools.io/app/en/ether/pair-explorer/${OPM_POOL_ADDRESS}`
export const ETHERSCAN_TOKEN_URL = `https://etherscan.io/token/${OPM_TOKEN_ADDRESS}`

// ERC20 ABI for balanceOf
export const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    type: "function",
  },
] as const

// Creator wallet address that is exempt from lock period
export const CREATOR_WALLET_ADDRESS = "0x1234567890123456789012345678901234567890" // Replace with actual creator wallet

// Mining/Staking Config
export const MINING_APY = 12 // 12% APY
export const MIN_MINING_AMOUNT = 1 // Minimum 1 OPM to mine
export const MINING_REWARD_INTERVAL = 86400 // Daily rewards in seconds

// Tier thresholds
export const TIER_THRESHOLDS = {
  STARTER: 0,
  BRONZE: 100,
  SILVER: 500,
  GOLD: 1000,
  PLATINUM: 2500,
  DIAMOND: 5000,
}

export const TIER_BENEFITS = {
  STARTER: { discount: 0, label: "Starter", color: "#9CA3AF" },
  BRONZE: { discount: 5, label: "Bronze", color: "#CD7F32" },
  SILVER: { discount: 10, label: "Silver", color: "#C0C0C0" },
  GOLD: { discount: 20, label: "Gold", color: "#D4A537" },
  PLATINUM: { discount: 35, label: "Platinum", color: "#E5E4E2" },
  DIAMOND: { discount: 50, label: "Diamond", color: "#B9F2FF" },
}
