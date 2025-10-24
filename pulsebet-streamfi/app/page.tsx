"use client"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, TrendingUp, Trophy, Zap, Shield, Wallet, Users, Star, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { BecomeCreatorDialog } from "@/components/become-creator-dialog"

export default function HomePage() {
  const [becomeCreatorOpen, setBecomeCreatorOpen] = useState(false)

  const featuredCreators = [
    { name: "CryptoKing", followers: "45.2K", earnings: "$125K", avatar: "CK", category: "Crypto" },
    { name: "SportsGuru", followers: "38.9K", earnings: "$98K", avatar: "SG", category: "Sports" },
    { name: "GameMaster", followers: "52.1K", earnings: "$156K", avatar: "GM", category: "Gaming" },
    { name: "DeFiDave", followers: "29.3K", earnings: "$87K", avatar: "DD", category: "DeFi" },
  ]

  const trendingPredictions = [
    { title: "BTC hits $100K by EOY", pool: "$45.2K", participants: 1234, odds: "2.3x" },
    { title: "ETH flips BTC in 2025", pool: "$32.8K", participants: 892, odds: "5.1x" },
    { title: "Lakers win NBA Finals", pool: "$28.5K", participants: 756, odds: "1.8x" },
  ]

  const testimonials = [
    {
      name: "Alex Chen",
      role: "Top Predictor",
      content: "Made $15K in my first month. The platform is addictive and the community is amazing!",
      earnings: "$15K",
    },
    {
      name: "Sarah Miller",
      role: "Creator",
      content: "As a streamer, Plusify changed my life. My viewers are more engaged and I earn more.",
      earnings: "$42K",
    },
    {
      name: "Mike Johnson",
      role: "Crypto Trader",
      content: "Finally, a prediction market that's fast, fair, and fun. Solana makes it seamless.",
      earnings: "$8.5K",
    },
  ]

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background opacity-50" />

        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-primary/3 rounded-full blur-3xl" />

        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-block animate-fade-in-up">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">The Future of StreamFi</span>
              </div>
            </div>

            <h1
              className="text-5xl md:text-7xl font-bold leading-tight text-balance animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              Watch. Predict. <span className="text-primary">Earn.</span>
            </h1>

            <p
              className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Join live streams and bet on what happens next. Watch creators host prediction shows, compete with
              friends, and win crypto rewards.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              <Link href="/stream">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white text-lg px-8 transition-smooth hover-shadow"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Start Watching
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
              {[
                { value: "$2.5M+", label: "Total Volume" },
                { value: "50K+", label: "Active Users" },
                { value: "100+", label: "Live Streams" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="space-y-2 animate-fade-in-up"
                  style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                >
                  <div className="text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Creators Section */}
      <section className="py-20 px-4 bg-secondary/5">
        <div className="container mx-auto">
          <div className="text-center mb-16 space-y-4 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold">
              Featured <span className="text-primary">Creators</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Top streamers earning thousands through live predictions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {featuredCreators.map((creator, index) => (
              <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <Card className="p-6 bg-card border-border hover:border-primary/30 transition-smooth hover-shadow group cursor-pointer">
                  <div className="text-center space-y-4">
                    <div className="h-20 w-20 rounded-2xl bg-primary flex items-center justify-center text-2xl font-bold text-white mx-auto hover-scale">
                      {creator.avatar}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">{creator.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {creator.category}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm pt-4 border-t border-border">
                      <div>
                        <div className="text-muted-foreground text-xs">Followers</div>
                        <div className="font-bold text-primary">{creator.followers}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground text-xs">Earned</div>
                        <div className="font-bold text-success">{creator.earnings}</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 animate-fade-in-up">
            <Link href="/stream">
              <Button
                variant="outline"
                className="border-primary/30 hover:bg-primary/10 bg-transparent transition-smooth"
              >
                View All Creators
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              Trending <span className="text-primary">Predictions</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join the hottest prediction markets right now
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {trendingPredictions.map((prediction, index) => (
              <Card
                key={index}
                className="p-6 bg-card border-border hover:border-primary/30 transition-all hover:shadow-lg group cursor-pointer"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-bold leading-snug flex-1">{prediction.title}</h3>
                    <TrendingUp className="h-5 w-5 text-primary flex-shrink-0 ml-2" />
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Pool</div>
                      <div className="font-bold text-sm">{prediction.pool}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Players</div>
                      <div className="font-bold text-sm">{prediction.participants}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Odds</div>
                      <div className="font-bold text-sm text-success">{prediction.odds}</div>
                    </div>
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white" size="sm">
                    Place Bet
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-secondary/5">
        <div className="container mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              Why <span className="text-primary">Plusify</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The first platform to combine live streaming, prediction markets, and gaming rewards
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="p-8 bg-card border-border hover:border-primary/30 transition-all hover:shadow-lg group">
              <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center mb-6">
                <Play className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Live & Interactive</h3>
              <p className="text-muted-foreground leading-relaxed">
                Watch creators go live and place predictions directly on the stream. Real-time results and instant
                payouts.
              </p>
            </Card>

            <Card className="p-8 bg-card border-border hover:border-primary/30 transition-all hover:shadow-lg group">
              <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Transparent & Fair</h3>
              <p className="text-muted-foreground leading-relaxed">
                All predictions and results are on-chain. Powered by Solana for fast, secure transactions with USDC.
              </p>
            </Card>

            <Card className="p-8 bg-card border-border hover:border-primary/30 transition-all hover:shadow-lg group">
              <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center mb-6">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Earn Rewards</h3>
              <p className="text-muted-foreground leading-relaxed">
                Win USDC prizes, collect NFT badges, and climb the leaderboard. Top predictors earn weekly rewards.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              How It <span className="text-primary">Works</span>
            </h2>
          </div>

          <div className="space-y-8">
            {[
              {
                step: "01",
                title: "Connect Your Wallet",
                description: "Link your Solana wallet to get started. Fund with USDC to place predictions.",
                icon: Wallet,
              },
              {
                step: "02",
                title: "Join Live Streams",
                description: "Watch creators host prediction shows about sports, crypto, events, or fun challenges.",
                icon: Play,
              },
              {
                step: "03",
                title: "Make Predictions",
                description: "Place your bets on outcomes. See odds and pool size in real-time.",
                icon: TrendingUp,
              },
              {
                step: "04",
                title: "Win & Earn",
                description: "Correct predictions earn USDC rewards. Climb the leaderboard for bonus prizes.",
                icon: Trophy,
              },
            ].map((item, index) => (
              <div key={index} className="flex gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center">
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <div className="text-sm font-mono text-primary mb-2">{item.step}</div>
                  <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-secondary/5">
        <div className="container mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              What Our <span className="text-primary">Community</span> Says
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real stories from real users earning on Plusify
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 bg-card border-border">
                <div className="space-y-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground leading-relaxed italic">"{testimonial.content}"</p>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <div className="font-bold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Earned</div>
                      <div className="font-bold text-success">{testimonial.earnings}</div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="p-12 bg-primary/5 border-primary/20">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">$2.5M+</div>
                <div className="text-muted-foreground">Total Paid Out</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">50K+</div>
                <div className="text-muted-foreground">Active Predictors</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">500+</div>
                <div className="text-muted-foreground">Live Creators</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-success">1M+</div>
                <div className="text-muted-foreground">Predictions Made</div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="p-12 bg-primary/5 border-primary/20 text-center animate-fade-in-up">
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold">
                Ready to Start <span className="text-primary">Predicting</span>?
              </h2>
              <p className="text-xl text-muted-foreground">
                Join thousands of users earning rewards through live predictions
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/stream">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-white text-lg px-8 transition-smooth hover-shadow"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Watch Live Now
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/30 hover:bg-primary/10 text-lg px-8 bg-transparent transition-smooth"
                  onClick={() => setBecomeCreatorOpen(true)}
                >
                  <Users className="mr-2 h-5 w-5" />
                  Become a Creator
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-16 px-4 bg-secondary/5">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-primary">Plusify</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The future of StreamFi. Watch, predict, and earn crypto rewards on Solana.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/stream" className="hover:text-primary transition-colors">
                    Live Streams
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="hover:text-primary transition-colors">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Become a Creator
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Community</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Discord
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Telegram
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div>© 2025 Plusify. All rights reserved.</div>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-primary transition-colors">
                Terms
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Privacy
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Become Creator Dialog */}
      <BecomeCreatorDialog open={becomeCreatorOpen} onOpenChange={setBecomeCreatorOpen} />
    </div>
  )
}
