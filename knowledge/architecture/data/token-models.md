---
title: Token & Coin Data Models
category: architecture
tags: [models, asset, coin, token, schema, info.json]
confidence: high
source: internal/info/model.go, internal/config/validators.go
updated: 2026-07-22
---

# Token & Coin Data Models

## AssetModel (internal/info/model.go)

Represents an individual token's `info.json`. Key fields:

| Field | Meaning |
|-------|---------|
| `Name`, `Symbol` | Human-readable identifiers |
| `Type` | Token type (`ERC20`, `BEP20`, `SPL`, etc.) |
| `Decimals` | On-chain decimal precision |
| `Status` | `active`, `abandoned`, `spam`, `scam` |
| `ID` | The on-chain contract address / token ID |
| `Links` | List of `{Name, URL}` pairs (website, twitter, telegram, etc.) |
| `Tags` | Freeform community tags |
| `DataSource` | Origin hint for auto-updated fields |
| `X`, `CoinMarketcap` | Social/market data links |

Required fields enforced by `ValidateAssetRequiredKeys`: `Name`, `Symbol`, `Type`, `Decimals`, `Website`, `Explorer`, `Status`, `ID`. Checked via `isEmpty()`.

## CoinModel (internal/info/model.go)

Represents a blockchain's native coin `info.json`. Fields overlap with `AssetModel` but without `ID`, `Address`, `DataSource`, `Audit`, `Code`, `ExplorerEth`, `X`, `CoinMarketcap`.

Required fields: `Name`, `Website`, `Description`, `Explorer`, `Symbol`, `Type`, `Decimals`, `Status`. Tags validated against allowed list.

## Folder structure validators (internal/config/validators.go)

| Struct | AllowedFiles / HasFiles |
|--------|------------------------|
| `RootFolder` | Defines allowed top-level files + skip lists |
| `ChainFolder` | Allowed files per chain dir |
| `AssetFolder` | Allowed files per asset dir (e.g. `logo.png`, `info.json`) |
| `ChainInfoFolder` | Required files for chain info |
| `ChainValidatorsAssetFolder` | Required staking validator asset files |
| `DappsFolder` | Allowed extension for dapp files |

## See Also
- [config system](../../libs/config-system.md) <!-- rel:strong -->
- [config](../../libs/config.md) <!-- rel:related -->
- [add token](../../guides/add-token.md) <!-- rel:weak -->
- [info](../../features/info.md) <!-- rel:weak -->
- [validator fixer updater](../../patterns/validator-fixer-updater.md) <!-- rel:weak -->
