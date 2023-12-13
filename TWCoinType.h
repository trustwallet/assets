// Copyright © 2017-2023 Trust Wallet.
//
// This file is part of Trust. The full Trust copyright notice, including
// terms governing use, modification, and redistribution, is contained in the
// file LICENSE at the root of the source code distribution tree.

#pragma once

#include "TWBase.h"
#include "TWBlockchain.h"
#include "TWCurve.h"
#include "TWDerivation.h"
#include "TWHDVersion.h"
#include "TWHRP.h"
#include "TWPurpose.h"
#include "TWString.h"
#include "TWDerivation.h"
#include "TWPublicKeyType.h"

TW_EXTERN_C_BEGIN

/// Represents a private key.
struct TWPrivateKey;

/// Represents a public key.
struct TWPublicKey;

/// Coin type for Level 2 of BIP44.
///
/// \see https://github.com/satoshilabs/slips/blob/master/slip-0044.md
TW_EXPORT_ENUM(uint32_t)
enum TWCoinType {
    TWCoinTypeAeternity = 457,
    TWCoinTypeAion = 425,
    TWCoinTypeBinance = 714,
    TWCoinTypeBitcoin = 0,
    TWCoinTypeBitcoinCash = 145,
    TWCoinTypeBitcoinGold = 156,
    TWCoinTypeCallisto = 820,
    TWCoinTypeCardano = 1815, // Note: Cardano Shelley testnet uses purpose 1852 (not 44) 1852/1815
    TWCoinTypeCosmos = 118,
    TWCoinTypePivx = 119,
    TWCoinTypeDash = 5,
    TWCoinTypeDecred = 42,
    TWCoinTypeDigiByte = 20,
    TWCoinTypeDogecoin = 3,
    TWCoinTypeEOS = 194,
    TWCoinTypeWAX = 14001,
    TWCoinTypeEthereum = 60,
    TWCoinTypeEthereumClassic = 61,
    TWCoinTypeFIO = 235,
    TWCoinTypeGoChain = 6060,
    TWCoinTypeGroestlcoin = 17,
    TWCoinTypeICON = 74,
    TWCoinTypeIoTeX = 304,
    TWCoinTypeKava = 459,
    TWCoinTypeKin = 2017,
    TWCoinTypeLitecoin = 2,
    TWCoinTypeMonacoin = 22,
    TWCoinTypeNebulas = 2718,
    TWCoinTypeNULS = 8964,
    TWCoinTypeNano = 165,
    TWCoinTypeNEAR = 397,
    TWCoinTypeNimiq = 242,
    TWCoinTypeOntology = 1024,
    TWCoinTypePOANetwork = 178,
    TWCoinTypeQtum = 2301,
    TWCoinTypeXRP = 144,
    TWCoinTypeSolana = 501,
    TWCoinTypeStellar = 148,
    TWCoinTypeTezos = 1729,
    TWCoinTypeTheta = 500,
    TWCoinTypeThunderCore = 1001,
    TWCoinTypeNEO = 888,
    TWCoinTypeViction = 889,
    TWCoinTypeTron = 195,
    TWCoinTypeVeChain = 818,
    TWCoinTypeViacoin = 14,
    TWCoinTypeWanchain = 5718350,
    TWCoinTypeZcash = 133,
    TWCoinTypeFiro = 136,
    TWCoinTypeZilliqa = 313,
    TWCoinTypeZelcash = 19167,
    TWCoinTypeRavencoin = 175,
    TWCoinTypeWaves = 5741564,
    TWCoinTypeTerra = 330, // see also TerraV2
    TWCoinTypeTerraV2 = 10000330, // see also Terra
    TWCoinTypeHarmony = 1023,
    TWCoinTypeAlgorand = 283,
    TWCoinTypeKusama = 434,
    TWCoinTypePolkadot = 354,
    TWCoinTypeFilecoin = 461,
    TWCoinTypeMultiversX = 508,
    TWCoinTypeBandChain = 494,
    TWCoinTypeSmartChainLegacy = 10000714,
    TWCoinTypeSmartChain = 20000714,
    TWCoinTypeTBinance = 30000714,
    TWCoinTypeOasis = 474,
    TWCoinTypePolygon = 966,
    TWCoinTypeTHORChain = 931,
    TWCoinTypeBluzelle = 483,
    TWCoinTypeOptimism = 10000070,
    TWCoinTypeZksync = 10000324,
    TWCoinTypeArbitrum = 10042221,
    TWCoinTypeECOChain = 10000553,
    TWCoinTypeAvalancheCChain = 10009000,
    TWCoinTypeXDai = 10000100,
    TWCoinTypeFantom = 10000250,
    TWCoinTypeCryptoOrg = 394,
    TWCoinTypeCelo = 52752,
    TWCoinTypeRonin = 10002020,
    TWCoinTypeOsmosis = 10000118,
    TWCoinTypeECash = 899,
    TWCoinTypeIOST = 291,
    TWCoinTypeCronosChain = 10000025,
    TWCoinTypeSmartBitcoinCash = 10000145,
    TWCoinTypeKuCoinCommunityChain = 10000321,
    TWCoinTypeBitcoinDiamond = 999,
    TWCoinTypeBoba = 10000288,
    TWCoinTypeSyscoin = 57,
    TWCoinTypeVerge = 77,
    TWCoinTypeZen = 121,
    TWCoinTypeMetis = 10001088,
    TWCoinTypeAurora = 1323161554,
    TWCoinTypeEvmos = 10009001,
    TWCoinTypeNativeEvmos = 20009001,
    TWCoinTypeMoonriver = 10001285,
    TWCoinTypeMoonbeam = 10001284,
    TWCoinTypeKavaEvm = 10002222,
    TWCoinTypeKlaytn = 10008217,
    TWCoinTypeMeter = 18000,
    TWCoinTypeOKXChain = 996,
    TWCoinTypeStratis = 105105,
    TWCoinTypeKomodo = 141,
    TWCoinTypeNervos = 309,
    TWCoinTypeEverscale = 396,
    TWCoinTypeAptos = 637,
    TWCoinTypeNebl = 146,
    TWCoinTypeHedera = 3030,
    TWCoinTypeSecret = 529,
    TWCoinTypeNativeInjective = 10000060,
    TWCoinTypeAgoric = 564,
    TWCoinTypeTON = 607,
    TWCoinTypeSui = 784,
    TWCoinTypeStargaze = 20000118,
    TWCoinTypePolygonzkEVM = 10001101,
    TWCoinTypeJuno = 30000118,
    TWCoinTypeStride = 40000118,
    TWCoinTypeAxelar = 50000118,
    TWCoinTypeCrescent = 60000118,
    TWCoinTypeKujira = 70000118,
    TWCoinTypeIoTeXEVM = 10004689,
    TWCoinTypeNativeCanto = 10007700,
    TWCoinTypeComdex = 80000118,
    TWCoinTypeNeutron = 90000118,
    TWCoinTypeSommelier = 11000118,
    TWCoinTypeFetchAI = 12000118,
    TWCoinTypeMars = 13000118,
    TWCoinTypeUmee = 14000118,
    TWCoinTypeCoreum = 10000990,
    TWCoinTypeQuasar = 15000118,
    TWCoinTypePersistence = 16000118,
    TWCoinTypeAkash = 17000118,
    TWCoinTypeNoble = 18000118,
    TWCoinTypeScroll = 534352,
    TWCoinTypeRootstock = 137,
    TWCoinTypeThetaFuel = 361,
    TWCoinTypeConfluxeSpace = 1030,
    TWCoinTypeAcala = 787,
    TWCoinTypeAcalaEVM = 10000787,
    TWCoinTypeOpBNB = 204,
    TWCoinTypeNeon = 245022934,
    TWCoinTypeBase = 8453,
    TWCoinTypeSei = 19000118,
    TWCoinTypeArbitrumNova = 10042170,
    TWCoinTypeLinea = 59144,
    TWCoinTypeGreenfield = 5600,
    TWCoinTypeMantle = 5000,
    TWCoinTypeZenEON = 7332,
    TWCoinTypeInternetComputer = 223,
    TWCoinTypeTia = 21000118,
    TWCoinTypeXDCNetwork = 50,
    // end_of_tw_coin_type_marker_do_not_modify
};

