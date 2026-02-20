"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import Image from "next/image"

interface TrendingCoin {
  symbol: string
  name: string
  price: number
  change: number
  logo: string
}

export function PriceTicker() {
  const [trending, setTrending] = useState<TrendingCoin[]>([])
  const [opmPrice, setOpmPrice] = useState(0)

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const [trendingRes, opmRes] = await Promise.all([
          fetch("/api/token-data?action=trendingPrices"),
          fetch("/api/token-data?action=price"),
        ])
        const trendingData = await trendingRes.json()
        const opmData = await opmRes.json()

        setTrending(trendingData.trending || [])
        setOpmPrice(opmData.priceUsd || 0)
      } catch (e) {
        console.error("Failed to fetch prices:", e)
      }
    }

    fetchPrices()
    const interval = setInterval(fetchPrices, 30000)
    return () => clearInterval(interval)
  }, [])

  // Add OPM to the beginning
  const allCoins = [
    {
      symbol: "OPM",
      name: "One Premium",
      price: opmPrice,
      change: 0,
      logo: "/images/3bffe8d5-1382-49f5-92e7.jpeg",
      isOPM: true,
    },
    ...trending,
  ]

  return (
    <div className="w-full overflow-hidden bg-card/50 border-y border-border/50 backdrop-blur-sm py-3">
      <div className="flex animate-scroll-x gap-8 px-4">
        {[...allCoins, ...allCoins].map((coin, index) => (
          <div
            key={`${coin.symbol}-${index}`}
            className={`flex items-center gap-3 shrink-0 px-4 py-2 rounded-lg ${
              (coin as any).isOPM ? "bg-primary/10 border border-primary/30" : "bg-secondary/30"
            }`}
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              <Image
                src={coin.logo || "/placeholder.svg"}
                alt={coin.symbol}
                fill
                className="object-cover"
                unoptimized={coin.logo.startsWith("http")}
              />
            </div>
            <div className="flex flex-col">
              <span className={`text-sm font-bold ${(coin as any).isOPM ? "text-primary" : "text-foreground"}`}>
                {coin.symbol}
              </span>
              <span className="text-xs text-muted-foreground">
                $
                {coin.price > 1000
                  ? coin.price.toLocaleString(undefined, { maximumFractionDigits: 0 })
                  : coin.price.toFixed(2)}
              </span>
            </div>
            {coin.change !== 0 && (
              <div className={`flex items-center gap-1 ${coin.change >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                {coin.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span className="text-xs font-medium">{Math.abs(coin.change).toFixed(1)}%</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
