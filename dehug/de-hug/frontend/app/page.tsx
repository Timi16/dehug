"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Brain,
  Globe,
  Users,
  BarChart3,
  Upload,
  Search,
  Cpu,
  Shield,
  Zap,
  TrendingUp,
  Play,
  ChevronDown,
  Database,
  Code,
  FileText,
  CheckCircle,
  Coins,
  Trophy,
  Download,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const features = [
    {
      icon: Database,
      title: "Decentralized Repository",
      description:
        "Host models and datasets on IPFS with permanent, censorship-resistant access. No single point of failure.",
      gradient: "from-slate-600 to-slate-800",
    },
    {
      icon: Code,
      title: "Developer SDK",
      description:
        "Access models and datasets programmatically with our Python SDK. Compatible with transformers library.",
      gradient: "from-gray-600 to-gray-800",
    },
    {
      icon: Coins,
      title: "NFT Rewards",
      description:
        "Earn NFTs for contributions. Value increases with downloads and community engagement.",
      gradient: "from-zinc-600 to-zinc-800",
    },
    {
      icon: Shield,
      title: "Immutable Metadata",
      description:
        "Model cards, licenses, and provenance stored permanently on blockchain for transparency.",
      gradient: "from-stone-600 to-stone-800",
    },
  ];

  const stats = [
    { value: "12.5K", label: "Models", icon: Brain },
    { value: "8.2K", label: "Datasets", icon: Database },
    { value: "3.4K", label: "Contributors", icon: Users },
    { value: "156M", label: "Downloads", icon: Download },
  ];

  const codeExample = `from dehug import DeHugRepository

# Load model from decentralized storage
model = DeHugRepository.load_model("microsoft/DialoGPT-medium")

# Load dataset
dataset = DeHugRepository.load_dataset("squad", split="train")

# Upload your model and mint NFT
nft_id = DeHugRepository.upload_model(
    model_path="./my-model",
    model_card="model_card.md",
    license="apache-2.0"
)`;

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative bottom-16 min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 text-white overflow-hidden">
      {/* Subtle Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div
          className="absolute inset-0 opacity-20 transition-opacity duration-700"
          style={{
            background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(148, 163, 184, 0.1), transparent 40%)`,
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 px-4 py-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <div
              className={`transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <Badge
                variant="outline"
                className="mb-8 border-slate-600 text-slate-300 px-6 py-2 text-sm font-medium backdrop-blur-sm bg-slate-900/50"
              >
                The Decentralized Hugging Face
              </Badge>

              <h1 className="text-6xl md:text-8xl font-light tracking-tight mb-8 leading-none">
                <span className="text-white font-extralight">DeHug</span>
                <br />
                <span className="text-slate-400 font-thin text-4xl md:text-5xl">
                  Decentralized ML Hub
                </span>
              </h1>

              <p className="mt-8 text-xl leading-8 text-slate-300 max-w-4xl mx-auto font-light">
                Host, discover, and monetize machine learning models and
                datasets on a decentralized platform. Earn NFT rewards for your
                contributions to the AI community.
              </p>

              <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link href="/models">
                  <Button
                    size="lg"
                    className="group bg-white text-black hover:bg-slate-100 px-10 py-4 text-lg font-medium rounded-none transition-all duration-300 transform hover:scale-105"
                  >
                    Explore Models
                    <Search className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                <Link href="/upload">
                  <Button
                    variant="outline"
                    size="lg"
                    className="group border-slate-600 text-slate-300 hover:bg-slate-800/50 px-10 py-4 text-lg font-medium rounded-none transition-all duration-300 backdrop-blur-sm"
                  >
                    <Upload className="mr-3 h-5 w-5" />
                    Upload & Earn NFT
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div
              className={`mt-32 transition-all duration-1000 delay-300 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div key={stat.label} className="group cursor-pointer">
                    <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-800 p-8 transition-all duration-500 hover:border-slate-600 hover:bg-slate-800/30">
                      <stat.icon className="h-8 w-8 text-slate-400 mx-auto mb-4" />
                      <div className="text-4xl font-light text-white mb-2">
                        {stat.value}
                      </div>
                      <div className="text-slate-400 text-sm font-medium tracking-wide uppercase">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-32 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-6xl font-light mb-8 text-white">
              Why Choose
              <span className="block text-slate-400 font-thin">DeHug?</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
              The first decentralized ML platform with built-in monetization
              through NFT rewards
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group cursor-pointer"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="bg-slate-900/20 backdrop-blur-sm border border-slate-800 p-10 h-full transition-all duration-700 hover:border-slate-600 hover:bg-slate-800/20">
                  <div className="flex items-start space-x-6">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-2xl font-light text-white mb-4 group-hover:text-slate-200 transition-colors">
                        {feature.title}
                      </h3>

                      <p className="text-slate-400 leading-relaxed font-light">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Example Section */}
      <section className="relative z-10 py-32 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-light text-white mb-8">
                Developer
                <span className="block text-slate-400 font-thin">
                  Experience
                </span>
              </h2>
              <p className="text-xl text-slate-300 mb-12 font-light leading-relaxed">
                Familiar API compatible with Hugging Face transformers. Access
                decentralized models with the same simplicity.
              </p>

              <div className="space-y-6">
                <div className="flex items-center text-slate-300">
                  <CheckCircle className="h-6 w-6 mr-4 text-slate-400" />
                  <span className="font-light">
                    Compatible with transformers library
                  </span>
                </div>
                <div className="flex items-center text-slate-300">
                  <CheckCircle className="h-6 w-6 mr-4 text-slate-400" />
                  <span className="font-light">Automatic IPFS resolution</span>
                </div>
                <div className="flex items-center text-slate-300">
                  <CheckCircle className="h-6 w-6 mr-4 text-slate-400" />
                  <span className="font-light">
                    Built-in caching and optimization
                  </span>
                </div>
                <div className="flex items-center text-slate-300">
                  <CheckCircle className="h-6 w-6 mr-4 text-slate-400" />
                  <span className="font-light">NFT minting on upload</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-slate-950/50 border border-slate-800 p-6 backdrop-blur-sm">
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-slate-400 text-sm ml-4">
                    dehug_example.py
                  </span>
                </div>
                <pre className="text-slate-300 text-sm leading-relaxed font-mono">
                  <code>{codeExample}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NFT Rewards Section */}
      <section className="relative z-10 py-32 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-6xl font-light mb-8 text-white">
              Earn While You
              <span className="block text-slate-400 font-thin">Contribute</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto font-light">
              Get rewarded with NFTs that appreciate in value based on community
              engagement
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-slate-900/20 backdrop-blur-sm border border-slate-800 p-8 text-center transition-all duration-700 hover:border-slate-600">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-orange-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-light text-white mb-4">
                Upload Content
              </h3>
              <p className="text-slate-400 font-light leading-relaxed">
                Upload models or datasets and automatically receive a unique NFT
                representing your contribution.
              </p>
            </div>

            <div className="bg-slate-900/20 backdrop-blur-sm border border-slate-800 p-8 text-center transition-all duration-700 hover:border-slate-600">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-light text-white mb-4">
                Gain Popularity
              </h3>
              <p className="text-slate-400 font-light leading-relaxed">
                As your models get downloaded and used, your NFT value increases
                automatically.
              </p>
            </div>

            <div className="bg-slate-900/20 backdrop-blur-sm border border-slate-800 p-8 text-center transition-all duration-700 hover:border-slate-600">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-light text-white mb-4">
                Earn Rewards
              </h3>
              <p className="text-slate-400 font-light leading-relaxed">
                Trade your NFTs or earn ongoing royalties from your popular
                contributions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="bg-slate-900/20 backdrop-blur-sm border border-slate-800 p-16 md:p-24">
            <h2 className="text-5xl md:text-6xl font-light mb-8 text-white">
              Start Building
            </h2>

            <p className="text-xl text-slate-300 mb-16 max-w-2xl mx-auto font-light leading-relaxed">
              Join thousands of developers building the future of decentralized
              AI. Upload your first model and start earning.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/upload">
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-slate-100 px-10 py-4 text-lg font-medium rounded-none transition-all duration-300 transform hover:scale-105"
                >
                  Upload Model
                  <Upload className="ml-3 h-5 w-5" />
                </Button>
              </Link>

              <Link href="/models">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800/50 px-10 py-4 text-lg font-medium rounded-none transition-all duration-300 backdrop-blur-sm"
                >
                  Browse Models
                  <Search className="ml-3 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