/// Returns the blockchain for a coin type.
///
/// \param coin A coin type
/// \return blockchain associated to the given coin type
TW_EXPORT_PROPERTY
enum TWBlockchain TWCoinTypeBlockchain(enum TWCoinType coin);

/// Returns the purpose for a coin type.
///
/// \param coin A coin type
/// \return purpose associated to the given coin type
TW_EXPORT_PROPERTY
enum TWPurpose TWCoinTypePurpose(enum TWCoinType coin);

/// Returns the curve that should be used for a coin type.
///
/// \param coin A coin type
/// \return curve that should be used for the given coin type
TW_EXPORT_PROPERTY
enum TWCurve TWCoinTypeCurve(enum TWCoinType coin);

/// Returns the xpub HD version that should be used for a coin type.
///
/// \param coin A coin type
/// \return xpub HD version that should be used for the given coin type
TW_EXPORT_PROPERTY
enum TWHDVersion TWCoinTypeXpubVersion(enum TWCoinType coin);

/// Returns the xprv HD version that should be used for a coin type.
///
/// \param coin A coin type
/// \return the xprv HD version that should be used for the given coin type.
TW_EXPORT_PROPERTY
enum TWHDVersion TWCoinTypeXprvVersion(enum TWCoinType coin);

/// Validates an address string.
///
/// \param coin A coin type
/// \param address A public address
/// \return true if the address is a valid public address of the given coin, false otherwise.
TW_EXPORT_METHOD
bool TWCoinTypeValidate(enum TWCoinType coin, TWString* _Nonnull address);

