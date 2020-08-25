# Bridge Wallet Assets Info

## Overview
This is a fork of the Trust Wallet token repository, which is a comprehensive collection of information about several thousands (!) of crypto tokens.

[Bridge Wallet](https://www.mtpelerin.com/bridge-wallet) uses token logos from this source.

The reason for this fork is the switch of Trust Wallet policy from a free, community driven repository to a paying repository where users need to pay a fee to add a new asset to the list. We therefore decided to take it from there and maintain it on our own, keeping the free policy for adding new assets.

The repository contains token info from several blockchains, info on dApps, staking validators, etc.
For every token a logo and optional additional information is available (such data is not available on-chain).

Such a large collection can be maintained only through a community effort, so _contributions are welcome_,
primarily from token projects.

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

For details, see the [developers site](https://developer.trustwallet.com/add_new_asset):

- [Contribution guidelines](https://developer.trustwallet.com/add_new_asset#contribution-guidelines)

- [Repository details](https://developer.trustwallet.com/add_new_asset#repository-details)

## Disclaimer
Mt Pelerin allows anyone to submit new assets to this repository. However, this does not mean that we are in direct partnership with all of the projects.

Mt Pelerin will reject projects that are deemed as scam or fraudulent after careful review.
Mt Pelerin reserves the right to change the terms of asset submissions at any time due to changing market conditions, risk of fraud, or any other factors we deem relevant.
