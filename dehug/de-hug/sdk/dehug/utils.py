"""Utility functions for DeHug SDK"""

import requests
from pathlib import Path
from typing import Dict
from .exceptions import NetworkError
import logging

# Configure logging
logger = logging.getLogger("dehug.utils")


def load_config() -> Dict[str, str]:
    """Load default configuration"""
    return {
        "ipfs_gateway": "https://gateway.pinata.cloud/ipfs",
        "contract_api": "https://api.dehug.io",
        "track_api": "https://analytics.dehug.io",
        "request_timeout": 30,
    }


def download_from_ipfs(
    cid: str, gateway: str = "https://gateway.pinata.cloud/ipfs"
) -> bytes:
    """Download raw content from IPFS using gateway"""
    url = f"{gateway.rstrip('/')}/{cid}"

    try:
        logger.info(f"Downloading from IPFS: {url}")
        response = requests.get(url, timeout=60)
        response.raise_for_status()
        return response.content
    except requests.exceptions.RequestException as e:
        raise NetworkError(f"Failed to download from IPFS: {e}")


def load_content_from_cid(
    cid: str, save_path: str, gateway: str = "https://gateway.pinata.cloud/ipfs"
) -> Path:
    """
    Download a file from IPFS CID and save it to the given path.
    Returns the Path object of the saved file.
    """
    content = download_from_ipfs(cid, gateway)

    save_path_obj = Path(save_path)
    save_path_obj.parent.mkdir(parents=True, exist_ok=True)

    with open(save_path_obj, "wb") as f:
        f.write(content)

    logger.info(f"Downloaded CID {cid} to {save_path_obj}")
    return save_path_obj.resolve()


def ensure_directory(path: str) -> Path:
    """Ensure directory exists, create if not"""
    path_obj = Path(path)
    path_obj.mkdir(parents=True, exist_ok=True)
    return path_obj
