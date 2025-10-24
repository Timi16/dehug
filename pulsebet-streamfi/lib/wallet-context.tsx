"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface WalletContextType {
  connected: boolean
  publicKey: string | null
  balance: number
  connect: () => Promise<void>
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false)
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    // Check if wallet was previously connected
    const savedPublicKey = localStorage.getItem("walletPublicKey")
    if (savedPublicKey) {
      setPublicKey(savedPublicKey)
      setConnected(true)
      // Simulate balance fetch
      setBalance(Math.random() * 1000)
    }
  }, [])

  const connect = async () => {
    try {
      // Check if Phantom wallet is installed
      if (typeof window !== "undefined" && "solana" in window) {
        const provider = (window as any).solana
        if (provider?.isPhantom) {
          try {
            // Add timeout to prevent hanging
            const connectPromise = provider.connect({ onlyIfTrusted: false })
            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Connection timeout")), 10000),
            )

            const response = await Promise.race([connectPromise, timeoutPromise])
            const pubKey = (response as any).publicKey.toString()
            setPublicKey(pubKey)
            setConnected(true)
            localStorage.setItem("walletPublicKey", pubKey)

            // Simulate USDC balance fetch
            setBalance(Math.random() * 1000)
          } catch (connectError: any) {
            console.error("[v0] Wallet connection error:", connectError)

            // Handle CORS or origin mismatch errors gracefully
            if (connectError.message?.includes("origin") || connectError.message?.includes("CORS")) {
              alert(
                "Wallet connection may not work in preview mode. Please deploy to production for full wallet functionality.",
              )
            } else if (connectError.message === "Connection timeout") {
              alert("Wallet connection timed out. Please try again.")
            } else {
              alert("Failed to connect wallet. Please try again.")
            }
          }
        } else {
          alert("Please install Phantom wallet to continue")
          window.open("https://phantom.app/", "_blank")
        }
      } else {
        alert("Please install Phantom wallet to continue")
        window.open("https://phantom.app/", "_blank")
      }
    } catch (error) {
      console.error("[v0] Error connecting wallet:", error)
      alert("An error occurred while connecting to your wallet.")
    }
  }

  const disconnect = () => {
    setConnected(false)
    setPublicKey(null)
    setBalance(0)
    localStorage.removeItem("walletPublicKey")

    try {
      if (typeof window !== "undefined" && "solana" in window) {
        const provider = (window as any).solana
        if (provider?.isPhantom && provider.disconnect) {
          provider.disconnect()
        }
      }
    } catch (error) {
      console.error("[v0] Error disconnecting wallet:", error)
    }
  }

  return (
    <WalletContext.Provider value={{ connected, publicKey, balance, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
