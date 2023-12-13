// Copyright © 2017-2023 Trust Wallet.
//
// This file is part of Trust. The full Trust copyright notice, including
// terms governing use, modification, and redistribution, is contained in the
// file LICENSE at the root of the source code distribution tree.

#include "Coin.h"
#include "HexCoding.h"

#include <gtest/gtest.h>

#include <mutex>
#include <thread>

namespace TW {

TEST(Coin, DeriveAddress) {
    auto dummyKeyData = parse_hex("0x4646464646464646464646464646464646464646464646464646464646464646");
    const auto privateKey = PrivateKey(dummyKeyData);
    const auto privateKeyExt = PrivateKey(dummyKeyData, dummyKeyData, dummyKeyData, dummyKeyData, dummyKeyData, dummyKeyData);

    const auto coins = TW::getCoinTypes();
    for (auto& c : coins) {
        std::string address;
        switch (c) {
        default:
            address = TW::deriveAddress(c, privateKey);
            break;

        case TWCoinTypeCardano:
        case TWCoinTypeNEO:
            address = TW::deriveAddress(c, privateKeyExt);
            break;
        }

        switch (c) {
        // Ethereum and ...
        case TWCoinTypeEthereum:
        // ... clones:
        case TWCoinTypeAcalaEVM:
        case TWCoinTypeArbitrum:
        case TWCoinTypeArbitrumNova:
        case TWCoinTypeAurora:
        case TWCoinTypeAvalancheCChain:
        case TWCoinTypeBoba:
        case TWCoinTypeCallisto:
        case TWCoinTypeCelo:
        case TWCoinTypeConfluxeSpace:
        case TWCoinTypeCronosChain:
        case TWCoinTypeECOChain:
        case TWCoinTypeEthereumClassic:
        case TWCoinTypeEvmos:
        case TWCoinTypeFantom:
        case TWCoinTypeGoChain:
        case TWCoinTypeKavaEvm:
        case TWCoinTypeKlaytn:
        case TWCoinTypeKuCoinCommunityChain:
        case TWCoinTypeMeter:
        case TWCoinTypeMetis:
        case TWCoinTypeMoonbeam:
        case TWCoinTypeMoonriver:
        case TWCoinTypeOptimism:
        case TWCoinTypeZksync:
        case TWCoinTypePolygonzkEVM:
        case TWCoinTypeOKXChain:
        case TWCoinTypePOANetwork:
        case TWCoinTypePolygon:
        case TWCoinTypeSmartBitcoinCash:
        case TWCoinTypeSmartChain:
        case TWCoinTypeSmartChainLegacy:
        case TWCoinTypeTheta:
        case TWCoinTypeThetaFuel:
        case TWCoinTypeThunderCore:
        case TWCoinTypeViction:
        case TWCoinTypeVeChain:
        case TWCoinTypeWanchain:
        case TWCoinTypeXDai:
        case TWCoinTypeIoTeXEVM:
        case TWCoinTypeScroll:
        case TWCoinTypeOpBNB:
        case TWCoinTypeNeon:
        case TWCoinTypeBase:
        case TWCoinTypeLinea:
        case TWCoinTypeGreenfield:
        case TWCoinTypeMantle:
        case TWCoinTypeXDCNetwork:
            EXPECT_EQ(address, "0x9d8A62f656a8d1615C1294fd71e9CFb3E4855A4F");
            break;

        case TWCoinTypeZenEON:
            // end_of_evm_address_derivation_tests_marker_do_not_modify
            EXPECT_EQ(address, "0x9d8A62f656a8d1615C1294fd71e9CFb3E4855A4F");
            break;

        case TWCoinTypeKin:
        case TWCoinTypeStellar:
            EXPECT_EQ(address, "GDXJHJHWN6GRNOAZXON6XH74ZX6NYFAS5B7642RSJQVJTIPA4ZYUQLEB");
            break;

        case TWCoinTypeNEO:
        case TWCoinTypeOntology:
            EXPECT_EQ(address, "AeicEjZyiXKgUeSBbYQHxsU1X3V5Buori5");
            break;

        case TWCoinTypeTerra:
        case TWCoinTypeTerraV2:
            EXPECT_EQ(address, "terra1hkfq3zahaqkkzx5mjnamwjsfpq2jk7z0ll9rwp");
            break;

        case TWCoinTypeZcash:
        case TWCoinTypeZelcash:
            EXPECT_EQ(address, "t1b9xfAk3kZp5Qk3rinDPq7zzLkJGHTChDS");
            break;

        case TWCoinTypeKomodo:
            EXPECT_EQ(address, "RSZYjMDCP4q3t7NAFXPPnqEGrMZn971pdB");
            break;
        case TWCoinTypeAcala:
            EXPECT_EQ(address, "26GQqmwt3154cQbG2fyBsh3cGuCBoRFtrwuCD6WcVJdFReA4");
            break;
        case TWCoinTypeAeternity:
            EXPECT_EQ(address, "ak_2p5878zbFhxnrm7meL7TmqwtvBaqcBddyp5eGzZbovZ5FeVfcw");
            break;
        case TWCoinTypeAion:
            EXPECT_EQ(address, "0xa0010b0ea04ba4d76ca6e5e9900bacf19bc4402eaec7e36ea7ddd8eed48f60f3");
            break;
        case TWCoinTypeAlgorand:
            EXPECT_EQ(address, "52J2J5TPRULLQGN3TPVZ77GN7TOBIEXIP7XGUMSMFKM2DYHGOFEOGBP2T4");
            break;
        case TWCoinTypeBandChain:
            EXPECT_EQ(address, "band1hkfq3zahaqkkzx5mjnamwjsfpq2jk7z0q5lp5f");
            break;
        case TWCoinTypeBinance:
            EXPECT_EQ(address, "bnb1hkfq3zahaqkkzx5mjnamwjsfpq2jk7z0mlq0d0");
            break;
        case TWCoinTypeTBinance:
            EXPECT_EQ(address, "tbnb1hkfq3zahaqkkzx5mjnamwjsfpq2jk7z042ftd7");
            break;
        case TWCoinTypeBitcoin:
            EXPECT_EQ(address, "bc1qhkfq3zahaqkkzx5mjnamwjsfpq2jk7z00ppggv");
            break;
        case TWCoinTypeBitcoinCash:
            EXPECT_EQ(address, "bitcoincash:qz7eyzytkl5z6cg6nw20hd62pyyp22mcfuardfd2vn");
            break;
        case TWCoinTypeBitcoinDiamond:
            EXPECT_EQ(address, "1JHMeqKunF2Up6zxnMQGhJu5667BXz98YQ");
            break;
        case TWCoinTypeBitcoinGold:
            EXPECT_EQ(address, "btg1qhkfq3zahaqkkzx5mjnamwjsfpq2jk7z0eg8day");
            break;
        case TWCoinTypeBluzelle:
            EXPECT_EQ(address, "bluzelle1hkfq3zahaqkkzx5mjnamwjsfpq2jk7z0vrup2s");
            break;
        case TWCoinTypeCardano:
            EXPECT_EQ(address, "addr1qxzk4wqhh5qmzas4e26aghcvkz8feju6sa43nghfj5xxsly9d2up00gpk9mptj44630sevywnn9e4pmtrx3wn9gvdp7qjhvjl4");
            break;
        case TWCoinTypeCosmos:
            EXPECT_EQ(address, "cosmos1hkfq3zahaqkkzx5mjnamwjsfpq2jk7z0emlrvp");
            break;
        case TWCoinTypeCryptoOrg:
            EXPECT_EQ(address, "cro1hkfq3zahaqkkzx5mjnamwjsfpq2jk7z0pqh6ss");
            break;
        case TWCoinTypeDash:
            EXPECT_EQ(address, "XsyCV5yojxF4y3bYeEiVYqarvRgsWFELZL");
            break;
        case TWCoinTypeDecred:
            EXPECT_EQ(address, "Dsp4u8xxTHSZU2ELWTQLQP77xJhgeWrTsGK");
            break;
        case TWCoinTypeDigiByte:
            EXPECT_EQ(address, "dgb1qhkfq3zahaqkkzx5mjnamwjsfpq2jk7z0c69ssz");
            break;
        case TWCoinTypeDogecoin:
            EXPECT_EQ(address, "DNRTC6GZ5evmM7BZWwPqF54fyDqUqULMyu");
            break;
        case TWCoinTypeECash:
            EXPECT_EQ(address, "ecash:qz7eyzytkl5z6cg6nw20hd62pyyp22mcfuywezks2y");
            break;
        case TWCoinTypeEOS:
        case TWCoinTypeWAX:
            EXPECT_EQ(address, "EOS5TrYnZP1RkDSUMzBY4GanCy6AP68kCMdkAb5EACkAwkdgRLShz");
            break;
        case TWCoinTypeMultiversX:
            EXPECT_EQ(address, "erd1a6f6fan035ttsxdmn04ellxdlnwpgyhg0lhx5vjv92v6rc8xw9yq83344f");
            break;
        case TWCoinTypeEverscale:
            EXPECT_EQ(address, "0:ef64d51f95ef17973b737277cfecbd2a8d551141be2f58f5fb362575fc3eb5b0");
            break;
        case TWCoinTypeTON:
            EXPECT_EQ(address, "EQAoYT8nMLfeNh6h0uIoK_wLm9JkvxiGxJDr6GRXJGu2ZhpY");
            break;
        case TWCoinTypeFIO:
            EXPECT_EQ(address, "FIO5TrYnZP1RkDSUMzBY4GanCy6AP68kCMdkAb5EACkAwkdgRLShz");
            break;
        case TWCoinTypeFilecoin:
            EXPECT_EQ(address, "f1qsx7qwiojh5duxbxhbqgnlyx5hmpcf7mcz5oxsy");
            break;
        case TWCoinTypeFiro:
            EXPECT_EQ(address, "aHzpPjmY132KseS4nkiQTbDahTEXqesY89");
            break;
        case TWCoinTypeGroestlcoin:
            EXPECT_EQ(address, "grs1qhkfq3zahaqkkzx5mjnamwjsfpq2jk7z0jsaf3d");
            break;
        case TWCoinTypeHarmony:
            EXPECT_EQ(address, "one1nk9x9ajk4rgkzhqjjn7hr6w0k0jg2kj0nmx3dt");
            break;
        case TWCoinTypeICON:
            EXPECT_EQ(address, "hx4728fc65c31728f0d3538b8783b5394b31a136b9");
            break;
        case TWCoinTypeIOST:
            EXPECT_EQ(address, "H4JcMPicKkHcxxDjkyyrLoQj7Kcibd9t815ak4UvTr9M");
            break;
        case TWCoinTypeIoTeX:
            EXPECT_EQ(address, "io1nk9x9ajk4rgkzhqjjn7hr6w0k0jg2kj0zgdt6h");
            break;
        case TWCoinTypeKava:
            EXPECT_EQ(address, "kava1hkfq3zahaqkkzx5mjnamwjsfpq2jk7z09wt76x");
            break;
        case TWCoinTypeKusama:
            EXPECT_EQ(address, "Hy8mqcexg5FMwMYnQvzrUvD723qMxDjMRU9HdNCnTsMAypY");
            break;
        case TWCoinTypeLitecoin:
            EXPECT_EQ(address, "ltc1qhkfq3zahaqkkzx5mjnamwjsfpq2jk7z0tamvsu");
            break;
        case TWCoinTypeMonacoin:
            EXPECT_EQ(address, "MRBWtGEKHGCHhmyJ1L4CwaWQZJzM5DnVcs");
            break;
        case TWCoinTypeNEAR:
            EXPECT_EQ(address, "ee93a4f66f8d16b819bb9beb9ffccdfcdc1412e87fee6a324c2a99a1e0e67148");
            break;
        case TWCoinTypeNULS:
            EXPECT_EQ(address, "NULSd6HgfXT3m5JBGxeCZXHRQbb82FKgZGT8o");
            break;
        case TWCoinTypeNano:
            EXPECT_EQ(address, "nano_1qepdf4k95dhb5gsmhmq3iddqsxiafwkihunm7irn48jdiwdtnn6pe93k3f6");
            break;
        case TWCoinTypeNativeEvmos:
            EXPECT_EQ(address, "evmos1nk9x9ajk4rgkzhqjjn7hr6w0k0jg2kj07me7uu");
            break;
        case TWCoinTypeNebulas:
            EXPECT_EQ(address, "n1XTciu9ZRYt3ni7SxNBmivk9Y6XpP6VrhT");
            break;
        case TWCoinTypeNimiq:
            EXPECT_EQ(address, "NQ74 D40G N3M0 9EJD ET56 UPLR 02VC X6DU 8G1E");
            break;
        case TWCoinTypeOasis:
            EXPECT_EQ(address, "oasis1qzw4h3wmyjtrttduqqrs8udggyy2emwdzqmuzwg4");
            break;
        case TWCoinTypeOsmosis:
            EXPECT_EQ(address, "osmo1hkfq3zahaqkkzx5mjnamwjsfpq2jk7z03qvn6n");
            break;
        case TWCoinTypePivx:
            EXPECT_EQ(address, "DNRTC6GZ5evmM7BZWwPqF54fyDqUqULMyu");
            break;
        case TWCoinTypePolkadot:
            EXPECT_EQ(address, "16PpFrXrC6Ko3pYcyMAx6gPMp3mFFaxgyYMt4G5brkgNcSz8");
            break;
        case TWCoinTypeQtum:
            EXPECT_EQ(address, "QdtLm8ccxhuJFF5zCgikpaghbM3thdaGsW");
            break;
        case TWCoinTypeRavencoin:
            EXPECT_EQ(address, "RSZYjMDCP4q3t7NAFXPPnqEGrMZn971pdB");
            break;
        case TWCoinTypeRonin:
            EXPECT_EQ(address, "ronin:9d8A62f656a8d1615C1294fd71e9CFb3E4855A4F");
            break;
        case TWCoinTypeSolana:
            EXPECT_EQ(address, "H4JcMPicKkHcxxDjkyyrLoQj7Kcibd9t815ak4UvTr9M");
            break;
        case TWCoinTypeSyscoin:
            EXPECT_EQ(address, "sys1qhkfq3zahaqkkzx5mjnamwjsfpq2jk7z083sjh7");
            break;
        case TWCoinTypeTHORChain:
            EXPECT_EQ(address, "thor1hkfq3zahaqkkzx5mjnamwjsfpq2jk7z0luxce7");
            break;
        case TWCoinTypeTezos:
            EXPECT_EQ(address, "tz1gcEWswVU6dxfNQWbhTgaZrUrNUFwrsT4z");
            break;
        case TWCoinTypeTron:
            EXPECT_EQ(address, "TQLCsShbQNXMTVCjprY64qZmEA4rBarpQp");
            break;
        case TWCoinTypeVerge:
            EXPECT_EQ(address, "DNRTC6GZ5evmM7BZWwPqF54fyDqUqULMyu");
            break;
        case TWCoinTypeViacoin:
            EXPECT_EQ(address, "via1qhkfq3zahaqkkzx5mjnamwjsfpq2jk7z09y9mn2");
            break;
        case TWCoinTypeWaves:
            EXPECT_EQ(address, "3P2C786D6mBuvyf4WYr6K6Vch5uhi97nBHG");
            break;
        case TWCoinTypeXRP:
            EXPECT_EQ(address, "rJHMeqKu8Ep7Fazx8MQG6JunaafBXz93YQ");
            break;
        case TWCoinTypeZen:
            EXPECT_EQ(address, "zniNGeFxXRpY6RDGVdfdmbcvcFb1rrLdnFz");
            break;
        case TWCoinTypeZilliqa:
            EXPECT_EQ(address, "zil1j2cvtd7j9n7fnxfv2r3neucjw8tp4xz9sp07v4");
            break;
        case TWCoinTypeStratis:
            EXPECT_EQ(address, "strax1qhkfq3zahaqkkzx5mjnamwjsfpq2jk7z0rvt20n");
            break;
        case TWCoinTypeNervos:
            EXPECT_EQ(address, "ckb1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqtsqfsf77ae0wn5a7795hs2ydv83g6hl4qleywxw");
            break;
        case TWCoinTypeAptos:
            EXPECT_EQ(address, "0xce2fd04ac9efa74f17595e5785e847a2399d7e637f5e8179244f76191f653276");
            break;
        case TWCoinTypeNebl:
            EXPECT_EQ(address, "NdCKqb8BQoavA5PZ5b4APxKmSpmBA6yMSi");
            break;
        case TWCoinTypeSui:
            EXPECT_EQ(address, "0x870deb25d5c0a4d7250d52d5cd58dacca2d51eb2a120a979b13384cd52e21e1b");
            break;
        case TWCoinTypeHedera:
            EXPECT_EQ(address, "0.0.302a300506032b6570032100ee93a4f66f8d16b819bb9beb9ffccdfcdc1412e87fee6a324c2a99a1e0e67148");
            break;
        case TWCoinTypeSecret:
            EXPECT_EQ(address, "secret1hkfq3zahaqkkzx5mjnamwjsfpq2jk7z0m7t23a");
            break;
        case TWCoinTypeNativeInjective:
            EXPECT_EQ(address, "inj1nk9x9ajk4rgkzhqjjn7hr6w0k0jg2kj0knl55v");
            break;
        case TWCoinTypeAgoric:
            EXPECT_EQ(address, "agoric1hkfq3zahaqkkzx5mjnamwjsfpq2jk7z0txauuh");
            break;
        case TWCoinTypeStargaze:
            EXPECT_EQ(address, "stars1hkfq3zahaqkkzx5mjnamwjsfpq2jk7z0d8g78s");
            break;
        case TWCoinTypeJuno:
            EXPECT_EQ(address, "juno1hkfq3zahaqkkzx5mjnamwjsfpq2jk7z00fucta");
            break;
        case TWCoinTypeStride:
            EXPECT_EQ(address, "stride1hkfq3zahaqkkzx5mjnamwjsfpq2jk7z06sllcd");
            break;
        case TWCoinTypeAxelar:
            EXPECT_EQ(address, "axelar1hkfq3zahaqkkzx5mjnamwjsfpq2jk7z0a4ft8q");
            break;
        case TWCoinTypeCrescent:
            EXPECT_EQ(address, "cre1hkfq3zahaqkkzx5mjnamwjsfpq2jk7z0anvxev");
            break;
        case TWCoinTypeKujira:
            EXPECT_EQ(address, "kujira1hkfq3zahaqkkzx5mjnamwjsfpq2jk7z0gnampt");
            break;
        case TWCoinTypeNativeCanto:
            EXPECT_EQ(address, "canto1nk9x9ajk4rgkzhqjjn7hr6w0k0jg2kj0wvfqju");
            break;
        case TWCoinTypeComdex:
            EXPECT_EQ(address, "comdex1hkfq3zahaqkkzx5mjnamwjsfpq2jk7z075ap4k");
            break;
        case TWCoinTypeNeutron:
            EXPECT_EQ(address, "neutron1hkfq3zahaqkkzx5mjnamwjsfpq2jk7z0aykpkx");
            break;
        case TWCoinTypeSommelier:
            EXPECT_EQ(address, "somm1hkfq3zahaqkkzx5mjnamwjsfpq2jk7z048s0at");
            break;
        case TWCoinTypeFetchAI:
            EXPECT_EQ(address, "fetch1hkfq3zahaqkkzx5mjnamwjsfpq2jk7z02xk8wk");
            break;
        case TWCoinTypeMars:
            EXPECT_EQ(address, "mars1hkfq3zahaqkkzx5mjnamwjsfpq2jk7z0yxx6e6");
            break;
        case TWCoinTypeUmee:
            EXPECT_EQ(address, "umee1hkfq3zahaqkkzx5mjnamwjsfpq2jk7z0tdzugn");
            break;
        case TWCoinTypeCoreum:
            EXPECT_EQ(address, "core1hkfq3zahaqkkzx5mjnamwjsfpq2jk7z0248ct6");
            break;
        case TWCoinTypeQuasar:
            EXPECT_EQ(address, "quasar1hkfq3zahaqkkzx5mjnamwjsfpq2jk7z0hc97py");
            break;
        case TWCoinTypePersistence:
            EXPECT_EQ(address, "persistence1hkfq3zahaqkkzx5mjnamwjsfpq2jk7z0hhesz9");
            break;
        case TWCoinTypeAkash:
            EXPECT_EQ(address, "akash1hkfq3zahaqkkzx5mjnamwjsfpq2jk7z05qjy4m");
            break;
        case TWCoinTypeNoble:
            EXPECT_EQ(address, "noble1hkfq3zahaqkkzx5mjnamwjsfpq2jk7z03c2t50");
            break;
        case TWCoinTypeRootstock:
            EXPECT_EQ(address, "0x9d8A62f656a8d1615C1294fd71e9CFb3E4855A4F");
            break;
        case TWCoinTypeSei:
            EXPECT_EQ(address, "sei1hkfq3zahaqkkzx5mjnamwjsfpq2jk7z05hw42q");
            break;
        case TWCoinTypeInternetComputer:
            EXPECT_EQ(address, "cb3aa6a0471a417fc33d8e71f1d241750dfa29b4dc8f084265ce1301fb03b65b");
            break;
        case TWCoinTypeTia:
            EXPECT_EQ(address, "celestia1hkfq3zahaqkkzx5mjnamwjsfpq2jk7z0g3wnkv");
            break;
            // end_of_coin_address_derivation_tests_marker_do_not_modify
            // no default branch here, intentionally, to better notice any missing coins
        }
    }
}

int countThreadReady = 0;
std::mutex countThreadReadyMutex;

void useCoinFromThread() {
    const int tryCount = 20;
    for (int i = 0; i < tryCount; ++i) {
        // perform some operations
        TW::validateAddress(TWCoinTypeZilliqa, "zil1j8xae6lggm8y63m3y2r7aefu797ze7mhzulnqg");
        TW::validateAddress(TWCoinTypeEthereum, "0x9d8A62f656a8d1615C1294fd71e9CFb3E4855A4F");
        const auto coinTypes = TW::getCoinTypes();
    }
    countThreadReadyMutex.lock();
    ++countThreadReady;
    countThreadReadyMutex.unlock();
}

TEST(Coin, InitMultithread) {
    const int numThread = 20;
    countThreadReady = 0;
    std::thread thread[numThread];
    // execute in threads
    for (int i = 0; i < numThread; ++i) {
        thread[i] = std::thread(useCoinFromThread);
    }
    // wait for completion
    for (int i = 0; i < numThread; ++i) {
        thread[i].join();
    }
    // check that all completed OK
    ASSERT_EQ(countThreadReady, numThread);
}

} // namespace TW
