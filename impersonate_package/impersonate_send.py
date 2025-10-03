import sys
from web3 import Web3

if len(sys.argv) != 3:
    print("Uso: python impersonate_send.py <ENDEREÇO_DESTINO> <VALOR_EM_ETH>")
    sys.exit(1)

to_address = Web3.to_checksum_address(sys.argv[1])
amount_eth = float(sys.argv[2])

# Conectando ao Anvil
w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))
assert w3.is_connected(), "❌ Falha na conexão com o Anvil"

# Conta famosa a ser impersonada (Vitalik, por exemplo)
from_address = Web3.to_checksum_address("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045")

# Impersonar e garantir saldo suficiente
w3.provider.make_request("anvil_impersonateAccount", [from_address])
w3.provider.make_request("anvil_setBalance", [from_address, hex(w3.to_wei(10000, "ether"))])

# Mostrar saldo antes (opcional)
saldo_antes = w3.eth.get_balance(to_address)
print(f"💰 Saldo ANTES do destinatário: {w3.from_wei(saldo_antes, 'ether')} ETH")

# Criar transação EIP-1559
tx = {
    "from": from_address,
    "to": to_address,
    "value": w3.to_wei(amount_eth, "ether"),
    "gas": 21000,
    "maxFeePerGas": w3.to_wei(100, "gwei"),
    "maxPriorityFeePerGas": w3.to_wei(1.5, "gwei"),
    "nonce": w3.eth.get_transaction_count(from_address),
    "type": "0x2",  # Transação EIP-1559
}

# Enviar e esperar confirmação
try:
    tx_hash = w3.eth.send_transaction(tx)
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    print(f"✅ Transação confirmada no bloco {receipt.blockNumber}")
    print(f"🔗 Hash: {tx_hash.hex()}")

    # Mostrar saldo depois (opcional)
    saldo_depois = w3.eth.get_balance(to_address)
    print(f"💰 Saldo DEPOIS do destinatário: {w3.from_wei(saldo_depois, 'ether')} ETH")

except Exception as e:
    print(f"❌ Erro ao enviar transação: {e}")
