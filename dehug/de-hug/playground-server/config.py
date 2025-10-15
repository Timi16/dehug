import os

IPFS_GATEWAY = "https://gateway.pinata.cloud/ipfs"
MODEL_CACHE_DIR = "/tmp/dehug_models"
MAX_MODEL_SIZE = 5 * 1024 * 1024 * 1024  # 5GB
REQUEST_TIMEOUT = 300  # 5 minutes
ALLOWED_ORIGINS = ["*"]  # TODO: restrict for production
CACHE_MAX_MODELS = 5 # Maximum number of models to cache

# Ensure cache dir exists
os.makedirs(MODEL_CACHE_DIR, exist_ok=True)
