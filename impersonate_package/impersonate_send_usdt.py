import sys
from web3 import Web3

if len(sys.argv) != 2:
    print("Uso: python impersonate_send_usdt.py <ENDEREÇO_DESTINO>")
    sys.exit(1)

destino = Web3.to_checksum_address(sys.argv[1])

# Conectar ao Anvil ou RPC exposto via ngrok
w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))  # ou seu ngrok
assert w3.is_connected(), "❌ Não conectado ao Anvil ou RPC"

# Endereço com muito USDT (real, contrato oficial)
usdt_holder = Web3.to_checksum_address("0xF977814e90dA44bFA03b6295A0616a897441aceC")
usdt_address = Web3.to_checksum_address("0xdAC17F958D2ee523a2206206994597C13D831ec7")  # USDT real da Mainnet

# ABI mínima do USDT
erc20_abi = [
    {"constant": True, "inputs": [{"name": "_owner", "type": "address"}],
     "name": "balanceOf", "outputs": [{"name": "balance", "type": "uint256"}],
     "type": "function"},
    {"constant": False, "inputs": [{"name": "_to", "type": "address"}, {"name": "_value", "type": "uint256"}],
     "name": "transfer", "outputs": [{"name": "", "type": "bool"}],
     "type": "function"},
    {"constant": True, "inputs": [], "name": "decimals",
     "outputs": [{"name": "", "type": "uint8"}], "type": "function"},
]

usdt = w3.eth.contract(address=usdt_address, abi=erc20_abi)
decimals = usdt.functions.decimals().call()
fator = 10 ** decimals

# Impersonar a whale
w3.provider.make_request("anvil_impersonateAccount", [usdt_holder])
w3.provider.make_request("anvil_setBalance", [usdt_holder, hex(10**20)])  # fornece ETH suficiente

# Saldo antes
saldo_antes = usdt.functions.balanceOf(destino).call()
print(f"💰 Saldo ANTES: {saldo_antes / fator:,.2f} USDT")

# Quantidade a transferir (500 mil USDT)
quantia = 500_000 * fator

# Construir transação
tx = usdt.functions.transfer(destino, quantia).build_transaction({
    "from": usdt_holder,
    "nonce": w3.eth.get_transaction_count(usdt_holder),
    "gas": 100_000,
    "maxFeePerGas": w3.to_wei(100, "gwei"),
    "maxPriorityFeePerGas": w3.to_wei(2, "gwei"),
})

# Enviar
tx_hash = w3.eth.send_transaction(tx)
receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

print(f"✅ Enviado com sucesso. Bloco: {receipt.blockNumber}")
print(f"🔗 Hash da transação: {tx_hash.hex()}")

# Saldo depois
saldo_depois = usdt.functions.balanceOf(destino).call()
print(f"💰 Saldo DEPOIS: {saldo_depois / fator:,.2f} USDT")
