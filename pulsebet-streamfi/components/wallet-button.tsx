"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Wallet, LogOut, Copy, ExternalLink } from "lucide-react"
import { useWallet } from "@/lib/wallet-context"
import { useState } from "react"

export function WalletButton() {
  const { connected, publicKey, balance, connect, disconnect } = useWallet()
  const [copied, setCopied] = useState(false)

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  if (!connected) {
    return (
      <Button onClick={connect} className="bg-gradient-primary neon-glow hover:opacity-90 transition-opacity">
        <Wallet className="mr-2 h-4 w-4" />
        Connect Wallet
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-gradient-primary neon-glow hover:opacity-90 transition-opacity">
          <Wallet className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">{formatAddress(publicKey!)}</span>
          <span className="sm:hidden">Wallet</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-card border-border/50">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-medium leading-none">Your Wallet</p>
            <p className="text-xs leading-none text-muted-foreground font-mono">{formatAddress(publicKey!)}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border/50" />
        <div className="px-2 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">USDC Balance</span>
            <span className="text-sm font-bold text-success">${balance.toFixed(2)}</span>
          </div>
        </div>
        <DropdownMenuSeparator className="bg-border/50" />
        <DropdownMenuItem onClick={copyAddress} className="cursor-pointer hover:bg-muted">
          <Copy className="mr-2 h-4 w-4" />
          <span>{copied ? "Copied!" : "Copy Address"}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => window.open(`https://solscan.io/account/${publicKey}`, "_blank")}
          className="cursor-pointer hover:bg-muted"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          <span>View on Solscan</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-border/50" />
        <DropdownMenuItem onClick={disconnect} className="cursor-pointer hover:bg-destructive/20 text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Disconnect</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
