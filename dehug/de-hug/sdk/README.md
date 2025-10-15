# DeHug - Decentralized Hugging Face

[![PyPI version](https://badge.fury.io/py/dehug.svg)](https://badge.fury.io/py/dehug)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

DeHug is a decentralized platform for AI models and datasets built on IPFS/Filecoin, providing a decentralized alternative to traditional centralized AI model repositories.

## Features

- 🌐 **Decentralized Storage**: Models and datasets stored on IPFS/Filecoin
- 🔒 **Censorship Resistant**: No single point of failure or control
- 🚀 **Easy Integration**: Simple Python SDK compatible with existing workflows
- 📊 **Data Loading**: Support for JSON, CSV, text, and binary formats
- 🔍 **Search**: Search and discover models and datasets
- 📋 **Metadata**: Rich metadata support for models and datasets

## Installation

```bash
pip install dehug
```

## Quick Start

### Loading Datasets

```python
from dehug import DeHug

client = DeHug()

# Load a CSV dataset
dataset = client.load_dataset("QmYourDatasetCID", format_hint="csv")
print(dataset.head())

# Load a JSON dataset
data = client.load_dataset("QmYourJSONDataCID", format_hint="json")
print(data)

# Load by name (if registered in DeHug registry)
dataset = client.load_dataset("my-dataset-name", format_hint="csv")
```

### Working with Models

```python
# Load model metadata
model_info = client.load_model("QmYourModelCID")
print(f"Model: {model_info['name']}")
print(f"Task: {model_info['task']}")
print(f"Description: {model_info['description']}")

# Download model files locally
model_path = client.download_model("QmYourModelCID", "./my_models")
print(f"Model downloaded to: {model_path}")
```

### Listing and Searching

```python
# List all available datasets
datasets = client.list_datasets()
for dataset in datasets:
    print(f"{dataset['name']}: {dataset['description']}")

# List all available models
models = client.list_models()
for model in models:
    print(f"{model['name']}: {model['task']}")

# Search for datasets
results = client.search_datasets("sentiment analysis")
print(f"Found {len(results)} datasets")

# Search for models
results = client.search_models("text classification")
print(f"Found {len(results)} models")
```

## CLI Usage

DeHug includes a command-line interface for easy access:

```bash
# Load and display a dataset
dehug dataset QmYourDatasetCID --format csv

# Save dataset to file
dehug dataset QmYourDatasetCID --format csv --output dataset.csv

# Load model metadata
dehug model QmYourModelCID

# Download model files
dehug model QmYourModelCID --download ./models

# List available datasets
dehug list datasets

# List available models
dehug list models

# Search for datasets
dehug search datasets "machine learning"

# Search for models
dehug search models "nlp"
```

## Configuration

You can customize the IPFS gateway and API endpoints by passing a config dictionary:

```python
config = {
    'ipfs_gateway': 'https://your-ipfs-gateway.com/ipfs',
    'contract_api': 'https://your-api.com',
    'request_timeout': 60
}

client = DeHug(config=config)
```

Default configuration:
- IPFS Gateway: `https://ipfs.io/ipfs`
- Contract API: `https://api.dehug.io`
- Request Timeout: 30 seconds

## Supported Formats

DeHug automatically detects and handles various data formats:

- **JSON**: Parsed into Python dictionaries
- **CSV**: Loaded as pandas DataFrames
- **Text**: Returned as strings
- **Binary**: Returned as bytes

You can also specify format hints for better performance:

```python
# Explicitly specify format
csv_data = client.load_dataset("QmDataCID", format_hint="csv")
json_data = client.load_dataset("QmDataCID", format_hint="json")
text_data = client.load_dataset("QmDataCID", format_hint="text")
binary_data = client.load_dataset("QmDataCID", format_hint="binary")
```

## Error Handling

DeHug provides specific exceptions for better error handling:

```python
from dehug import DeHug, DeHugError, NetworkError, DatasetNotFoundError

client = DeHug()

try:
    dataset = client.load_dataset("nonexistent-dataset")
except DatasetNotFoundError:
    print("Dataset not found")
except NetworkError:
    print("Network connection failed")
except DeHugError as e:
    print(f"DeHug error: {e}")
```

## API Reference

### DeHug Client

- `load_dataset(name_or_cid, format_hint=None)`: Load dataset from IPFS
- `load_model(name_or_cid)`: Load model metadata
- `download_model(name_or_cid, download_dir="./models")`: Download model files
- `list_datasets()`: List available datasets
- `list_models()`: List available models
- `search_datasets(query)`: Search datasets by query
- `search_models(query)`: Search models by query

### Utility Functions

- `load_dataset_from_cid(cid, format_hint=None)`: Direct dataset loading from CID
- `load_content_from_cid(cid, format_hint=None)`: Load any content from CID

## Architecture

DeHug consists of two main components:

1. **Contract API**: Metadata registry for models and datasets
2. **IPFS Storage**: Decentralized storage for actual model/data files

The SDK provides a seamless interface to both layers, allowing you to work with decentralized AI assets as easily as with traditional centralized repositories.

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature