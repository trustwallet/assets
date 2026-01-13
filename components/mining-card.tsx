"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/hooks/use-language"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Pickaxe, Zap, TrendingUp, Clock, Coins, Sparkles, Info } from "lucide-react"
import { MINING_APY, MIN_MINING_AMOUNT } from "@/lib/constants"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface MiningCardProps {
  balance: string
  priceUsd: number
}

export function MiningCard({ balance, priceUsd }: MiningCardProps) {
  const { language } = useLanguage()
  const [miningAmount, setMiningAmount] = useState("")
  const [isMining, setIsMining] = useState(false)
  const [miningStartTime, setMiningStartTime] = useState<number | null>(null)
  const [accumulatedRewards, setAccumulatedRewards] = useState(0)
  const [miningProgress, setMiningProgress] = useState(0)

  const labels = {
    en: {
      title: "OPM Mining",
      subtitle: "Earn passive rewards by mining",
      apy: "APY",
      minAmount: "Min. Amount",
      yourBalance: "Your Balance",
      amountToMine: "Amount to Mine",
      max: "MAX",
      startMining: "Start Mining",
      stopMining: "Stop Mining",
      estimatedDaily: "Est. Daily Rewards",
      estimatedMonthly: "Est. Monthly Rewards",
      currentRewards: "Current Rewards",
      miningActive: "Mining Active",
      miningInactive: "Not Mining",
      claimRewards: "Claim Rewards",
      miningPower: "Mining Power",
      timeElapsed: "Time Elapsed",
      hours: "hours",
      comingSoon: "Full mining coming soon! Preview mode active.",
    },
    de: {
      title: "OPM Mining",
      subtitle: "Verdienen Sie passive Belohnungen durch Mining",
      apy: "APY",
      minAmount: "Min. Betrag",
      yourBalance: "Ihr Guthaben",
      amountToMine: "Mining-Betrag",
      max: "MAX",
      startMining: "Mining Starten",
      stopMining: "Mining Stoppen",
      estimatedDaily: "Geschätzte Tagesbelohnung",
      estimatedMonthly: "Geschätzte Monatsbelohnung",
      currentRewards: "Aktuelle Belohnungen",
      miningActive: "Mining Aktiv",
      miningInactive: "Nicht Mining",
      claimRewards: "Belohnungen abholen",
      miningPower: "Mining-Leistung",
      timeElapsed: "Vergangene Zeit",
      hours: "Stunden",
      comingSoon: "Vollständiges Mining bald verfügbar! Vorschaumodus aktiv.",
    },
  }

  const t = labels[language]

  const balanceNum = Number.parseFloat(balance.replace(/,/g, ""))
  const miningAmountNum = Number.parseFloat(miningAmount) || 0

  // Calculate estimated rewards
  const dailyRate = MINING_APY / 365 / 100
  const dailyRewards = miningAmountNum * dailyRate
  const monthlyRewards = dailyRewards * 30

  // Simulated mining progress
  useEffect(() => {
    if (isMining && miningStartTime) {
      const interval = setInterval(() => {
        const elapsed = (Date.now() - miningStartTime) / 1000 // seconds
        const hourlyRate = dailyRate / 24
        const rewardsPerSecond = (miningAmountNum * hourlyRate) / 3600
        setAccumulatedRewards(elapsed * rewardsPerSecond)
        setMiningProgress((elapsed % 3600) / 36) // Progress resets every hour
      }, 100)
      return () => clearInterval(interval)
    }
  }, [isMining, miningStartTime, miningAmountNum, dailyRate])

  const handleStartMining = () => {
    if (miningAmountNum >= MIN_MINING_AMOUNT && miningAmountNum <= balanceNum) {
      setIsMining(true)
      setMiningStartTime(Date.now())
      setAccumulatedRewards(0)
    }
  }

  const handleStopMining = () => {
    setIsMining(false)
    setMiningStartTime(null)
  }

  const handleSetMax = () => {
    setMiningAmount(balance.replace(/,/g, ""))
  }

  const elapsedHours = miningStartTime ? Math.floor((Date.now() - miningStartTime) / 3600000) : 0
  const elapsedMinutes = miningStartTime ? Math.floor(((Date.now() - miningStartTime) % 3600000) / 60000) : 0

  return (
    <Card className="border-border/50 bg-gradient-to-br from-violet-950/30 via-card to-purple-950/10 backdrop-blur relative overflow-hidden">
      <div className="absolute inset-0 animate-shimmer pointer-events-none" />
      <div className="absolute top-0 right-0 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl" />

      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Pickaxe className="h-4 w-4 text-violet-400" />
            {t.title}
          </span>
          <Badge
            variant="outline"
            className={
              isMining
                ? "border-emerald-500/50 text-emerald-400 bg-emerald-500/10"
                : "border-muted text-muted-foreground"
            }
          >
            {isMining ? t.miningActive : t.miningInactive}
          </Badge>
        </CardTitle>
        <p className="text-xs text-muted-foreground">{t.subtitle}</p>
      </CardHeader>

      <CardContent className="space-y-4 relative">
        {/* Info Banner */}
        <div className="flex items-center gap-2 p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
          <Info className="h-4 w-4 text-violet-400 shrink-0" />
          <p className="text-xs text-violet-300">{t.comingSoon}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 rounded-lg bg-secondary/50 text-center">
            <TrendingUp className="h-4 w-4 text-emerald-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-emerald-400">{MINING_APY}%</p>
            <p className="text-[10px] text-muted-foreground">{t.apy}</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary/50 text-center">
            <Coins className="h-4 w-4 text-primary mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">{MIN_MINING_AMOUNT}</p>
            <p className="text-[10px] text-muted-foreground">{t.minAmount}</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary/50 text-center">
            <Zap className="h-4 w-4 text-amber-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">{balance}</p>
            <p className="text-[10px] text-muted-foreground">{t.yourBalance}</p>
          </div>
        </div>

        {/* Mining Input */}
        {!isMining ? (
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">{t.amountToMine}</label>
            <div className="relative">
              <Input
                type="number"
                placeholder="0.0"
                value={miningAmount}
                onChange={(e) => setMiningAmount(e.target.value)}
                className="pr-16 font-mono bg-secondary border-border"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 text-xs text-primary"
                onClick={handleSetMax}
              >
                {t.max}
              </Button>
            </div>

            {/* Estimated Rewards */}
            {miningAmountNum > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="p-2 rounded bg-secondary/30 text-center">
                  <p className="text-xs text-muted-foreground">{t.estimatedDaily}</p>
                  <p className="text-sm font-semibold text-emerald-400">+{dailyRewards.toFixed(6)} OPM</p>
                </div>
                <div className="p-2 rounded bg-secondary/30 text-center">
                  <p className="text-xs text-muted-foreground">{t.estimatedMonthly}</p>
                  <p className="text-sm font-semibold text-emerald-400">+{monthlyRewards.toFixed(4)} OPM</p>
                </div>
              </div>
            )}

            <Button
              className="w-full bg-gradient-to-r from-violet-600 to-purple-500 hover:from-violet-500 hover:to-purple-400 text-white"
              onClick={handleStartMining}
              disabled={miningAmountNum < MIN_MINING_AMOUNT || miningAmountNum > balanceNum}
            >
              <Pickaxe className="mr-2 h-4 w-4" />
              {t.startMining}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Mining Animation */}
            <div className="relative p-6 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 border border-violet-500/30">
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-violet-500/20 flex items-center justify-center animate-pulse">
                    <Pickaxe
                      className="h-10 w-10 text-violet-400 animate-bounce"
                      style={{ animationDuration: "0.5s" }}
                    />
                  </div>
                  <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400 animate-ping" />
                  <Sparkles
                    className="absolute -bottom-1 -left-2 h-4 w-4 text-violet-400 animate-ping"
                    style={{ animationDelay: "0.5s" }}
                  />
                </div>
              </div>

              {/* Mining Progress */}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{t.miningPower}</span>
                  <span className="text-violet-400">{miningProgress.toFixed(0)}%</span>
                </div>
                <Progress value={miningProgress} className="h-2 bg-secondary" />
              </div>

              {/* Time Elapsed */}
              <div className="mt-3 flex justify-center gap-4 text-sm">
                <div className="text-center">
                  <Clock className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                  <span className="text-foreground font-medium">
                    {elapsedHours}h {elapsedMinutes}m
                  </span>
                  <p className="text-[10px] text-muted-foreground">{t.timeElapsed}</p>
                </div>
              </div>
            </div>

            {/* Current Rewards */}
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t.currentRewards}</span>
                <div className="text-right">
                  <p className="text-lg font-bold text-emerald-400">+{accumulatedRewards.toFixed(8)} OPM</p>
                  <p className="text-xs text-muted-foreground">≈ ${(accumulatedRewards * priceUsd).toFixed(4)}</p>
                </div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="border-destructive/50 text-destructive hover:bg-destructive/10 bg-transparent"
                onClick={handleStopMining}
              >
                {t.stopMining}
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white"
                      disabled
                    >
                      {t.claimRewards}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t.comingSoon}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
