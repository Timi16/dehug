import axios from "axios";

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Types
export interface DownloadStats {
  sdk: number;
  ui: number;
  total: number;
}

export interface StatsResponse {
  [itemName: string]: DownloadStats;
}

export interface NFTAttribute {
  trait_type: string;
  value: string | number;
}

export interface NFTMetadata {
  tokenId: string;
  name: string;
  description: string;
  image: string;
  contractAddress: string;
  currentValue: number;
  mintedAt: string;
  lastSyncedAt: string;
  openseaUrl: string;
  attributes: NFTAttribute[];
}

export interface ModelDetails {
  id: string;
  name: string;
  type: string;
  description: string;
  author: string;
  downloads: number;
  likes: number;
  views: number;
  forks: number;
  tags: string[];
  modelCard: string;
  examples: string[];
  license: string;
  size: string;
  format: string;
  uploadDate: string;
  lastUpdated: string;
  ipfsHash: string;
  parameters: {
    [key: string]: {
      min: number;
      max: number;
      default: number;
      description: string;
    };
  };
}

// Mock model data for development
const mockModels: Record<string, ModelDetails> = {
  "1": {
    id: "1",
    name: "GPT-2 Small Fine-tuned",
    type: "Text Generation",
    description:
      "A fine-tuned GPT-2 model for creative writing with enhanced storytelling capabilities. This model has been trained on a curated dataset of literature and creative writing samples to improve its ability to generate coherent, engaging narratives.",
    author: "openai-community",
    downloads: 124700,
    likes: 2340,
    views: 45678,
    forks: 234,
    tags: ["gpt-2", "text-generation", "creative-writing", "fine-tuned"],
    modelCard:
      "This model is a fine-tuned version of GPT-2 Small, specifically optimized for creative writing tasks.",
    examples: [
      "Once upon a time in a distant galaxy",
      "The future of artificial intelligence is",
      "In the heart of Africa, there lived",
      "Climate change is affecting our planet by",
      "The ancient library contained secrets that",
    ],
    license: "MIT",
    size: "548 MB",
    format: "PyTorch",
    uploadDate: "2024-01-15",
    lastUpdated: "2024-01-20",
    ipfsHash: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
    parameters: {
      temperature: {
        min: 0.1,
        max: 2.0,
        default: 0.8,
        description:
          "Controls randomness in generation. Higher values make output more random.",
      },
      max_length: {
        min: 10,
        max: 500,
        default: 100,
        description: "Maximum number of tokens to generate.",
      },
      top_p: {
        min: 0.1,
        max: 1.0,
        default: 0.9,
        description:
          "Nucleus sampling parameter. Lower values make output more focused.",
      },
      top_k: {
        min: 1,
        max: 100,
        default: 50,
        description:
          "Top-k sampling parameter. Limits vocabulary for each step.",
      },
      repetition_penalty: {
        min: 1.0,
        max: 2.0,
        default: 1.1,
        description:
          "Penalty for repetition. Higher values reduce repetitive text.",
      },
    },
  },
  "2": {
    id: "2",
    name: "African Language Classifier",
    type: "Text Classification",
    description:
      "A BERT-based model fine-tuned for classifying text in multiple African languages including Swahili, Yoruba, Amharic, and Zulu.",
    author: "african-nlp-community",
    downloads: 89234,
    likes: 1876,
    views: 32145,
    forks: 167,
    tags: ["bert", "classification", "african-languages", "multilingual"],
    modelCard:
      "This model classifies text across 15 African languages with high accuracy.",
    examples: [
      "Habari za asubuhi, hali ya hewa ni nzuri leo",
      "Bawo ni, emi ni omo Yoruba",
      "Selam, ene Ethiopian negn",
      "Sawubona, ngiyajabula ukukubona",
    ],
    license: "Apache 2.0",
    size: "1.2 GB",
    format: "PyTorch",
    uploadDate: "2024-01-12",
    lastUpdated: "2024-01-18",
    ipfsHash: "QmXwBPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdH",
    parameters: {
      max_length: {
        min: 10,
        max: 512,
        default: 128,
        description: "Maximum sequence length for classification.",
      },
      threshold: {
        min: 0.1,
        max: 0.9,
        default: 0.5,
        description: "Classification confidence threshold.",
      },
    },
  },
  "3": {
    id: "3",
    name: "Swahili Speech Recognition",
    type: "Speech Recognition",
    description:
      "A Wav2Vec2-based model trained on Swahili speech data for automatic speech recognition tasks.",
    author: "east-africa-ai",
    downloads: 45678,
    likes: 987,
    views: 18234,
    forks: 89,
    tags: ["wav2vec2", "speech-recognition", "swahili", "asr"],
    modelCard:
      "High-accuracy Swahili speech recognition model trained on diverse dialects.",
    examples: [
      "Upload an audio file in Swahili to transcribe",
      "Supported formats: WAV, MP3, FLAC",
      "Maximum duration: 30 seconds",
    ],
    license: "MIT",
    size: "2.1 GB",
    format: "PyTorch",
    uploadDate: "2024-01-08",
    lastUpdated: "2024-01-16",
    ipfsHash: "QmZwCPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdI",
    parameters: {
      chunk_length: {
        min: 5,
        max: 30,
        default: 10,
        description: "Audio chunk length in seconds for processing.",
      },
      beam_size: {
        min: 1,
        max: 10,
        default: 5,
        description: "Beam search size for decoding.",
      },
    },
  },
};

