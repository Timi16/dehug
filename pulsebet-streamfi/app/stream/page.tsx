"use client"

import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Play, Users, TrendingUp, Circle, Send, Video, Settings, Search, MessageSquare } from "lucide-react"
import { PredictionCard } from "@/components/prediction-card"
import { GoLiveDialog } from "@/components/go-live-dialog"
import { useState } from "react"

export default function StreamPage() {
  const [chatMessage, setChatMessage] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [goLiveOpen, setGoLiveOpen] = useState(false)

  const categories = ["All", "Crypto", "Sports", "Gaming", "DeFi", "Entertainment"]

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

  const chatMessages = [
    { user: "CryptoFan", message: "LFG! Going all in on YES", time: "2m ago" },
    { user: "BetMaster", message: "Odds looking good for NO", time: "3m ago" },
    { user: "Whale123", message: "Just dropped 5K on this", time: "5m ago" },
    { user: "NewbiePred", message: "How do I place a bet?", time: "7m ago" },
    { user: "CryptoKing", message: "Welcome everyone! Big prediction coming up", time: "10m ago" },
  ]

  const filteredStreams =
    selectedCategory === "All" ? liveStreams : liveStreams.filter((s) => s.category === selectedCategory)

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
          <div className="container mx-auto">
            <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Circle className="h-3 w-3 text-destructive fill-destructive animate-pulse" />
                  <span className="text-sm font-medium text-destructive">LIVE NOW</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold">
                  Live <span className="text-gradient">Streams</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                  Watch, predict, and earn in real-time. Join the action now.
                </p>
              </div>
              <Button
                className="bg-gradient-primary neon-glow hover:opacity-90 transition-opacity"
                size="lg"
                onClick={() => setGoLiveOpen(true)}
              >
                <Video className="mr-2 h-5 w-5" />
                Go Live
              </Button>
            </div>

            {/* Featured Stream with Chat */}
            <Card className="mb-12 overflow-hidden border-primary/30 neon-glow">
              <div className="grid lg:grid-cols-3 gap-0">
                {/* Video + Stream Info */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Video Placeholder */}
                  <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20">
                    <img
                      src={`/.jpg?key=kp4f9&height=720&width=1280&query=${encodeURIComponent(liveStreams[0].thumbnail)}`}
                      alt={liveStreams[0].title}
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
                          {liveStreams[0].viewers.toLocaleString()}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="secondary" className="bg-background/80 backdrop-blur-sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Stream Info */}
                  <div className="p-6 space-y-6">
                    <div className="space-y-3">
                      <h2 className="text-2xl font-bold">{liveStreams[0].title}</h2>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />${liveStreams[0].pool.toLocaleString()} pool
                        </div>
                        <Badge variant="secondary">{liveStreams[0].category}</Badge>
                      </div>
                    </div>

                    <PredictionCard
                      title="Make Your Prediction"
                      yesOdds={liveStreams[0].odds.yes}
                      noOdds={liveStreams[0].odds.no}
                      pool={liveStreams[0].pool}
                    />

                    <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-primary neon-glow flex items-center justify-center text-sm font-bold text-white">
                          {liveStreams[0].streamer[0]}
                        </div>
                        <div>
                          <div className="font-medium text-gradient">{liveStreams[0].streamer}</div>
                          <div className="text-sm text-muted-foreground">Creator</div>
                        </div>
                      </div>
                      <Button variant="outline" className="border-primary/30 bg-transparent">
                        Follow
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="border-l border-border/50 flex flex-col bg-card/50">
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
                      <Button size="icon" className="bg-gradient-primary neon-glow hover:opacity-90">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="mb-8 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={
                      selectedCategory === category
                        ? "bg-gradient-primary neon-glow"
                        : "border-border/50 hover:border-primary/30"
                    }
                  >
                    {category}
                  </Button>
                ))}
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search streams..." className="pl-9 bg-background/50" />
              </div>
            </div>

            {/* All Streams Grid */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {selectedCategory === "All" ? "All Live Streams" : `${selectedCategory} Streams`}
                </h2>
                <div className="text-sm text-muted-foreground">{filteredStreams.length} streams live</div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredStreams.map((stream) => (
                  <Card
                    key={stream.id}
                    className="overflow-hidden border-border/50 hover:border-primary/50 transition-all hover:neon-glow group cursor-pointer"
                    onClick={() => (window.location.href = `/stream/${stream.id}`)}
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={`/.jpg?key=451ib&height=360&width=640&query=${encodeURIComponent(stream.thumbnail)}`}
                        alt={stream.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-destructive/90 text-white border-0">
                          <Circle className="h-2 w-2 mr-1 fill-white" />
                          LIVE
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                          {stream.category}
                        </Badge>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="h-12 w-12 text-white drop-shadow-lg" />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4 space-y-3">
                      <h3 className="font-bold line-clamp-2 leading-snug">{stream.title}</h3>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {stream.viewers.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />${stream.pool.toLocaleString()}
                        </div>
                      </div>
                      <div className="pt-2 border-t border-border/50">
                        <div className="text-sm text-gradient font-medium">{stream.streamer}</div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Go Live Dialog */}
      <GoLiveDialog open={goLiveOpen} onOpenChange={setGoLiveOpen} />
    </div>
  )
}
