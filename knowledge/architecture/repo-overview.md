---
title: Assets Repository Overview
category: architecture
tags: [assets, token-registry, blockchain, trust-wallet, overview]
confidence: high
source: README.md, internal/, blockchains/, .github/assets.config.yaml
updated: 2026-07-22
---

# Assets Repository Overview

Trust Wallet Assets is the community-maintained registry of crypto token information: logos, `info.json` metadata, and trading-pair tokenlists for ~188 blockchains. It is the canonical source that the Trust Wallet app and CDN (`https://assets-cdn.trustwallet.com`) pull token logos and metadata from.

## Domain

**Asset registry & validation** — the repo owns token metadata (logos, names, decimals, links, tags) and the Go tooling that validates and manages it. It does NOT contain any wallet logic, keys, or transaction handling.

## Directory Layout

| Path | Purpose |
|------|---------|
| `blockchains/<chain>/` | Per-chain directory containing `info/`, `assets/`, `tokenlist.json`, `tokenlist-extended.json`, `chainlist.json` |
| `blockchains/<chain>/assets/<address>/` | Per-token directory: `logo.png` + optional `info.json` |
| `dapps/` | DApp info files (logo, metadata) |
| `cmd/main.go` | CLI entry-point — delegates to `internal/manager` |
| `internal/` | All Go business logic (config, info, manager, processor, report, service) |
| `.github/assets.config.yaml` | Central validator configuration (allowed files per folder type, external API URLs) |

## Ships

A compiled Go binary (`bin/assets`) that exposes commands: `check`, `fix`, `update-auto`, `add-token`, `add-tokenlist`, `add-tokenlist-extended`. The binary is used by CI and maintainers — it is NOT deployed as a service.

## Consumers

- Trust Wallet mobile app — loads logos and token info from the CDN backed by this repo
- `assets-management` web app — uses the Assets Manager API for PR-based token additions
- External projects (e.g. Uniswap, other wallets) — consume token logos from the public GitHub URLs

## See Also
- [architecture/layers.md](layers.md)
- [architecture/call-graph.md](call-graph.md)
- [features/service.md](../features/service.md)
- [overview](../patterns/brand/overview.md) <!-- rel:strong -->
- [go conventions](../code-conventions/go-conventions.md) <!-- rel:strong -->
