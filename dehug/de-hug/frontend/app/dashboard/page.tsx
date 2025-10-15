"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Upload, Download, Coins, TrendingUp, RefreshCw, BarChart3, Crown, Trophy, Database, Brain, Activity, Users, Eye, Heart, GitFork, Star, MessageCircle } from 'lucide-react'
import { DeHugAPI, UserUpload, PortfolioStats } from "@/lib/api"
import { UploadCard } from "@/components/ui/upload-card"
import { NFTCard } from "@/components/ui/nft-card"
import { toast } from 'react-toastify'

export default function AdminPage() {
  const [uploads, setUploads] = useState<UserUpload[]>([])
  const [stats, setStats] = useState<PortfolioStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUpload, setSelectedUpload] = useState<UserUpload | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [uploadsData, statsData] = await Promise.all([
        DeHugAPI.getUserUploads(),
        DeHugAPI.getPortfolioStats()
      ])
      setUploads(uploadsData)
      setStats(statsData)
    } catch (error) {
      toast.error("Failed to load dashboard data", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    toast.info("Refreshing dashboard data...", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
    loadData()
  }

  const handleUploadUpdate = (updatedUpload: UserUpload) => {
    setUploads(prev => prev.map(upload => 
      upload.id === updatedUpload.id ? updatedUpload : upload
    ))
    // Recalculate stats
    loadData()
  }

  const topUploads = uploads
    .sort((a, b) => b.downloads.total - a.downloads.total)
    .slice(0, 3)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
        <div className="relative container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-3">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-400" />
              <span className="text-lg text-gray-300">Loading your dashboard...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 text-white">
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div className="relative container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Creator Dashboard
            </h1>
            <p className="text-gray-400">
              Manage your AI models, datasets, and NFT portfolio
            </p>
          </div>
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            className="border-gray-700 text-gray-300 hover:bg-gray-800/50 hover:border-gray-600 backdrop-blur-sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>

        {/* Statistics Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300 backdrop-blur-sm hover:bg-gray-900/70">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Total Uploads</CardTitle>
                <Upload className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalUploads}</div>
                <p className="text-xs text-gray-400 mt-1">
                  Models & Datasets
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300 backdrop-blur-sm hover:bg-gray-900/70">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Total Downloads</CardTitle>
                <Download className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalDownloads.toLocaleString()}</div>
                <p className="text-xs text-gray-400 mt-1">
                  All-time downloads
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300 backdrop-blur-sm hover:bg-gray-900/70">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">NFT Portfolio Value</CardTitle>
                <Coins className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalNFTValue.toFixed(3)} ETH</div>
                <p className="text-xs text-gray-400 mt-1">
                  ≈ ${(stats.totalNFTValue * 2500).toLocaleString()} USD
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300 backdrop-blur-sm hover:bg-gray-900/70">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Community Engagement</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalEngagement.toLocaleString()}</div>
                <p className="text-xs text-gray-400 mt-1">
                  Total interactions
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Top Performers Section */}
        <Card className="mb-8 bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Trophy className="h-5 w-5 text-yellow-400" />
              Top Performing Assets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topUploads.map((upload, index) => (
                <div key={upload.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:bg-gray-800/70 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <Badge className={`
                      ${index === 0 ? 'bg-yellow-600 hover:bg-yellow-700' : 
                        index === 1 ? 'bg-gray-500 hover:bg-gray-600' : 
                        'bg-orange-600 hover:bg-orange-700'}
                      text-white px-3 py-1
                    `}>
                      #{index + 1}
                    </Badge>
                    <div className="flex items-center gap-3">
                      {upload.type === 'model' ? (
                        <Brain className="h-5 w-5 text-blue-400" />
                      ) : (
                        <Database className="h-5 w-5 text-green-400" />
                      )}
                      <div>
                        <p className="font-medium text-white">{upload.name}</p>
                        <p className="text-sm text-gray-400 capitalize">{upload.type}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">{upload.downloads.total.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">downloads</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="uploads" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-900/50 border border-gray-800 backdrop-blur-sm">
            <TabsTrigger 
              value="uploads" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300 transition-all duration-300"
            >
              <Upload className="h-4 w-4 mr-2" />
              My Uploads
            </TabsTrigger>
            <TabsTrigger 
              value="nfts" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300 transition-all duration-300"
            >
              <Crown className="h-4 w-4 mr-2" />
              NFT Portfolio
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-gray-300 transition-all duration-300"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Uploads Tab */}
          <TabsContent value="uploads" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Your AI Assets</h2>
              <Badge variant="secondary" className="bg-gray-800/50 text-gray-300 border-gray-700 backdrop-blur-sm">
                {uploads.length} items
              </Badge>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {uploads.map((upload) => (
                <UploadCard 
                  key={upload.id} 
                  upload={upload} 
                  onViewNFT={setSelectedUpload}
                />
              ))}
            </div>
          </TabsContent>

          {/* NFTs Tab */}
          <TabsContent value="nfts" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">NFT Collection</h2>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-gray-800/50 text-gray-300 border-gray-700 backdrop-blur-sm">
                  {uploads.length} NFTs
                </Badge>
                <Badge className="bg-yellow-600 hover:bg-yellow-700 text-white">
                  {stats?.totalNFTValue.toFixed(3)} ETH
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {uploads.map((upload) => (
                <NFTCard 
                  key={upload.id} 
                  upload={upload} 
                  onUpdate={handleUploadUpdate}
                />
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-6">Detailed Analytics</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Download Sources Analysis */}
              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Download className="h-5 w-5 text-blue-400" />
                    Download Sources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {uploads.map((upload) => (
                      <div key={upload.id} className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-300">{upload.name}</span>
                          <span className="text-sm text-gray-400">{upload.downloads.total} total</span>
                        </div>
                        <div className="flex gap-1 h-2 bg-gray-800/50 rounded-full overflow-hidden">
                          <div 
                            className="bg-blue-500 h-full transition-all duration-300"
                            style={{ 
                              width: `${(upload.downloads.sdk / upload.downloads.total) * 100}%` 
                            }}
                          />
                          <div 
                            className="bg-green-500 h-full transition-all duration-300"
                            style={{ 
                              width: `${(upload.downloads.ui / upload.downloads.total) * 100}%` 
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>SDK: {upload.downloads.sdk}</span>
                          <span>UI: {upload.downloads.ui}</span>
                        </div>
                        <Separator className="bg-gray-800/50" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Engagement Breakdown */}
              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="h-5 w-5 text-purple-400" />
                    Engagement Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {uploads.map((upload) => (
                      <div key={upload.id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 backdrop-blur-sm">
                        <h4 className="font-medium text-white mb-3">{upload.name}</h4>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <Heart className="h-3 w-3 text-red-400" />
                              <span className="text-red-400 font-bold">{upload.likes}</span>
                            </div>
                            <p className="text-gray-400 text-xs">Likes</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <Eye className="h-3 w-3 text-blue-400" />
                              <span className="text-blue-400 font-bold">{upload.views}</span>
                            </div>
                            <p className="text-gray-400 text-xs">Views</p>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <GitFork className="h-3 w-3 text-green-400" />
                              <span className="text-green-400 font-bold">{upload.forks}</span>
                            </div>
                            <p className="text-gray-400 text-xs">Forks</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
