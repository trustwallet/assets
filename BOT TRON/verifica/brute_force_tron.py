import hashlib
import time
from mnemonic import Mnemonic
from tronpy import Tron
from tronpy.keys import PrivateKey

# Função para gerar chave privada e endereço Tron com base nas 12 palavras
def generate_address_from_words(words):
    # Instância do Mnemonic
    mnemo = Mnemonic("english")
    seed = mnemo.to_seed(" ".join(words))
    
    # Gerando chave privada a partir do seed
    private_key_hex = hashlib.sha256(seed).hexdigest()
    
    # Convertendo a chave privada hexadecimal para o formato PrivateKey
    private_key = PrivateKey(bytes.fromhex(private_key_hex))
    
    # Cliente Tron
    client = Tron()

    # Gerando endereço Tron a partir da chave privada
    generated_address = private_key.public_key.to_base58check_address()
    
    return private_key_hex, generated_address

# Função para realizar o brute-force e tentar encontrar a chave privada correta
def brute_force(target_address):
    # Inicializa o Mnemonic
    mnemo = Mnemonic("english")
    
    # Começando o brute-force a partir da primeira combinação de palavras
    print(f"Iniciando brute-force de 12 palavras para o endereço alvo: {target_address}")
    
    # Gerar todas as combinações possíveis de 12 palavras
    # (isso é apenas um exemplo, normalmente seria um conjunto de palavras para tentar)
    word_list = mnemo.wordlist
    
    # Tentando 12 palavras de cada vez
    start_time = time.time()
    for w1 in word_list:
        for w2 in word_list:
            for w3 in word_list:
                for w4 in word_list:
                    for w5 in word_list:
                        for w6 in word_list:
                            for w7 in word_list:
                                for w8 in word_list:
                                    for w9 in word_list:
                                        for w10 in word_list:
                                            for w11 in word_list:
                                                for w12 in word_list:
                                                    
                                                    words = [w1, w2, w3, w4, w5, w6, w7, w8, w9, w10, w11, w12]
                                                    
                                                    # Gerar o endereço a partir das 12 palavras
                                                    private_key, generated_address = generate_address_from_words(words)
                                                    
                                                    # Verificar se o endereço gerado corresponde ao alvo
                                                    if generated_address == target_address:
                                                        end_time = time.time()
                                                        print(f"✅ Encontrei! Endereço: {generated_address}")
                                                        print(f"Chave privada: {private_key}")
                                                        print(f"Tempo de execução: {end_time - start_time:.2f} segundos")
                                                        return private_key
                                                    
    print("❌ Não encontrei a chave privada para o endereço fornecido.")
    return None

# Endereço alvo a ser encontrado
target_address = "TVwjTKKySh76jahXR2cFeR8jodXMvmFads"

# Iniciar o brute-force
brute_force(target_address)
