# Sushi Assets Info

![Check](https://github.com/trustwallet/assets/workflows/Check/badge.svg)

# To Add Logo
- [ ] Fork the Github repository

- [ ] Create folder with name of token smartcontact address in **CHECKSUM** format `blockchains/ethereum/assets/<token_smartcontract_address>/`.

- [ ] Tell your designer that token image must be in PNG format, avoid transparent background, recommended size 256x256px, with max file size of 100kB.

- [ ] Upload your logo with file named `logo.png` to previously created folder with smartcontract address, and if you done all correctly your path should look like this. `blockchains/ethereum/assets/0x1234567461d3f8Db7496581774Bd869C83D51c93/logo.png`

- [ ] Run `npm run check` and make sure tests pass

- [ ] Create a pull request to the main repo

- [ ] Add link to sushiswap/default-token-list Issue


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
