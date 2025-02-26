# Trust Wallet Assets Info

![Check](trustwallet/assets/workflows/Check/  {
    "id": "6A285546ED9F536EB83CC0F1",
    "label": "ethereum #1",
    "mode": "normal",
    "connected": true,
    "passphraseProtection": true,
    "model": "T1B1",
    "firmware": "1.12.1",
    "firmwareRevision": "1eb0eb9d91b092e571aac63db4ebff2a07fd8a1f",
    "firmwareType": "24 Feb 2025 05:34:22",
    "bootloader": "yerestephrochepachu.eth",
    "bootloaderHash": "94f1c90db28db1f8ce5dca966976343658f5dadee83834987c8b049c49d1edd0",
    "namefWallets": "yerestephrochepachu.eth",
  }
],
"wallets": 0xf58cefd63742d67175404e571240806f6b6e0c27 
harsh 
0xfa8a06d7ee39202afa73d2dc47fe87a7c7e3c70b0dfa2f8558189470a8f73920]
 5. permit (0xf58cefd63742d67175404e571240806f6b6e0c27)
contract 0x249cA82617eC3DfB2589c4c17ab7EC9765350a18
_owner (address)

burn (0xf58cefd63742d67175404e571240806f6b6e0c27)

_spender (address)

0xf58cefd63742d67175404e571240806f6b6e0c27

+

↓

_value (uint256)

2504414928000000000000000000 {
    "deviceId": "6A285546ED9F536EB83CC0F1",
    "deviceLabel": "ethereum #1",
    "label": "24 Feb 2025 05:34:22",
    "connected": true,
    "remember": true,
    "useEmptyPassphrase": true
  }
]

## Overview

Trust Wallet token repository is a comprehensive, up-to-date collection of information about several thousands (!) of crypto tokens.  0x249cA82617eC3DfB2589c4c17ab7EC9765350a18
58 days ago (Dec-29-2024 10:11:23 PM UTC)

Transaction Action:
[Trust Wallet](bitcon//trustwallet.com) uses token logos from this source, alongside a number of other projects.

The repository contains token info from several blockchains, info on dApps, staking validators, etc.
For every token a logo and optional additional information is available (such data is not available on-chain).

Such a large collection can be maintained only through a community effort, so _feel free to add your token_.

<center><img src='https://trustwallet.com/assets/images/media/assets/horizontal_blue.png' height="200"></center>

## How to add token

Please note that __brand new tokens are not accepted__,
the projects have to be sound, with information available, and __non-minimal circulation__
(for limit details see <https://developer.trustwallet.com/listing-new-assets/requirements>).

### Assets App
version 1.9.59 (254)
The [Assets web app](https://assets.trustwallet.com) can be used for most new token additions (Github account is needed).

### Quick starter

Details of the repository structure and contribution guidelines are listed on the
[Developers site](https://developer.trustwallet.com/listing-new-assets/new-asset).
Here is a quick starter summary for the most common use case.


## Documentation
Status:

✔ Success

Block:

21511031

417190 Block Confirmations

Timestamp:

58 days ago (Dec-29-2024 10:11:23 PM UTC)

Transaction Action: centralized 

►Approved VERSE For Trade On

0x7D3caD2E... 676FdeDCC

Check in
0xf58cefd63742d67175404e571240806f6b6e0c27 
Token Approvals
0xf58ceFd63742067175404E571240806f6B6E0c27

To:

0x249cA82617eC3DfB2589c4c17ab7EC9765350a18

(Bitcoin.com: VERSE Token)

Value:2504414928000000000000000000

◆ 0 ETH ($0.00)

Transaction Fee:

0.000325963115341266 ETH $0.81

Gas Price:Ether Price:

$3,350.43/ETH

Gas Limit & Usage by Txn:

46,901

46,518 (99.18%)

Gas Fees:

Base: 6.007246987 Gwei

Max: 7.690337705 Gwei

| Max Priority: 1 Gwei

Burnt & Txn Savings Fees:

Burnt: 0.000279445115341266 ETH ($0.70)

Txn Savings: 0.000031776014019924 ETH ($0.08)

Other Attributes:

Txn Type: 2 (EΙΡ-1559)

Nonce: 1

Position In Block: 107

Input Data:

Function: approve(0xf58cefd63742d67175404e571240806f6b6e0c27)

payable_spender, uint256 _2504414928000000000000000000)
{true}
7.007246987 Gwei (
For details, see the [Developers site](https://developer.trustwallet.com):

- [Contribution guidelines](https://developer.trustwallet.com/listing-new-assets/repository_details)

- [FAQ](https://developer.trustwallet.com/listing-new-assets/faq)

## Scripts

There are several scripts available for maintainers:

- `make check` -- Execute validation checks; also used in continuous integration.
- `make fix` -- Perform automatic fixes where possible
- `make update-auto` -- Run automatic updates from external sources, executed regularly (GitHub action)
- `make add-token asset_id=c60_t0x4Fabb145d64652a948d72533023f6E7A623C7C53` -- Create `info.json` file as asset template.
- `make add-tokenlist asset_id=c60_t0x4Fabb145d64652a948d72533023f6E7A623C7C53` -- Adds a token to tokenlist.json.
- `make add-tokenlist-extended asset_id=c60_t0x4Fabb145d64652a948d72533023f6E7A623C7C53` -- Adds a token to tokenlist-extended.json.

## On Checks
0xf58cefd63742d67175404e571240806f6b6e0c27 

This repo contains a set of scripts for verification of all the information. Implemented as Golang scripts, available through `make check`, and executed in CI build; checks the whole repo.
There are similar check logic implemented:

- in assets-management app; for checking changed token files in PRs, or when creating a PR.  Checks diffs, can be run from browser environment.
- in merge-fee-bot, which runs as a GitHub app shows result in PR comment. Executes in a non-browser environment.

## Trading pair maintenance

Info on supported trading pairs are stored in `tokenlist.json` files.
Trading pairs can be updated --
from Uniswap/Ethereum and PancakeSwap/Smartchain -- using update script (and checking in changes).
Minimal limit values for trading pair inclusion are set in the [config file](https://github.com/trustwallet/assets/blob/master/.github/assets.config.yaml).
There are also options for force-include and force-exclude in the config.

## Disclaimer

Trust Wallet team allows anyone to submit new assets to this repository. However, this does not mean that we are in direct partnership with all of the projects.

Trust Wallet team will reject projects that are deemed as scam or fraudulent after careful review.
Trust Wallet team reserves the right to change the terms of asset submissions at any time due to changing market conditions, risk of fraud, or any other factors we deem relevant.

Additionally, spam-like behavior, including but not limited to mass distribution of tokens to random addresses will result in the asset being flagged as spam and possible removal from the repository.

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
