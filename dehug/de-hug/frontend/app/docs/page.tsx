"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Book, Code, Download, Upload, Brain, Database, Zap, ArrowRight, Copy, CheckCircle, ExternalLink, Terminal, FileText, Cpu, Shield } from 'lucide-react'

const quickStartSteps = [
  {
    title: "Install DeHug SDK",
    description: "Get started with our Python SDK for seamless integration",
    code: "pip install dehug",
    icon: Download
  },
  {
    title: "Load a Model",
    description: "Access any model from our decentralized repository",
    code: `from dehug import DeHugRepository

model = DeHugRepository.load_model("openai-community/gpt2-small")`,
    icon: Brain
  },
  {
    title: "Load a Dataset",
    description: "Access training data stored on IPFS",
    code: `dataset = DeHugRepository.load_dataset("common-crawl/web-text")
train_data = dataset["train"]`,
    icon: Database
  },
  {
    title: "Upload & Earn",
    description: "Upload your own models/datasets and mint NFTs",
    code: `nft_id = DeHugRepository.upload_model(
    model_path="./my-model",
    model_card="README.md"
)`,
    icon: Upload
  }
]

const apiExamples = [
  {
    title: "Model Loading",
    description: "Load and use models from the decentralized network",
    code: `from dehug import DeHugRepository
from transformers import pipeline

# Load model from DeHug
model = DeHugRepository.load_model("microsoft/DialoGPT-medium")

# Use with transformers pipeline
generator = pipeline("text-generation", model=model)
output = generator("Hello, how are you?", max_length=50)
print(output)`
  },
  {
    title: "Dataset Processing",
    description: "Access and process large-scale datasets",
    code: `from dehug import DeHugRepository

# Load dataset
dataset = DeHugRepository.load_dataset("squad", split="train")

# Process samples
for sample in dataset:
    question = sample["question"]
    context = sample["context"]
    answer = sample["answers"]["text"][0]
    
    # Your processing logic here
    process_sample(question, context, answer)`
  },
  {
    title: "Model Upload",
    description: "Upload your trained models and mint NFTs",
    code: `from dehug import DeHugRepository

# Upload model and mint NFT
nft_details = DeHugRepository.upload_model(
    model_path="./my-fine-tuned-model",
    model_card="model_card.md",
    license="apache-2.0",
    tags=["nlp", "text-generation", "fine-tuned"],
    description="Fine-tuned model for creative writing"
)

print(f"NFT minted: {nft_details['token_id']}")
print(f"IPFS hash: {nft_details['ipfs_hash']}")`
  },
  {
    title: "Dataset Upload",
    description: "Share your datasets with the community",
    code: `from dehug import DeHugRepository

# Upload dataset and mint NFT
nft_details = DeHugRepository.upload_dataset(
    data_path="./my-dataset",
    dataset_card="README.md",
    license="cc-by-4.0",
    tags=["nlp", "text-classification"],
    description="Curated dataset for sentiment analysis"
)

print(f"Dataset NFT: {nft_details['token_id']}")
print(f"Initial value: {nft_details['initial_value']} ETH")`
  }
]

const guides = [
  {
    title: "Getting Started",
    description: "Complete guide to using DeHug for the first time",
    category: "Basics",
    readTime: "5 min",
    icon: Book
  },
  {
    title: "Model Management",
    description: "How to upload, version, and manage your AI models",
    category: "Models",
    readTime: "10 min",
    icon: Brain
  },
  {
    title: "Dataset Handling",
    description: "Best practices for dataset upload and organization",
    category: "Datasets",
    readTime: "8 min",
    icon: Database
  },
  {
    title: "NFT Rewards System",
    description: "Understanding how NFT values increase with usage",
    category: "NFTs",
    readTime: "6 min",
    icon: Zap
  },
  {
    title: "IPFS Integration",
    description: "How decentralized storage works in DeHug",
    category: "Infrastructure",
    readTime: "12 min",
    icon: Shield
  },
  {
    title: "API Reference",
    description: "Complete SDK documentation and examples",
    category: "Development",
    readTime: "15 min",
    icon: Code
  }
]

