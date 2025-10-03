from tronpy import Tron
from tronpy.providers import HTTPProvider
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("TRONGRID_API_KEY")
ADDRESS = os.getenv("SOURCE_ADDRESS")

client = Tron(provider=HTTPProvider(api_key=API_KEY))
account_info = client.get_account(ADDRESS)

print("🔐 Permissões da conta:")
print("\n🔑 Permissões ativas (active_permission):")
print(account_info.get("active_permission", []))

print("\n👑 Permissão de proprietário (owner_permission):")
print(account_info.get("owner_permission", {}))
