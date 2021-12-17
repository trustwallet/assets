export interface TagDescription {
    id: string;
    name: string;
    description: string;
}

export const TagValues: TagDescription[] = [
    {
        id: "stablecoin",
        name: "Stablecoin",
        description: "Tokens that are fixed to an external asset, e.g. the US dollar."
    },
    {
        id: "wrapped",
        name: "Wrapped",
        description: "Tokens that are wrapped or peg representation of digital assets. Excluded stablecoins"
    },
    {
        id: "synthetics",
        name: "Synthetics",
        description: "Synthetic assets created to track the value of another asset"
    },
    {
        id: "nft",
        name: "NFT",
        description: "Non-fungible tokens or tokens associated with the NFT ecosystem."
    },
    {
        id: "governance",
        name: "Governance",
        description: "Tokens that used to participate in the governance process of the project."
    },
    {
        id: "defi",
        name: "DeFi",
        description: "Tokens that are used for variety of decentralized financial applications."
    },
    {
        id: "staking",
        name: "Staking",
        description: "Tokens that are used for staking to receive rewards."
    },
    {
        id: "staking-native",
        name: "Staking Native",
        description: "Coins/Blockchains that are used for staking to secure the network to receive rewards."
    },
    {
        id: "privacy",
        name: "Privacy",
        description: "Privacy tokens."
    },
    {
        id: "nsfw",
        name: "NSFW",
        description: "Content Not suitable for work."
    },
    {
        id: "binance-peg",
        name: "Binance-Peg",
        description: "Binance-Peg tokens."
    },
    {
        id: "deflationary",
        name: "Deflationary",
        description: "Tokens that are deflationary or use mechanism to burn a token on transfer/swap."
    }
];
