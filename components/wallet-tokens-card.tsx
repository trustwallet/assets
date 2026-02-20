"use client"

import { useWalletTokens } from "@/hooks/use-wallet-tokens"
import { useLanguage } from "@/hooks/use-language"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Wallet, RefreshCw, TrendingUp, TrendingDown, ExternalLink } from "lucide-react"
import Image from "next/image"

interface WalletTokensCardProps {
  address: string | null
}

export function WalletTokensCard({ address }: WalletTokensCardProps) {
  const { language } = useLanguage()
  const { tokens, totalValue, isLoading, refresh } = useWalletTokens(address)

  const labels = {
    en: {
      title: "Your Wallet",
      totalValue: "Total Value",
      asset: "Asset",
      balance: "Balance",
      value: "Value",
      noTokens: "No tokens found",
      viewOnEtherscan: "View on Etherscan",
    },
    de: {
      title: "Ihre Wallet",
      totalValue: "Gesamtwert",
      asset: "Vermögenswert",
      balance: "Guthaben",
      value: "Wert",
      noTokens: "Keine Token gefunden",
      viewOnEtherscan: "Auf Etherscan ansehen",
    },
  }

  const t = labels[language]

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur relative overflow-hidden">
      <div className="absolute inset-0 animate-shimmer pointer-events-none" />
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Wallet className="h-4 w-4 text-primary" />
          {t.title}
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={refresh} disabled={isLoading} className="h-8 w-8">
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Total Value */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
          <p className="text-xs text-muted-foreground">{t.totalValue}</p>
          <p className="text-2xl font-bold text-gradient">
            ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        {/* Tokens List */}
        <div className="space-y-2">
          {isLoading ? (
            <>
              <Skeleton className="h-16 bg-secondary" />
              <Skeleton className="h-16 bg-secondary" />
              <Skeleton className="h-16 bg-secondary" />
            </>
          ) : tokens.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">{t.noTokens}</div>
          ) : (
            tokens.map((token) => (
              <div
                key={token.symbol}
                className={`flex items-center justify-between p-3 rounded-lg transition-all hover:scale-[1.02] ${
                  token.isOPM
                    ? "bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30"
                    : "bg-secondary/50 hover:bg-secondary/70"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`relative w-10 h-10 rounded-full overflow-hidden ${token.isOPM ? "animate-pulse-glow" : ""}`}
                  >
                    <Image
                      src={token.logo || "/placeholder.svg"}
                      alt={token.symbol}
                      fill
                      className="object-cover"
                      unoptimized={token.logo.startsWith("http")}
                    />
                  </div>
                  <div>
                    <p className={`font-semibold ${token.isOPM ? "text-primary" : "text-foreground"}`}>
                      {token.symbol}
                    </p>
                    <p className="text-xs text-muted-foreground">{token.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{token.balance}</p>
                  {token.valueUsd > 0 && (
                    <p className="text-xs text-muted-foreground">
                      ${token.valueUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </p>
                  )}
                  {token.change24h !== 0 && (
                    <div
                      className={`flex items-center justify-end gap-1 ${token.change24h >= 0 ? "text-emerald-500" : "text-red-500"}`}
                    >
                      {token.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      <span className="text-xs">{Math.abs(token.change24h).toFixed(1)}%</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* View on Etherscan */}
        {address && (
          <Button variant="outline" size="sm" asChild className="w-full bg-transparent">
            <a href={`https://etherscan.io/address/${address}`} target="_blank" rel="noopener noreferrer">
              {t.viewOnEtherscan}
              <ExternalLink className="ml-2 h-3 w-3" />
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
