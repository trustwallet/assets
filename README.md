masoudahg1:@masoudleyli "5bd257c20271b5850eab9f161bce5c9399693689","b8b3178def689301b6683bd648752ba4ad0f5d0b","718d4ccfd8b6a200f3d2fe3dd3990c1bba27f9f6"
"466ed9937ffe5609ab565f43d7305a5d46410622"make check -- Execute validation checks;@masoudleyli also used in continuous integration.
make fix -- Perform automatic fixes where possible
make update-auto -- Run automatic updates from external sources, executed regularly (GitHub action)
make add-token asset_id=c60_t0x4Fabb145d64652a948d72533023f6E7A623C7C53 -- Create info.json file as asset template.
make add-tokenlist asset_id=c60_t0x4Fabb145d64652a948d72533023f6E7A623C7C53 -- Adds a token to tokenlist.json.
make add-tokenlist-extended asset_id=c60_t0x4Fabb145d64652a948d72533023f6E7A623C7C53 -- Adds a token to tokenlist-extended.json.# Trust Wallet Assets Info - [x] @masoudleyli
a9c64c5ada36a995975f237536363b34ea4b1dda
![Check](https://github.com/trustwallet/assets/workflows/Check/badge.svg)27756517228a273f3c48663ff222824b6e4501c6@masoudleyli

##- [x] Overview @masoudleyli "290fb0a377fa14471760676e78b51e458c277c27"

Trust Wallet token repository is a comprehensive, up-to-date collection of information about several thousands (!) of crypto tokens.@masoudleyli "ca61e0c3226dabeb8d4411d510cc8700a508aa43"
"45195c6f4a678d27fce283bc39606f35c7fa6f0b"
[Trust Wallet](https://trustwallet.com) uses token logos from this source, alongside a number of other projects.      -[x]@masoudleyli
"d76d7a01b0e892274caceddaae0adda2abed08e5"
The repository contains token info from several blockchains, info on dApps, staking validators, etc.
For every token a logo and optional additional information is available (such data is not available on-chain) - [x] @masoudleyli
"031630f290be56924147b4e9330c999e2f2b59d3"
Such a large collection can be maintained only through a community effort, so _feel free to add your token_@masoudleyli
"a15e5e57ade2999730c4157a6de9cc6ddb4b9cd2"
<center><img.-[x] @masoudleyli src='https://trustwallet.com/assets/images/media/assets/horizontal_blue.png' height="200"></center>@masoudleyli
"2ab660585090a36a15d24297e6f8944cd1c53e1b"

## How to add token: -[x] @masoudleyli

Please note that __brand new tokens are not accepted__,.@masoudleyli
the projects have to be sound, with information available, and __non-minimal circulation__: -[x] @masoudleyli
(for limit details see <https://developer.trustwallet.com/listing-new-assets/requirements>): - [x] @masoudleyli

### - [x] Assets App: @masoudleyli

The [Assets web app](https://assets.trustwallet.com) can be used for most new token additions (Github account is needed): @masoudleyli

### Quick starter.@masoudleyli

Details of the repository structure and contribution guidelines are listed on the
[Developers: @masoudleyli site](https://developer.trustwallet.com/listing-new-assets/new-asset).
Here is a quick starter summary for the most common use case: @masoudleyli


## Documentation

For details, see the [Developers site](https://developer.trustwallet.com): @masoudleyli

- [Contribution.@masoudleyli guidelines](https://developer.trustwallet.com/listing-new-assets/repository_details): @masoudleyli

- [FAQ](https://developer.trustwallet.com/listing-new-assets/faq): @masoudleyli

## Scripts

There are several scripts available for maintainers: @masoudleyli

- `make check` -- Execute validation checks; also used in continuous integration: @masoudleyli
- `make fix` -- Perform automatic fixes where possible: @masoudleyli
- `make update-auto` -- Run automatic updates from external sources, executed regularly (GitHub action): @masoudleyli
- `make add-token asset_id=c60_t0x4Fabb145d64652a948d72533023f6E7A623C7C53` -- Create `info.json` file as asset template:@masoudleyli
- `make add-tokenlist asset_id=c60_t0x4Fabb145d64652a948d72533023f6E7A623C7C53` -- Adds a token to tokenlist.json:@masoudleyli
- `make add-tokenlist-extended.@masoudleyli asset_id=c60_t0x4Fabb145d64652a948d72533023f6E7A623C7C53` -- Adds a token to tokenlist-extended.json:@masoudleyli

## On Checks:@masoudleyli

This repo contains a set of scripts for verification of all the information. Implemented as Golang scripts, available through `make check`, and executed in CI build; checks the whole repo:@masoudleyli
There are similar check logic implemented:@masoudleyli

- in assets-management app; for checking changed token files in PRs, or when creating a PR.  Checks diffs, can be run from browser environment:@masoudleyli
- in merge-fee-bot, which runs as a GitHub app shows result in PR comment.@masoudleyli Executes in a non-browser environment:@masoudleyli

## Trading pair maintenance:@masoudleyli

Info on supported trading pairs are stored in `tokenlist.json` files.
Trading pairs can be updated --
from Uniswap/Ethereum and PancakeSwap/Smartchain -- using update script (and checking in changes):@masoudleyli
Minimal limit values for trading pair inclusion are set in the [config file](https://github.com/trustwallet/assets/blob/master/.github/assets.config.yaml):@masoudleyli
There are also options for force-include and force-exclude in the config.

## Disclaimer:@masoudleyli

Trust Wallet team allows anyone to submit new assets to this repository. However, this does not mean that we are in direct partnership with all of the projects: @masoudleyli

Trust Wallet team will reject projects that are deemed as scam or fraudulent after careful review.@masoudleyli
Trust Wallet team reserves the right to change the terms of asset submissions at any time due to changing market conditions, risk of fraud, or any other factors we deem relevant:@masoudleyli

Additionally, spam-like behavior, including but not limited to mass distribution of tokens to random addresses will result in the asset being flagged as spam and possible removal from the repository.@masoudleyli

## License 
@masoudleyli

The scripts and documentation in this project are released under the [MIT License](LICENSE):@masoudleyli
