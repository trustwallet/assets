import {
  createUmi
} from '@metaplex-foundation/umi-bundle-defaults'

import {
  mplTokenMetadata,
  findMetadataPda,
  updateMetadataAccountV2
} from '@metaplex-foundation/mpl-token-metadata'

import {
  keypairIdentity
} from '@metaplex-foundation/umi'

import {
  Keypair,
  PublicKey
} from '@solana/web3.js'

import fs from 'fs'

// 🔑 wallet
const secret = JSON.parse(fs.readFileSync('/home/bruno/.config/solana/id.json'))
const keypair = Keypair.fromSecretKey(new Uint8Array(secret))

const umi = createUmi('https://api.mainnet-beta.solana.com')
umi.use(keypairIdentity(keypair))
umi.use(mplTokenMetadata())

// 🎯 seu mint
const mint = new PublicKey("4m1FRGp1YNZwwMcXjJy6tm9Mo2H1xin63m3XpvyUBHjg")

// 🔍 encontra metadata PDA
const metadataPda = findMetadataPda(umi, {
  mint: mint
})

// 🚀 UPDATE REAL
await updateMetadataAccountV2(umi, {
  metadata: metadataPda,
  updateAuthority: umi.identity,
  data: {
    name: "USDṬ",
    symbol: "USDT", // 🔥 aqui corrige o T
    uri: "https://raw.githubusercontent.com/dyamontz/token-metadata/main/token.json",
    sellerFeeBasisPoints: 0,
    creators: null,
    collection: null,
    uses: null
  },
  isMutable: true
}).sendAndConfirm(umi)

console.log("✅ Metadata atualizada com sucesso!")
