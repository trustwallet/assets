"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Crown, Award, Medal, Star } from "lucide-react"
import { TIER_THRESHOLDS, TIER_BENEFITS } from "@/lib/constants"

interface TierCardProps {
  balance: string
  balanceRaw: bigint
}

type TierName = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM"

const TIERS: { name: TierName; icon: typeof Crown; color: string }[] = [
  { name: "BRONZE", icon: Medal, color: "text-amber-700" },
  { name: "SILVER", icon: Award, color: "text-slate-400" },
  { name: "GOLD", icon: Star, color: "text-yellow-500" },
  { name: "PLATINUM", icon: Crown, color: "text-cyan-400" },
]

export function TierCard({ balance, balanceRaw }: TierCardProps) {
  const balanceNumber = Number(balanceRaw) / 1e18

  const getCurrentTier = (): TierName => {
    if (balanceNumber >= TIER_THRESHOLDS.PLATINUM) return "PLATINUM"
    if (balanceNumber >= TIER_THRESHOLDS.GOLD) return "GOLD"
    if (balanceNumber >= TIER_THRESHOLDS.SILVER) return "SILVER"
    return "BRONZE"
  }

  const currentTier = getCurrentTier()
  const currentTierData = TIERS.find((t) => t.name === currentTier)!
  const TierIcon = currentTierData.icon

  const getNextTier = (): TierName | null => {
    const tierOrder: TierName[] = ["BRONZE", "SILVER", "GOLD", "PLATINUM"]
    const currentIndex = tierOrder.indexOf(currentTier)
    return currentIndex < tierOrder.length - 1 ? tierOrder[currentIndex + 1] : null
  }

  const nextTier = getNextTier()
  const nextThreshold = nextTier ? TIER_THRESHOLDS[nextTier] : TIER_THRESHOLDS.PLATINUM
  const currentThreshold = TIER_THRESHOLDS[currentTier]

  const progress = nextTier
    ? Math.min(100, ((balanceNumber - currentThreshold) / (nextThreshold - currentThreshold)) * 100)
    : 100

  const tokensToNext = nextTier ? Math.max(0, nextThreshold - balanceNumber) : 0

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Your Tier Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-full bg-secondary ${currentTierData.color}`}>
              <TierIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{currentTier}</p>
              <p className="text-sm text-muted-foreground">{TIER_BENEFITS[currentTier].discount}% Discount</p>
            </div>
          </div>
        </div>

        {nextTier && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress to {nextTier}</span>
              <span>{progress.toFixed(1)}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-secondary" />
            <p className="text-xs text-muted-foreground text-center">
              {tokensToNext.toLocaleString(undefined, { maximumFractionDigits: 0 })} OPM needed
            </p>
          </div>
        )}

        {!nextTier && (
          <div className="text-center p-3 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-sm font-medium text-primary">Maximum Tier Achieved</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
