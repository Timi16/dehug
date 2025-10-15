# DeHug - Decentralized Hugging Face

A decentralized AI model and dataset hub built on Web3 technology, featuring NFT rewards, IPFS storage, and community-driven content curation.

## Features

### Core Platform
- **Decentralized Storage**: Models and datasets stored on IPFS for permanent availability
- **NFT Rewards**: Automatic NFT minting for uploads with value appreciation based on engagement
- **Community Curation**: Like, download, and discover AI content from the community
- **Multi-format Support**: Compatible with various model formats and dataset types

### Upload System
- **Smart File Handling**: Automatic compression for multiple files, single archive support
- **Metadata Management**: Rich metadata stored on IPFS with blockchain references
- **Progress Tracking**: Real-time upload progress with detailed status updates
- **Error Handling**: Comprehensive error reporting with user-friendly messages

### Download Tracking
- **Dual Tracking**: Separate statistics for SDK and UI downloads
- **Real-time Analytics**: Live download counts and engagement metrics
- **Geographic Distribution**: Global download pattern analysis
- **Growth Metrics**: Weekly and monthly growth tracking

### SDK & API
- **Python SDK**: Full-featured client library for programmatic access
- **RESTful API**: Complete API for all platform operations
- **Local Inference**: Playground server for running models locally
- **Batch Operations**: CLI tools for bulk uploads and downloads

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+
- Web3 wallet (MetaMask recommended)

### Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/your-org/dehug-platform.git
cd dehug-platform

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
\`\`\`

### Environment Variables

\`\`\`bash
# Blockchain Configuration
NEXT_PUBLIC_CHAIN_ID=1
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...

# IPFS Configuration
IPFS_API_URL=https://api.pinata.cloud
PINATA_API_KEY=your_pinata_key
PINATA_SECRET_KEY=your_pinata_secret

# Optional: Database
DATABASE_URL=postgresql://...
\`\`\`

## Usage

### Web Interface

1. **Browse Content**: Explore models and datasets on the platform
2. **Connect Wallet**: Link your Web3 wallet for uploads and NFT rewards
3. **Upload Content**: Drag and drop files with automatic processing
4. **Track Performance**: Monitor downloads and NFT value growth

### Python SDK

```python
# Install SDK
pip install dehug-sdk

# Basic usage
from dehug import DeHugRepository

# Initialize client
client = DeHugRepository()

# Load model to tmpdehug directory
models = client.load_model("model hash")

# Load dataset
dataset = client.load_dataset("dataset hash")

# Upload your model
upload_result = client.upload_model(
    model_path="./my_model",
    title="My Awesome Model",
    description="A fine-tuned model for specific tasks",
    tags=["nlp", "classification"],
    license="mit"
)
