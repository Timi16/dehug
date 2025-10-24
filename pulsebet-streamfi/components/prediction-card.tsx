"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useWallet } from "@/lib/wallet-context"

interface PredictionCardProps {
  title: string
  yesOdds: number
  noOdds: number
  pool: number
}

export function PredictionCard({ title, yesOdds, noOdds, pool }: PredictionCardProps) {
  const { connected, balance, connect } = useWallet()
  const [amount, setAmount] = useState("")
  const [selectedSide, setSelectedSide] = useState<"yes" | "no" | null>(null)

  const handlePredict = async (side: "yes" | "no") => {
    if (!connected) {
      await connect()
      return
    }

    if (!amount || Number.parseFloat(amount) <= 0) {
      alert("Please enter a valid amount")
      return
    }

    if (Number.parseFloat(amount) > balance) {
      alert("Insufficient USDC balance")
      return
    }

    setSelectedSide(side)
    // Simulate prediction transaction
    console.log(`[v0] Placing ${side.toUpperCase()} prediction for $${amount}`)
    alert(`Prediction placed: ${side.toUpperCase()} for $${amount} USDC`)
  }

  return (
    <Card className="p-6 bg-card border-border/50 space-y-4">
      <div>
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <div className="text-sm text-muted-foreground">Pool: ${pool.toLocaleString()} USDC</div>
      </div>

      {connected && (
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Amount (USDC)</label>
          <Input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-background border-border/50"
          />
          <div className="text-xs text-muted-foreground">Balance: ${balance.toFixed(2)} USDC</div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={() => handlePredict("yes")}
          className="h-auto py-4 flex-col gap-2 bg-success/20 hover:bg-success/30 border border-success/30 neon-glow"
        >
          <span className="text-lg font-bold text-success">YES</span>
          <span className="text-sm text-muted-foreground">{yesOdds}x</span>
        </Button>
        <Button
          onClick={() => handlePredict("no")}
          className="h-auto py-4 flex-col gap-2 bg-destructive/20 hover:bg-destructive/30 border border-destructive/30"
        >
          <span className="text-lg font-bold text-destructive">NO</span>
          <span className="text-sm text-muted-foreground">{noOdds}x</span>
        </Button>
      </div>
    </Card>
  )
}
