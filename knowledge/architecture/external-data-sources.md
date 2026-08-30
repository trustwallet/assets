---
title: External Token Data Fetching
category: architecture
tags: [external, erc20, spl, trc20, trc10, scraping, update-auto, integration]
confidence: high
source: internal/info/external/, internal/processor/validators.go
updated: 2026-07-22
---

# External Token Data Fetching

The `update-auto` command enriches token metadata from external blockchain data sources. All fetchers live in `internal/info/external/`.

## Sources

| Fetcher | Chain | Fields fetched | API |
|---------|-------|----------------|-----|
| `GetTokenInfoForERC20` | Ethereum & EVM | `Decimals`, `HoldersCount` | Etherscan-compatible API (via scraping) |
| `GetTokenInfoForSPL` | Solana | `Decimals`, `HoldersCount` | Solana token program API |
| `GetTokenInfoForTRC10` | Tron (TRC10) | `Symbol`, `Decimals`, `HoldersCount` | Tron API |
| `GetTokenInfoForTRC20` | Tron (TRC20) | `Symbol`, `Decimals`, `HoldersCount` | Tron API |
| `GetTokenInfoByScraping` | Other chains | Various | HTML scraping (4 call sites) |

## Dispatcher

`info.GetTokenInfo(tokenID)` dispatches to the appropriate chain-specific fetcher based on token ID format, then falls back to `GetTokenInfoByScraping` for unsupported chains.

## Trading pair updates

Trading-pair info (for `tokenlist.json`) is fetched from Uniswap/Ethereum and PancakeSwap/BSC. The `TradingPair` and `TradingPairs` models in `internal/processor/model.go` represent pairs with reserve USD, volume USD, and token metadata.

## Config

External API base URLs are configured in `.github/assets.config.yaml` under `client_urls` (Binance DEX/explorer, Assets Manager API) and `urls` (CDN base, logo base).

## See Also
- [architecture/data/models.md](data/models.md)
- [features/info.md](../features/info.md)
- [features/processor.md](../features/processor.md)
- [trading pair maintenance](../ci/workflows/trading-pair-maintenance.md) <!-- rel:strong -->
- [go conventions](../code-conventions/go-conventions.md) <!-- rel:strong -->
