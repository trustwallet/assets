# Bridge Wallet Assets Info

## Overview
This is a fork of the Trust Wallet token repository, which is a comprehensive collection of information about several thousands (!) of crypto tokens.

[Bridge Wallet](https://www.mtpelerin.com/bridge-wallet) uses token logos from this source.

The reason for this fork is the switch of Trust Wallet policy from a free, community driven repository to a paying repository where users need to pay a fee to add a new asset to the list. We therefore decided to take it from there and maintain it on our own, keeping the free policy for adding new assets.

The repository contains token info from several blockchains, info on dApps, staking validators, etc.
For every token a logo and optional additional information is available (such data is not available on-chain).

Such a large collection can be maintained only through a community effort, so _feel free to add your token_.

## Contribution Quick Start

**Adding an ERC20 token**:
- fork the Github repository
- prepare a logo file, according to the
listed [image rules](https://developer.trustwallet.com/add_new_asset#image-requirements), but must importantly:
PNG format, max. pixel size of 512x512 and max. file size of 100kB.
- add/upload the logo file named `logo.png` to the folder `blockchains/ethereum/assets/<contract>`,
where the last part is the token contract address in  
[_checksum format_](https://developer.trustwallet.com/add_new_asset#checksum_format)
such as
`blockchains/ethereum/assets/0x1234567461d3f8Db7496581774Bd869C83D51c93/logo.png`.
- Create a PR to this repo

## Original Documentation

For more information, see the original Trust Wallet documentation on their [developers site](https://developer.trustwallet.com/add_new_asset):

- [Contribution guidelines](https://developer.trustwallet.com/add_new_asset#contribution-guidelines)

- [FAQ](https://developer.trustwallet.com/assets/faq)

## Scripts

There are several scripts available for maintainers:

- `npm run check` -- Execute validation checks; also used in continuous integration.
- `npm run check-sanity` -- Strict subset of checks
- `npm run fix` -- Perform automatic fixes where possible
- `npm run fix-sanity` -- Stricter subset
- `npm run updateAuto` -- Run automatic updates from external sources, executed regularly (GitHub action)
- `npm run update` -- Run manual updates from external sources, for manual use.
- `npm test` -- Run script unit tests
- `npm lint` -- Run Lint static code check

## On Checks

This repo contais a set of scripts for verification of all the information.  Implemented as Typescript scripts, available through `npm run check`, and executed in CI build; checks the whole repo.
There are similar check logic implemeted:
- in assets-management app; for checking changed token files in PRs, or when creating a PR.  Implemented as a Typescript library, checks diffs, can be run from browser environment.
- in merge-fee-bot, which runs as a GitHub app shows result in PR comment.  Also uses library, but executes in a non-browser environment.

## Trading pair maintenance

Info on supported trading pairs are stored in `tokenlist.json` files.
Trading pairs can be updated --
from Uniswap/Ethereum and PancakeSwap/Smartchain -- using update script (and checking in changes).
Minimal limit values for trading pair inclusion are set in the `config.ts` file.
There are also options for force-include and force-exclude in the config.

## Disclaimer
Mt Pelerin allows anyone to submit new assets to this repository. However, this does not mean that we are in direct partnership with all of the projects.

Mt Pelerin will reject projects that are deemed as scam or fraudulent after careful review.
Mt Pelerin reserves the right to change the terms of asset submissions at any time due to changing market conditions, risk of fraud, or any other factors we deem relevant.

Additionally, spam-like behavior, including but not limited to mass distribution of tokens to random addresses will result in the asset being flagged as spam and possible removal from the repository.
