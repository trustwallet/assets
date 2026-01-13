"use client"

import { useState } from "react"
import { useLanguage } from "@/hooks/use-language"
import { useWallet } from "@/hooks/use-wallet"
import { useOPMData } from "@/hooks/use-opm-data"
import { Header } from "./header"
import { Footer } from "./footer"
import { TransactionsCard } from "./transactions-card"
import { LockStatusCard } from "./lock-status-card"
import { WalletTokensCard } from "./wallet-tokens-card"
import { MiningCard } from "./mining-card"
import { SendReceiveModal } from "./send-receive-modal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  RefreshCw,
  Crown,
  Award,
  Medal,
  Star,
  Gem,
  ShoppingCart,
  ArrowRightLeft,
  PiggyBank,
  ExternalLink,
  BarChart3,
  Coins,
  Activity,
  Copy,
  Check,
  Sparkles,
  Zap,
  Send,
  Download,
} from "lucide-react"
import { TIER_THRESHOLDS, TIER_BENEFITS, OPM_TOKEN_ADDRESS, UNISWAP_BUY_URL } from "@/lib/constants"
import { useLockStatus } from "@/hooks/use-lock-status"

type TierName = keyof typeof TIER_THRESHOLDS

const TIER_ICONS: Record<TierName, typeof Crown> = {
  STARTER: Sparkles,
  BRONZE: Medal,
  SILVER: Award,
  GOLD: Star,
  PLATINUM: Crown,
  DIAMOND: Gem,
}

