from mnemonic import Mnemonic
from bip_utils import Bip39SeedGenerator, Bip44, Bip44Coins, Bip44Changes

# Gerar frase mnemônica (12 palavras)
mnemo = Mnemonic("english")
mnemonic_phrase = mnemo.generate(strength=128)

# Gerar seed a partir da mnemonic
seed_bytes = Bip39SeedGenerator(mnemonic_phrase).Generate()

# Criar carteira Ethereum BIP44
bip44_mst = Bip44.FromSeed(seed_bytes, Bip44Coins.ETHEREUM)
bip44_acc = bip44_mst.Purpose().Coin().Account(0).Change(Bip44Changes.CHAIN_EXT).AddressIndex(0)

# Obter chave privada e endereço
private_key = bip44_acc.PrivateKey().Raw().ToHex()
address = bip44_acc.PublicKey().ToAddress()

# Preparar conteúdo
output = f"""
Frase mnemônica (12 palavras):
{mnemonic_phrase}

Endereço Ethereum:
{address}

Chave privada:
0x{private_key}
"""

# Exibir no terminal
print(output)

# Salvar em arquivo TXT
with open("ethereum_wallet.txt", "w") as file:
    file.write(output)

print("Carteira salva no arquivo 'ethereum_wallet.txt'")
