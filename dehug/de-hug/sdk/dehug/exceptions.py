"""Custom exceptions for DeHug SDK"""


class DeHugError(Exception):
    """Base exception for DeHug SDK"""

    pass


class NetworkError(DeHugError):
    """Network-related errors"""

    pass


class IPFSError(DeHugError):
    """IPFS-specific errors"""

    pass


class ModelNotFoundError(DeHugError):
    """Model not found error"""

    pass


class DatasetNotFoundError(DeHugError):
    """Dataset not found error"""

    pass


class ConfigurationError(DeHugError):
    """Configuration-related errors"""

    pass
