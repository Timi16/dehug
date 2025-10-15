"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Download,
  Eye,
  Share2,
  Star,
  Calendar,
  User,
  FileText,
  BarChart3,
  Shield,
  Unlock,
  AlertTriangle,
  Coins,
  Trophy,
  Heart,
  GitBranch,
  Database,
  Loader2,
  AlertCircle,
  Users,
  Copy,
} from "lucide-react";
import Link from "next/link";
import { DownloadStatsComponent } from "@/components/ui/download-stats";
import { DownloadButton } from "@/components/ui/download-button";
import { DeHugAPI } from "@/lib/api";
import useGetContentMetadata from "@/hooks/DeHug/useGetContentMetadata";
import { useAccount } from "@/lib/thirdweb-hooks";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";

export default function DatasetDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isStarred, setIsStarred] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const { isConnected } = useAccount();
  const tokenId = Number.parseInt(params.id);

  // Get content data and metadata
  const {
    metadata,
    isLoading: metadataLoading,
    error: metadataError,
    refetch: refetchMetadata,
  } = useGetContentMetadata(tokenId);

  const isLoading = metadataLoading;
  const error = metadataError;

  const handleDownload = async () => {
    if (!metadata) return;
    try {
      await DeHugAPI.downloadFromFilecoin(
        metadata.name || "Default Dataset Name",
        metadata.properties?.ipfsHash,
        "ui"
      );
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const refetch = () => {
    refetchMetadata();
  };

  // Wallet connection check
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 text-white flex items-center justify-center">
        <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800 p-8 text-center max-w-md">
          <CardContent>
            <AlertCircle className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-light text-white mb-2">
              Wallet Required
            </h3>
            <p className="text-slate-400 font-light mb-6">
              Please connect your wallet to view dataset details.
            </p>
            <Button className="bg-white text-black hover:bg-slate-100 font-medium">
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 text-white flex items-center justify-center">
        <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800 p-8 text-center">
          <CardContent>
            <Loader2 className="h-16 w-16 text-slate-400 mx-auto mb-4 animate-spin" />
            <h3 className="text-xl font-light text-white mb-2">
              Loading Dataset
            </h3>
            <p className="text-slate-400 font-light">
              Fetching dataset details from blockchain...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state or not a dataset
  if (error || !metadata) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 text-white flex items-center justify-center">
        <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800 p-8 text-center max-w-md">
          <CardContent>
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-light text-white mb-2">
              Dataset Not Found
            </h3>
            <p className="text-slate-400 font-light mb-6">
              {error || "The requested dataset could not be found or loaded."}
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={refetch}
                className="bg-slate-800/30 border-slate-700 text-slate-300 hover:bg-slate-700/50"
              >
                Try Again
              </Button>
              <Link href="/datasets">
                <Button className="bg-white text-black hover:bg-slate-100 font-medium">
                  Browse Datasets
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Helper to get attribute value
  const getAttribute = (trait: string) =>
    metadata.attributes?.find((a: any) => a.trait_type === trait)?.value;

  const qualityTierMap: { [key: string]: number } = {
    BASIC: 0,
    PREMIUM: 1,
    VERIFIED: 2,
  };

  const qualityTierValue = getAttribute("Quality Tier") || "BASIC";
  const qualityTier = qualityTierMap[qualityTierValue];

  // Extract data from content and metadata
  const properties = metadata.properties || {};
  const title = metadata.name || `Dataset #${params.id}`;
  const description = metadata.description || "No description available";
  const category =
    properties.category ||
    getAttribute("Category") ||
    "Natural Language Processing";
  const author = `${
    properties.uploader?.slice(0, 6) || getAttribute("Uploader")?.slice(0, 6)
  }...${properties.uploader?.slice(-4) || getAttribute("Uploader")?.slice(-4)}`;
  const uploadDate = properties.uploadTimestamp
    ? new Date(properties.uploadTimestamp)
    : new Date(getAttribute("Upload Date") || Date.now());
  const downloads = properties.downloadCount || getAttribute("Downloads") || 0;
  const likes = Math.floor((getAttribute("Points Balance") || 0) / 10);
  const isVerified = qualityTier === 2;
  const size = properties.size || "Unknown";
  const format = properties.format || "JSON Lines";
  const license = properties.license || getAttribute("License") || "CC BY 4.0";
  const tags = properties.tags ||
    getAttribute("Tags")?.split(", ") || [
      "blockchain",
      "decentralized",
      "dataset",
    ];
  const rating = qualityTier === 2 ? 4.6 : qualityTier === 1 ? 4.2 : 3.8;
  const nftValue =
    qualityTier === 2 ? "5.2 ETH" : qualityTier === 1 ? "2.1 ETH" : "0.8 ETH";
  const samples =
    properties.samples ||
    (qualityTier === 2 ? "2.1B" : qualityTier === 1 ? "500M" : "100M");
  const languages = properties.languages || ["English", "Spanish", "French"];
  const ipfsHash = properties.ipfsHash;

  // Mock sample data for preview
  const sampleData = [
    {
      id: 1,
      text: "Sample text from the dataset...",
      category: category,
      length: 1247,
    },
    {
      id: 2,
      text: "Another sample entry from the dataset...",
      category: category,
      length: 2156,
    },
    {
      id: 3,
      text: "Third sample showing dataset structure...",
      category: category,
      length: 1834,
    },
  ];

  // Mock files data
  const files = [
    {
      name: "train.jsonl",
      size: size,
      type: "Training Data",
      samples: samples,
    },
    {
      name: "validation.jsonl",
      size: "10% of total",
      type: "Validation Data",
      samples: "10%",
    },
    { name: "test.jsonl", size: "2.0 GB", type: "Test Data", samples: "150M" },
    { name: "metadata.json", size: "45 KB", type: "Metadata", samples: "1" },
    { name: "README.md", size: "12 KB", type: "Documentation", samples: "1" },
  ];

  // Usage code examples
  const pythonCode = `from datasets import load_dataset

# Load dataset from Hugging Face Hub
dataset = load_dataset("${title.toLowerCase().replace(/\s+/g, "-")}")

# Access training split
train_data = dataset["train"]

# Iterate through samples
for sample in train_data:
  print(sample)
  print("---")`;

  const dehugCode = `from dehug import DeHugRepository

# Load dataset from decentralized storage
dataset = DeHugRepository.load_dataset("${ipfsHash}")

# Access training data
train_data = dataset["train"]

# Process samples
for sample in train_data:
  print(sample)`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 text-white">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6 gap-6">
            <div className="flex-1 w-full">
              <div className="flex items-center mb-4">
                <Badge
                  variant="outline"
                  className="mr-3 border-slate-700 text-slate-300 bg-slate-800/30"
                >
                  {category}
                </Badge>
                {isVerified && (
                  <Badge className="mr-3 bg-slate-700 text-slate-200 border-slate-600">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
                <Badge
                  variant="outline"
                  className="border-slate-700 text-slate-300 bg-slate-800/30"
                >
                  <Unlock className="h-3 w-3 mr-1" />
                  Public
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-light text-white mb-4 leading-tight w-full">
                {title}
              </h1>
              <div className="w-full mb-6">
                <p className="text-xl text-slate-300 line-clamp-5 font-light leading-relaxed w-full max-w-none">
                  <ReactMarkdown>{description}</ReactMarkdown>
                </p>
              </div>

              <div className="flex flex-wrap items-center text-sm text-slate-400 gap-x-6 gap-y-2 font-light">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  {author}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Updated {uploadDate.toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  {downloads?.toLocaleString()} downloads
                </div>
                <div className="flex items-center">
                  <Heart className="h-4 w-4 mr-2" />
                  {likes.toLocaleString()} likes
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 lg:flex-nowrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsStarred(!isStarred)}
                className="bg-slate-800/30 border-slate-700 text-slate-300 hover:bg-slate-700/50"
              >
                <Star
                  className={`h-4 w-4 mr-2 ${
                    isStarred ? "fill-yellow-400 text-yellow-400" : ""
                  }`}
                />
                {isStarred ? "Starred" : "Star"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLiked(!isLiked)}
                className="bg-slate-800/30 border-slate-700 text-slate-300 hover:bg-slate-700/50"
              >
                <Heart
                  className={`h-4 w-4 mr-2 ${
                    isLiked ? "fill-red-400 text-red-400" : ""
                  }`}
                />
                {isLiked ? "Liked" : "Like"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-slate-800/30 border-slate-700 text-slate-300 hover:bg-slate-700/50"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <DownloadButton
                itemName={title}
                ipfsHash={ipfsHash}
                className="bg-white text-black hover:bg-slate-100 font-medium"
                onDownloadComplete={() => {
                  toast.info("Dataset download completed successfully");
                }}
              />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400 font-light">Size</p>
                    <p className="text-lg font-light text-white">{size}</p>
                  </div>
                  <Database className="h-6 w-6 text-slate-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400 font-light">Samples</p>
                    <p className="text-lg font-light text-white">{samples}</p>
                  </div>
                  <FileText className="h-6 w-6 text-slate-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400 font-light">License</p>
                    <p className="text-lg font-light text-white">{license}</p>
                  </div>
                  <Shield className="h-6 w-6 text-slate-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400 font-light">Format</p>
                    <p className="text-lg font-light text-white">{format}</p>
                  </div>
                  <FileText className="h-6 w-6 text-slate-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 backdrop-blur-sm border-amber-800/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-amber-200/80 font-light">
                      NFT Value
                    </p>
                    <p className="text-lg font-light text-amber-400">
                      {nftValue}
                    </p>
                  </div>
                  <Coins className="h-6 w-6 text-amber-400" />
                </div>
              </CardContent>
            </Card>
          </div>
          <DownloadStatsComponent
            itemName={title}
            className="lg:col-span-2 mt-4"
            showDetailed={true}
          />
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-8"
        >
          <TabsList className="grid w-full grid-cols-6 bg-slate-900/30 border border-slate-800">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-white data-[state=active]:text-black font-light"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              className="data-[state=active]:bg-white data-[state=active]:text-black font-light"
            >
              Data Preview
            </TabsTrigger>
            <TabsTrigger
              value="usage"
              className="data-[state=active]:bg-white data-[state=active]:text-black font-light"
            >
              Usage
            </TabsTrigger>
            <TabsTrigger
              value="files"
              className="data-[state=active]:bg-white data-[state=active]:text-black font-light"
            >
              Files
            </TabsTrigger>
            <TabsTrigger
              value="nft"
              className="data-[state=active]:bg-white data-[state=active]:text-black font-light"
            >
              NFT Details
            </TabsTrigger>
            <TabsTrigger
              value="community"
              className="data-[state=active]:bg-white data-[state=active]:text-black font-light"
            >
              Community
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Description */}
                <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white font-light text-xl">
                      About This Dataset
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 whitespace-pre-wrap mb-6 font-light leading-relaxed">
                      {description}
                    </p>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-light text-white mb-3">
                          Key Features:
                        </h4>
                        <ul className="text-sm text-slate-300 space-y-2 font-light">
                          <li>• Stored on decentralized infrastructure</li>
                          <li>• Blockchain-verified authenticity</li>
                          <li>• Community curated and validated</li>
                          <li>• High-quality data with proper licensing</li>
                          <li>• Ready for machine learning applications</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-light text-white mb-3">
                          Use Cases:
                        </h4>
                        <ul className="text-sm text-slate-300 space-y-2 font-light">
                          <li>• Machine learning model training</li>
                          <li>• Research and academic studies</li>
                          <li>• Data analysis and insights</li>
                          <li>• Benchmarking and evaluation</li>
                          <li>• Educational purposes</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Statistics */}
                <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white font-light text-xl">
                      Dataset Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-light text-white mb-1">
                          {samples}
                        </div>
                        <div className="text-slate-400 font-light text-sm">
                          Total Samples
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-light text-white mb-1">
                          1,247
                        </div>
                        <div className="text-slate-400 font-light text-sm">
                          Avg Length
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-light text-white mb-1">
                          {languages.length}
                        </div>
                        <div className="text-slate-400 font-light text-sm">
                          Languages
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-light text-white mb-1">
                          Multiple
                        </div>
                        <div className="text-slate-400 font-light text-sm">
                          Domains
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tags */}
                <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white font-light text-xl">
                      Tags
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag: string) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="border-slate-700 text-slate-300 bg-slate-800/30"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-8">
                {/* Author Info */}
                <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white font-light text-xl">
                      Dataset Author
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="font-light text-white text-lg">
                          {author}
                        </p>
                        <p className="text-sm text-slate-400 font-light">
                          Data Contributor
                        </p>
                      </div>
                      <div className="text-xs text-slate-500 font-light">
                        <p>
                          Wallet:{" "}
                          {properties.uploader?.slice(0, 6) ||
                            getAttribute("Uploader")?.slice(0, 6)}
                          ...
                          {properties.uploader?.slice(-4) ||
                            getAttribute("Uploader")?.slice(-4)}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-slate-800/30 border-slate-700 text-slate-300 hover:bg-slate-700/50 font-light"
                      >
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Languages */}
                <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white font-light text-xl">
                      Languages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {languages.map((lang: string) => (
                        <Badge
                          key={lang}
                          variant="outline"
                          className="border-slate-700 text-slate-300 bg-slate-800/30"
                        >
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Technical Details */}
                <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white font-light text-xl">
                      Technical Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm font-light">
                      <span className="text-slate-400">Token ID:</span>
                      <code className="text-xs text-slate-300">
                        {params.id}
                      </code>
                    </div>
                    <div className="flex justify-between items-center text-sm font-light">
                      <span className="text-slate-400">IPFS Hash:</span>
                      <div className="flex items-center gap-2">
                        <code className="text-xs text-slate-300">
                          {ipfsHash?.slice(0, 8)}...
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 hover:bg-slate-700/50"
                          onClick={() => {
                            if (ipfsHash) {
                              navigator.clipboard.writeText(ipfsHash);
                              toast.info("IPFS hash copied to clipboard");
                            }
                          }}
                        >
                          <Copy className="h-3 w-3 text-slate-400 hover:text-slate-300" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm font-light">
                      <span className="text-slate-400">Upload Date:</span>
                      <span className="text-slate-300">
                        {uploadDate.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-light">
                      <span className="text-slate-400">File Count:</span>
                      <span className="text-slate-300">
                        {files.length} files
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-light">
                      <span className="text-slate-400">Total Size:</span>
                      <span className="text-slate-300">{size}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white font-light text-xl">
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-slate-800/30 border-slate-700 text-slate-300 hover:bg-slate-700/50 font-light"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View on IPFS
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-slate-800/30 border-slate-700 text-slate-300 hover:bg-slate-700/50 font-light"
                    >
                      <GitBranch className="h-4 w-4 mr-2" />
                      Fork Dataset
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-slate-800/30 border-slate-700 text-slate-300 hover:bg-slate-700/50 font-light"
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Report Issue
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Data Preview Tab */}
          <TabsContent value="preview" className="space-y-8">
            <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
              <CardHeader>
                <CardTitle className="text-white font-light text-xl">
                  Sample Data
                </CardTitle>
                <CardDescription className="text-slate-400 font-light">
                  Preview of dataset samples. Download the full dataset to
                  access all records.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-800">
                        <TableHead className="text-slate-300 font-light">
                          ID
                        </TableHead>
                        <TableHead className="text-slate-300 font-light">
                          Text Preview
                        </TableHead>
                        <TableHead className="text-slate-300 font-light">
                          Category
                        </TableHead>
                        <TableHead className="text-slate-300 font-light">
                          Length
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sampleData.map((row) => (
                        <TableRow key={row.id} className="border-slate-800">
                          <TableCell className="text-slate-300 font-light">
                            {row.id}
                          </TableCell>
                          <TableCell className="text-slate-300 font-light max-w-md">
                            <div className="truncate">{row.text}</div>
                          </TableCell>
                          <TableCell className="text-slate-300 font-light">
                            {row.category}
                          </TableCell>
                          <TableCell className="text-slate-300 font-light">
                            {row.length.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-6 text-center">
                  <p className="text-sm text-slate-400 mb-4 font-light">
                    Showing 3 of {samples} samples. Download the full dataset to
                    access all data.
                  </p>
                  <DownloadButton
                    itemName={title}
                    ipfsHash={ipfsHash}
                    size="sm"
                    className="bg-white text-black hover:bg-slate-100 font-medium"
                    onDownloadComplete={() => {
                      toast.info("Dataset downloaded successfully");
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Usage Tab */}
          <TabsContent value="usage" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white font-light text-xl">
                    Datasets Library
                  </CardTitle>
                  <CardDescription className="text-slate-400 font-light">
                    Use with the Hugging Face datasets library
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-950/50 border border-slate-800 p-4">
                    <div className="flex items-center mb-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-slate-400 text-sm ml-4 font-light">
                        datasets_usage.py
                      </span>
                    </div>
                    <pre className="text-slate-300 text-sm leading-relaxed font-mono overflow-x-auto">
                      <code>{pythonCode}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white font-light text-xl">
                    DeHug SDK
                  </CardTitle>
                  <CardDescription className="text-slate-400 font-light">
                    Use with our decentralized SDK for direct IPFS access
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-950/50 border border-slate-800 p-4">
                    <div className="flex items-center mb-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-slate-400 text-sm ml-4 font-light">
                        dehug_usage.py
                      </span>
                    </div>
                    <pre className="text-slate-300 text-sm leading-relaxed font-mono overflow-x-auto">
                      <code>{dehugCode}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
              <CardHeader>
                <CardTitle className="text-white font-light text-xl">
                  Installation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-950/50 border border-slate-800 p-4">
                  <pre className="text-slate-300 text-sm font-mono">
                    <code>{`# Install required packages
pip install datasets

# Or use our decentralized SDK
pip install dehug`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Files Tab */}
          <TabsContent value="files" className="space-y-8">
            <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
              <CardHeader>
                <CardTitle className="text-white font-light text-xl">
                  Dataset Files
                </CardTitle>
                <CardDescription className="text-slate-400 font-light">
                  Individual files included in this dataset package. Download
                  the complete zip file using the main download button.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-slate-800/20 border border-slate-700"
                    >
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-slate-400 mr-4" />
                        <div>
                          <p className="font-light text-white">{file.name}</p>
                          <p className="text-sm text-slate-400 font-light">
                            {file.size} • {file.type} • {file.samples} samples
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-slate-800/30 border-slate-700 text-slate-300 hover:bg-slate-700/50 font-light"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-slate-800/20 border border-slate-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-light text-white mb-1">
                        Complete Dataset Package
                      </p>
                      <p className="text-sm text-slate-400 font-light">
                        Download all files as a single zip archive
                      </p>
                    </div>
                    <DownloadButton
                      itemName={title}
                      ipfsHash={ipfsHash}
                      className="bg-white text-black hover:bg-slate-100 font-medium"
                      onDownloadComplete={() => {
                        toast.info("Dataset package downloaded successfully");
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* NFT Details Tab */}
          <TabsContent value="nft" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 backdrop-blur-sm border-amber-800/30">
                <CardHeader>
                  <CardTitle className="flex items-center text-white font-light text-xl">
                    <Trophy className="h-6 w-6 mr-3 text-amber-400" />
                    NFT Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-amber-200/80 font-light text-sm">
                        Token ID:
                      </span>
                      <p className="text-white font-mono">#{params.id}</p>
                    </div>
                    <div>
                      <span className="text-amber-200/80 font-light text-sm">
                        Current Value:
                      </span>
                      <p className="text-amber-400 font-medium text-lg">
                        {nftValue}
                      </p>
                    </div>
                    <div>
                      <span className="text-amber-200/80 font-light text-sm">
                        Initial Value:
                      </span>
                      <p className="text-amber-200">0.2 ETH</p>
                    </div>
                    <div>
                      <span className="text-amber-200/80 font-light text-sm">
                        Growth:
                      </span>
                      <p className="text-green-400 font-medium">
                        +
                        {Math.round(
                          ((Number.parseFloat(nftValue) - 0.2) / 0.2) * 100
                        )}
                        %
                      </p>
                    </div>
                  </div>
                  <div>
                    <span className="text-amber-200/80 font-light text-sm">
                      Contract Address:
                    </span>
                    <p className="text-white font-mono text-xs break-all">
                      {process.env.DEHUG_ADDRESS}
                    </p>
                  </div>
                  <div>
                    <span className="text-amber-200/80 font-light text-sm">
                      Owner:
                    </span>
                    <p className="text-white font-mono text-xs">
                      {properties.uploader?.slice(0, 6) ||
                        getAttribute("Uploader")?.slice(0, 6)}
                      ...
                      {properties.uploader?.slice(-4) ||
                        getAttribute("Uploader")?.slice(-4)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white font-light text-xl">
                    Value History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <BarChart3 className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-light text-white mb-2">
                      Value Chart Coming Soon
                    </h3>
                    <p className="text-slate-400 font-light">
                      Historical value tracking will be available as the NFT
                      gains more activity.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
              <CardHeader>
                <CardTitle className="text-white font-light text-xl">
                  How NFT Value Increases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-slate-800/50 border border-slate-700 flex items-center justify-center mx-auto mb-3">
                      <Download className="h-6 w-6 text-slate-400" />
                    </div>
                    <h4 className="font-light text-white mb-2">Downloads</h4>
                    <p className="text-sm text-slate-400 font-light">
                      Each download increases the NFT value based on usage
                      metrics
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-slate-800/50 border border-slate-700 flex items-center justify-center mx-auto mb-3">
                      <Heart className="h-6 w-6 text-slate-400" />
                    </div>
                    <h4 className="font-light text-white mb-2">
                      Community Engagement
                    </h4>
                    <p className="text-sm text-slate-400 font-light">
                      Likes, stars, and community interaction boost NFT value
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-slate-800/50 border border-slate-700 flex items-center justify-center mx-auto mb-3">
                      <BarChart3 className="h-6 w-6 text-slate-400" />
                    </div>
                    <h4 className="font-light text-white mb-2">Quality</h4>
                    <p className="text-sm text-slate-400 font-light">
                      High-quality datasets with good ratings increase in value
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Community Tab */}
          <TabsContent value="community" className="space-y-8">
            <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
              <CardHeader>
                <CardTitle className="text-white font-light text-xl">
                  Community Feedback
                </CardTitle>
                <CardDescription className="text-slate-400 font-light">
                  Reviews and discussions from the community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-light text-white mb-2">
                    Community Features Coming Soon
                  </h3>
                  <p className="text-slate-400 font-light">
                    Reviews, discussions, and community features will be
                    available in the next update.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
