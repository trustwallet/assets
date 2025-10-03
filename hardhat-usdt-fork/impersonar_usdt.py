from web3 import Web3
import json

# Conectar ao fork (Hardhat ou Anvil)
web3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))
assert web3.is_connected(), "❌ Não conectado ao fork local"

# Endereços
usdt_address = Web3.to_checksum_address("0xdAC17F958D2ee523a2206206994597C13D831ec7")
rich_wallet = Web3.to_checksum_address("0x835678a611B28684005a5e2233695fB6cbbB0007")  # carteira rica
destino = Web3.to_checksum_address("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")

# ABI mínima do USDT (apenas balanceOf e transfer)
usdt_abi = json.loads("""
[
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance", "type": "uint256"}],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{"name": "_to", "type": "address"}, {"name": "_value", "type": "uint256"}],
    "name": "transfer",
    "outputs": [{"name": "", "type": "bool"}],
    "type": "function"
  }
]
""")

# Instanciar contrato
usdt = web3.eth.contract(address=usdt_address, abi=usdt_abi)

# Função auxiliar: exibir saldo formatado
def mostrar_saldo(nome, endereco):
    saldo = usdt.functions.balanceOf(endereco).call()
    print(f"{nome}: {saldo / 1e6:.2f} USDT")

# Saldo antes
print("📊 Saldos antes da transferência:")
mostrar_saldo("Carteira rica", rich_wallet)
mostrar_saldo("Destino", destino)

# Impersonar a carteira rica
web3.provider.make_request("anvil_impersonateAccount", [rich_wallet])

# Criar transação
valor_usdt = int(100_000_000 * 1e6)  # 100 milhões de USDT
print(f"\n🚀 Enviando {valor_usdt / 1e6:,.0f} USDT para {destino}...")

nonce = web3.eth.get_transaction_count(rich_wallet)

tx = usdt.functions.transfer(destino, valor_usdt).build_transaction({
    'from': rich_wallet,
    'nonce': nonce,
    'gas': 100000,
    'maxFeePerGas': web3.to_wei('100', 'gwei'),
    'maxPriorityFeePerGas': web3.to_wei('2', 'gwei')
})

# Enviar transação
tx_hash = web3.eth.send_transaction(tx)
receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

# Parar impersonation
web3.provider.make_request("anvil_stopImpersonatingAccount", [rich_wallet])

# Saldos depois
print("\n✅ Transação confirmada!")
print("📊 Saldos depois da transferência:")
mostrar_saldo("Carteira rica", rich_wallet)
mostrar_saldo("Destino", destino)
