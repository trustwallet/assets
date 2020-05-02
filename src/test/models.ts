export interface ValidatorModel {
    id: string,
    name: string,
    description: string,
    website: string,
    staking: Staking
    payout: Payout
    status: ValidatorStatus
}

interface Staking {
  freeSpace: number,
  minDelegation: number
  openForDelegation: boolean
}

interface Payout {
  commission: number // in %
  payoutDelay: number // in cycles
  payoutPeriod: number
}

interface ValidatorStatus {
  disabled: boolean;
  note: string;
}

// Minimal property requirements for asset info file
export interface AssetInfo {
    explorer: string;
    name: string;
    short_description: string;
    website: string;
}

export interface CoinInfoList {
    name: string;
    website: string;
    source_code: string;
    whitepaper: string;
    short_description: string;
    explorer: string;
    socials: Social[];
    details: Detail[];
  }
  
  interface Detail {
    language: string;
    description: string;
  }

  interface Social {
    name: string;
    url: string;
    handle: string;
  }
  
// CoinmarketCap
export interface mapTiker {
    coin: number
    type: mapType
    token_id?: string
    id: number
}

export type mapType = TickerType.Coin | TickerType.Token 

export enum TickerType {
    Token = "token",
    Coin = "coin"
}

export enum PlatformType {
    Ethereum = "Ethereum",
    Binance = "Binance Coin",
    TRON = "TRON",
    OMNI = "Omni",
    VeChain = "VeChain"
}

export interface BakingBadBaker {
  address: string,
  freeSpace: number
  // serviceHealth: string // active or Dead is a working baker who was a public baker but for some reason stopped paying his delegators, Closed is a permanently closed service (we store them for historical purposes only
  fee: number
  minDelegation: number
  openForDelegation: boolean
  payoutDelay: number
  payoutPeriod: number
  serviceHealth: string
}