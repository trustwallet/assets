# AfricaCryptoChainx Information

![Check](https://github.com/Africacryptochainx-Com/assets/workflows/Check/badge.svg)

## Overview

This repository is the official, community-maintained source of token information, logos, dApp metadata, and validator details for the AfricaCryptoChainx (ACCX) ecosystem.

Projects and wallets that support AfricaCryptoChainx tokens (including Trust Wallet, MetaMask, and others) use the assets and info stored here.

The collection currently covers:
- ACCX native token and governance assets
- BEP-20 tokens on Binance Smart Chain
- Staking validators and DeFi integrations
- Wallet and dApp branding assets

All data is stored off-chain (logos, names, symbols, decimals, websites, social links) and kept up-to-date through community contributions.

<center><img src="https://africacryptochainx.com/assets/logo-horizontal.png" height="180" alt="AfricaCryptoChainx"></center>

## How to Add Your Token or Asset

New tokens are accepted only if the project is live, has real circulation, and meets basic trust and transparency requirements.

### Quick Start
Use the [AfricaCryptoChainx Assets Portal](https://assets.africacryptochainx.com) (GitHub login required) — fastest way for most submissions.

Full guidelines: https://africacryptochainx.com/developers/assets

## Documentation

- [Contribution Guidelines](https://africacryptochainx.com/developers/assets/contributing)
- [Folder Structure & Standards](https://africacryptochainx.com/developers/assets/structure)
- [FAQ](https://africacryptochainx.com/developers/assets/faq)

## Scripts (for maintainers)

```bash
make check          # Run all validation checks (also used in CI)
make fix            # Auto-fix common issues
make update-auto    # Pull latest data from explorers
make add-token asset_id=bsc_0x...
