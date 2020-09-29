# Trust Wallet Assets Info

![Check](https://github.com/trustwallet/assets/workflows/Check/badge.svg)

## Overview
Trust Wallet token repository is a comprehensive, up-to-date collection of information about several thousands (!) of crypto tokens.

[Trust Wallet](https://trustwallet.com) uses token logos from this source, alongside a number of other projects.

The repository contains token info from several blockchains, info on dApps, staking validators, etc.
For every token a logo and optional additional information is available (such data is not available on-chain).

Such a large collection can be maintained only through a community effort, so _contributions are welcome_,
primarily from token projects.

Please note that __new tokens are not accepted__,
the projects have to be sound, with information available, and __non-minimal circulation__
(for limit details see https://community.trustwallet.com/t/how-to-submit-a-token-logo/3863#how-to-get-approved).

<center><img src='https://raw.githubusercontent.com/trustwallet/assets/master/media/trust-wallet.png'></center>

## How to add token

Details of the repository structure and contribution guidelines are listed on the
[Developers site](https://developer.trustwallet.com/add_new_asset).
Here is a quick starter summary for the most common use case.

**Adding an ERC20 token checklist**:
- [ ] Make sure your smartcontract has more than 500 address holders, otherwise you will be rejected
- [ ] Fork the Github repository
- [ ] Create folder with name of token smartcontact address in [_checksum format_](https://developer.trustwallet.com/add_new_asset#checksum_format) `blockchains/ethereum/assets/<token_smartcontract_address>/`.
- [ ] Tell your designer that token image must be in PNG format, max size: 512x512px, with max file size of 100kB, for further details read [image rules](https://developer.trustwallet.com/add_new_asset#image-requirements).
- [ ] Upload your logo with file named `logo.png` to previously created folder with smartcontract address, and if you done all correctly your path should look like this. `blockchains/ethereum/assets/0x1234567461d3f8Db7496581774Bd869C83D51c93/logo.png`
- [ ] Create a pull request to the main repo
- [ ] Pay the processing fee

## Documentation

For details, see the [Developers site](https://developer.trustwallet.com/add_new_asset):

- [Contribution guidelines](https://developer.trustwallet.com/add_new_asset#contribution-guidelines)

- [Repository details](https://developer.trustwallet.com/add_new_asset#repository-details)

## Disclaimer
Trust Wallet team allows anyone to submit new assets to this repository. However, this does not mean that we are in direct partnership with all of the projects.

Trust Wallet team will reject projects that are deemed as scam or fraudulent after careful review.
Trust Wallet team reserves the right to change the terms of asset submissions at any time due to changing market conditions, risk of fraud, or any other factors we deem relevant.
