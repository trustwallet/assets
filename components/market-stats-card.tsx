"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart3, Activity, Layers, PieChart } from "lucide-react"

interface MarketStatsCardProps {
  totalSupply: string
  marketCap: number
  volume24h: number
  isLoading: boolean
}

export function MarketStatsCard({ totalSupply, marketCap, volume24h, isLoading }: MarketStatsCardProps) {
  const stats = [
    {
      label: "Total Supply",
      value: totalSupply,
      icon: Layers,
    },
    {
      label: "Market Cap",
      value: `$${marketCap.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      icon: PieChart,
    },
    {
      label: "24h Volume",
      value: `$${volume24h.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      icon: Activity,
    },
  ]

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <BarChart3 className="h-4 w-4 text-primary" />
          Market Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full bg-secondary" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/30"
              >
                <div className="flex items-center gap-2">
                  <stat.icon className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                </div>
                <span className="text-sm font-semibold text-foreground">{stat.value}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
