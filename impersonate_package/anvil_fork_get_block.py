import subprocess
import time
from web3 import Web3

# 1. Comando para iniciar o Anvil dentro do WSL (Debian)
anvil_cmd = [
    "wsl", "anvil",
    "--fork-url", "https://ethereum.publicnode.com",
    "--chain-id", "1"
]

# 2. Iniciar o Anvil como subprocesso no WSL
print("Iniciando Anvil dentro do Debian (WSL)...")
anvil_process = subprocess.Popen(anvil_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

# 3. Aguardar alguns segundos para garantir que o Anvil esteja pronto
time.sleep(5)

# 4. Conectar via Web3 à instância do Anvil
w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))

# 5. Verificar a conexão
if not w3.is_connected():
    print("❌ Erro: Não foi possível conectar ao Anvil.")
    anvil_process.terminate()
    exit(1)

# 6. Obter o número do bloco atual
block_number = w3.eth.block_number
print(f"✅ Bloco atual no fork: {block_number}")

# ⚠️ O Anvil continuará rodando após isso.
# Para finalizar o processo automaticamente ao final, descomente a linha abaixo:
# anvil_process.terminate()
