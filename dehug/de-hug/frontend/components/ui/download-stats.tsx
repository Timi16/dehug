"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Smartphone, Code, TrendingUp } from 'lucide-react'
import { DeHugAPI, type DownloadStats } from "@/lib/api"

interface DownloadStatsProps {
  itemName: string
  className?: string
  showDetailed?: boolean
}

export function DownloadStatsComponent({ itemName, className = "", showDetailed = false }: DownloadStatsProps) {
  const [stats, setStats] = useState<DownloadStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const itemStats = await DeHugAPI.getItemStats(itemName)
        setStats(itemStats)
        setError(null)
      } catch (err) {
        setError('Failed to load stats')
        console.error('Error fetching stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
    
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [itemName])

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 bg-slate-800/20 border border-slate-700"></div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className={`text-slate-500 text-sm ${className}`}>
        <Download className="h-4 w-4 inline mr-1" />
        Stats unavailable
      </div>
    )
  }

  if (!showDetailed) {
    return (
      <div className={`flex items-center text-slate-300 ${className}`}>
        <Download className="h-4 w-4 mr-2" />
        <span className="font-light">{stats.total.toLocaleString()} downloads</span>
      </div>
    )
  }

  return (
    <Card className={`bg-slate-900/20 backdrop-blur-sm border-slate-800 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-light text-lg">Download Statistics</h3>
          <Badge variant="outline" className="border-slate-700 text-slate-300 bg-slate-800/30">
            <TrendingUp className="h-3 w-3 mr-1" />
            Live
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-slate-800/20 border border-slate-700">
            <div className="flex items-center justify-center mb-2">
              <Download className="h-5 w-5 text-slate-400 mr-2" />
              <span className="text-slate-400 font-light text-sm">Total</span>
            </div>
            <div className="text-2xl font-light text-white">{stats.total.toLocaleString()}</div>
          </div>
          
          <div className="text-center p-4 bg-slate-800/20 border border-slate-700">
            <div className="flex items-center justify-center mb-2">
              <Smartphone className="h-5 w-5 text-blue-400 mr-2" />
              <span className="text-slate-400 font-light text-sm">Web UI</span>
            </div>
            <div className="text-2xl font-light text-white">{stats.ui.toLocaleString()}</div>
          </div>
          
          <div className="text-center p-4 bg-slate-800/20 border border-slate-700">
            <div className="flex items-center justify-center mb-2">
              <Code className="h-5 w-5 text-green-400 mr-2" />
              <span className="text-slate-400 font-light text-sm">SDK</span>
            </div>
            <div className="text-2xl font-light text-white">{stats.sdk.toLocaleString()}</div>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-slate-500 text-center font-light">
          Downloads tracked from Filecoin/IPFS network
        </div>
      </CardContent>
    </Card>
  )
}
