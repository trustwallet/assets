"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Shield, Zap, Crown } from "lucide-react"
import Image from "next/image"
import { ConnectWalletButton } from "./connect-wallet-button"

export function ConnectPrompt() {
  const features = [
    { icon: Shield, text: "Secure & Private" },
    { icon: Zap, text: "Instant Access" },
    { icon: Crown, text: "Exclusive Benefits" },
  ]

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 overflow-hidden">
      <div className="absolute inset-0 shimmer pointer-events-none" />
      <CardContent className="flex flex-col items-center text-center p-8 sm:p-12 space-y-6">
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 pulse-gold rounded-full overflow-hidden">
          <Image src="/images/3bffe8d5-1382-49f5-92e7.jpeg" alt="OnePremium Token" fill className="object-cover" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Welcome to <span className="text-primary">OnePremium</span>
          </h2>
          <p className="text-muted-foreground max-w-md">
            Connect your MetaMask wallet to access your exclusive dashboard and manage your $OPM tokens
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 py-4">
          {features.map((feature) => (
            <div
              key={feature.text}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50"
            >
              <feature.icon className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">{feature.text}</span>
            </div>
          ))}
        </div>

        <ConnectWalletButton />
      </CardContent>
    </Card>
  )
}
