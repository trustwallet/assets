"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, TrendingDown, DollarSign, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface PortfolioCardProps {
  balance: string
  priceUsd: number
  priceChange24h: number
  valueUsd: number
  isLoading: boolean
  onRefresh: () => void
}

export function PortfolioCard({
  balance,
  priceUsd,
  priceChange24h,
  valueUsd,
  isLoading,
  onRefresh,
}: PortfolioCardProps) {
  const isPositive = priceChange24h >= 0

  return (
    <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-card via-card to-primary/5">
      <div className="absolute inset-0 shimmer pointer-events-none" />
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Your Portfolio</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRefresh}
          disabled={isLoading}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-3/4 bg-secondary" />
            <Skeleton className="h-6 w-1/2 bg-secondary" />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden pulse-gold">
                <Image src="/images/3bffe8d5-1382-49f5-92e7.jpeg" alt="OPM Token" fill className="object-cover" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-foreground">
                  {balance} <span className="text-primary">OPM</span>
                </p>
                <p className="text-lg sm:text-xl font-semibold text-muted-foreground">
                  ≈ ${valueUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                <DollarSign className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Price</p>
                  <p className="text-sm font-semibold text-foreground">${priceUsd.toFixed(8)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                {isPositive ? (
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
                <div>
                  <p className="text-xs text-muted-foreground">24h Change</p>
                  <p className={`text-sm font-semibold ${isPositive ? "text-emerald-500" : "text-destructive"}`}>
                    {isPositive ? "+" : ""}
                    {priceChange24h.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
