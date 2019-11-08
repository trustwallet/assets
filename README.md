# Trust Wallet Assets Info

```diff
- On November 8th 2019 we made big changes to the repository, please read summary and recomnadations
```

### What changed:
- Assets in fodler `assets` and validators assets in `validators/assets` were changed from lowercased format to checksum format e,g: Binance BEP2: busd-bd1 => BUSD-BD1, Ethreum ERC20 token: 0xfff3ada5a2555a2b59bff4f44dfad90146cce8cb => 0xffF3ada5A2555a2B59BfF4F44DFad90146CcE8CB
- Added scripts that generates white and black list of contract assets list

### What to do next:
- If you first time contributor nothing required, just simple follow repository contribution guidelines
- If you contributed before nad planning on continue please upgrade your fork from latest master or simple delete your fork and fork again to save your time dealing with merge conflicts

## Overview
Hello and welcome to Trust Wallet assets info contribution guide. We appreciate your effort to open-source.
Token repository [https://github.com/trustwallet/assets](https://github.com/trustwallet/assets) (repo) is a source of images used by [Trust Wallet](https://trustwallet.com/) including:

1. [ERC20](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md), ERC223 tokens on Ethereum compatible networks supported by Trust Wallet such as:
  - [Ethereum (ETH)](https://ethereum.org/)
  - [Ethereum Classic (ETC)](https://ethereumclassic.org/)
  - [POA Network (POA)](https://poa.network/)
  - [TomoChain (TOMO)](https://tomochain.com/)
  - [GoChain (GO)](https://gochain.io/)
  - [Wanchain (WAN)](https://wanchain.org/)
  - [Callisto Network (CLO)](https://callisto.network/)
  - [Thunder Token (TT)](https://thundercore.com/)

2. [BEP2](https://github.com/binance-chain/BEPs/blob/master/BEP2.md) Binance DEX token (native marketplace on Binance Chain)

3. [TRC10, TRC20](https://developers.tron.network/docs/trc10-token) tokens on TRON blockchain

4. [coins](https://github.com/satoshilabs/slips/blob/master/slip-0044.md) integrated in [Wallet Core](https://developer.trustwallet.com/wallet-core)

5. dApp images available in `Browser` section in Trust Wallet and at https://dapps.trustwallet.com and bookmarks icons. [read requirments](#dApp-image-naming-requirments)

6. Staking validators info available on [Trust Wallet Staking Platform](https://github.com/trustwallet/developer/blob/master/platform/staking.md)

7. Coming soon: token info, token price

<center><img src='https://raw.githubusercontent.com/trustwallet/assets/master/media/trust-wallet.png'></center>

## Contribution steps

1. Prepare image [requirements](#image-requirements)
2. Get familiar with [folder strcture](#repository-structure), will give you understanding where asset image should be placed
3. [Add asset guide](#how-to-add-asset)

## Image Requirements
- file extension: `png`. Uppercase `PNG` considered invalid.
- name：file name requirements for: `logo.png` name, but [folder naming](#repository-structure) where they placed is most important part of contribution
- size: `256px by 256px`
- background: preferably transparent
- use simple drag and drop online service [tinypng](https://tinypng.com/) to optimize image size

## dApp image naming requirments
- [Folder for upload](https://github.com/trustwallet/assets/tree/master/dapps)
- `<subdomain>.<domain_name>.png` e.g:
  https://app.compound.finance/ => `app.compound.finance.png`
  https://kyberswap.com/ => `kyberswap.com.png`


## Repository structure

`blockchains` folder contains many subfolders and represents chains e.g. `ethereum`, `binance` ...

`assets` folder contains token folders named by smart contract address in `checksum address` for Ethreum like networks and inside of it `logo.png` - image representation. Note: Lowercased or uppercased contract addresses considered invalid. You can find checksum address by searching on [ etherscan.io](https://etherscan.io), for example stablecoin [DAI](https://etherscan.io/address/0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359) checksum address located at the top left corner of the page and has both uppercase and lowercase characters. Or [convert Ethereum address to Checksum address](https://piyolab.github.io/sushiether/RunScrapboxCode/?web3=1.0.0-beta.33&code=https://scrapbox.io/api/code/sushiether/web3.js_-_Ethereum_%E3%81%AE%E3%82%A2%E3%83%89%E3%83%AC%E3%82%B9%E3%82%92%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF%E3%82%B5%E3%83%A0%E4%BB%98%E3%81%8D%E3%82%A2%E3%83%89%E3%83%AC%E3%82%B9%E3%81%AB%E5%A4%89%E6%8F%9B%E3%81%99%E3%82%8B/demo.js). For other networks address must be specified as it was originated on a chain, e.g TRON TRC10: `1002000`, TRON TRC20: `TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t` etc ...

`info` folder contains for now only `logo.png` that represents coin image

`validators` folder contains folders: `assets` same structure as above and `list.json` information about validators. 

`blacklist.json` and `whitelist.json` files you may find in folders like `tron`, `ethereum` but not limited to, contain list of address approved based on many criterias (TODO add criterias) and disapproved based on factors such as scam, outdated, abandoned contracts etc ... .


```
.
├── blockchains
│   └──ethereum
│   │   └──assets
│   │   │  └──0x0a2D9370cF74Da3FD3dF5d764e394Ca8205C50B6 // address folder
│   │   │     └──logo.png // address logo
│   │   └──info
│   │      └──logo.png // coin logo
|   |
|   └──binance
│   │   └──assets
│   │   │  └──ONE-5F9
│   │   │     └──logo.png
│   │   └──info
│   │      └──logo.png
|   └──tron
│   |  └──assets
│   |  │  └──1002000
│   |  │  |   └──logo.png
|   |  |  └──TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t
|   |  |      └──logo.png
|   |  | 
│   |  └──info
│   |     └──logo.png
|   |
|   └──cosmos
│   │   └──info
|   |   |  └──logo.png
|   |   |
│   │   └──validators
│   │   |  └──assets
|   |   |     └──cosmosvaloper1clpqr4nrk4khgkxj78fcwwh6dl3uw4epsluffn
|   |   |        └──logo.png
|   |   |
|   |   └──list.json
├── ...
```


## Common uploads
Uploading:
1. Ethereum ERC20 [token folder](https://github.com/trustwallet/assets/tree/master/blockchains/ethereum/assets)
2. Binance DEX BEP2 token [token folder](https://github.com/trustwallet/assets/tree/master/blockchains/binance/assets)
3. TRON TRC10, TRC20 token [token folder](https://github.com/trustwallet/assets/tree/master/blockchains/tron/assets)
4. Add Cosmos validator image [](https://github.com/trustwallet/assets/tree/master/blockchains/cosmos/validators)
5. Add Tezos validator info [](https://github.com/trustwallet/assets/tree/master/blockchains/tezos/validators/list.json)
6. Add Ethereum contract address to blacklist [](https://github.com/trustwallet/assets/tree/master/blockchains/ethereum/blacklist.json)
7. Add TRON TRC10 ID or TRC20 owner contract address to whitelist [](https://github.com/trustwallet/assets/tree/master/blockchains/tron/whitelist.json)


## How To Add Asset
Process adding new tokens may look complicated at first glance, but once you completed it will be way easier do it next time:

### Easy way
1. [Follow image requirements](#image-requirements)
2. Proceed to [https://github.com/trustwallet/assets](https://github.com/trustwallet/assets)
3. Press on `Fork` in the top right corner, wait for process to complete
4. Navigate to desire chain folder you want to add asset
5. Prepare folder with image on your computer
7. Simply drag and drop folder from step 5 to active window
8. In `Commit changes` box:
  - `Add files via upload` add meaningfull comment what you adding to the repo
  - optional: In `Add an optional extended description` write a comment about upload
  - optional: adjust fork branch nam
9. Click on `Propose changes`
10. Press on `Create pull request`
13. Once tests have completed and verified that your image follows all requirements, a maintainer will merge it. In 5-10 minutes your token will have the updated image instead of plain logo in Trust Wallet

### Easy way for Git user
1. Fork the repo to your own github account
2. Clone fork and create new branch:
```bash
git clone git@github.com:YOUR_HANDLE/assets.git
cd tokens
git branch <branch_name>
git checkout <branch_name>
```
3.  Add asset to appropriate directory, here [folder strcture](#repository-structure) to help you
4. Commit and push to your fork
```bash
git add -A
git commit -m “Add <token_name>”
git push origin <branch_name>
```
5. From your repo clone page make PR


## FAQ
### Why do I still see old logo in Trust Wallet after uploaded new one
Both clients, Android and iOS keep old image cache for up to 7 days. In order to see changes immediately, reinstall Trust Wallet. But as always, make sure you have a backup of all your wallets.

## How to use it? (For Developers)
Base URL for token image:
```js
https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/<contract_address_checksum>/logo.png
```

Base URL for coin image:
```js
https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/<coin_name_lowercase>/info/logo.png
```

Examples:

Coin logo, e.g Bitcoin:
```js
https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png
```

ERC20:
```js
https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x006BeA43Baa3f7A6f765F14f10A1a1b08334EF45/logo.png
```

BEP-2:
```js
https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/assets/ANKR-E97/logo.png
```

TRC-10:
```js
https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/tron/assets/1002000/logo.png
```

TRC-20:
```js
https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/tron/assets/TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t/logo.png
```

## Used in Applications
- [Trust Wallet](https://trustwallet.com) - [iOS](https://itunes.apple.com/us/app/trust-ethereum-wallet/id1288339409) and [Android](https://play.google.com/store/apps/details?id=com.wallet.crypto.trustapp)
- [0x Tracker](https://0xtracker.com) - The 0x Protocol Trade Explorer and news aggregator
- [Uniswap](https://uniswap.exchange) - Uniswap is a protocol for automated token exchange on Ethereum.
- [LinkDrop](https://linkdrop.io/) - A customer acquisition platform for DApps. The easiest crypto onboarding.
