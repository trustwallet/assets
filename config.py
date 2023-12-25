from dataclasses import dataclass
from typing import Optional

import torch

from cpufeature import CPUFeature
from petals.constants import PUBLIC_INITIAL_PEERS


@dataclass
class ModelInfo:
    repo: str
    adapter: Optional[str] = None


MODELS = [
    ModelInfo(repo="meta-llama/Llama-2-70b-chat-hf"),
    ModelInfo(repo="stabilityai/StableBeluga2"),
    ModelInfo(repo="enoch/llama-65b-hf"),
    ModelInfo(repo="enoch/llama-65b-hf", adapter="timdettmers/guanaco-65b"),
    ModelInfo(repo="bigscience/bloomz"),
]
DEFAULT_MODEL_NAME = "enoch/llama-65b-hf"

INITIAL_PEERS = PUBLIC_INITIAL_PEERS
# Set this to a list of multiaddrs to connect to a private swarm instead of the public one, for example:
# INITIAL_PEERS = ['/ip4/10.1.2.3/tcp/31234/p2p/QmcXhze98AcgGQDDYna23s4Jho96n8wkwLJv78vxtFNq44']

DEVICE = "cpu"

if DEVICE == "cuda":
    TORCH_DTYPE = "auto"
elif CPUFeature["AVX512f"] and CPUFeature["OS_AVX512"]:
    TORCH_DTYPE = torch.bfloat16
else:
    TORCH_DTYPE = torch.float32  # You can use bfloat16 in this case too, but it will be slow

STEP_TIMEOUT = 5 * 60
MAX_SESSIONS = 50  # Has effect only for API v1 (HTTP-based)
