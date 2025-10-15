"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { ExternalLink, Coins, Calendar, Hash, Zap, TrendingUp, Download, Heart, Eye, GitFork, Star, MessageCircle, Loader2, CheckCircle, XCircle, Activity } from 'lucide-react'
import { UserUpload, DeHugAPI } from "@/lib/api"
import { toast } from 'react-toastify'

interface NFTCardProps {
  upload: UserUpload
  onUpdate?: (upload: UserUpload) => void
}

export function NFTCard({ upload, onUpdate }: NFTCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [lastSyncResult, setLastSyncResult] = useState<{
    success: boolean
    txHash?: string
    error?: string
  } | null>(null)

  const handleSyncEngagement = async () => {
    setIsLoading(true)
    setLastSyncResult(null)

    try {
      const result = await DeHugAPI.syncNFTEngagement(upload)
      setLastSyncResult(result)

      if (result.success) {
        toast.success(`NFT Synced Successfully! New value: ${result.newValue.toFixed(3)} ETH`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })

        // Update the upload with new value
        const updatedUpload = {
          ...upload,
          nft: {
            ...upload.nft,
            currentValue: result.newValue,
            lastSyncedAt: new Date().toISOString()
          }
        }
        
        onUpdate?.(updatedUpload)
      } else {
        toast.error(`Sync Failed: ${result.error || "Smart contract interaction failed"}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      }
    } catch (error) {
      toast.error("Network error occurred during sync", {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'legendary': return 'bg-gradient-to-r from-yellow-600 to-orange-600'
      case 'epic': return 'bg-gradient-to-r from-purple-600 to-pink-600'
      case 'rare': return 'bg-gradient-to-r from-blue-600 to-cyan-600'
      default: return 'bg-gradient-to-r from-gray-600 to-gray-700'
    }
  }

  const rarityAttribute = upload.nft.attributes.find(attr => attr.trait_type === 'Rarity')
  const rarity = rarityAttribute?.value as string || 'Common'

  // Calculate engagement score for progress bar
  const maxEngagement = 10000
  const currentEngagement = upload.downloads.total + upload.likes + upload.views + upload.forks + upload.stars + upload.comments
  const engagementProgress = Math.min((currentEngagement / maxEngagement) * 100, 100)

  return (
    <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-all duration-300 group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg text-white group-hover:text-gray-100 transition-colors">
                {upload.nft.name}
              </CardTitle>
              <Badge className={`${getRarityColor(rarity)} text-white border-0 text-xs px-2 py-1`}>
                {rarity}
              </Badge>
            </div>
            <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
              {upload.nft.description}
            </p>
          </div>
          {/* <div className="ml-4 flex-shrink-0">
            <img 
              src={upload.nft.image || "/placeholder.svg?height=64&width=64"} 
              alt={upload.nft.name}
              className="w-16 h-16 rounded-lg object-cover border border-gray-700 group-hover:border-gray-600 transition-colors"
            />
          </div> */}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* NFT Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Hash className="h-4 w-4 text-gray-500" />
            <span className="text-gray-300">#{upload.nft.tokenId}</span>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-yellow-400" />
            <span className="text-yellow-400 font-semibold">{upload.nft.currentValue.toFixed(3)} ETH</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-gray-300">{formatDate(upload.nft.mintedAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-green-400" />
            <span className="text-green-400">Active</span>
          </div>
        </div>

        {/* Attributes */}
        <div>
          <h4 className="text-sm font-medium text-gray-200 mb-3">NFT Attributes</h4>
          <div className="grid grid-cols-2 gap-2">
            {upload.nft.attributes.map((attr, index) => (
              <div key={index} className="bg-gray-800 p-2 rounded border border-gray-700 text-xs">
                <p className="text-gray-400 mb-1">{attr.trait_type}</p>
                <p className="text-white font-medium">{attr.value}</p>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-gray-800" />

        {/* Engagement Impact */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-200">Engagement Impact</h4>
            <span className="text-xs text-gray-400">{engagementProgress.toFixed(1)}%</span>
          </div>
          <Progress value={engagementProgress} className="mb-3" />
          
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Download className="h-3 w-3 text-blue-400" />
              <span className="text-gray-300">{upload.downloads.total}</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-3 w-3 text-red-400" />
              <span className="text-gray-300">{upload.likes}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-3 w-3 text-green-400" />
              <span className="text-gray-300">{upload.views}</span>
            </div>
            <div className="flex items-center gap-2">
              <GitFork className="h-3 w-3 text-yellow-400" />
              <span className="text-gray-300">{upload.forks}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-3 w-3 text-purple-400" />
              <span className="text-gray-300">{upload.stars}</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-3 w-3 text-cyan-400" />
              <span className="text-gray-300">{upload.comments}</span>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-800" />

        {/* Smart Contract Status */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-200">Smart Contract</h4>
            <span className="text-xs text-gray-400">
              Last sync: {formatDate(upload.nft.lastSyncedAt)}
            </span>
          </div>
          
          {lastSyncResult && (
            <div className={`p-3 rounded-lg text-xs mb-3 border ${
              lastSyncResult.success 
                ? 'bg-green-900/20 border-green-500/30 text-green-300' 
                : 'bg-red-900/20 border-red-500/30 text-red-300'
            }`}>
              <div className="flex items-center gap-2">
                {lastSyncResult.success ? (
                  <CheckCircle className="h-3 w-3" />
                ) : (
                  <XCircle className="h-3 w-3" />
                )}
                <span>
                  {lastSyncResult.success 
                    ? `Synced successfully! TX: ${lastSyncResult.txHash?.substring(0, 10)}...`
                    : lastSyncResult.error
                  }
                </span>
              </div>
            </div>
          )}

          <Button 
            onClick={handleSyncEngagement}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white mb-3"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Syncing to Blockchain...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Sync Engagement to NFT
              </>
            )}
          </Button>

          {/* External Links */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
              onClick={() => window.open(upload.nft.openseaUrl, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              OpenSea
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
              onClick={() => window.open(`https://etherscan.io/address/${upload.nft.contractAddress}`, '_blank')}
            >
              <Hash className="h-4 w-4 mr-2" />
              Contract
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