export interface UserUpload {
  id: string;
  name: string;
  description: string;
  type: "model" | "dataset";
  author: string;
  uploadedAt: string;
  fileSize: string;
  license: string;
  tags: string[];
  downloads: DownloadStats;
  likes: number;
  views: number;
  forks: number;
  stars: number;
  comments: number;
  nft: NFTMetadata;
}

export interface PortfolioStats {
  totalUploads: number;
  totalDownloads: number;
  totalNFTValue: number;
  totalEngagement: number;
}

export interface EngagementMetrics {
  downloads: number;
  likes: number;
  views: number;
  forks: number;
  comments: number;
  stars: number;
}

export interface SyncResult {
  success: boolean;
  newValue: number;
  transactionHash: string;
  error?: string;
}

export interface InferenceRequest {
  model_hash: string;
  task: string;
  input_text: string;
  parameters?: Record<string, any>;
}

export interface InferenceResponse {
  success: boolean;
  result?: {
    generated_text?: string;
    predictions?: Array<{
      label: string;
      score: number;
    }>;
    transcription?: {
      text: string;
      timestamps?: Array<{ start: number; end: number; text: string }>;
    };
  };
  error?: string;
  model_info?: {
    hash: string;
    task: string;
    cached: boolean;
  };
  processing_time?: number;
  request_id: string;
}

export interface PlaygroundInferenceService {
  testConnection(
    endpoint: string
  ): Promise<{ healthy: boolean; cached_models: number }>;
  generateText(
    endpoint: string,
    request: InferenceRequest
  ): Promise<InferenceResponse>;
  generateWithFile(
    endpoint: string,
    file: File,
    modelHash: string,
    task: string,
    parameters: Record<string, any>
  ): Promise<InferenceResponse>;
}

// Playground Inference Service Implementation
export const PlaygroundInferenceService: PlaygroundInferenceService = {
  async testConnection(
    endpoint: string
  ): Promise<{ healthy: boolean; cached_models: number }> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      // In a real implementation, this would make an actual HTTP request
      // const response = await fetch(`${endpoint}/health`)
      // const data = await response.json()

      // Mock response
      return {
        healthy: true,
        cached_models: Math.floor(Math.random() * 10) + 5,
      };
    } catch (error) {
      throw new Error("Connection failed");
    }
  },

  async generateText(
    endpoint: string,
    request: InferenceRequest
  ): Promise<InferenceResponse> {
    try {
      console.log("Generating text with request:", request);
      const response = await axios.post(`${endpoint}/infer`, request, {
        headers: { "Content-Type": "application/json" },
      });
      const result = response.data;
      return result;
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        request_id: `req_${Date.now()}`,
      };
    }
  },

  async generateWithFile(
    endpoint: string,
    file: File,
    modelHash: string,
    task: string,
    parameters: Record<string, any>
  ): Promise<InferenceResponse> {
    // Simulate file upload and processing delay
    await new Promise((resolve) =>
      setTimeout(resolve, 2000 + Math.random() * 3000)
    );

    try {
      // In a real implementation, this would make an actual HTTP request with FormData
      // const formData = new FormData()
      // formData.append('file', file)
      // formData.append('model_hash', modelHash)
      // formData.append('task', task)
      // formData.append('parameters', JSON.stringify(parameters))
      //
      // const response = await fetch(`${endpoint}/infer-with-files`, {
      //   method: 'POST',
      //   body: formData
      // })
      // const result = await response.json()

      const startTime = Date.now();
      let mockResult: any;

      if (task === "image-classification") {
        mockResult = {
          predictions: [
            { label: "Lion", score: 0.852 },
            { label: "Elephant", score: 0.123 },
            { label: "Giraffe", score: 0.025 },
          ],
        };
      } else if (task === "speech-recognition") {
        mockResult = {
          transcription: {
            text: "Sannu da zuwa. Yaya kake? Na ji daɗi sosai.",
            ...(parameters.return_timestamps && {
              timestamps: [
                { start: 0.0, end: 1.2, text: "Sannu da zuwa." },
                { start: 1.5, end: 2.8, text: "Yaya kake?" },
                { start: 3.0, end: 4.5, text: "Na ji daɗi sosai." },
              ],
            }),
          },
        };
      }

      const processingTime = (Date.now() - startTime) / 1000;

      return {
        success: true,
        result: mockResult,
        model_info: {
          hash: modelHash,
          task: task,
          cached: true,
        },
        processing_time: processingTime,
        request_id: `req_${Date.now()}`,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "File processing failed",
        request_id: `req_${Date.now()}`,
      };
    }
  },
};