export default function DocsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const filteredGuides = guides.filter(guide =>
    guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 text-white">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-16 text-center">
          <Badge 
            variant="outline" 
            className="mb-6 border-slate-600 text-slate-300 px-4 py-2 backdrop-blur-sm bg-slate-900/50"
          >
            <Book className="w-4 h-4 mr-2" />
            Developer Documentation
          </Badge>
          <h1 className="text-5xl md:text-7xl font-light mb-6 leading-none">
            <span className="text-white">
              Build with
            </span>
            <br />
            <span className="text-slate-400 font-thin">
              DeHug
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
            Complete documentation for integrating decentralized AI models and datasets 
            into your applications. Start building the future of AI today.
          </p>
        </div>

        <Tabs defaultValue="quickstart" className="space-y-12">
          <TabsList className="grid w-full grid-cols-4 bg-slate-900/30 border border-slate-800">
            <TabsTrigger value="quickstart" className="data-[state=active]:bg-white data-[state=active]:text-black font-light">Quick Start</TabsTrigger>
            <TabsTrigger value="api" className="data-[state=active]:bg-white data-[state=active]:text-black font-light">API Reference</TabsTrigger>
            <TabsTrigger value="guides" className="data-[state=active]:bg-white data-[state=active]:text-black font-light">Guides</TabsTrigger>
            <TabsTrigger value="examples" className="data-[state=active]:bg-white data-[state=active]:text-black font-light">Examples</TabsTrigger>
          </TabsList>

          {/* Quick Start Tab */}
          <TabsContent value="quickstart" className="space-y-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-light text-white mb-4">Get Started in Minutes</h2>
              <p className="text-xl text-slate-300 font-light">
                Follow these simple steps to start using DeHug in your projects
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {quickStartSteps.map((step, index) => (
                <Card key={index} className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
                  <CardHeader>
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-slate-800/50 border border-slate-700 flex items-center justify-center mr-4">
                        <step.icon className="h-6 w-6 text-slate-400" />
                      </div>
                      <div>
                        <Badge variant="outline" className="border-slate-700 text-slate-300 bg-slate-800/30 mb-2">
                          Step {index + 1}
                        </Badge>
                        <CardTitle className="text-white font-light text-xl">{step.title}</CardTitle>
                      </div>
                    </div>
                    <CardDescription className="text-slate-400 font-light">
                      {step.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-slate-950/50 border border-slate-800 p-4 relative">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 text-slate-400 hover:text-white"
                        onClick={() => copyToClipboard(step.code, `step-${index}`)}
                      >
                        {copiedCode === `step-${index}` ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      <pre className="text-slate-300 text-sm font-mono overflow-x-auto pr-8">
                        <code>{step.code}</code>
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Installation */}
            <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
              <CardHeader>
                <CardTitle className="text-white font-light text-2xl">Installation</CardTitle>
                <CardDescription className="text-slate-400 font-light">
                  Install the DeHug SDK using pip or conda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-white font-light mb-3">Using pip:</h4>
                  <div className="bg-slate-950/50 border border-slate-800 p-4 relative">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 text-slate-400 hover:text-white"
                      onClick={() => copyToClipboard("pip install dehug", "pip-install")}
                    >
                      {copiedCode === "pip-install" ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <pre className="text-slate-300 text-sm font-mono">
                      <code>pip install dehug</code>
                    </pre>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-light mb-3">Using conda:</h4>
                  <div className="bg-slate-950/50 border border-slate-800 p-4 relative">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 text-slate-400 hover:text-white"
                      onClick={() => copyToClipboard("conda install -c dehug dehug", "conda-install")}
                    >
                      {copiedCode === "conda-install" ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <pre className="text-slate-300 text-sm font-mono">
                      <code>conda install -c dehug dehug</code>
                    </pre>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-light mb-3">Development version:</h4>
                  <div className="bg-slate-950/50 border border-slate-800 p-4 relative">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 text-slate-400 hover:text-white"
                      onClick={() => copyToClipboard("pip install git+https://github.com/dehug/dehug.git", "dev-install")}
                    >
                      {copiedCode === "dev-install" ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <pre className="text-slate-300 text-sm font-mono">
                      <code>pip install git+https://github.com/dehug/dehug.git</code>
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Reference Tab */}
          <TabsContent value="api" className="space-y-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-light text-white mb-4">API Reference</h2>
              <p className="text-xl text-slate-300 font-light">
                Complete reference for the DeHug SDK
              </p>
            </div>

            <div className="space-y-8">
              {apiExamples.map((example, index) => (
                <Card key={index} className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white font-light text-xl">{example.title}</CardTitle>
                    <CardDescription className="text-slate-400 font-light">
                      {example.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-slate-950/50 border border-slate-800 p-4 relative">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-slate-400 text-sm ml-4 font-light">example.py</span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-slate-400 hover:text-white"
                          onClick={() => copyToClipboard(example.code, `api-${index}`)}
                        >
                          {copiedCode === `api-${index}` ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <pre className="text-slate-300 text-sm leading-relaxed font-mono overflow-x-auto">
                        <code>{example.code}</code>
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Guides Tab */}
          <TabsContent value="guides" className="space-y-12">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl font-light text-white mb-4">Documentation Guides</h2>
                <p className="text-xl text-slate-300 font-light">
                  In-depth guides and tutorials for mastering DeHug
                </p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search guides..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-900/30 border-slate-700 text-white placeholder:text-slate-400 focus:border-slate-500 w-80"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGuides.map((guide, index) => (
                <Card key={index} className="bg-slate-900/20 backdrop-blur-sm border-slate-800 hover:border-slate-600 transition-all duration-300 cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-slate-800/50 border border-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <guide.icon className="h-6 w-6 text-slate-400" />
                      </div>
                      <Badge variant="outline" className="border-slate-700 text-slate-300 bg-slate-800/30 text-xs">
                        {guide.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-white font-light text-lg group-hover:text-slate-200 transition-colors">
                      {guide.title}
                    </CardTitle>
                    <CardDescription className="text-slate-400 font-light">
                      {guide.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500 font-light">{guide.readTime} read</span>
                      <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Examples Tab */}
          <TabsContent value="examples" className="space-y-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-light text-white mb-4">Code Examples</h2>
              <p className="text-xl text-slate-300 font-light">
                Real-world examples and use cases
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white font-light text-xl">Text Generation App</CardTitle>
                  <CardDescription className="text-slate-400 font-light">
                    Build a text generation application using DeHug models
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="border-slate-700 text-slate-300 bg-slate-800/30">
                        Python • Flask
                      </Badge>
                      <Button size="sm" variant="outline" className="bg-slate-800/30 border-slate-700 text-slate-300 hover:bg-slate-700/50">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View on GitHub
                      </Button>
                    </div>
                    <p className="text-slate-400 text-sm font-light">
                      Complete Flask application that uses DeHug to load GPT models and generate text based on user prompts.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white font-light text-xl">Dataset Analysis Tool</CardTitle>
                  <CardDescription className="text-slate-400 font-light">
                    Analyze large datasets with automated insights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="border-slate-700 text-slate-300 bg-slate-800/30">
                        Python • Streamlit
                      </Badge>
                      <Button size="sm" variant="outline" className="bg-slate-800/30 border-slate-700 text-slate-300 hover:bg-slate-700/50">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View on GitHub
                      </Button>
                    </div>
                    <p className="text-slate-400 text-sm font-light">
                      Streamlit dashboard for exploring datasets from DeHug with automated statistical analysis and visualizations.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white font-light text-xl">NFT Trading Bot</CardTitle>
                  <CardDescription className="text-slate-400 font-light">
                    Automated trading based on model performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="border-slate-700 text-slate-300 bg-slate-800/30">
                        Python • Web3
                      </Badge>
                      <Button size="sm" variant="outline" className="bg-slate-800/30 border-slate-700 text-slate-300 hover:bg-slate-700/50">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View on GitHub
                      </Button>
                    </div>
                    <p className="text-slate-400 text-sm font-light">
                      Smart trading bot that monitors model NFT values and executes trades based on performance metrics and community engagement.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white font-light text-xl">Model Comparison Tool</CardTitle>
                  <CardDescription className="text-slate-400 font-light">
                    Compare performance across multiple models
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="border-slate-700 text-slate-300 bg-slate-800/30">
                        Python • Jupyter
                      </Badge>
                      <Button size="sm" variant="outline" className="bg-slate-800/30 border-slate-700 text-slate-300 hover:bg-slate-700/50">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View on GitHub
                      </Button>
                    </div>
                    <p className="text-slate-400 text-sm font-light">
                      Jupyter notebook for benchmarking and comparing multiple models from DeHug across various tasks and metrics.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Support Section */}
        <div className="mt-20 text-center">
          <Card className="bg-slate-900/20 backdrop-blur-sm border-slate-800 p-12">
            <h3 className="text-3xl font-light text-white mb-6">Need Help?</h3>
            <p className="text-xl text-slate-300 mb-8 font-light">
              Join our community or reach out for support
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" className="bg-slate-800/30 border-slate-700 text-slate-300 hover:bg-slate-700/50 font-light">
                <ExternalLink className="h-4 w-4 mr-2" />
                Join Discord
              </Button>
              <Button variant="outline" className="bg-slate-800/30 border-slate-700 text-slate-300 hover:bg-slate-700/50 font-light">
                <ExternalLink className="h-4 w-4 mr-2" />
                GitHub Issues
              </Button>
              <Button className="bg-white text-black hover:bg-slate-100 font-medium">
                <ExternalLink className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
