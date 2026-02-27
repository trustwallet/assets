---
name: add-asset
description: Add a new token asset to the Trust Wallet assets repository. Use when the user wants to list a token, add a token logo, submit a new asset to trustwallet/assets, update info.json, or fix a logo for an existing token.
---

# Add Asset to Trust Wallet

Step-by-step guide for contributing a new token logo and metadata to [`trustwallet/assets`](https://github.com/trustwallet/assets).

## Before You Start — Requirements

**Brand new tokens are not accepted.** The project must:
- Have a mainnet launch with non-minimal circulation
- Have publicly available information and documentation
- Not exhibit spam-like behavior (e.g. mass airdrops)

Full requirements: `developer.trustwallet.com/listing-new-assets/requirements`

---

## Repository Structure

```
blockchains/
└── <chain>/
    └── assets/
        └── <address>/
            ├── logo.png     ← required
            └── info.json    ← required
```

**Chain slug examples**: `ethereum`, `smartchain` (BNB Chain), `polygon`, `solana`, `arbitrum`, `optimism`, `base`, `avalanchec`, `tron`, `ton`, `cosmos`

**Address format**:
- EVM chains: EIP-55 checksum address (e.g. `0xdAC17F958D2ee523a2206206994597C13D831ec7`)
- Solana: base58 mint address
- Other chains: native token ID

---

## Step-by-Step: Adding a Token

### Option A — Web app (easiest, no CLI needed)
Go to `assets.trustwallet.com` and follow the UI. GitHub account required.

### Option B — Manual PR

**1. Fork and clone the repo**
```bash
git clone https://github.com/<your-username>/assets.git
cd assets
```

**2. Scaffold the info.json**
```bash
make add-token asset_id=c60_t0x<ContractAddress>
# Example for USDC on Ethereum:
make add-token asset_id=c60_t0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
```
This creates `blockchains/ethereum/assets/0xA0b86991.../info.json`.

**Asset ID format**:
- `c<slip44>_t<address>` for tokens (c60 = Ethereum, c20000714 = BNB Chain, c501 = Solana)
- Full list of coin IDs: `github.com/trustwallet/wallet-core/blob/master/registry.json`

**3. Fill in info.json**
```json
{
    "name": "USD Coin",
    "website": "https://centre.io",
    "description": "USDC is a fully collateralized US dollar stablecoin.",
    "explorer": "https://etherscan.io/token/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    "type": "ERC20",
    "symbol": "USDC",
    "decimals": 6,
    "status": "active",
    "id": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    "tags": ["stablecoin"],
    "links": [
        { "name": "x", "url": "https://x.com/centre_io" },
        { "name": "coinmarketcap", "url": "https://coinmarketcap.com/currencies/usd-coin/" },
        { "name": "coingecko", "url": "https://coingecko.com/en/coins/usd-coin" }
    ]
}
```

**Required fields**: `name`, `symbol`, `decimals`, `type`, `status`, `id`

**`type` values**: `ERC20`, `BEP20`, `BEP2`, `SPL`, `TRC20`, `POLYGON`, `ARBITRUM`, `OPTIMISM`, `BASE`, `AVAXC`, `TON_JET`

**`status` values**: `active`, `abandoned`, `spam`

**`tags` values**: `stablecoin`, `wrapped`, `defi`, `nft`, `governance`, `meme`, `bridge`

**4. Add logo.png**

Place `logo.png` in the same directory as `info.json`:
```
blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png
```

**Logo requirements**:
- Format: PNG
- Size: exactly **256×256 pixels**
- File size: under **100KB**
- Transparent background preferred
- Must be clearly recognizable at small sizes

**5. Validate**
```bash
make check   # full validation — must pass before opening PR
make fix     # auto-fix common issues (resizes images, formats JSON)
```

**6. Optionally add to tokenlist**
```bash
make add-tokenlist asset_id=c60_t0x<ContractAddress>
make add-tokenlist-extended asset_id=c60_t0x<ContractAddress>
```

**7. Open a PR** against the `master` branch of `trustwallet/assets`

---

## Common Validation Errors

| Error | Fix |
|-------|-----|
| Logo wrong dimensions | Must be exactly 256×256px — run `make fix` or resize manually |
| Logo file too large | Compress the PNG to under 100KB |
| Address not checksummed | Use EIP-55 checksum — convert with `web3.utils.toChecksumAddress()` |
| Missing required fields | Ensure `name`, `symbol`, `decimals`, `type`, `status`, `id` are all present |
| Invalid `type` value | Must be one of the supported type strings (see above) |
| Duplicate asset | Token already exists — check `blockchains/<chain>/assets/<address>/` |

---

## CDN URL (after merge)

Once merged, the logo is served at:
```
https://assets-cdn.trustwallet.com/blockchains/<chain>/assets/<address>/logo.png
```

Example:
```
https://assets-cdn.trustwallet.com/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png
```

---

## Available make commands

```bash
make check                                  # validate entire repo (runs in CI)
make fix                                    # auto-fix resizable/formattable issues
make add-token asset_id=<id>               # scaffold info.json
make add-tokenlist asset_id=<id>           # add to tokenlist.json
make add-tokenlist-extended asset_id=<id>  # add to tokenlist-extended.json
make update-auto                           # sync from external sources (maintainers only)
```
