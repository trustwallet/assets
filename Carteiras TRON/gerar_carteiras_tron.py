from tronpy import Tron
from tronpy.keys import PrivateKey
import json

client = Tron(network='nile')

# Abrir arquivos de saída antecipadamente
with open('tron_wallets.json', 'w') as f_json, open('tron_wallets.txt', 'w') as f_txt:
    f_json.write('[\n')  # Início do JSON como array
    for i in range(10_000):
        priv_key = PrivateKey.random()
        address = priv_key.public_key.to_base58check_address()
        wallet_data = {
            'index': i + 1,
            'address': address,
            'private_key': priv_key.hex(),
        }

        # Escrever em JSON
        json.dump(wallet_data, f_json, indent=4)
        if i < 9999:
            f_json.write(',\n')  # vírgula entre os objetos
        else:
            f_json.write('\n')  # último objeto sem vírgula

        # Escrever em TXT
        f_txt.write(f"Carteira {wallet_data['index']}:\n")
        f_txt.write(f"  Endereço: {wallet_data['address']}\n")
        f_txt.write(f"  Chave Privada: {wallet_data['private_key']}\n")
        f_txt.write("-" * 40 + "\n")

    f_json.write(']')  # Final do JSON array

print("✔️  10.000 carteiras geradas e salvas diretamente em 'tron_wallets.json' e 'tron_wallets.txt'")
