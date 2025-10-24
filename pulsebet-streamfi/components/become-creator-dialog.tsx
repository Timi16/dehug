"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Video, Users, DollarSign, Zap, CheckCircle2 } from "lucide-react"

interface BecomeCreatorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BecomeCreatorDialog({ open, onOpenChange }: BecomeCreatorDialogProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    channelName: "",
    bio: "",
    category: "crypto",
  })

  const handleSubmit = () => {
    if (step === 1) {
      setStep(2)
    } else {
      // Complete creator setup
      onOpenChange(false)
      setStep(1)
    }
  }

  const benefits = [
    { icon: DollarSign, text: "Earn from viewer predictions" },
    { icon: Users, text: "Build your community" },
    { icon: Zap, text: "Real-time earnings tracking" },
    { icon: Video, text: "Go live instantly" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-2xl">Become a Creator</DialogTitle>
          <DialogDescription>Start streaming and earning on Plusify</DialogDescription>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-6 py-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-bold text-lg">Creator Benefits</h3>
                <div className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <benefit.icon className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">{benefit.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-lg">Creator Stats</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="text-2xl font-bold text-primary">500+</div>
                    <div className="text-xs text-muted-foreground">Active Creators</div>
                  </div>
                  <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                    <div className="text-2xl font-bold text-success">$2.5M+</div>
                    <div className="text-xs text-muted-foreground">Paid Out</div>
                  </div>
                  <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                    <div className="text-2xl font-bold text-accent">$8.9K</div>
                    <div className="text-xs text-muted-foreground">Avg Earnings</div>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                    <div className="text-2xl font-bold">1.2K</div>
                    <div className="text-xs text-muted-foreground">Avg Viewers</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="flex-1 bg-primary hover:bg-primary/90">
                Continue
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="channel-name">Channel Name</Label>
                <Input
                  id="channel-name"
                  placeholder="Your streaming channel name"
                  value={formData.channelName}
                  onChange={(e) => setFormData({ ...formData, channelName: e.target.value })}
                  className="animate-slide-in-left"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell viewers about yourself and what you stream"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="animate-slide-in-left"
                  style={{ animationDelay: "0.1s" }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground animate-slide-in-left"
                  style={{ animationDelay: "0.2s" }}
                >
                  <option value="crypto">Crypto</option>
                  <option value="sports">Sports</option>
                  <option value="gaming">Gaming</option>
                  <option value="events">Events</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-success/10 border border-success/20 flex items-start gap-3 animate-fade-in-up">
              <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <div className="font-bold text-success mb-1">You're all set!</div>
                <div className="text-muted-foreground">
                  Your creator account will be activated immediately. Start streaming and earning today.
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button onClick={handleSubmit} className="flex-1 bg-primary hover:bg-primary/90">
                Activate Creator Account
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
