"use client"

import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EditProfileDialog } from "@/components/edit-profile-dialog"
import { useState } from "react"
import {
  Trophy,
  TrendingUp,
  Target,
  Zap,
  Award,
  Calendar,
  Users,
  DollarSign,
  Video,
  BarChart3,
  Eye,
} from "lucide-react"

export default function ProfilePage() {
  const [editProfileOpen, setEditProfileOpen] = useState(false)

  const userStats = {
    username: "YourUsername",
    rank: 42,
    totalProfit: 12450,
    accuracy: 68,
    totalPredictions: 156,
    winStreak: 5,
    badge: "Silver",
    joinedDate: "Jan 2025",
    isCreator: true,
    followers: 3420,
    totalStreams: 45,
    streamEarnings: 8900,
    avgViewers: 1250,
  }

  const recentPredictions = [
    { id: 1, event: "BTC > $70k", result: "won", amount: 250, payout: 450, date: "2 hours ago" },
    { id: 2, event: "Lakers Win", result: "won", amount: 100, payout: 180, date: "5 hours ago" },
    { id: 3, event: "ETH Gas < 10", result: "lost", amount: 150, payout: 0, date: "1 day ago" },
    { id: 4, event: "Spin Challenge", result: "won", amount: 200, payout: 440, date: "2 days ago" },
    { id: 5, event: "SOL to $200", result: "won", amount: 300, payout: 750, date: "3 days ago" },
    { id: 6, event: "NFL Chiefs Win", result: "lost", amount: 180, payout: 0, date: "4 days ago" },
  ]

  const streamingHistory = [
    { id: 1, title: "BTC Price Prediction Show", viewers: 2453, earnings: 450, date: "2 days ago" },
    { id: 2, title: "Crypto Market Analysis", viewers: 1892, earnings: 320, date: "5 days ago" },
    { id: 3, title: "Live Trading Session", viewers: 3124, earnings: 680, date: "1 week ago" },
    { id: 4, title: "Q&A with Community", viewers: 1567, earnings: 290, date: "1 week ago" },
  ]

  const achievements = [
    { name: "First Win", icon: Trophy, unlocked: true },
    { name: "10 Win Streak", icon: Zap, unlocked: true },
    { name: "High Roller", icon: TrendingUp, unlocked: true },
    { name: "100 Predictions", icon: Target, unlocked: true },
    { name: "Perfect Week", icon: Award, unlocked: false },
    { name: "Top 10", icon: Trophy, unlocked: false },
    { name: "1K Followers", icon: Users, unlocked: true },
    { name: "50 Streams", icon: Video, unlocked: false },
  ]

  return (
    <div className="min-h-screen">
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: "url('/profile-background.jpeg')",
          opacity: 0.12,
          zIndex: 0,
        }}
      />
      <div className="relative z-10">
        <Navigation />

        <div className="pt-24 pb-12 px-4">
          <div className="container mx-auto max-w-6xl">
            {/* Profile Header */}
            <Card className="p-8 mb-8 bg-gradient-to-br from-primary/20 via-card to-accent/20 border-primary/30 neon-glow">
              <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                <div className="h-24 w-24 rounded-2xl bg-gradient-primary neon-glow flex items-center justify-center text-4xl font-bold text-white">
                  {userStats.username[0]}
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <h1 className="text-3xl font-bold">{userStats.username}</h1>
                    <Badge className="bg-muted-foreground/20 text-muted-foreground border-muted-foreground/30 w-fit">
                      {userStats.badge}
                    </Badge>
                    <Badge variant="outline" className="border-primary/30 w-fit">
                      Rank #{userStats.rank}
                    </Badge>
                    {userStats.isCreator && (
                      <Badge className="bg-gradient-primary neon-glow text-white border-0 w-fit">
                        <Video className="h-3 w-3 mr-1" />
                        Creator
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Joined {userStats.joinedDate}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="bg-gradient-primary neon-glow hover:opacity-90 transition-opacity"
                    onClick={() => setEditProfileOpen(true)}
                  >
                    Edit Profile
                  </Button>
                  {userStats.isCreator && (
                    <Button variant="outline" className="border-secondary/30 hover:bg-secondary/10 bg-transparent">
                      <Video className="mr-2 h-4 w-4" />
                      Go Live
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            <Tabs defaultValue="predictor" className="space-y-8">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="predictor">Predictor Stats</TabsTrigger>
                {userStats.isCreator && <TabsTrigger value="creator">Creator Dashboard</TabsTrigger>}
              </TabsList>

              {/* Predictor Stats Tab */}
              <TabsContent value="predictor" className="space-y-8">
                {/* Stats Grid */}
                <div className="grid md:grid-cols-4 gap-6">
                  <Card className="p-6 bg-card border-primary/30">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <TrendingUp className="h-4 w-4" />
                        Total Profit
                      </div>
                      <div className="text-3xl font-bold text-success">${userStats.totalProfit.toLocaleString()}</div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-card border-secondary/30">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Target className="h-4 w-4" />
                        Accuracy
                      </div>
                      <div className="text-3xl font-bold text-secondary">{userStats.accuracy}%</div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-card border-accent/30">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Zap className="h-4 w-4" />
                        Win Streak
                      </div>
                      <div className="text-3xl font-bold text-accent">{userStats.winStreak}</div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-card border-border/50">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Trophy className="h-4 w-4" />
                        Predictions
                      </div>
                      <div className="text-3xl font-bold">{userStats.totalPredictions}</div>
                    </div>
                  </Card>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Recent Predictions */}
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Recent Predictions</h2>
                    <div className="space-y-4">
                      {recentPredictions.map((prediction) => (
                        <Card
                          key={prediction.id}
                          className="p-4 bg-card border-border/50 hover:border-primary/30 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="font-bold mb-1">{prediction.event}</div>
                              <div className="text-sm text-muted-foreground">{prediction.date}</div>
                            </div>
                            <Badge
                              className={
                                prediction.result === "won"
                                  ? "bg-success/20 text-success border-success/30"
                                  : "bg-destructive/20 text-destructive border-destructive/30"
                              }
                            >
                              {prediction.result}
                            </Badge>
                          </div>
                          <div className="flex justify-between text-sm">
                            <div>
                              <span className="text-muted-foreground">Bet: </span>
                              <span className="font-bold">${prediction.amount}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Payout: </span>
                              <span
                                className={`font-bold ${prediction.result === "won" ? "text-success" : "text-muted-foreground"}`}
                              >
                                ${prediction.payout}
                              </span>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Achievements */}
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Achievements</h2>
                    <div className="grid grid-cols-2 gap-4">
                      {achievements.map((achievement, index) => (
                        <Card
                          key={index}
                          className={`p-4 text-center ${achievement.unlocked ? "bg-card border-primary/30" : "bg-card/50 border-border/30 opacity-50"}`}
                        >
                          <div
                            className={`h-12 w-12 rounded-xl mx-auto mb-3 flex items-center justify-center ${achievement.unlocked ? "bg-gradient-primary neon-glow" : "bg-muted"}`}
                          >
                            <achievement.icon
                              className={`h-6 w-6 ${achievement.unlocked ? "text-white" : "text-muted-foreground"}`}
                            />
                          </div>
                          <div className="text-sm font-medium">{achievement.name}</div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {userStats.isCreator && (
                <TabsContent value="creator" className="space-y-8">
                  {/* Creator Stats Grid */}
                  <div className="grid md:grid-cols-4 gap-6">
                    <Card className="p-6 bg-card border-primary/30">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <DollarSign className="h-4 w-4" />
                          Stream Earnings
                        </div>
                        <div className="text-3xl font-bold text-success">
                          ${userStats.streamEarnings.toLocaleString()}
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6 bg-card border-secondary/30">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <Users className="h-4 w-4" />
                          Followers
                        </div>
                        <div className="text-3xl font-bold text-secondary">{userStats.followers.toLocaleString()}</div>
                      </div>
                    </Card>

                    <Card className="p-6 bg-card border-accent/30">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <Eye className="h-4 w-4" />
                          Avg Viewers
                        </div>
                        <div className="text-3xl font-bold text-accent">{userStats.avgViewers.toLocaleString()}</div>
                      </div>
                    </Card>

                    <Card className="p-6 bg-card border-border/50">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <Video className="h-4 w-4" />
                          Total Streams
                        </div>
                        <div className="text-3xl font-bold">{userStats.totalStreams}</div>
                      </div>
                    </Card>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Streaming History */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Streaming History</h2>
                        <Button variant="outline" size="sm" className="border-primary/30 bg-transparent">
                          <BarChart3 className="mr-2 h-4 w-4" />
                          Analytics
                        </Button>
                      </div>
                      <div className="space-y-4">
                        {streamingHistory.map((stream) => (
                          <Card
                            key={stream.id}
                            className="p-4 bg-card border-border/50 hover:border-primary/30 transition-colors"
                          >
                            <div className="space-y-3">
                              <div>
                                <div className="font-bold mb-1">{stream.title}</div>
                                <div className="text-sm text-muted-foreground">{stream.date}</div>
                              </div>
                              <div className="flex justify-between text-sm pt-3 border-t border-border/50">
                                <div>
                                  <span className="text-muted-foreground">Viewers: </span>
                                  <span className="font-bold">{stream.viewers.toLocaleString()}</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Earned: </span>
                                  <span className="font-bold text-success">${stream.earnings}</span>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Creator Tools */}
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold">Creator Tools</h2>
                      <div className="space-y-4">
                        <Card className="p-6 bg-gradient-to-br from-primary/20 to-card border-primary/30 hover:neon-glow transition-all cursor-pointer">
                          <div className="flex items-start gap-4">
                            <div className="h-12 w-12 rounded-xl bg-gradient-primary neon-glow flex items-center justify-center">
                              <Video className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold mb-1">Start Streaming</h3>
                              <p className="text-sm text-muted-foreground">Go live and create prediction markets</p>
                            </div>
                          </div>
                        </Card>

                        <Card className="p-6 bg-card border-border/50 hover:border-secondary/30 transition-all cursor-pointer">
                          <div className="flex items-start gap-4">
                            <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center">
                              <BarChart3 className="h-6 w-6 text-background" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold mb-1">View Analytics</h3>
                              <p className="text-sm text-muted-foreground">Track your performance and earnings</p>
                            </div>
                          </div>
                        </Card>

                        <Card className="p-6 bg-card border-border/50 hover:border-accent/30 transition-all cursor-pointer">
                          <div className="flex items-start gap-4">
                            <div className="h-12 w-12 rounded-xl bg-gradient-alt flex items-center justify-center">
                              <Users className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold mb-1">Manage Community</h3>
                              <p className="text-sm text-muted-foreground">Engage with your followers</p>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <EditProfileDialog open={editProfileOpen} onOpenChange={setEditProfileOpen} />
    </div>
  )
}