/// Returns the default derivation path for a particular coin.
///
/// \param coin A coin type
/// \return the default derivation path for the given coin type.
TW_EXPORT_METHOD
TWString* _Nonnull TWCoinTypeDerivationPath(enum TWCoinType coin);

/// Returns the derivation path for a particular coin with the explicit given derivation.
///
/// \param coin A coin type
/// \param derivation A derivation type
/// \return the derivation path for the given coin with the explicit given derivation
TW_EXPORT_METHOD
TWString* _Nonnull TWCoinTypeDerivationPathWithDerivation(enum TWCoinType coin, enum TWDerivation derivation);

/// Derives the address for a particular coin from the private key.
///
/// \param coin A coin type
/// \param privateKey A valid private key
/// \return Derived address for the given coin from the private key.
TW_EXPORT_METHOD
TWString* _Nonnull TWCoinTypeDeriveAddress(enum TWCoinType coin,
                                           struct TWPrivateKey* _Nonnull privateKey);

/// Derives the address for a particular coin from the public key.
///
/// \param coin A coin type
/// \param publicKey A valid public key
/// \return Derived address for the given coin from the public key.
TW_EXPORT_METHOD
TWString* _Nonnull TWCoinTypeDeriveAddressFromPublicKey(enum TWCoinType coin,
                                                        struct TWPublicKey* _Nonnull publicKey);

/// Derives the address for a particular coin from the public key with the derivation.
TW_EXPORT_METHOD
TWString* _Nonnull TWCoinTypeDeriveAddressFromPublicKeyAndDerivation(enum TWCoinType coin,
                                                                     struct TWPublicKey* _Nonnull publicKey,
                                                                     enum TWDerivation derivation);

/// HRP for this coin type
///
/// \param coin A coin type
/// \return HRP of the given coin type.
TW_EXPORT_PROPERTY
enum TWHRP TWCoinTypeHRP(enum TWCoinType coin);

/// P2PKH prefix for this coin type
///
/// \param coin A coin type
/// \return P2PKH prefix for the given coin type
TW_EXPORT_PROPERTY
uint8_t TWCoinTypeP2pkhPrefix(enum TWCoinType coin);

/// P2SH prefix for this coin type
///
/// \param coin A coin type
/// \return P2SH prefix for the given coin type
TW_EXPORT_PROPERTY
uint8_t TWCoinTypeP2shPrefix(enum TWCoinType coin);

/// Static prefix for this coin type
///
/// \param coin A coin type
/// \return Static prefix for the given coin type
TW_EXPORT_PROPERTY
uint8_t TWCoinTypeStaticPrefix(enum TWCoinType coin);

/// ChainID for this coin type.
///
/// \param coin A coin type
/// \return ChainID for the given coin type.
/// \note Caller must free returned object.
TW_EXPORT_PROPERTY
TWString* _Nonnull TWCoinTypeChainId(enum TWCoinType coin);

/// SLIP-0044 id for this coin type
///
/// \param coin A coin type
/// \return SLIP-0044 id for the given coin type
TW_EXPORT_PROPERTY
uint32_t TWCoinTypeSlip44Id(enum TWCoinType coin);

/// SS58Prefix for this coin type
///
/// \param coin A coin type
/// \return SS58Prefix for the given coin type
TW_EXPORT_PROPERTY
uint32_t TWCoinTypeSS58Prefix(enum TWCoinType coin);

/// public key type for this coin type
///
/// \param coin A coin type
/// \return public key type for the given coin type
TW_EXPORT_PROPERTY
enum TWPublicKeyType TWCoinTypePublicKeyType(enum TWCoinType coin);

TW_EXTERN_C_END
