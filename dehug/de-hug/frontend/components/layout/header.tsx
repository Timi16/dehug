"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Menu, Brain, Upload, Database, Wallet, Zap, User } from "lucide-react"
import ConnectWallet from "../ConnectWallet"


export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        scrolled ? "bg-slate-950/90 backdrop-blur-md border-b border-slate-800" : "bg-transparent"
      }`}
    >
      <div className="container flex h-20 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-3 group">
             <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Brain className="h-5 w-5 text-white" />
          </div>
            <span className="font-light text-2xl text-white">DeHug</span>
            <Badge variant="outline" className="hidden sm:inline-flex border-slate-600 text-slate-400 bg-slate-900/50">
              Enterprise
            </Badge>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent text-slate-300 hover:text-white hover:bg-slate-800/50 font-light">
                Platform
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-8 w-[500px] bg-slate-950/95 backdrop-blur-md border border-slate-800">
                  <NavigationMenuLink asChild>
                    <Link
                      href="/models"
                      className="flex items-center space-x-4 p-4 hover:bg-slate-800/30 transition-colors group"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Brain className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-white">AI Models</div>
                        <div className="text-sm text-slate-400 font-light">Enterprise-grade model repository</div>
                      </div>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/datasets"
                      className="flex items-center space-x-4 p-4 hover:bg-slate-800/30 transition-colors group"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Database className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-white">Datasets</div>
                        <div className="text-sm text-slate-400 font-light">Curated training data</div>
                      </div>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/playground"
                      className="flex items-center space-x-4 p-4 hover:bg-slate-800/30 transition-colors group"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Zap className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-white">Playground</div>
                        <div className="text-sm text-slate-400 font-light">Test models interactively</div>
                      </div>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/dashboard"
                      className="flex items-center space-x-4 p-4 hover:bg-slate-800/30 transition-colors group"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-white">Dashboard</div>
                        <div className="text-sm text-slate-400 font-light">Manage your AI assets</div>
                      </div>
                    </Link>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/upload" legacyBehavior passHref>
                <NavigationMenuLink className="group inline-flex h-12 w-max items-center justify-center px-6 py-2 text-sm font-light text-slate-300 transition-colors hover:bg-slate-800/50 hover:text-white focus:bg-slate-800/50 focus:text-white focus:outline-none">
                  Upload
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/docs" legacyBehavior passHref>
                <NavigationMenuLink className="group inline-flex h-12 w-max items-center justify-center px-6 py-2 text-sm font-light text-slate-300 transition-colors hover:bg-slate-800/50 hover:text-white focus:bg-slate-800/50 focus:text-white focus:outline-none">
                  Documentation
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex relative md:left-16 lg:left-18 items-center justify-end">
          {/* <Button
            variant="outline" 
            size="sm" 
            className="hidden sm:inline-flex border-slate-600 text-slate-300 hover:bg-slate-800/50 font-light"
          >
            <Wallet className="h-4 w-4 mr-2" />
            Connect Wallet
          </Button> */}
  
          <ConnectWallet />

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden text-slate-300 hover:text-white hover:bg-slate-800/50"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[350px] bg-slate-950/95 backdrop-blur-md border-l border-slate-800">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <SheetDescription className="sr-only">Mobile navigation menu for DeHug platform</SheetDescription>
              <div className="flex flex-col space-y-6 mt-12">
                <Link
                  href="/models"
                  className="flex items-center space-x-4 p-4 hover:bg-slate-800/30 transition-colors group"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-white font-light">AI Models</span>
                </Link>
                <Link
                  href="/datasets"
                  className="flex items-center space-x-4 p-4 hover:bg-slate-800/30 transition-colors group"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
                    <Database className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-white font-light">Datasets</span>
                </Link>
                <Link
                  href="/playground"
                  className="flex items-center space-x-4 p-4 hover:bg-slate-800/30 transition-colors group"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-white font-light">Playground</span>
                </Link>
                <Link
                  href="/upload"
                  className="flex items-center space-x-4 p-4 hover:bg-slate-800/30 transition-colors group"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
                    <Upload className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-white font-light">Upload</span>
                </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-4 p-4 hover:bg-slate-800/30 transition-colors group"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-white font-light">Dashboard</span>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
