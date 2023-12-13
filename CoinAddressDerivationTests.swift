// Copyright © 2017-2020 Trust Wallet.
//
// This file is part of Trust. The full Trust copyright notice, including
// terms governing use, modification, and redistribution, is contained in the
// file LICENSE at the root of the source code distribution tree.

import XCTest
import WalletCore

class CoinAddressDerivationTests: XCTestCase {

    func testDerive() {
        let wallet = HDWallet(mnemonic: "shoot island position soft burden budget tooth cruel issue economy destroy above", passphrase: "")!

        for _ in 0..<4 {
            for coin in CoinType.allCases {
                let privateKey = wallet.getKeyForCoin(coin: coin)
                let derivedAddress = coin.deriveAddress(privateKey: privateKey)
                let address = coin.address(string: derivedAddress)

                switch coin {
                case .acala:
                    let expectedResult = "25GGezx3LWFQj6HZpYzoWoVzLsHojGtybef3vthC9nd19ms3"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .aeternity:
                    let expectedResult = "ak_QDHJSfvHG9sDHBobaWt2TAGhuhipYjEqZEH34bWugpJfJc3GN"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .aion:
                    let expectedResult = "0xa0629f34c9ea4757ad0b275628d4d02e3db6c9009ba2ceeba76a5b55fb2ca42e"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .algorand:
                    let expectedResult = "JTJWO524JXIHVPGBDWFLJE7XUIA32ECOZOBLF2QP3V5TQBT3NKZSCG67BQ"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .bandChain:
                    let expectedResult = "band1624hqgend0s3d94z68fyka2y5jak6vd7u0l50r"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .binance:
                    let expectedResult = "bnb12vtaxl9952zm6rwf7v8jerq74pvaf77fcmvzhw"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .tbinance:
                    let expectedResult = "tbnb12vtaxl9952zm6rwf7v8jerq74pvaf77fkw9xhl"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .bitcoin:
                    let expectedResult = "bc1quvuarfksewfeuevuc6tn0kfyptgjvwsvrprk9d"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .bitcoinDiamond:
                    let expectedResult = "1KaRW9xPPtCTZ9FdaTHduCPck4YvSeEWNn"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .bitcoinCash:
                    let expectedResult = "bitcoincash:qpzl3jxkzgvfd9flnd26leud5duv795fnv7vuaha70"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .bitcoinGold:
                    let expectedResult = "btg1qwz9sed0k4neu6ycrudzkca6cnqe3zweq35hvtg"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .callisto:
                    let expectedResult = "0x3E6FFC80745E6669135a76F4A7ce6BCF02436e04"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .cardano:
                    let expectedResult = "addr1qyr8jjfnypp95eq74aqzn7ss687ehxclgj7mu6gratmg3mul2040vt35dypp042awzsjk5xm3zr3zm5qh7454uwdv08s84ray2"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .cosmos:
                    let expectedResult = "cosmos142j9u5eaduzd7faumygud6ruhdwme98qsy2ekn"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .dash:
                    let expectedResult = "XqHiz8EXYbTAtBEYs4pWTHh7ipEDQcNQeT"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .decred:
                    let expectedResult = "DsidJiDGceqHTyqiejABy1ZQ3FX4SiWZkYG"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .digiByte:
                    let expectedResult = "dgb1qtjgmerfqwdffyf8ghcrkgy52cghsqptynmyswu"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .dogecoin:
                    let expectedResult = "DJRFZNg8jkUtjcpo2zJd92FUAzwRjitw6f"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .multiversX:
                    let expectedResult = "erd1jfcy8aeru6vlx4fe6h3pc3vlpe2cnnur5zetxdhp879yagq7vqvs8na4f8"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .eos, .wax:
                    let expectedResult = "EOS6hs8sRvGSzuQtq223zwJipMzqTJpXUVjyvHPvPwBSZWWrJTJkg"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .ethereum,
                     .smartChain,
                     .polygon,
                     .optimism,
                     .zksync,
                     .polygonzkEVM,
                     .scroll,
                     .arbitrum,
                     .arbitrumNova,
                     .ecochain,
                     .avalancheCChain,
                     .xdai,
                     .fantom,
                     .celo,
                     .cronosChain,
                     .smartBitcoinCash,
                     .kuCoinCommunityChain,
                     .boba,
                     .metis,
                     .aurora,
                     .evmos,
                     .moonriver,
                     .moonbeam,
                     .kavaEvm,
                     .klaytn,
                     .meter,
                     .okxchain,
                     .confluxeSpace,
                     .opBNB,
                     .acalaEVM,
                     .neon,
                     .base,
                     .linea,
                     .greenfield,
                     .mantle,
                     .zenEON:
                    let expectedResult = "0x8f348F300873Fd5DA36950B2aC75a26584584feE"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .ronin:
                    let expectedResult = "ronin:8f348F300873Fd5DA36950B2aC75a26584584feE"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .ethereumClassic:
                    let expectedResult = "0x078bA3228F3E6C08bEEac9A005de0b7e7089aD1c"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .rootstock:
                    let expectedResult = "0xA2D7065F94F838a3aB9C04D67B312056846424Df"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)       
                case .filecoin:
                    let expectedResult = "f1zzykebxldfcakj5wdb5n3n7priul522fnmjzori"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .fio:
                    let expectedResult = "FIO7MN1LuSfFgrbVHmrt9cVa2FYAs857Ppr9dzvEXoD1miKSxm3n3"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .goChain:
                    let expectedResult = "0x5940ce4A14210d4Ccd0ac206CE92F21828016aC2"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .groestlcoin:
                    let expectedResult = "grs1qexwmshts5pdpeqglkl39zyl6693tmfwp0cue4j"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .harmony:
                    let expectedResult = "one12fk20wmvgypdkn59n4hq8e3aa5899xfx4vsu09"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .icon:
                    let expectedResult = "hx18b380b53c23dc4ee9f6666bc20d1be02f3fe106"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .ioTeX:
                    let expectedResult = "io1qw9cccecw09q7p5kzyqtuhfhvah2mhfrc84jfk"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .ioTeXEVM:
                    let expectedResult = "0x038B8C633873Ca0f06961100BE5d37676EADDD23"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .litecoin:
                    let expectedResult = "ltc1qhd8fxxp2dx3vsmpac43z6ev0kllm4n53t5sk0u"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .monacoin:
                    let expectedResult = "M9xFZzZdZhCDxpx42cM8bQHnLwaeX1aNja"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .nano:
                    let expectedResult = "nano_39gsbcishxn3n7wd17ono4otq5wazwzusqgqigztx73wbrh5jwbdbshfnumc"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .near:
                    let expectedResult = "0c91f6106ff835c0195d5388565a2d69e25038a7e23d26198f85caf6594117ec"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .nebulas:
                    let expectedResult = "n1ZVgEidtdseYv9ogmGz69Cz4mbqmHYSNqJ"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .neo:
                    let expectedResult = "AT6w7PJvwPcSqHvtbNBY2aHPDv12eW5Uuf"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .nervos:
                    let expectedResult = "ckb1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqdtyq04tvp02wectaumxn0664yw2jd53lqk4mxg3";
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .nimiq:
                    let expectedResult = "NQ76 7AVR EHDA N05U X7SY XB14 XJU7 8ERV GM6H"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .nuls:
                    let expectedResult = "NULSd6HgU8MoRnNjBgvJpa9tqvGxYdv5ne4en"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .kava:
                    let expectedResult = "kava1drpa0x9ptz0fql3frv562rcrhj2nstuz3pas87"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .kin:
                    let expectedResult = "GBL3MT2ICHHM5OJ2QJ44CAHGDK6MLPINVXBKOKLHGBWQDVRWTWQ7U2EA"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .kusama:
                    let expectedResult = "G9xV2EatmrjRC1FLPexc3ddqNRRzCsAdURU8RFiAAJX6ppY"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .ontology:
                    let expectedResult = "AHKTnybvnWo3TeY8uvNXekvYxMrXogUjeT"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .poanetwork:
                    let expectedResult = "0xe8a3e8bE17E172B6926130eAfB521e9D2849aca9"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .pivx:
                    let expectedResult = "D81AqC8zKma3Cht4TbVuh4jyVVyLkZULCm"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .polkadot:
                    let expectedResult = "13nN6BGAoJwd7Nw1XxeBCx5YcBXuYnL94Mh7i3xBprqVSsFk"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .qtum:
                    let expectedResult = "QhceuaTdeCZtcxmVc6yyEDEJ7Riu5gWFoF"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .ravencoin:
                    let expectedResult = "RHoCwPc2FCQqwToYnSiAb3SrCET4zEHsbS"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .solana:
                    let expectedResult = "2bUBiBNZyD29gP1oV6de7nxowMLoDBtopMMTGgMvjG5m"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .stellar:
                    let expectedResult = "GA3H6I4C5XUBYGVB66KXR27JV5KS3APSTKRUWOIXZ5MVWZKVTLXWKZ2P"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .terra,
                     .terraV2:
                    let expectedResult = "terra1rh402g98t7sly8trzqw5cyracntlep6qe3smug"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .tezos:
                    let expectedResult = "tz1acnY9VbMagps26Kj3RfoGRWD9nYG5qaRX"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .theta,
                     .thetaFuel:
                    let expectedResult = "0x0d1fa20c218Fec2f2C55d52aB267940485fa5DA4"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .thunderCore:
                    let expectedResult = "0x4b92b3ED6d8b24575Bf5ce4C6a86ED261DA0C8d7"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .viction:
                    let expectedResult = "0xC74b6D8897cBa9A4b659d43fEF73C9cA852cE424"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .tron:
                    let expectedResult = "TQ5NMqJjhpQGK7YJbESKtNCo86PJ89ujio"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .veChain:
                    let expectedResult = "0x1a553275dF34195eAf23942CB7328AcF9d48c160"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .viacoin:
                    let expectedResult = "via1qnmsgjd6cvfprnszdgmyg9kewtjfgqflz67wwhc"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .verge:
                    let expectedResult = "DPb3Xz4vjB6QGLKDmrbprrtv4XzNqkADc2"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .wanchain:
                    let expectedResult = "0xD5ca90b928279FE5D06144136a25DeD90127aC15"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .waves:
                    let expectedResult = "3P63vkaHhyE9pPv9EfsjwGKqmZYcCRHys4n"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .xrp:
                    let expectedResult = "rPwE3gChNKtZ1mhH3Ko8YFGqKmGRWLWXV3"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .zcash:
                    let expectedResult = "t1YYnByMzdGhQv3W3rnjHMrJs6HH4Y231gy"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .komodo:
                    let expectedResult = "RCWJLXE5CSXydxdSnwcghzPgkFswERegyb"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .zen:
                    let expectedResult = "znUmzvod1f4P9LYsBhNxjqCDQvNSStAmYEX"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .firo:
                    let expectedResult = "aEd5XFChyXobvEics2ppAqgK3Bgusjxtik"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .zelcash:
                    let expectedResult = "t1UKbRPzL4WN8Rs8aZ8RNiWoD2ftCMHKGUf"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .zilliqa:
                    let expectedResult = "zil1mk6pqphhkmaguhalq6n3cq0h38ltcehg0rfmv6"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .smartChainLegacy:
                    let expectedResult = "0x49784f90176D8D9d4A3feCDE7C1373dAAb5b13b8"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .oasis:
                    let expectedResult = "oasis1qzcpavvmuw280dk0kd4lxjhtpf0u3ll27yf7sqps"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .thorchain:
                    let expectedResult = "thor1c8jd7ad9pcw4k3wkuqlkz4auv95mldr2kyhc65"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .bluzelle:
                    let expectedResult = "bluzelle1xccvees6ev4wm2r49rc6ptulsdxa8x8jfpmund"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .cryptoOrg:
                    let expectedResult = "cro16fdf785ejm00jf9a24d23pzqzjh2h05klxjwu8"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .osmosis:
                    let expectedResult = "osmo142j9u5eaduzd7faumygud6ruhdwme98qclefqp"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .ecash:
                    let expectedResult = "ecash:qpelrdn7a0hcucjlf9ascz3lkxv7r3rffgzn6x5377"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .iost:
                    let expectedResult = "4av8w81EyzUgHonsVWqfs15WM4Vrpgox4BYYQWhNQDVu"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .syscoin:
                    let expectedResult = "sys1qkl640se3mwpt666e3lyywnwh09e9jquvx9x8qj"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .stratis:
                    let expectedResult = "strax1q0caanaw4nkf6fzwnzq2p7yum680e57pdg05zkm"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .nativeEvmos:
                    let expectedResult = "evmos13u6g7vqgw074mgmf2ze2cadzvkz9snlwstd20d"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .everscale:
                    let expectedResult = "0:0c39661089f86ec5926ea7d4ee4223d634ba4ed6dcc2e80c7b6a8e6d59f79b04";
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .ton:
                    let expectedResult = "EQDgEMqToTacHic7SnvnPFmvceG5auFkCcAw0mSCvzvKUfk9";
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .aptos:
                    let expectedResult = "0x7968dab936c1bad187c60ce4082f307d030d780e91e694ae03aef16aba73f30";
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .nebl:
                    let expectedResult = "NgDVaXAwNgBwb88xLiFKomfBmPkEh9F2d7";
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .sui:
                    let expectedResult = "0xada112cfb90b44ba889cc5d39ac2bf46281e4a91f7919c693bcd9b8323e81ed2";
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .hedera:
                    let expectedResult = "0.0.302a300506032b657003210049eba62f64d0d941045595d9433e65d84ecc46bcdb1421de55e05fcf2d8357d5";
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .secret:
                    let expectedResult = "secret1f69sk5033zcdr2p2yf3xjehn7xvgdeq09d2llh"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .nativeInjective:
                    let expectedResult = "inj13u6g7vqgw074mgmf2ze2cadzvkz9snlwcrtq8a"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .agoric:
                    let expectedResult = "agoric18zvvgk6j3eq5wd7mqxccgt20gz2w94cy88aek5"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .stargaze:
                    let expectedResult = "stars142j9u5eaduzd7faumygud6ruhdwme98qycayaz"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .juno:
                    let expectedResult = "juno142j9u5eaduzd7faumygud6ruhdwme98qxkfz30"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .stride:
                    let expectedResult = "stride142j9u5eaduzd7faumygud6ruhdwme98qn029zl"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .axelar:
                    let expectedResult = "axelar142j9u5eaduzd7faumygud6ruhdwme98q52u3aj"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .crescent:
                    let expectedResult = "cre142j9u5eaduzd7faumygud6ruhdwme98q5veur7"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .kujira:
                    let expectedResult = "kujira142j9u5eaduzd7faumygud6ruhdwme98qpvgpme"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .nativeCanto:
                    let expectedResult = "canto13u6g7vqgw074mgmf2ze2cadzvkz9snlwqua5pd"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .comdex:
                    let expectedResult = "comdex142j9u5eaduzd7faumygud6ruhdwme98qhtgm0y"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .neutron:
                    let expectedResult = "neutron142j9u5eaduzd7faumygud6ruhdwme98q5mrmv5"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .sommelier:
                    let expectedResult = "somm142j9u5eaduzd7faumygud6ruhdwme98quc948e"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .fetchAI:
                    let expectedResult = "fetch142j9u5eaduzd7faumygud6ruhdwme98qrera5y"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .mars:
                    let expectedResult = "mars142j9u5eaduzd7faumygud6ruhdwme98qdenqrg"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .umee:
                    let expectedResult = "umee142j9u5eaduzd7faumygud6ruhdwme98qzjhxjp"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .coreum:
                    let expectedResult = "core1rawf376jz2lnchgc4wzf4h9c77neg3zldc7xa8"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .quasar:
                    let expectedResult = "quasar142j9u5eaduzd7faumygud6ruhdwme98q78symk"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .persistence:
                    let expectedResult = "persistence142j9u5eaduzd7faumygud6ruhdwme98q7gv2ch"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .akash:
                    let expectedResult = "akash142j9u5eaduzd7faumygud6ruhdwme98qal870f"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .noble:
                    let expectedResult = "noble142j9u5eaduzd7faumygud6ruhdwme98qc8l3wa"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .sei:
                    let expectedResult = "sei142j9u5eaduzd7faumygud6ruhdwme98qagm0sj"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .internetComputer:
                    let expectedResult = "b9a13d974ee9db036d5abc5b66ace23e513cb5676f3996626c7717c339a3ee87"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .tia:
                    let expectedResult = "celestia142j9u5eaduzd7faumygud6ruhdwme98qpwmfv7"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)
                case .xdc:
                    let expectedResult = "0xcf808d69db8ddc8d5fc90bf2586074f328058082"
                    assertCoinDerivation(coin, expectedResult, derivedAddress, address)  
                @unknown default:
                    fatalError()
                }
            }
        }
    }

    private func assertCoinDerivation(_ coin: CoinType, _ expected: String, _ derivedAddress: String, _ address: AnyAddress?) {
        XCTAssertNotNil(address, "\(coin) is not implemented CoinType.address(string: String)")
        XCTAssertEqual(expected, derivedAddress, "\(coin) failed to match address")
        XCTAssertEqual(expected, address?.description, "\(coin) is not implemented CoinType.address(string: String)")
    }
}