export function UserDashboard() {
  const { t, language } = useLanguage()
  const { isConnected, address, disconnect } = useWallet()
  const opmData = useOPMData(address)
  const lockStatus = useLockStatus(address)
  const [copied, setCopied] = useState(false)
  const [sendReceiveOpen, setSendReceiveOpen] = useState(false)

  const balanceNumber = Number(opmData.balanceRaw) / 1e18
  const isPositive = opmData.priceChange24h >= 0

  const getCurrentTier = (): TierName => {
    const tiers: TierName[] = ["DIAMOND", "PLATINUM", "GOLD", "SILVER", "BRONZE", "STARTER"]
    for (const tier of tiers) {
      if (balanceNumber >= TIER_THRESHOLDS[tier]) return tier
    }
    return "STARTER"
  }

  const currentTier = getCurrentTier()
  const tierData = TIER_BENEFITS[currentTier]
  const TierIcon = TIER_ICONS[currentTier]

  const getNextTier = (): TierName | null => {
    const tierOrder: TierName[] = ["STARTER", "BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND"]
    const currentIndex = tierOrder.indexOf(currentTier)
    return currentIndex < tierOrder.length - 1 ? tierOrder[currentIndex + 1] : null
  }

  const nextTier = getNextTier()
  const nextThreshold = nextTier ? TIER_THRESHOLDS[nextTier] : TIER_THRESHOLDS.DIAMOND
  const currentThreshold = TIER_THRESHOLDS[currentTier]
  const progress = nextTier
    ? Math.min(100, ((balanceNumber - currentThreshold) / (nextThreshold - currentThreshold)) * 100)
    : 100
  const tokensToNext = nextTier ? Math.max(0, nextThreshold - balanceNumber) : 0

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

  if (!isConnected) {
    return null
  }

  return (
    <div className="min-h-screen bg-background/80 backdrop-blur-sm">
      <Header />

      <main className="container px-4 py-6 sm:py-8 space-y-6">
        {/* Welcome Card */}
        <Card
          className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 animate-card-float"
          style={{ animationDuration: "6s" }}
        >
          <div className="absolute inset-0 animate-shimmer pointer-events-none" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-4 relative">
            <div className="relative w-20 h-20 rounded-full overflow-hidden animate-pulse-glow shrink-0 border-2 border-primary/30">
              <Image src="/images/3bffe8d5-1382-49f5-92e7.jpeg" alt="OPM" fill className="object-cover" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                {t.connect.welcome} <span className="text-gradient">OnePremium</span>
              </h1>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                <Wallet className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground font-mono">{formatAddress(address!)}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyAddress}>
                  {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
            </div>
            <Badge
              className="border-0 text-sm px-4 py-2 font-semibold"
              style={{ backgroundColor: `${tierData.color}20`, color: tierData.color }}
            >
              <TierIcon className="h-5 w-5 mr-2" />
              {tierData.label}
            </Badge>
          </CardContent>
        </Card>

        {/* Portfolio Card */}
        <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-card via-card to-primary/5">
          <div className="absolute inset-0 animate-shimmer pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              {t.dashboard.portfolio}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent border-primary/30 hover:bg-primary/10"
                onClick={() => setSendReceiveOpen(true)}
              >
                <Send className="h-3 w-3" />
                <Download className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={opmData.refreshData}
                disabled={opmData.isLoading}
                className="h-8 w-8"
              >
                <RefreshCw className={`h-4 w-4 ${opmData.isLoading ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 relative">
            {opmData.isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-14 w-3/4 bg-secondary" />
                <Skeleton className="h-8 w-1/2 bg-secondary" />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden animate-pulse-glow shrink-0 border-2 border-primary/30">
                    <Image src="/images/3bffe8d5-1382-49f5-92e7.jpeg" alt="OPM" fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-3xl sm:text-4xl font-bold text-foreground">
                      {opmData.balance} <span className="text-gradient">OPM</span>
                    </p>
                    <p className="text-xl sm:text-2xl font-semibold text-primary">
                      ≈ $
                      {opmData.valueUsd.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-2 p-4 rounded-xl bg-secondary/50 transition-all hover:bg-secondary/70">
                    <DollarSign className="h-5 w-5 text-primary shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">{t.dashboard.price}</p>
                      <p className="text-lg font-bold text-foreground truncate">
                        ${opmData.priceUsd > 0 ? opmData.priceUsd.toFixed(2) : "259.58"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-4 rounded-xl bg-secondary/50 transition-all hover:bg-secondary/70">
                    {isPositive ? (
                      <TrendingUp className="h-5 w-5 text-emerald-500 shrink-0" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-destructive shrink-0" />
                    )}
                    <div>
                      <p className="text-xs text-muted-foreground">{t.dashboard.change24h}</p>
                      <p className={`text-lg font-bold ${isPositive ? "text-emerald-500" : "text-destructive"}`}>
                        {isPositive ? "+" : ""}
                        {opmData.priceChange24h.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Lock Status & Mining */}
        <div className="grid gap-4 md:grid-cols-2">
          <LockStatusCard address={address} />
          <MiningCard balance={opmData.balance} priceUsd={opmData.priceUsd || 259.58} />
        </div>

        {/* Wallet Tokens */}
        <WalletTokensCard address={address} />

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Market Stats */}
          <Card className="border-border/50 bg-card/50 backdrop-blur relative overflow-hidden">
            <div className="absolute inset-0 animate-shimmer pointer-events-none" />
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <BarChart3 className="h-4 w-4 text-primary" />
                {t.dashboard.marketStats}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 relative">
              {opmData.isLoading ? (
                <>
                  <Skeleton className="h-12 bg-secondary" />
                  <Skeleton className="h-12 bg-secondary" />
                  <Skeleton className="h-12 bg-secondary" />
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 transition-all hover:bg-secondary/70">
                    <div className="flex items-center gap-2">
                      <Coins className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">{t.dashboard.totalSupply}</span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">{opmData.totalSupply}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 transition-all hover:bg-secondary/70">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">{t.dashboard.marketCap}</span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      $
                      {opmData.marketCap > 0
                        ? opmData.marketCap.toLocaleString(undefined, { maximumFractionDigits: 0 })
                        : "2,595,800"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 transition-all hover:bg-secondary/70">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">{t.dashboard.volume24h}</span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      $
                      {opmData.volume24h > 0
                        ? opmData.volume24h.toLocaleString(undefined, { maximumFractionDigits: 0 })
                        : "—"}
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Tier Status */}
          <Card className="border-border/50 bg-card/50 backdrop-blur relative overflow-hidden">
            <div className="absolute inset-0 animate-shimmer pointer-events-none" />
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t.dashboard.tierStatus}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="p-3 rounded-full animate-pulse-glow"
                    style={{ backgroundColor: `${tierData.color}20` }}
                  >
                    <TierIcon className="h-6 w-6" style={{ color: tierData.color }} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">{tierData.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {tierData.discount}% {t.dashboard.discount}
                    </p>
                  </div>
                </div>
              </div>

              {nextTier ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      {t.dashboard.progressTo} {TIER_BENEFITS[nextTier].label}
                    </span>
                    <span>{progress.toFixed(1)}%</span>
                  </div>
                  <Progress value={progress} className="h-2 bg-secondary" />
                  <p className="text-xs text-muted-foreground text-center">
                    {tokensToNext.toLocaleString(undefined, { maximumFractionDigits: 0 })} OPM {t.dashboard.needed}
                  </p>
                </div>
              ) : (
                <div className="text-center p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-sm font-medium text-primary">{t.dashboard.maxTier}</p>
                </div>
              )}

              {/* All Tiers */}
              <div className="grid grid-cols-6 gap-1 pt-2">
                {(Object.keys(TIER_THRESHOLDS) as TierName[]).map((tier) => {
                  const Icon = TIER_ICONS[tier]
                  const benefits = TIER_BENEFITS[tier]
                  return (
                    <div
                      key={tier}
                      className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                        currentTier === tier ? "bg-primary/10 border border-primary/30 scale-110" : "bg-secondary/30"
                      }`}
                    >
                      <Icon className="h-4 w-4" style={{ color: benefits.color }} />
                      <span className="text-[8px] text-muted-foreground mt-1">{benefits.label.slice(0, 4)}</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-border/50 bg-card/50 backdrop-blur relative overflow-hidden">
          <div className="absolute inset-0 animate-shimmer pointer-events-none" />
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Activity className="h-4 w-4 text-primary" />
              {t.dashboard.quickActions}
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Buy OPM */}
              <Button
                variant="default"
                asChild
                className="relative h-auto flex-col gap-1 p-4 min-h-[90px] bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black border-0 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
              >
                <a href={UNISWAP_BUY_URL} target="_blank" rel="noopener noreferrer">
                  <ShoppingCart className="h-6 w-6" />
                  <span className="text-sm font-semibold">{t.dashboard.buyOpm}</span>
                  <span className="text-xs text-black/70">{t.dashboard.purchaseTokens}</span>
                  <ExternalLink className="absolute top-2 right-2 h-3 w-3 opacity-50" />
                </a>
              </Button>

              {/* Send/Receive */}
              <Button
                variant="outline"
                className="relative h-auto flex-col gap-1 p-4 min-h-[90px] border-primary/30 hover:border-primary/50 hover:bg-primary/5 bg-transparent transition-all hover:scale-[1.02]"
                onClick={() => setSendReceiveOpen(true)}
              >
                <div className="flex gap-1">
                  <Send className="h-5 w-5" />
                  <Download className="h-5 w-5" />
                </div>
                <span className="text-sm font-semibold">{language === "de" ? "Senden/Empfangen" : "Send/Receive"}</span>
                <span className="text-xs text-muted-foreground">
                  {language === "de" ? "OPM übertragen" : "Transfer OPM"}
                </span>
              </Button>

              {/* Swap */}
              <Button
                variant="outline"
                disabled={lockStatus.isLocked && !lockStatus.isCreator}
                asChild={!lockStatus.isLocked || lockStatus.isCreator}
                className={`relative h-auto flex-col gap-1 p-4 min-h-[90px] transition-all hover:scale-[1.02] ${
                  lockStatus.isLocked && !lockStatus.isCreator
                    ? "border-amber-500/50 bg-amber-500/5 text-amber-500"
                    : "border-border hover:border-primary/50 hover:bg-primary/5 bg-transparent"
                }`}
              >
                {!lockStatus.isLocked || lockStatus.isCreator ? (
                  <a
                    href="https://app.uniswap.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1"
                  >
                    <ArrowRightLeft className="h-6 w-6" />
                    <span className="text-sm font-semibold">{t.dashboard.swap}</span>
                    <span className="text-xs text-muted-foreground">{t.dashboard.exchangeTokens}</span>
                    <ExternalLink className="absolute top-2 right-2 h-3 w-3 opacity-50" />
                  </a>
                ) : (
                  <>
                    <ArrowRightLeft className="h-6 w-6" />
                    <span className="text-sm font-semibold">{t.dashboard.swap}</span>
                    <span className="text-xs">
                      {lockStatus.remainingDays}d {language === "de" ? "gesperrt" : "locked"}
                    </span>
                  </>
                )}
              </Button>

              {/* Stake - Coming Soon */}
              <Button
                variant="outline"
                disabled
                className="relative h-auto flex-col gap-1 p-4 min-h-[90px] border-border hover:border-primary/50 hover:bg-primary/5 bg-transparent"
              >
                <PiggyBank className="h-6 w-6" />
                <span className="text-sm font-semibold">{t.dashboard.stake}</span>
                <span className="text-xs text-muted-foreground">{t.dashboard.comingSoon}</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <TransactionsCard address={address} />

        {/* Contract Info */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="text-xs text-muted-foreground">
                  {language === "de" ? "Vertragsadresse" : "Contract Address"}
                </p>
                <code className="text-xs text-foreground font-mono">{OPM_TOKEN_ADDRESS}</code>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild className="text-xs bg-transparent">
                  <a href={`https://etherscan.io/token/${OPM_TOKEN_ADDRESS}`} target="_blank" rel="noopener noreferrer">
                    Etherscan <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild className="text-xs bg-transparent">
                  <a
                    href={`https://dex.coinmarketcap.com/token/ethereum/${OPM_TOKEN_ADDRESS}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    CMC DEX <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />

      {/* Send/Receive Modal */}
      <SendReceiveModal
        open={sendReceiveOpen}
        onOpenChange={setSendReceiveOpen}
        balance={opmData.balance}
        priceUsd={opmData.priceUsd || 259.58}
      />
    </div>
  )
}
