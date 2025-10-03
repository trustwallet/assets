from web3 import Web3
from web3.middleware import geth_poa_middleware

# ===============================
# CONFIGURAÇÕES
# ===============================

# URL do seu fork local (Anvil rodando com fork BSC)
FORK_RPC_URL = 'http://127.0.0.1:8545'

# Endereço da conta rica para impersonar
IMPERSONATE_ACCOUNT = '0x98B4be9C7a32A5d3bEFb08bB98d65E6D204f7E98'

# Endereço de destino (sua wallet ou outra conta)
DESTINATION_ACCOUNT = '0x3565B722937886224800C207299014FA8E5D4bD2'

# Endereço do contrato USDT na BSC
USDT_CONTRACT_ADDRESS = '0x55d398326f99059fF775485246999027B3197955'

# ABI mínima para balanceOf e transfer
USDT_ABI = [
    {
        "constant": True,
        "inputs": [{"name": "_owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "balance", "type": "uint256"}],
        "type": "function"
    },
    {
        "constant": False,
        "inputs": [
            {"name": "_to", "type": "address"},
            {"name": "_value", "type": "uint256"}
        ],
        "name": "transfer",
        "outputs": [{"name": "", "type": "bool"}],
        "type": "function"
    }
]

# Valor a transferir (10000 USDT, considerando 6 casas decimais)
TRANSFER_AMOUNT = 10000 * (10 ** 18)  # Cuidado: cheque o DECIMALS do token!

# ===============================
# INICIALIZA WEB3
# ===============================

web3 = Web3(Web3.HTTPProvider(FORK_RPC_URL))
web3.middleware_onion.inject(geth_poa_middleware, layer=0)

print(f'✅ Conectado: {web3.is_connected()}')

# Inicializa contrato USDT
usdt_contract = web3.eth.contract(address=USDT_CONTRACT_ADDRESS, abi=USDT_ABI)

# ===============================
# FUNÇÕES DE LEITURA DE SALDO
# ===============================

def get_usdt_balance(address):
    balance = usdt_contract.functions.balanceOf(address).call()
    # Converter para formato legível
    return balance / (10 ** 18)

# ===============================
# SALDO ANTES
# ===============================

impersonate_balance_before = get_usdt_balance(IMPERSONATE_ACCOUNT)
dest_balance_before = get_usdt_balance(DESTINATION_ACCOUNT)

print(f'💰 Saldo ANTES - IMPERSONATE_ACCOUNT: {impersonate_balance_before} USDT')
print(f'💰 Saldo ANTES - DESTINATION_ACCOUNT: {dest_balance_before} USDT')

# ===============================
# IMPERSONAÇÃO E TRANSFERÊNCIA
# ===============================

# Permite impersonar no Anvil
web3.provider.make_request('anvil_impersonateAccount', [IMPERSONATE_ACCOUNT])
print(f'✅ Impersonado: {IMPERSONATE_ACCOUNT}')

# Monta transação transfer
tx = usdt_contract.functions.transfer(
    DESTINATION_ACCOUNT,
    TRANSFER_AMOUNT
).build_transaction({
    'from': IMPERSONATE_ACCOUNT,
    'nonce': web3.eth.get_transaction_count(IMPERSONATE_ACCOUNT),
    'gas': 200000,
    'gasPrice': web3.to_wei('5', 'gwei'),
})

# Envia transação
tx_hash = web3.eth.send_transaction(tx)
print(f'✅ Tx enviada! Hash: {web3.to_hex(tx_hash)}')

# Para de impersonar
web3.provider.make_request('anvil_stopImpersonatingAccount', [IMPERSONATE_ACCOUNT])
print(f'✅ Parou de impersonar: {IMPERSONATE_ACCOUNT}')

# ===============================
# SALDO DEPOIS
# ===============================

impersonate_balance_after = get_usdt_balance(IMPERSONATE_ACCOUNT)
dest_balance_after = get_usdt_balance(DESTINATION_ACCOUNT)

print(f'💰 Saldo DEPOIS - IMPERSONATE_ACCOUNT: {impersonate_balance_after} USDT')
print(f'💰 Saldo DEPOIS - DESTINATION_ACCOUNT: {dest_balance_after} USDT')
