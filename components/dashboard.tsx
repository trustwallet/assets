"use client"

import { useWallet } from "@/hooks/use-wallet"
import { useOPMData } from "@/hooks/use-opm-data"
import { DashboardHeader } from "./dashboard-header"
import { ConnectPrompt } from "./connect-prompt"
import { PortfolioCard } from "./portfolio-card"
import { MarketStatsCard } from "./market-stats-card"
import { TierCard } from "./tier-card"
import { ActionButtons } from "./action-buttons"

export function Dashboard() {
  const { isConnected, address } = useWallet()
  const opmData = useOPMData(address)

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container px-4 py-6 sm:py-8 space-y-6">
        {!isConnected ? (
          <ConnectPrompt />
        ) : (
          <div className="space-y-6">
            {/* Portfolio Overview */}
            <PortfolioCard
              balance={opmData.balance}
              priceUsd={opmData.priceUsd}
              priceChange24h={opmData.priceChange24h}
              valueUsd={opmData.valueUsd}
              isLoading={opmData.isLoading}
              onRefresh={opmData.refreshData}
            />

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              <MarketStatsCard
                totalSupply={opmData.totalSupply}
                marketCap={opmData.marketCap}
                volume24h={opmData.volume24h}
                isLoading={opmData.isLoading}
              />
              <TierCard balance={opmData.balance} balanceRaw={opmData.balanceRaw} />
            </div>

            {/* Action Buttons */}
            <ActionButtons isConnected={isConnected} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-12">
        <div className="container px-4 py-6 text-center">
          <p className="text-sm text-muted-foreground">© 2025 OnePremium. All rights reserved.</p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Powered by Ethereum • Live Price from CoinMarketCap DEX
          </p>
        </div>
      </footer>
    </div>
  )
}
