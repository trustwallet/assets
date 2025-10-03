from bip_utils import Bip39SeedGenerator, Bip39MnemonicValidator, Bip44, Bip44Coins, Bip44Changes
from itertools import product, islice
import os

# Palavras fixas que você lembra
fixed_words = ["capital", "hurdle", "catch", "true"]

# Lista de palavras candidatas
candidates = ["apple", "stone", "river", "gauge", "space", "lady", "fancy", "true", "glory", "brush"]

# Endereço TRON alvo
target_address = "TVwjTKKySh76jahXR2cFeR8jodXMvmFads"

validator = Bip39MnemonicValidator()
total_tested = 0
total_combinations = len(candidates) ** 8

# Caminho do arquivo de checkpoint
checkpoint_file = "checkpoint.txt"

# Carrega índice salvo do último progresso
start_index = 0
if os.path.exists(checkpoint_file):
    with open(checkpoint_file, "r") as f:
        content = f.read().strip()
        if content.isdigit():
            start_index = int(content)
            print(f"🔁 Retomando do índice {start_index}")

print(f"Total de combinações possíveis: {total_combinations}")

# Gera combinações a partir do ponto salvo
combinations = islice(product(candidates, repeat=8), start_index, None)

for i, combo in enumerate(combinations, start=start_index):
    seed_phrase = fixed_words + list(combo)
    mnemonic = " ".join(seed_phrase)

    print(f"\nTestando #{i}: {mnemonic}")

    if not validator.IsValid(mnemonic):
        continue

    seed_bytes = Bip39SeedGenerator(mnemonic).Generate()
    bip44_wallet = Bip44.FromSeed(seed_bytes, Bip44Coins.TRON)
    derived_address = bip44_wallet.Purpose().Coin().Account(0).Change(Bip44Changes.CHAIN_EXT).AddressIndex(0).PublicKey().ToAddress()

    # Verifica se é o endereço desejado
    if derived_address == target_address:
        print("\n🎉 Seed encontrada!")
        print("Frase correta:", mnemonic)
        break

    # Atualiza o checkpoint
    with open(checkpoint_file, "w") as f:
        f.write(str(i + 1))

    # Mostrar progresso a cada 100 tentativas
    if (i + 1) % 100 == 0:
        percent = ((i + 1) / total_combinations) * 100
        print(f">>> Testadas: {i + 1} | Progresso: {percent:.6f}%")