// API Functions
export class DeHugAPI {
  // Track download
  static async trackDownload(
    itemName: string,
    source: "sdk" | "ui"
  ): Promise<void> {
    try {
      const formData = new FormData();
      formData.append("item_name", itemName);
      formData.append("source", source);

      await apiClient.post("/track/download", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.warn("Error tracking download:", error);
      // Graceful fallback - don't break the download flow
    }
  }

  // Get download stats
  static async getDownloadStats(): Promise<Record<string, DownloadStats>> {
    try {
      const response = await apiClient.get("/track/stats");
      return response.data;
    } catch (error) {
      console.warn("Error fetching download stats:", error);
      return {};
    }
  }

  static async getItemStats(itemName: string): Promise<DownloadStats | null> {
    try {
      const allStats = await this.getDownloadStats();
      return allStats[itemName] || null;
    } catch (error) {
      console.error("Failed to fetch item stats:", error);
      return null;
    }
  }

  // Download from Filecoin/IPFS
  static async downloadFromFilecoin(
    itemName: string,
    ipfsHash: string,
    source: "sdk" | "ui" = "ui"
  ): Promise<string> {
    try {
      // Track the download
      await this.trackDownload(itemName, source);

      // Return IPFS gateway URL using the provided ipfsHash
      return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    } catch (error) {
      console.warn("Error downloading from Filecoin:", error);
      throw error;
    }
  }

  // Get user uploads (mock data)
  static async getUserUploads(): Promise<UserUpload[]> {
    try {
      // Mock data for development
      return [
        {
          id: "1",
          name: "African Language Model v2.1",
          description:
            "Advanced multilingual model trained on 15 African languages including Swahili, Yoruba, Amharic, and Zulu.",
          type: "model",
          author: "Dr. Amara Okafor",
          uploadedAt: "2024-01-15T10:30:00Z",
          fileSize: "2.3 GB",
          license: "Apache 2.0",
          tags: ["nlp", "multilingual", "african-languages", "transformer"],
          downloads: { sdk: 1247, ui: 856, total: 2103 },
          likes: 342,
          views: 5678,
          forks: 89,
          stars: 234,
          comments: 67,
          nft: {
            tokenId: "1001",
            name: "African Language Model NFT",
            description:
              "Represents ownership and contribution to African NLP advancement",
            image: "/african-ai-nft.png",
            contractAddress: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
            currentValue: 0.847,
            mintedAt: "2024-01-15T10:30:00Z",
            lastSyncedAt: "2024-01-20T14:22:00Z",
            openseaUrl:
              "https://opensea.io/assets/ethereum/0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4/1001",
            attributes: [
              { trait_type: "Rarity", value: "Epic" },
              { trait_type: "Language Count", value: 15 },
              { trait_type: "Model Size", value: "2.3B" },
              { trait_type: "Training Data", value: "Curated" },
            ],
          },
        },
        {
          id: "2",
          name: "Swahili Speech Dataset",
          description:
            "Comprehensive speech dataset with 10,000 hours of native Swahili speakers from Kenya, Tanzania, and Uganda.",
          type: "dataset",
          author: "Prof. Kesi Mwangi",
          uploadedAt: "2024-01-10T08:15:00Z",
          fileSize: "45.7 GB",
          license: "CC BY-SA 4.0",
          tags: ["speech", "swahili", "audio", "east-africa"],
          downloads: { sdk: 892, ui: 1205, total: 2097 },
          likes: 278,
          views: 4321,
          forks: 156,
          stars: 189,
          comments: 43,
          nft: {
            tokenId: "1002",
            name: "Swahili Speech Collection NFT",
            description: "Preserving and promoting Swahili language through AI",
            image: "/swahili-dataset-nft.png",
            contractAddress: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
            currentValue: 0.623,
            mintedAt: "2024-01-10T08:15:00Z",
            lastSyncedAt: "2024-01-19T16:45:00Z",
            openseaUrl:
              "https://opensea.io/assets/ethereum/0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4/1002",
            attributes: [
              { trait_type: "Rarity", value: "Rare" },
              { trait_type: "Hours", value: 10000 },
              { trait_type: "Speakers", value: "Native" },
              { trait_type: "Quality", value: "Studio" },
            ],
          },
        },
        {
          id: "3",
          name: "Yoruba Text Classification Model",
          description:
            "Fine-tuned BERT model for Yoruba text classification tasks including sentiment analysis and topic modeling.",
          type: "model",
          author: "Dr. Folake Adebayo",
          uploadedAt: "2024-01-08T12:45:00Z",
          fileSize: "1.8 GB",
          license: "MIT",
          tags: ["bert", "yoruba", "classification", "sentiment"],
          downloads: { sdk: 567, ui: 423, total: 990 },
          likes: 156,
          views: 2890,
          forks: 34,
          stars: 98,
          comments: 28,
          nft: {
            tokenId: "1003",
            name: "Yoruba AI Model NFT",
            description: "Advancing Yoruba language processing with modern AI",
            image: "/yoruba-speech-nft.png",
            contractAddress: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
            currentValue: 0.412,
            mintedAt: "2024-01-08T12:45:00Z",
            lastSyncedAt: "2024-01-18T09:30:00Z",
            openseaUrl:
              "https://opensea.io/assets/ethereum/0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4/1003",
            attributes: [
              { trait_type: "Rarity", value: "Common" },
              { trait_type: "Base Model", value: "BERT" },
              { trait_type: "Task", value: "Classification" },
              { trait_type: "Accuracy", value: "94.2%" },
            ],
          },
        },
      ];
    } catch (error) {
      console.warn("Error fetching user uploads:", error);
      return [];
    }
  }

  // Get portfolio stats
  static async getPortfolioStats(): Promise<PortfolioStats> {
    try {
      const uploads = await this.getUserUploads();

      return {
        totalUploads: uploads.length,
        totalDownloads: uploads.reduce(
          (sum, upload) => sum + upload.downloads.total,
          0
        ),
        totalNFTValue: uploads.reduce(
          (sum, upload) => sum + upload.nft.currentValue,
          0
        ),
        totalEngagement: uploads.reduce(
          (sum, upload) =>
            sum +
            upload.likes +
            upload.views +
            upload.forks +
            upload.stars +
            upload.comments,
          0
        ),
      };
    } catch (error) {
      console.warn("Error calculating portfolio stats:", error);
      return {
        totalUploads: 0,
        totalDownloads: 0,
        totalNFTValue: 0,
        totalEngagement: 0,
      };
    }
  }

  // Sync NFT engagement to smart contract
  static async syncNFTEngagement(upload: UserUpload): Promise<SyncResult> {
    try {
      // Mock smart contract interaction
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate network delay

      // Calculate new NFT value based on engagement
      const engagementScore =
        upload.downloads.total * 10 +
        upload.likes * 5 +
        upload.views * 1 +
        upload.forks * 20 +
        upload.stars * 8 +
        upload.comments * 3;

      // Convert engagement to ETH value (mock calculation)
      const baseValue = 0.1;
      const engagementMultiplier = Math.log(engagementScore + 1) / 10;
      const newValue = baseValue + engagementMultiplier;

      // Mock transaction hash
      const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;

      // Simulate 90% success rate
      const success = Math.random() > 0.1;

      if (success) {
        return {
          success: true,
          newValue: Math.max(newValue, upload.nft.currentValue * 1.01), // Ensure some growth
          transactionHash: txHash,
        };
      } else {
        return {
          success: false,
          newValue: upload.nft.currentValue,
          transactionHash: "",
          error: "Smart contract execution failed",
        };
      }
    } catch (error) {
      return {
        success: false,
        newValue: upload.nft.currentValue,
        transactionHash: "",
        error: "Network error during sync",
      };
    }
  }

  // Get model details
  static async getModel(modelId: string): Promise<ModelDetails> {
    try {
      // In a real implementation, this would make an API call
      // For now, return mock data
      const model = mockModels[modelId];

      if (!model) {
        throw new Error(`Model with ID ${modelId} not found`);
      }

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return model;
    } catch (error) {
      console.error("Error fetching model:", error);
      throw error;
    }
  }
}
