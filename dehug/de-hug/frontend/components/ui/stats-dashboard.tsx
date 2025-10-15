"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Code, Smartphone, TrendingUp, RefreshCw, BarChart3 } from 'lucide-react'
import { DeHugAPI, type StatsResponse } from "@/lib/api"

export function StatsDashboard() {
  const [stats, setStats] = useState<StatsResponse>({})
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      const allStats = await DeHugAPI.getDownloadStats()
      setStats(allStats)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const totalStats = Object.values(stats).reduce(
    (acc, stat) => ({
      total: acc.total + stat.total,
      ui: acc.ui + stat.ui,
      sdk: acc.sdk + stat.sdk
    }),
    { total: 0, ui: 0, sdk: 0 }
  )

  const topItems = Object.entries(stats)
    .sort(([, a], [, b]) => b.total - a.total)
    .slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-light text-white mb-2">Download Analytics</h2>
          <p className="text-slate-400 font-light">
            Real-time download statistics from Filecoin/IPFS network
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {lastUpdated && (
            <span className="text-sm text-slate-500 font-light">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <Button
            onClick={fetchStats}
            disabled={loading}
            variant="outline"
            size="sm"
            className="bg-slate-800/30 border-slate-700 text-slate-300 hover:bg-slate-700/50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 font-light text-sm">Total Downloads</p>
                <p className="text-3xl font-light text-white">{totalStats.total.toLocaleString()}</p>
              </div>
              <Download className="h-8 w-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 font-light text-sm">Web UI Downloads</p>
                <p className="text-3xl font-light text-white">{totalStats.ui.toLocaleString()}</p>
              </div>
              <Smartphone className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 font-light text-sm">SDK Downloads</p>
                <p className="text-3xl font-light text-white">{totalStats.sdk.toLocaleString()}</p>
              </div>
              <Code className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Downloads */}
      <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center text-white font-light text-xl">
            <TrendingUp className="h-5 w-5 mr-3" />
            Most Downloaded Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-slate-800/20 border border-slate-700"></div>
                </div>
              ))}
            </div>
          ) : topItems.length > 0 ? (
            <div className="space-y-4">
              {topItems.map(([itemName, itemStats], index) => (
                <div key={itemName} className="flex items-center justify-between p-4 bg-slate-800/20 border border-slate-700">
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-4 border-slate-700 text-slate-300 bg-slate-800/30">
                      #{index + 1}
                    </Badge>
                    <div>
                      <p className="font-light text-white">{itemName}</p>
                      <p className="text-sm text-slate-400 font-light">
                        {itemStats.total.toLocaleString()} total downloads
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="text-center">
                      <div className="text-blue-400 font-medium">{itemStats.ui.toLocaleString()}</div>
                      <div className="text-slate-500 font-light">UI</div>
                    </div>
                    <div className="text-center">
                      <div className="text-green-400 font-medium">{itemStats.sdk.toLocaleString()}</div>
                      <div className="text-slate-500 font-light">SDK</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BarChart3 className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-light text-white mb-2">No Download Data</h3>
              <p className="text-slate-400 font-light">
                Download statistics will appear here once items are accessed.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
