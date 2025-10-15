"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Eye, Calendar, User, Shield, Brain, Zap, Star, Coins, TrendingUp, Loader2 } from "lucide-react"
import Link from "next/link"
import { DownloadStatsComponent } from "@/components/ui/download-stats"
import { useActiveAccount } from "thirdweb/react"
import useGetLatestModels from "@/hooks/useGetLatestModels"
import ReactMarkdown from "react-markdown";

const categories = [
  "All",
  "Natural Language Processing",
  "Computer Vision",
  "Audio",
  "Multimodal",
  "Reinforcement Learning",
]

const tasks = [
  "All",
  "Text Generation",
  "Image Classification",
  "Object Detection",
  "Speech Recognition",
  "Text Classification",
]

export default function ModelsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedTask, setSelectedTask] = useState("All")
  const [sortBy, setSortBy] = useState("trending")

  const account = useActiveAccount()
  const { models, isLoading, error, refetch } = useGetLatestModels(20, 100)

  if (!account) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 text-white">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Brain className="w-16 h-16 mx-auto mb-4 text-slate-400" />
            <h2 className="text-2xl font-light text-white mb-4">Connect Your Wallet</h2>
            <p className="text-slate-400 mb-6">Please connect your wallet to access the decentralized model hub.</p>
            <Button className="bg-white text-black hover:bg-slate-100 font-medium">Connect Wallet</Button>
          </div>
        </div>
      </div>
    )
  }

  const filteredModels = models.filter((model) => {
    const matchesSearch =
      model.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "All" || model.category === selectedCategory
    const matchesTask = selectedTask === "All" || model.task === selectedTask
    return matchesSearch && matchesCategory && matchesTask
  })

  const sortedModels = [...filteredModels].sort((a, b) => {
    switch (sortBy) {
      case "downloads":
        return b.downloads - a.downloads
      case "likes":
        return b.likes - a.likes
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
            <Brain className="w-4 h-4 mr-2" />
            Decentralized Model Hub
          </Badge>
          <h1 className="text-5xl md:text-7xl font-light mb-6 leading-none">
            <span className="text-white">Discover</span>
            <br />
            <span className="text-slate-400 font-thin">AI Models</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
            Browse machine learning models hosted on decentralized
            infrastructure. Each model is backed by an NFT that appreciates with
            usage.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-12 space-y-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input
                placeholder="Search models, authors, or tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 bg-slate-900/30 border-slate-700 text-white placeholder:text-slate-400 focus:border-slate-500 backdrop-blur-sm h-14 text-lg"
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
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
            <Select value={sortBy} onValueChange={setSortBy}>
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
                <SelectItem value="likes" className="focus:bg-slate-800">
                  Most Liked
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

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-red-900/20 border border-red-700 flex items-center justify-center mx-auto mb-8">
              <Brain className="h-10 w-10 text-red-400" />
            </div>
            <h3 className="text-2xl font-light text-white mb-4">
              Error Loading Models
            </h3>
            <p className="text-red-400 mb-8 font-light">{error}</p>
            <Button
              onClick={refetch}
              variant="outline"
              className="bg-red-900/20 border-red-700 text-red-300 hover:bg-red-800/30 hover:border-red-600"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-slate-400" />
              <p className="text-slate-400 font-light">
                Loading models from blockchain...
              </p>
            </div>
          </div>
        )}

        {/* Results Count */}
        {!isLoading && !error && (
          <div className="mb-8">
            <p className="text-slate-400 font-light">
              Showing{" "}
              <span className="text-white font-medium">
                {sortedModels.length}
              </span>{" "}
              of <span className="text-white font-medium">{models.length}</span>{" "}
              models
            </p>
          </div>
        )}

        {/* Models Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedModels.map((model, index) => (
              <Card
                key={model.id}
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
                        {model.task}
                      </Badge>
                      {model.verified && (
                        <Badge className="bg-green-900/30 text-green-300 border-green-700 text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      {model.trending && (
                        <Badge className="bg-amber-900/30 text-amber-300 border-amber-700 text-xs">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center text-xs text-slate-400">
                      <Star className="h-3 w-3 mr-1" />
                      {model.likes.toLocaleString()}
                    </div>
                  </div>
                  <CardTitle className="text-xl leading-tight text-white group-hover:text-slate-200 transition-colors font-light">
                    {model.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-slate-400 line-clamp-3 font-light">
                    <ReactMarkdown>{model.description}</ReactMarkdown>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-6">
                    {/* NFT Value */}
                    <div className="flex items-center justify-between p-3 bg-slate-800/30 border border-slate-700 rounded-lg">
                      <div className="flex items-center">
                        <Coins className="h-4 w-4 text-amber-400 mr-2" />
                        <span className="text-sm text-slate-300 font-light">
                          NFT Value
                        </span>
                      </div>
                      <span className="text-amber-400 font-medium">
                        {model.nftValue}
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {model.tags.slice(0, 3).map((tag, tagIndex) => (
                        <Badge
                          key={`${model.id}-tag-${tagIndex}`}
                          variant="outline"
                          className="text-xs bg-slate-800/30 border-slate-700 text-slate-300"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {model.tags.length > 3 && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-slate-800/30 border-slate-700 text-slate-300"
                        >
                          +{model.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 font-light">
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {model.author}
                      </div>
                      <div className="flex items-center">
                        <DownloadStatsComponent
                          itemName={model.title}
                          className="text-xs"
                        />
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(model.uploadDate).toLocaleDateString()}
                      </div>
                      <div>
                        {model.size} • {model.format}
                      </div>
                    </div>

                    {/* Download Count */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Downloads</span>
                      <span className="text-white font-medium">
                        {model.downloads.toLocaleString()}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                      <Link href={`/models/${model.id}`} className="flex-1">
                        <Button
                          size="sm"
                          className="w-full bg-white text-black hover:bg-slate-100 font-medium"
                        >
                          <Eye className="h-3 w-3 mr-2" />
                          View Model
                        </Button>
                      </Link>
                      <Link href={`/models/${model.id}/playground`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-slate-800/30 border-slate-700 text-slate-300 hover:bg-slate-700/50 hover:border-slate-600"
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          Try
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State - No Models */}
        {!isLoading && !error && models.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-800/30 border border-slate-700 rounded-lg flex items-center justify-center mx-auto mb-8">
              <Brain className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-light text-white mb-4">
              No Models Found
            </h3>
            <p className="text-slate-400 mb-8 font-light">
              Be the first to upload a model to the decentralized hub.
            </p>
            <Link href="/upload">
              <Button className="bg-white text-black hover:bg-slate-100 font-medium">
                Upload First Model
              </Button>
            </Link>
          </div>
        )}

        {/* No Search Results */}
        {!isLoading &&
          !error &&
          sortedModels.length === 0 &&
          models.length > 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-slate-800/30 border border-slate-700 rounded-lg flex items-center justify-center mx-auto mb-8">
                <Search className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-2xl font-light text-white mb-4">
                No Models Match Your Search
              </h3>
              <p className="text-slate-400 mb-8 font-light">
                Try adjusting your search criteria or browse all categories.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                  setSelectedTask("All");
                }}
                className="bg-slate-800/30 border-slate-700 text-slate-300 hover:bg-slate-700/50 hover:border-slate-600"
              >
                Clear Filters
              </Button>
            </div>
          )}

        {/* Load More */}
        {!isLoading &&
          !error &&
          sortedModels.length > 0 &&
          models.length >= 20 && (
            <div className="text-center mt-16">
              <Button
                onClick={() => refetch()}
                variant="outline"
                className="bg-slate-800/30 border-slate-700 text-slate-300 hover:bg-slate-700/50 hover:border-slate-600 px-12 py-4 text-lg font-light"
              >
                Load More Models
              </Button>
            </div>
          )}
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
