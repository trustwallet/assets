# Trust Wallet Assets Info

![Periodic Update](https://github.com/trustwallet/assets/workflows/Periodic%20External%20Update/badge.svg)

## Overview
Trust Wallet token repository is a comprehensive, up-to-date collection of information about several thousands (!) of crypto tokens.

[Trust Wallet](https://trustwallet.com) uses token logos from this source, alongside a number of other projects.

The repository contains token info from several blockchains, info on dApps, staking validators, etc.
For every token a logo and optional additional information is available (such data is not available on-chain).

Such a large collection can be maintained only through a community effort, so _contributions are welcome_,
primarily from token projects.

<center><img src='https://raw.githubusercontent.com/trustwallet/assets/master/media/trust-wallet.png'></center>

## Contribution Quick Start

Details of the repository structure and contribution guidelines are listed on the
[Developers site](https://developer.trustwallet.com/add_new_asset).
Here is a quick starter summary for the most common use case.

For **adding an ERC20 token**:
- fork the Github repository
- prepare a logo file, according to the
listed [image rules](https://developer.trustwallet.com/add_new_asset#image-requirements), but must importantly:
PNG format, max. pixel size of 512x512 and max. file size of 100kB.
- add/upload the logo file named `logo.png` to the folder `blockchains/ethereum/assets/<contract>`,
where the last part is the token contract address in  
[_checksum format_](https://developer.trustwallet.com/add_new_asset#checksum_format)
such as
`blockchains/ethereum/assets/0x1234567461d3f8Db7496581774Bd869C83D51c93/logo.png`.
- Create a PR to the main repo
- Pay the processing fee

## Documentation

For details, see the [Developers site](https://developer.trustwallet.com/add_new_asset):

- [Contribution guidelines](https://developer.trustwallet.com/add_new_asset#contribution-guidelines)

- [Repository details](https://developer.trustwallet.com/add_new_asset#repository-details)

## Disclaimer
Trust Wallet team allows anyone to submit new assets to this repository. However, this does not mean that we are in direct partnership with all of the projects.

Trust Wallet team will reject projects that are deemed as scam or fraudulent after careful review.
Trust Wallet team reserves the right to change the terms of asset submissions at any time due to changing market conditions, risk of fraud, or any other factors we deem relevant.
