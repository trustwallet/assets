# Rainbow Wallet Assets


## Overview
Rainbow Wallet token repository is a comprehensive, up-to-date collection of information about several thousands (!) of crypto tokens.

[Rainbow Wallet](https://rainbow.me) uses token logos from this source

The repository contains token info from several blockchains, info on dApps, staking validators, etc.
For every token a logo and optional additional information is available (such data is not available on-chain).

Such a large collection can be maintained only through a community effort, so _feel free to add your token_.


**Adding an ERC20 token checklist**:
- [ ] Make sure your smartcontract has more than 2,500 address holders, otherwise you will be rejected
- [ ] Fork the Github repository
- [ ] Create folder with name of token smartcontact address in [_checksum format_](https://ethsum.netlify.app/) `blockchains/ethereum/assets/<token_smartcontract_address>/`.
- [ ] Tell your designer that token image must be in PNG format, avoid transparent background, recommended size 256x256px, max. 512x512px, with max file size of 100kB. Please us [Image Optim](https://imageoptim.com/mac) or similar on larger files.
- [ ] Upload your logo with file named `logo.png` to previously created folder with smartcontract address, and if you done all correctly your path should look like this. `blockchains/ethereum/assets/0x1234567461d3f8Db7496581774Bd869C83D51c93/logo.png`
- [ ] Create `info.json` file with info about the token/project
- [ ] Create a pull request to the main repo

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


## Disclaimer
Rainbow Wallet allows anyone to submit new assets to this repository. However, this does not mean that we are in direct partnership with any of these projects.

Rainbow Wallet team will reject projects that are deemed as scam or fraudulent after careful review.
Rainbow Wallet team reserves the right to change the terms of asset submissions at any time due to changing market conditions, risk of fraud, or any other factors we deem relevant.
