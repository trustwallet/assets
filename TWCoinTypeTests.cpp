// Copyright © 2017-2023 Trust Wallet.
//
// This file is part of Trust. The full Trust copyright notice, including
// terms governing use, modification, and redistribution, is contained in the
// file LICENSE at the root of the source code distribution tree.
//
// This is a GENERATED FILE, changes made here MAY BE LOST.
// Generated one-time (codegen/bin/cointests)
//

#include "TestUtilities.h"
#include <TrustWalletCore/TWCoinTypeConfiguration.h>
#include <gtest/gtest.h>


TEST(TWXDCNetworkCoinType, TWCoinType) {
    const auto coin = TWCoinTypeXDCNetwork;
    const auto symbol = WRAPS(TWCoinTypeConfigurationGetSymbol(coin));
    const auto id = WRAPS(TWCoinTypeConfigurationGetID(coin));
    const auto name = WRAPS(TWCoinTypeConfigurationGetName(coin));
    const auto txId = WRAPS(TWStringCreateWithUTF8Bytes("0x5c4fa942ff0b39651e5ffd21d646f2956a289ce9f26a59ddbef5dfa27701aa56"));
    const auto txUrl = WRAPS(TWCoinTypeConfigurationGetTransactionURL(coin, txId.get()));
    const auto accId = WRAPS(TWStringCreateWithUTF8Bytes("0xbc4f1b0c59857dd97089d9d860f169d712c1fb6e"));
    const auto accUrl = WRAPS(TWCoinTypeConfigurationGetAccountURL(coin, accId.get()));

    assertStringsEqual(id, "xdc");
    assertStringsEqual(name, "XDCNetwork");
    assertStringsEqual(symbol, "XDC");
    ASSERT_EQ(TWCoinTypeConfigurationGetDecimals(coin), 18);
    ASSERT_EQ(TWCoinTypeBlockchain(coin), TWBlockchainEthereum);
    ASSERT_EQ(TWCoinTypeP2shPrefix(coin), 0x0);
    ASSERT_EQ(TWCoinTypeStaticPrefix(coin), 0x0);
    assertStringsEqual(txUrl, "https://xdc.blocksscan.io/tx/0x5c4fa942ff0b39651e5ffd21d646f2956a289ce9f26a59ddbef5dfa27701aa56");
    assertStringsEqual(accUrl, "https://xdc.blocksscan.io/address/0xbc4f1b0c59857dd97089d9d860f169d712c1fb6e");
}
