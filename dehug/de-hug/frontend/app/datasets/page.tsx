"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Filter,
  Eye,
  Calendar,
  User,
  Shield,
  Database,
  Coins,
  TrendingUp,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import { DownloadStatsComponent } from "@/components/ui/download-stats"
import useGetLatestDatasets from "@/hooks/useGetLatestDatasets"
import { useActiveAccount } from "thirdweb/react"
import ReactMarkdown from "react-markdown";

const categories = ["All", "Natural Language Processing", "Computer Vision", "Audio", "Multimodal", "Tabular"]

export default function DatasetsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("trending")

  const account = useActiveAccount()
  const { datasets, isLoading, error, refetch } = useGetLatestDatasets(20, 100)

  // Show wallet connection prompt if not connected
  if (!account) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 text-white flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-slate-800/30 border border-slate-700 rounded-lg flex items-center justify-center mx-auto">
            <Database className="h-10 w-10 text-slate-400" />
          </div>
          <div>
            <h2 className="text-2xl font-light text-white mb-2">Connect Your Wallet</h2>
            <p className="text-slate-400 font-light">
              Please connect your wallet to view datasets on the decentralized hub.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const filteredDatasets = datasets.filter((dataset) => {
    const matchesSearch =
      dataset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dataset.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dataset.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "All" || dataset.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedDatasets = [...filteredDatasets].sort((a, b) => {
    switch (sortBy) {
      case "downloads":
        return b.downloads - a.downloads
      case "nft-value":
        return Number.parseFloat(b.nftValue.replace(" ETH", "")) - Number.parseFloat(a.nftValue.replace(" ETH", ""))
      case "trending":
      default:
        return (b.trending ? 1 : 0) - (a.trending ? 1 : 0) || b.downloads - a.downloads
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-16 text-center">
          <Badge
            variant="outline"
            className="mb-6 border-slate-600 text-slate-300 px-4 py-2 backdrop-blur-sm bg-slate-900/50"
          >
            <Database className="w-4 h-4 mr-2" />
            Decentralized Dataset Hub
          </Badge>
          <h1 className="text-5xl md:text-7xl font-light mb-6 leading-none">
            <span className="text-white">Training</span>
            <br />
            <span className="text-slate-400 font-thin">Datasets</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
            Access high-quality datasets for machine learning research and
            development. Each dataset is tokenized as an NFT, creating value for
            data contributors.
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 p-6 bg-red-900/20 border border-red-800 rounded-lg backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="flex-1">
                <h3 className="text-red-300 font-medium">
                  Error Loading Datasets
                </h3>
                <p className="text-red-400/80 text-sm mt-1">{error}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={refetch}
                className="bg-red-900/30 border-red-700 text-red-300 hover:bg-red-800/30"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="mb-12 space-y-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input
                placeholder="Search datasets, authors, or domains..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 bg-slate-900/30 border-slate-700 text-white placeholder:text-slate-400 focus:border-slate-500 backdrop-blur-sm h-14 text-lg"
                disabled={isLoading}
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full lg:w-[220px] bg-slate-900/30 border-slate-700 text-white backdrop-blur-sm h-14">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700 text-white">
                {categories.map((category) => (
                  <SelectItem
                    key={category}
                    value={category}
                    className="focus:bg-slate-800"
                  >
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={sortBy}
              onValueChange={setSortBy}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full lg:w-[220px] bg-slate-900/30 border-slate-700 text-white backdrop-blur-sm h-14">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700 text-white">
                <SelectItem value="trending" className="focus:bg-slate-800">
                  Trending
                </SelectItem>
                <SelectItem value="downloads" className="focus:bg-slate-800">
                  Most Downloaded
                </SelectItem>
                <SelectItem value="nft-value" className="focus:bg-slate-800">
                  NFT Value
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                disabled={isLoading}
                className={`text-sm transition-all duration-300 font-light ${
                  selectedCategory === category
                    ? "bg-white text-black hover:bg-slate-100"
                    : "bg-slate-900/30 border-slate-700 text-slate-300 hover:bg-slate-800/50 hover:border-slate-600"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-slate-400 mx-auto" />
              <div>
                <h3 className="text-xl font-light text-white mb-2">
                  Loading Datasets
                </h3>
                <p className="text-slate-400 font-light">
                  Fetching datasets from the blockchain...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        {!isLoading && (
          <div className="mb-8">
            <p className="text-slate-400 font-light">
              Showing{" "}
              <span className="text-white font-medium">
                {sortedDatasets.length}
              </span>{" "}
              of{" "}
              <span className="text-white font-medium">{datasets.length}</span>{" "}
              datasets
            </p>
          </div>
        )}

        {/* Datasets Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sortedDatasets.map((dataset, index) => (
              <Card
                key={dataset.id}
                className="group bg-slate-900/20 backdrop-blur-sm border-slate-800 hover:border-slate-600 transition-all duration-500 hover:bg-slate-800/20 cursor-pointer"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 100}ms both`,
                }}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="border-slate-700 text-slate-300 bg-slate-800/30 text-xs"
                      >
                        {dataset.category}
                      </Badge>
                      {dataset.verified && (
                        <Badge className="bg-slate-700 text-slate-200 border-slate-600 text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      {dataset.trending && (
                        <Badge className="bg-amber-900/30 text-amber-300 border-amber-700 text-xs">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-xl leading-tight text-white group-hover:text-slate-200 transition-colors font-light">
                    {dataset.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-slate-400 line-clamp-3 font-light">
                    <ReactMarkdown>{dataset.description}</ReactMarkdown>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-6">
                    {/* NFT Value & Samples */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center justify-between p-3 bg-slate-800/30 border border-slate-700">
                        <div className="flex items-center">
                          <Coins className="h-4 w-4 text-amber-400 mr-2" />
                          <span className="text-xs text-slate-300 font-light">
                            NFT Value
                          </span>
                        </div>
                        <span className="text-amber-400 font-medium text-sm">
                          {dataset.nftValue}
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {dataset.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-xs bg-slate-800/30 border-slate-700 text-slate-300"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {dataset.tags.length > 3 && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-slate-800/30 border-slate-700 text-slate-400"
                        >
                          +{dataset.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 font-light">
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {dataset.author}
                      </div>
                      <div className="flex items-center">
                        <DownloadStatsComponent
                          itemName={dataset.title}
                          className="text-xs"
                        />
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(dataset.uploadDate).toLocaleDateString()}
                      </div>
                      <div>
                        {dataset.size} • {dataset.format}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                      <Link href={`/datasets/${dataset.id}`} className="flex-1">
                        <Button
                          size="sm"
                          className="w-full bg-white text-black hover:bg-slate-100 font-medium"
                        >
                          <Eye className="h-3 w-3 mr-2" />
                          Explore Dataset
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty States */}
        {!isLoading && datasets.length === 0 && !error && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-800/30 border border-slate-700 rounded-lg flex items-center justify-center mx-auto mb-8">
              <Database className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-light text-white mb-4">
              No datasets uploaded yet
            </h3>
            <p className="text-slate-400 mb-8 font-light">
              Be the first to contribute a dataset to the decentralized hub.
            </p>
            <Link href="/upload">
              <Button className="bg-white text-black hover:bg-slate-100 font-medium">
                Upload Dataset
              </Button>
            </Link>
          </div>
        )}

        {!isLoading && sortedDatasets.length === 0 && datasets.length > 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-800/30 border border-slate-700 rounded-lg flex items-center justify-center mx-auto mb-8">
              <Search className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-light text-white mb-4">
              No datasets found
            </h3>
            <p className="text-slate-400 mb-8 font-light">
              Try adjusting your search criteria or browse all categories.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
              className="bg-slate-800/30 border-slate-700 text-slate-300 hover:bg-slate-700/50 hover:border-slate-600"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Load More */}
        {!isLoading && sortedDatasets.length > 0 && (
          <div className="text-center mt-16">
            <Button
              variant="outline"
              className="bg-slate-800/30 border-slate-700 text-slate-300 hover:bg-slate-700/50 hover:border-slate-600 px-12 py-4 text-lg font-light"
            >
              Load More Datasets
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
