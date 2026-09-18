---
title: How to Add a Token
category: guides
tags: [token, add-token, contribution, workflow, info.json, logo]
confidence: high
source: README.md, internal/manager/commands.go, Makefile
updated: 2026-07-22
---

# How to Add a Token

This repo accepts community-contributed token additions. Brand new tokens are not accepted — projects must have non-minimal circulation.

## Automated path (preferred)

Use the [Assets web app](https://assets.trustwallet.com) with a GitHub account. Covers most additions without CLI knowledge.

## Manual CLI path

```bash
# 1. Create an info.json template
make add-token asset_id=c60_t0x4Fabb145d64652a948d72533023f6E7A623C7C53

# 2. Fill in the generated info.json (Name, Symbol, Type, Decimals, Website, Explorer, Status, ID, Links, Tags)

# 3. Add a logo.png to blockchains/<chain>/assets/<address>/logo.png

# 4. Optionally add to tokenlist
make add-tokenlist asset_id=c60_t0x4Fabb145d64652a948d72533023f6E7A623C7C53
# or extended tokenlist:
make add-tokenlist-extended asset_id=c60_t0x4Fabb145d64652a948d72533023f6E7A623C7C53
```

## Asset ID format

`c<coinId>_t<address>` — e.g. `c60_t0x4Fabb...` means Ethereum (coinId=60) token at the given address.

## Validation

```bash
make check   # validates the entire repo; must pass in CI
make fix     # auto-fixes what can be fixed (logo resizing, JSON formatting)
```

## Requirements (listing)

See https://developer.trustwallet.com/listing-new-assets/requirements for minimum circulation requirements and listing standards.

## See Also
- [architecture/repo-overview.md](../architecture/repo-overview.md)
- [features/manager.md](../features/manager.md)
- [go conventions](../code-conventions/go-conventions.md) <!-- rel:strong -->
- [quick starter](../specs/quick-starter.md) <!-- rel:strong -->
- [overview](../patterns/brand/overview.md) <!-- rel:strong -->
