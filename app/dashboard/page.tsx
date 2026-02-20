"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LanguageProvider } from "@/hooks/use-language"
import { useWallet } from "@/hooks/use-wallet"
import { UserDashboard } from "@/components/user-dashboard"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, Loader2 } from "lucide-react"
import Image from "next/image"

function DashboardContent() {
  const router = useRouter()
  const { isConnected, connect, isConnecting, hasMetaMask, error } = useWallet()

  // Redirect to home if not connected after a delay
  useEffect(() => {
    if (!isConnected && !isConnecting) {
      const timer = setTimeout(() => {
        // Don't redirect, let user connect from dashboard
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isConnected, isConnecting])

  if (isConnected) {
    return <UserDashboard />
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-primary/20 bg-gradient-to-br from-card via-card to-primary/5">
        <CardContent className="flex flex-col items-center text-center p-8 space-y-6">
          <div className="relative w-24 h-24 pulse-gold rounded-full overflow-hidden">
            <Image src="/images/3bffe8d5-1382-49f5-92e7.jpeg" alt="OnePremium" fill className="object-cover" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-serif font-bold text-foreground">
              Connect to <span className="text-primary">Dashboard</span>
            </h1>
            <p className="text-muted-foreground">Connect your MetaMask wallet to access your OnePremium dashboard</p>
          </div>

          {error && (
            <div className="w-full p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
              {error}
            </div>
          )}

          {!hasMetaMask ? (
            <Button asChild className="w-full gap-2 bg-gradient-to-r from-amber-600 to-yellow-500 text-black">
              <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer">
                <Wallet className="h-5 w-5" />
                Install MetaMask
              </a>
            </Button>
          ) : (
            <Button
              onClick={connect}
              disabled={isConnecting}
              className="w-full gap-2 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black font-semibold"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="h-5 w-5" />
                  Connect MetaMask
                </>
              )}
            </Button>
          )}

          <Button variant="ghost" onClick={() => router.push("/")} className="text-muted-foreground">
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <LanguageProvider>
      <DashboardContent />
    </LanguageProvider>
  )
}
