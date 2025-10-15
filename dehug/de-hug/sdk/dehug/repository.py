"""DeHug Repository class for managing models and datasets"""

import requests
from typing import Dict, List, Any, Optional, Union
import json

from .exceptions import (
    ModelNotFoundError,
)
from .utils import load_content_from_cid, download_from_ipfs
from pathlib import Path

class DeHugRepository:
    """Repository interface for DeHug models and datasets"""

    def __init__(self, config: Dict[str, str]):
        """Initialize repository

        Args:
            config: Configuration dictionary
        """
        self.config = config
        self.ipfs_gateway = config.get(
            "ipfs_gateway", "https://gateway.pinata.cloud/ipfs"
        )
        self.timeout = config.get("request_timeout", 60)
        self.track_api = "https://download-tracker.vercel.app"

    @staticmethod
    def _track_download(item_name: str):
        try:
            response = requests.post(
                f"{TRACK_API}/track/download",
                json={"item_name": item_name, "source": "sdk"},
                timeout=5,
            )
            response.raise_for_status()
        except requests.RequestException as e:
            print(f"[DeHug SDK] Tracking failed: {e}")

    def load_dataset(self, cid: str, format_hint: str = None) -> Any:
        """Load dataset by name or CID

        Args:
            name_or_cid: Dataset name or IPFS CID
            format_hint: Format hint for parsing (json, csv, text, binary)

        Returns:
            Loaded dataset
        """
        return load_content_from_cid(cid, format_hint)

    def load_model(self, name_or_cid: str) -> Dict[str, Any]:
        """Load model metadata by name or CID

        Args:
            name_or_cid: Model name or IPFS CID

        Returns:
            Model metadata dictionary
        """
        try:
            download_dir = self.config.get("download_dir", "/tmp/dehug")
            download_path = f"{download_dir}/{name_or_cid}.zip"
            metadata = load_content_from_cid(name_or_cid, download_path, self.ipfs_gateway)
            return metadata
        except Exception as e:
            raise ModelNotFoundError(f"Model metadata not found: {e}")

    def download_model_files(
        self, name_or_cid: str, download_dir: str = "./models"
    ) -> str:
        """Download model files to local directory

        Args:
            name_or_cid: Model name or IPFS CID
            download_dir: Directory to download files to

        Returns:
            Path to downloaded model directory
        """
        model_metadata = self.load_model(name_or_cid)

        # Get model files CID
        files_cid = model_metadata.get("files_cid")
        if not files_cid:
            raise ModelNotFoundError("Model files CID not found in metadata")

        # Create download directory
       

        download_path = Path(download_dir) / (model_metadata.get("name", files_cid))
        download_path.mkdir(parents=True, exist_ok=True)

        # Download model files (this would need to handle directories)
        model_files = download_from_ipfs(files_cid)

        # Save as binary file (in real implementation, would extract archive)
        model_file_path = download_path / "model.bin"
        model_file_path.write_bytes(model_files)

        return str(download_path)
