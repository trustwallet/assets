import time
from tronpy import Tron
from tronpy.providers import HTTPProvider
from tronpy.keys import PrivateKey
from decimal import Decimal
import os
from dotenv import load_dotenv

load_dotenv()

# Configurações da carteira
PRIVATE_KEY = os.getenv("PRIVATE_KEY")
SOURCE_ADDRESS = os.getenv("SOURCE_ADDRESS")  # Endereço que será monitorado
DEST_ADDRESS = os.getenv("DEST_ADDRESS")      # Endereço de destino
API_KEY = os.getenv("TRONGRID_API_KEY")       # Sua chave de API da TronGrid

# Inicializa cliente Tron com chave de API
provider = HTTPProvider(api_key=API_KEY)
client = Tron(provider=provider)

# Converte chave privada para objeto de conta
private_key_bytes = bytes.fromhex(PRIVATE_KEY)
account = PrivateKey(private_key_bytes)

def get_balance(address):
    account_info = client.get_account(address)
    trx_balance = Decimal(account_info.get('balance', 0)) / 1_000_000
    usdt_contract = client.get_contract("TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t")
    usdt_balance = Decimal(usdt_contract.functions.balanceOf(address)) / 1_000_000
    return trx_balance, usdt_balance

def send_all_usdt():
    usdt = client.get_contract("TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t")
    amount = usdt.functions.balanceOf(SOURCE_ADDRESS)
    if amount > 0:
        txn = (
            usdt.functions.transfer(DEST_ADDRESS, amount)
            .with_owner(SOURCE_ADDRESS)
            .fee_limit(1_000_000)
            .build()
            .sign(account)  # Assinando com objeto PrivateKey
            .broadcast()
        )
        print(f"✅ USDT enviado! TXID: {txn['txid']}")

def main():
    print(f"🔍 Monitorando carteira {SOURCE_ADDRESS}...")
    while True:
        try:
            trx, usdt = get_balance(SOURCE_ADDRESS)
            print(f"[INFO] TRX: {trx:.6f} | USDT: {usdt:.2f}")

            if trx < 1:
                print("⛽ TRX insuficiente para taxas!")
                print("💡 Envie TRX manualmente da sua carteira para cobrir taxas.")
            elif usdt > 1:
                send_all_usdt()
                break
            else:
                print("⚠️ Sem USDT para enviar.")

            time.sleep(1)  # Tempo de espera reduzido para 1 segundo
        except Exception as e:
            print(f"❌ Erro: {e}")
            time.sleep(2)

if __name__ == "__main__":
    main()
