"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, MessageSquare, BarChart3, TrendingUp, AlertTriangle, Lightbulb, Send, Loader2, Sparkles, Zap } from 'lucide-react'

const predefinedInsights = [
  {
    id: "crop-yield",
    title: "Predict Crop Yield",
    description: "Forecast agricultural production based on weather, soil, and historical data",
    category: "Agriculture",
    icon: "🌾",
    gradient: "from-green-500/20 to-emerald-500/20"
  },
  {
    id: "malaria-outbreak",
    title: "Forecast Malaria Outbreak",
    description: "Predict disease outbreak patterns using climate and health surveillance data",
    category: "Health",
    icon: "🦟",
    gradient: "from-red-500/20 to-pink-500/20"
  },
  {
    id: "education-anomaly",
    title: "Detect Education Anomalies",
    description: "Identify unusual patterns in student enrollment and performance data",
    category: "Education",
    icon: "📚",
    gradient: "from-blue-500/20 to-cyan-500/20"
  },
  {
    id: "climate-trend",
    title: "Analyze Climate Trends",
    description: "Examine long-term climate patterns and predict future changes",
    category: "Climate",
    icon: "🌡️",
    gradient: "from-teal-500/20 to-green-500/20"
  },
  {
    id: "economic-forecast",
    title: "Economic Forecasting",
    description: "Predict economic indicators and market trends",
    category: "Economics",
    icon: "📈",
    gradient: "from-purple-500/20 to-indigo-500/20"
  },
  {
    id: "population-growth",
    title: "Population Growth Analysis",
    description: "Analyze demographic trends and predict population changes",
    category: "Demographics",
    icon: "👥",
    gradient: "from-orange-500/20 to-red-500/20"
  }
]

const mockDatasets = [
  { id: "1", name: "Kenya Agricultural Production 2020-2023" },
  { id: "2", name: "West Africa Malaria Surveillance Data" },
  { id: "3", name: "South African Education Statistics 2023" },
  { id: "4", name: "East Africa Climate Change Indicators" },
  { id: "5", name: "Nigeria Population Demographics 2023" },
  { id: "6", name: "Ghana Economic Indicators 2020-2023" }
]

