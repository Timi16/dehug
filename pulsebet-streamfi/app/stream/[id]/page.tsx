"use client"

import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, TrendingUp, Circle, Send, MessageSquare, Lock, ArrowLeft, Trophy } from "lucide-react"
import { PredictionCard } from "@/components/prediction-card"
import { useState } from "react"
import Link from "next/link"

export default function StreamDetailPage({ params }: { params: { id: string } }) {
  const [chatMessage, setChatMessage] = useState("")
  const [activeTab, setActiveTab] = useState("predictions")

  // Mock stream data
  const liveStreams = [
    {
      id: 1,
      title: "BTC Price Prediction - Will it hit $70k?",
      streamer: "CryptoKing",
      viewers: 2453,
      pool: 15420,
      odds: { yes: 1.8, no: 2.1 },
      category: "Crypto",
      thumbnail: "bitcoin cryptocurrency trading chart with candlesticks",
    },
    {
      id: 2,
      title: "NBA Finals - Lakers vs Celtics",
      streamer: "SportsGuru",
      viewers: 3821,
      pool: 28900,
      odds: { yes: 1.5, no: 2.5 },
      category: "Sports",
      thumbnail: "basketball game nba arena with players",
    },
    {
      id: 3,
      title: "Spin the Bottle Challenge - 1000 USDC Prize",
      streamer: "GameMaster",
      viewers: 1892,
      pool: 8750,
      odds: { yes: 2.2, no: 1.7 },
      category: "Gaming",
      thumbnail: "gaming setup with colorful lights and controller",
    },
    {
      id: 4,
      title: "ETH Gas Fees - Will they drop below 10 gwei?",
      streamer: "DeFiDave",
      viewers: 1234,
      pool: 6200,
      odds: { yes: 3.1, no: 1.4 },
      category: "DeFi",
      thumbnail: "ethereum blockchain network visualization",
    },
    {
      id: 5,
      title: "SOL to $200 by end of week?",
      streamer: "SolanaQueen",
      viewers: 1567,
      pool: 12300,
      odds: { yes: 2.5, no: 1.6 },
      category: "Crypto",
      thumbnail: "solana cryptocurrency coin with purple gradient",
    },
    {
      id: 6,
      title: "NFL Sunday Night - Chiefs Win?",
      streamer: "FootballFanatic",
      viewers: 2891,
      pool: 19800,
      odds: { yes: 1.9, no: 2.0 },
      category: "Sports",
      thumbnail: "american football stadium at night with lights",
    },
    {
      id: 7,
      title: "Fortnite Tournament - Who Wins?",
      streamer: "ProGamer",
      viewers: 4123,
      pool: 22500,
      odds: { yes: 1.7, no: 2.3 },
      category: "Gaming",
      thumbnail: "fortnite battle royale gameplay scene",
    },
    {
      id: 8,
      title: "Aave TVL hits $10B this month?",
      streamer: "DeFiAnalyst",
      viewers: 892,
      pool: 5400,
      odds: { yes: 3.5, no: 1.3 },
      category: "DeFi",
      thumbnail: "defi protocol dashboard with charts and data",
    },
  ]

  const stream = liveStreams.find((s) => s.id === Number.parseInt(params.id)) || liveStreams[0]

  const chatMessages = [
    { user: "CryptoFan", message: "LFG! Going all in on YES", time: "2m ago" },
    { user: "BetMaster", message: "Odds looking good for NO", time: "3m ago" },
    { user: "Whale123", message: "Just dropped 5K on this", time: "5m ago" },
    { user: "NewbiePred", message: "How do I place a bet?", time: "7m ago" },
    { user: "CryptoKing", message: "Welcome everyone! Big prediction coming up", time: "10m ago" },
  ]

  // Mock leaderboard data - private/subscription feature
  const leaderboardData = [
    { rank: 1, user: "WhaleKing", winRate: "78%", earnings: "$12,450", streak: 12 },
    { rank: 2, user: "PredictorPro", winRate: "72%", earnings: "$9,320", streak: 8 },
    { rank: 3, user: "LuckyBet", winRate: "68%", earnings: "$7,890", streak: 6 },
    { rank: 4, user: "CryptoGuru", winRate: "65%", earnings: "$6,540", streak: 5 },
    { rank: 5, user: "BetMaster", winRate: "62%", earnings: "$5,210", streak: 4 },
  ]

  const isSubscribed = true // Mock subscription status

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          {/* Back Button */}
          <Link href="/stream" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Streams
          </Link>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Video Player */}
              <Card className="overflow-hidden border-border/50">
                <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20">
                  <img
                    src={`/.jpg?key=kp4f9&height=720&width=1280&query=${encodeURIComponent(stream.thumbnail)}`}
                    alt={stream.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-destructive/90 text-white border-0">
                        <Circle className="h-2 w-2 mr-1 fill-white" />
                        LIVE
                      </Badge>
                      <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                        <Users className="h-3 w-3 mr-1" />
                        {stream.viewers.toLocaleString()}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Stream Info */}
              <Card className="p-6 border-border/50 space-y-6">
                <div className="space-y-3">
                  <h1 className="text-3xl font-bold">{stream.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />${stream.pool.toLocaleString()} pool
                    </div>
                    <Badge variant="secondary">{stream.category}</Badge>
                  </div>
                </div>

                <PredictionCard
                  title="Make Your Prediction"
                  yesOdds={stream.odds.yes}
                  noOdds={stream.odds.no}
                  pool={stream.pool}
                />

                <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center text-sm font-bold text-white">
                      {stream.streamer[0]}
                    </div>
                    <div>
                      <div className="font-medium text-gradient">{stream.streamer}</div>
                      <div className="text-sm text-muted-foreground">Creator</div>
                    </div>
                  </div>
                  <Button variant="outline" className="border-primary/30 bg-transparent">
                    Follow
                  </Button>
                </div>
              </Card>

              {/* Tabs */}
              <Card className="border-border/50">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="w-full justify-start border-b border-border/50 bg-transparent p-0 rounded-none">
                    <TabsTrigger
                      value="predictions"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                    >
                      Predictions
                    </TabsTrigger>
                    <TabsTrigger
                      value="leaderboard"
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary flex items-center gap-2"
                    >
                      <Trophy className="h-4 w-4" />
                      Leaderboard
                      {!isSubscribed && <Lock className="h-3 w-3 text-destructive" />}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="predictions" className="p-6 space-y-4">
                    <div className="space-y-3">
                      <h3 className="font-bold">Recent Predictions</h3>
                      <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-border/30"
                          >
                            <div>
                              <div className="font-medium">User{i}</div>
                              <div className="text-sm text-muted-foreground">Predicted YES • 2 hours ago</div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-primary">+$250</div>
                              <div className="text-sm text-muted-foreground">$500 bet</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="leaderboard" className="p-6">
                    {!isSubscribed ? (
                      <div className="text-center py-12 space-y-4">
                        <Lock className="h-12 w-12 text-destructive mx-auto opacity-50" />
                        <div>
                          <h3 className="font-bold text-lg mb-2">Premium Feature</h3>
                          <p className="text-muted-foreground mb-4">
                            Subscribe to view the stream leaderboard and top predictors
                          </p>
                          <Button className="bg-gradient-primary">Subscribe Now</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <h3 className="font-bold">Top Predictors This Stream</h3>
                        <div className="space-y-2">
                          {leaderboardData.map((entry) => (
                            <div
                              key={entry.rank}
                              className="flex items-center justify-between p-4 bg-card/50 rounded-lg border border-border/30 hover:border-primary/30 transition-colors"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center font-bold text-white text-sm">
                                  {entry.rank}
                                </div>
                                <div>
                                  <div className="font-medium">{entry.user}</div>
                                  <div className="text-sm text-muted-foreground">{entry.winRate} win rate</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-primary">{entry.earnings}</div>
                                <div className="text-sm text-muted-foreground">{entry.streak} streak</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </Card>
            </div>

            {/* Chat Sidebar */}
            <div className="border border-border/50 rounded-lg flex flex-col bg-card/50 h-fit lg:sticky lg:top-24">
              <div className="p-4 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <h3 className="font-bold">Live Chat</h3>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4 h-[400px]">
                <div className="space-y-4">
                  {chatMessages.map((msg, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-sm text-gradient">{msg.user}</span>
                        <span className="text-xs text-muted-foreground">{msg.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{msg.message}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-border/50">
                <div className="flex gap-2">
                  <Input
                    placeholder="Send a message..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="bg-background/50"
                  />
                  <Button size="icon" className="bg-gradient-primary hover:opacity-90">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
