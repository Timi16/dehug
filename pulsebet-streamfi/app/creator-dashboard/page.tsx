"use client"

import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DollarSign,
  TrendingUp,
  Users,
  Eye,
  Video,
  Calendar,
  Download,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

export default function CreatorDashboardPage() {
  const creatorStats = {
    totalEarnings: 28450,
    monthlyEarnings: 8900,
    totalStreams: 45,
    totalViewers: 156234,
    avgViewersPerStream: 3472,
    followers: 12450,
    conversionRate: 34.2,
  }

  const earningsData = [
    { date: "Jan 1", earnings: 450, viewers: 1200 },
    { date: "Jan 2", earnings: 320, viewers: 980 },
    { date: "Jan 3", earnings: 680, viewers: 2100 },
    { date: "Jan 4", earnings: 290, viewers: 850 },
    { date: "Jan 5", earnings: 520, viewers: 1600 },
    { date: "Jan 6", earnings: 890, viewers: 2800 },
    { date: "Jan 7", earnings: 750, viewers: 2300 },
  ]

  const recentStreams = [
    {
      id: 1,
      title: "BTC Price Prediction Show",
      date: "2 days ago",
      viewers: 2453,
      earnings: 450,
      duration: "2h 15m",
      trend: "up",
    },
    {
      id: 2,
      title: "Crypto Market Analysis",
      date: "5 days ago",
      viewers: 1892,
      earnings: 320,
      duration: "1h 45m",
      trend: "down",
    },
    {
      id: 3,
      title: "Live Trading Session",
      date: "1 week ago",
      viewers: 3124,
      earnings: 680,
      duration: "3h 20m",
      trend: "up",
    },
    {
      id: 4,
      title: "Q&A with Community",
      date: "1 week ago",
      viewers: 1567,
      earnings: 290,
      duration: "1h 30m",
      trend: "down",
    },
  ]

  return (
    <div className="min-h-screen">
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: "url('/stream-background.jpeg')",
          opacity: 0.15,
          zIndex: 0,
        }}
      />
      <div className="relative z-10">
        <Navigation />

        <div className="pt-24 pb-12 px-4">
          <div className="container mx-auto max-w-6xl">
            {/* Header */}
            <div className="mb-8 animate-fade-in-up">
              <h1 className="text-4xl font-bold mb-2">Creator Dashboard</h1>
              <p className="text-muted-foreground">Track your earnings and stream performance</p>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {[
                {
                  label: "Total Earnings",
                  value: `$${creatorStats.totalEarnings.toLocaleString()}`,
                  icon: DollarSign,
                  color: "text-success",
                  delay: 0,
                },
                {
                  label: "This Month",
                  value: `$${creatorStats.monthlyEarnings.toLocaleString()}`,
                  icon: TrendingUp,
                  color: "text-primary",
                  delay: 0.1,
                },
                {
                  label: "Total Viewers",
                  value: creatorStats.totalViewers.toLocaleString(),
                  icon: Eye,
                  color: "text-accent",
                  delay: 0.2,
                },
                {
                  label: "Followers",
                  value: creatorStats.followers.toLocaleString(),
                  icon: Users,
                  color: "text-secondary",
                  delay: 0.3,
                },
              ].map((stat, index) => (
                <Card
                  key={index}
                  className="p-6 bg-card border-border animate-fade-in-up hover-shadow transition-smooth"
                  style={{ animationDelay: `${stat.delay}s` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center ${stat.color}`}
                    >
                      <stat.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </div>
                </Card>
              ))}
            </div>

            <Tabs defaultValue="overview" className="space-y-8">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="streams">Streams</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-8 animate-fade-in-up">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Quick Stats */}
                  <Card className="p-6 bg-card border-border">
                    <h3 className="text-lg font-bold mb-6">Quick Stats</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-4 border-b border-border">
                        <div className="flex items-center gap-3">
                          <Video className="h-5 w-5 text-primary" />
                          <span className="text-muted-foreground">Total Streams</span>
                        </div>
                        <span className="font-bold">{creatorStats.totalStreams}</span>
                      </div>
                      <div className="flex items-center justify-between pb-4 border-b border-border">
                        <div className="flex items-center gap-3">
                          <Eye className="h-5 w-5 text-accent" />
                          <span className="text-muted-foreground">Avg Viewers</span>
                        </div>
                        <span className="font-bold">{creatorStats.avgViewersPerStream.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <TrendingUp className="h-5 w-5 text-success" />
                          <span className="text-muted-foreground">Conversion Rate</span>
                        </div>
                        <span className="font-bold text-success">{creatorStats.conversionRate}%</span>
                      </div>
                    </div>
                  </Card>

                  {/* Earnings Breakdown */}
                  <Card className="p-6 bg-card border-border">
                    <h3 className="text-lg font-bold mb-6">Earnings Breakdown</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Prediction Earnings</span>
                          <span className="font-bold">$18,450</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: "65%" }} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Viewer Tips</span>
                          <span className="font-bold">$7,000</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-success h-2 rounded-full" style={{ width: "25%" }} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Bonuses</span>
                          <span className="font-bold">$3,000</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-accent h-2 rounded-full" style={{ width: "10%" }} />
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>

              {/* Streams Tab */}
              <TabsContent value="streams" className="space-y-6 animate-fade-in-up">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold">Recent Streams</h3>
                  <Button variant="outline" size="sm" className="border-primary/30 bg-transparent">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>

                <div className="space-y-4">
                  {recentStreams.map((stream, index) => (
                    <Card
                      key={stream.id}
                      className="p-4 bg-card border-border hover:border-primary/30 transition-smooth animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="font-bold mb-1">{stream.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {stream.date}
                            </span>
                            <span>{stream.duration}</span>
                          </div>
                        </div>
                        <Badge
                          className={
                            stream.trend === "up"
                              ? "bg-success/20 text-success border-success/30"
                              : "bg-destructive/20 text-destructive border-destructive/30"
                          }
                        >
                          {stream.trend === "up" ? (
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3 mr-1" />
                          )}
                          {stream.trend === "up" ? "Up" : "Down"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Viewers</div>
                          <div className="font-bold">{stream.viewers.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Earnings</div>
                          <div className="font-bold text-success">${stream.earnings}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Avg/Viewer</div>
                          <div className="font-bold">${(stream.earnings / stream.viewers).toFixed(2)}</div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6 animate-fade-in-up">
                <Card className="p-6 bg-card border-border">
                  <h3 className="text-lg font-bold mb-6">7-Day Performance</h3>
                  <div className="space-y-6">
                    {earningsData.map((data, index) => (
                      <div
                        key={index}
                        className="space-y-2 animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">{data.date}</span>
                          <div className="flex gap-4">
                            <span className="font-bold text-success">${data.earnings}</span>
                            <span className="text-muted-foreground">{data.viewers} viewers</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${(data.earnings / 1000) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