export default function InsightsPage() {
  const [selectedDataset, setSelectedDataset] = useState("")
  const [selectedInsight, setSelectedInsight] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedInsight, setGeneratedInsight] = useState<any>(null)
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([])
  const [chatInput, setChatInput] = useState("")
  const [isChatLoading, setIsChatLoading] = useState(false)

  const handleGenerateInsight = async () => {
    if (!selectedDataset || !selectedInsight) return
    
    setIsGenerating(true)
    
    // Simulate AI processing
    setTimeout(() => {
      const insight = predefinedInsights.find(i => i.id === selectedInsight)
      setGeneratedInsight({
        title: insight?.title,
        summary: "Based on the analysis of your dataset, here are the key findings:",
        findings: [
          "Crop yield is expected to increase by 15% in the next growing season",
          "Rainfall patterns show a 23% increase compared to historical averages",
          "Temperature variations are within optimal range for selected crops",
          "Soil moisture levels indicate favorable growing conditions"
        ],
        confidence: 87,
        recommendations: [
          "Consider expanding cultivation area by 10-15%",
          "Implement water conservation measures during peak season",
          "Monitor soil nutrients and apply fertilizers as needed"
        ]
      })
      setIsGenerating(false)
    }, 3000)
  }

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    const userMessage = chatInput.trim()
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setChatInput("")
    setIsChatLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Based on the agricultural data from Kenya, I can see that maize production has increased by 12% over the past three years, primarily due to improved rainfall patterns and better farming techniques.",
        "The malaria surveillance data shows a concerning trend in West Africa, with cases increasing by 8% during the rainy season. This correlates with higher mosquito breeding activity.",
        "Education enrollment data indicates that rural areas in South Africa have seen a 15% improvement in school attendance, likely due to infrastructure investments.",
        "Climate data reveals that East Africa is experiencing more frequent extreme weather events, with temperatures rising 0.3°C above historical averages."
      ]
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      setChatMessages(prev => [...prev, { role: 'assistant', content: randomResponse }])
      setIsChatLoading(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-green-900/20" />
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-purple-400/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <Badge 
            variant="secondary" 
            className="mb-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-300 px-4 py-2 backdrop-blur-sm"
          >
            <Brain className="w-4 h-4 mr-2" />
            AI-Powered Analysis
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              AI
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-600 bg-clip-text text-transparent">
              Insights
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Generate intelligent insights from your datasets using AI-powered analysis tools.
          </p>
        </div>

        <Tabs defaultValue="structured" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-white/10 backdrop-blur-sm">
            <TabsTrigger 
              value="structured" 
              className="flex items-center data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Structured Insights
            </TabsTrigger>
            <TabsTrigger 
              value="chat" 
              className="flex items-center data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Ask AI
            </TabsTrigger>
          </TabsList>

          {/* Structured Insights Tab */}
          <TabsContent value="structured" className="space-y-8">
            {/* Dataset Selection */}
            <Card className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Select Dataset</CardTitle>
                <CardDescription className="text-gray-400">
                  Choose a dataset to analyze and generate insights from.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedDataset} onValueChange={setSelectedDataset}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Choose a dataset..." />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/10 text-white">
                    {mockDatasets.map(dataset => (
                      <SelectItem key={dataset.id} value={dataset.id} className="focus:bg-white/10">
                        {dataset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Insight Types */}
            <Card className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Choose Insight Type</CardTitle>
                <CardDescription className="text-gray-400">
                  Select the type of analysis you want to perform on your dataset.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {predefinedInsights.map(insight => (
                    <div
                      key={insight.id}
                      className={`group p-6 border rounded-xl cursor-pointer transition-all duration-300 ${
                        selectedInsight === insight.id
                          ? 'border-purple-500 bg-gradient-to-br from-purple-500/20 to-pink-500/20'
                          : 'border-white/20 bg-gradient-to-br from-white/5 to-white/10 hover:border-white/30'
                      }`}
                      onClick={() => setSelectedInsight(insight.id)}
                    >
                      <div className="flex items-center mb-3">
                        <span className="text-3xl mr-3">{insight.icon}</span>
                        <div>
                          <h3 className="font-medium text-white group-hover:text-purple-300 transition-colors">{insight.title}</h3>
                          <Badge variant="secondary" className="text-xs mt-1 bg-white/10 text-gray-300 border-white/20">
                            {insight.category}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400">{insight.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleGenerateInsight}
                disabled={!selectedDataset || !selectedInsight || isGenerating}
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-4 text-lg rounded-full disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Generating Insights...
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5 mr-2" />
                    Generate AI Insights
                  </>
                )}
              </Button>
            </div>

            {/* Generated Insights */}
            {generatedInsight && (
              <Card className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Lightbulb className="h-5 w-5 mr-2 text-yellow-400" />
                    {generatedInsight.title}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    AI-generated insights from your selected dataset
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Summary */}
                  <div>
                    <h4 className="font-medium text-white mb-2">Summary</h4>
                    <p className="text-gray-300">{generatedInsight.summary}</p>
                  </div>

                  {/* Confidence Score */}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-white/10">
                    <span className="font-medium text-white">Confidence Score</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-700 rounded-full h-2 mr-3">
                        <div
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                          style={{ width: `${generatedInsight.confidence}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-green-400">{generatedInsight.confidence}%</span>
                    </div>
                  </div>

                  {/* Key Findings */}
                  <div>
                    <h4 className="font-medium text-white mb-3 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Key Findings
                    </h4>
                    <ul className="space-y-2">
                      {generatedInsight.findings.map((finding: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-300">{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4 className="font-medium text-white mb-3 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Recommendations
                    </h4>
                    <ul className="space-y-2">
                      {generatedInsight.recommendations.map((rec: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-300">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-white/10">
                    <Button variant="outline" className="bg-white/5 border-white/20 text-gray-300 hover:bg-white/10">
                      Download Report
                    </Button>
                    <Button variant="outline" className="bg-white/5 border-white/20 text-gray-300 hover:bg-white/10">
                      Share Insights
                    </Button>
                    <Button variant="outline" className="bg-white/5 border-white/20 text-gray-300 hover:bg-white/10">
                      Export Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-8">
            <Card className="h-[600px] flex flex-col bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Ask AI About Your Data
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Have a conversation with AI to explore your datasets and get insights through natural language queries.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-black/20 rounded-lg border border-white/10">
                  {chatMessages.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">
                      <Brain className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                      <p className="text-lg font-medium mb-2 text-white">Start a conversation with AI</p>
                      <p className="text-sm">
                        Ask questions like "Which region had the worst drought?" or "Compare student enrollment trends"
                      </p>
                    </div>
                  ) : (
                    <>
                      {chatMessages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-lg ${
                              message.role === 'user'
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                                : 'bg-white/10 border border-white/20 text-gray-100'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                          </div>
                        </div>
                      ))}
                      {isChatLoading && (
                        <div className="flex justify-start">
                          <div className="bg-white/10 border border-white/20 p-3 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span className="text-sm text-gray-300">AI is thinking...</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Chat Input */}
                <form onSubmit={handleChatSubmit} className="flex gap-2">
                  <Textarea
                    placeholder="Ask a question about your data..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 min-h-[60px] resize-none bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-purple-500/50"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleChatSubmit(e)
                      }
                    }}
                  />
                  <Button
                    type="submit"
                    disabled={!chatInput.trim() || isChatLoading}
                    className="self-end bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>

                {/* Example Questions */}
                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-2">Try asking:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Which region had the highest crop yield?",
                      "Compare malaria cases between 2022 and 2023",
                      "What are the education trends in rural areas?",
                      "Predict climate patterns for next year"
                    ].map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs bg-white/5 border-white/20 text-gray-300 hover:bg-white/10"
                        onClick={() => setChatInput(question)}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
