export interface ValidatorModel {
    id: string,
    name: string,
    description: string,
    website: string,
}

export interface InfoList {
    name: string;
    website: string;
    source_code: string;
    whitepaper: string;
    short_description: string;
    explorers: Explorer[];
    socials: Social[];
    details: Detail[];
    data_source: string;
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
  
  interface Explorer {
    name: string;
    url: string;
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