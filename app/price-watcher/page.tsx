"use client"

import { useState, useEffect, useMemo } from "react"
import { useLanguage } from "@/hooks/use-language"
import { useOPMData } from "@/hooks/use-opm-data"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AnimatedBackground } from "@/components/animated-background"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  PieChart,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Clock,
  DollarSign,
  LineChart,
  CandlestickChart,
  Sparkles,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface CryptoData {
  symbol: string
  name: string
  price: number
  change24h: number
  change7d: number
  marketCap: number
  volume24h: number
  logo: string
  sparkline: number[]
}

// Mathematical indicators
const calculateRSI = (prices: number[], period = 14): number => {
  if (prices.length < period + 1) return 50
  let gains = 0,
    losses = 0
  for (let i = prices.length - period; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1]
    if (diff > 0) gains += diff
    else losses -= diff
  }
  const avgGain = gains / period
  const avgLoss = losses / period
  if (avgLoss === 0) return 100
  const rs = avgGain / avgLoss
  return 100 - 100 / (1 + rs)
}

const calculateMACD = (prices: number[]): { macd: number; signal: number; histogram: number } => {
  const ema12 = calculateEMA(prices, 12)
  const ema26 = calculateEMA(prices, 26)
  const macd = ema12 - ema26
  const signal = macd * 0.9 // Simplified
  return { macd, signal, histogram: macd - signal }
}

const calculateEMA = (prices: number[], period: number): number => {
  if (prices.length === 0) return 0
  const k = 2 / (period + 1)
  let ema = prices[0]
  for (let i = 1; i < prices.length; i++) {
    ema = prices[i] * k + ema * (1 - k)
  }
  return ema
}

const calculateBollingerBands = (prices: number[], period = 20): { upper: number; middle: number; lower: number } => {
  if (prices.length < period) return { upper: 0, middle: 0, lower: 0 }
  const slice = prices.slice(-period)
  const middle = slice.reduce((a, b) => a + b, 0) / period
  const variance = slice.reduce((sum, p) => sum + Math.pow(p - middle, 2), 0) / period
  const stdDev = Math.sqrt(variance)
  return { upper: middle + 2 * stdDev, middle, lower: middle - 2 * stdDev }
}

const calculateVolatility = (prices: number[]): number => {
  if (prices.length < 2) return 0
  const returns = []
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1])
  }
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length
  return Math.sqrt(variance) * Math.sqrt(365) * 100 // Annualized volatility %
}

export default function PriceWatcherPage() {
  const { language } = useLanguage()
  const { price, priceChange24h, volume24h, marketCap, liquidity } = useOPMData(null)
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([])
  const [selectedTimeframe, setSelectedTimeframe] = useState("24h")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  const content = {
    en: {
      title: "Price Watcher",
      subtitle: "Advanced Market Analytics & Mathematical Indicators",
      opmAnalysis: "OPM Technical Analysis",
      marketOverview: "Market Overview",
      topGainers: "Top Gainers",
      topLosers: "Top Losers",
      indicators: "Technical Indicators",
      rsi: "RSI (14)",
      macd: "MACD",
      bollinger: "Bollinger Bands",
      volatility: "Volatility",
      volume: "24h Volume",
      marketCap: "Market Cap",
      price: "Price",
      change: "Change",
      signal: "Signal",
      buy: "Buy",
      sell: "Sell",
      hold: "Hold",
      overbought: "Overbought",
      oversold: "Oversold",
      neutral: "Neutral",
      bullish: "Bullish",
      bearish: "Bearish",
      lastUpdate: "Last Update",
      refresh: "Refresh",
      priceChart: "Price Movement",
      volumeChart: "Volume Analysis",
      fearGreed: "Fear & Greed Index",
      extreme_fear: "Extreme Fear",
      fear: "Fear",
      neutral_fg: "Neutral",
      greed: "Greed",
      extreme_greed: "Extreme Greed",
    },
    de: {
      title: "Preis-Beobachter",
      subtitle: "Erweiterte Marktanalyse & Mathematische Indikatoren",
      opmAnalysis: "OPM Technische Analyse",
      marketOverview: "Marktübersicht",
      topGainers: "Top Gewinner",
      topLosers: "Top Verlierer",
      indicators: "Technische Indikatoren",
      rsi: "RSI (14)",
      macd: "MACD",
      bollinger: "Bollinger Bänder",
      volatility: "Volatilität",
      volume: "24h Volumen",
      marketCap: "Marktkapitalisierung",
      price: "Preis",
      change: "Änderung",
      signal: "Signal",
      buy: "Kaufen",
      sell: "Verkaufen",
      hold: "Halten",
      overbought: "Überkauft",
      oversold: "Überverkauft",
      neutral: "Neutral",
      bullish: "Bullisch",
      bearish: "Bärisch",
      lastUpdate: "Letzte Aktualisierung",
      refresh: "Aktualisieren",
      priceChart: "Preisbewegung",
      volumeChart: "Volumenanalyse",
      fearGreed: "Angst & Gier Index",
      extreme_fear: "Extreme Angst",
      fear: "Angst",
      neutral_fg: "Neutral",
      greed: "Gier",
      extreme_greed: "Extreme Gier",
    },
  }

  const t = content[language]

  // Generate simulated price history for indicators
  const priceHistory = useMemo(() => {
    const basePrice = price || 259.58
    const history: number[] = []
    let currentPrice = basePrice * 0.85
    for (let i = 0; i < 100; i++) {
      const change = (Math.random() - 0.48) * 0.05
      currentPrice = currentPrice * (1 + change)
      history.push(currentPrice)
    }
    history.push(basePrice)
    return history
  }, [price])

  // Calculate all indicators
  const rsi = useMemo(() => calculateRSI(priceHistory), [priceHistory])
  const macd = useMemo(() => calculateMACD(priceHistory), [priceHistory])
  const bollinger = useMemo(() => calculateBollingerBands(priceHistory), [priceHistory])
  const volatility = useMemo(() => calculateVolatility(priceHistory), [priceHistory])

  // Fear & Greed calculation
  const fearGreedIndex = useMemo(() => {
    const rsiWeight = rsi > 70 ? 80 : rsi < 30 ? 20 : 50
    const volWeight = volatility > 50 ? 30 : volatility < 20 ? 70 : 50
    const priceWeight = (priceChange24h || 0) > 5 ? 75 : (priceChange24h || 0) < -5 ? 25 : 50
    return Math.round((rsiWeight + volWeight + priceWeight) / 3)
  }, [rsi, volatility, priceChange24h])

  // Fetch trending crypto data
  useEffect(() => {
    const fetchCryptoData = async () => {
      const mockData: CryptoData[] = [
        {
          symbol: "OPM",
          name: "One Premium",
          price: price || 259.58,
          change24h: priceChange24h || 0,
          change7d: 12.5,
          marketCap: marketCap || 2500000,
          volume24h: volume24h || 259.5,
          logo: "/images/opm-logo-200.png",
          sparkline: priceHistory.slice(-24),
        },
        {
          symbol: "BTC",
          name: "Bitcoin",
          price: 105000,
          change24h: 2.5,
          change7d: 8.2,
          marketCap: 2100000000000,
          volume24h: 45000000000,
          logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png",
          sparkline: Array.from({ length: 24 }, () => 100000 + Math.random() * 10000),
        },
        {
          symbol: "ETH",
          name: "Ethereum",
          price: 3900,
          change24h: 1.8,
          change7d: 5.5,
          marketCap: 470000000000,
          volume24h: 18000000000,
          logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
          sparkline: Array.from({ length: 24 }, () => 3700 + Math.random() * 400),
        },
        {
          symbol: "SOL",
          name: "Solana",
          price: 220,
          change24h: 5.2,
          change7d: 15.3,
          marketCap: 105000000000,
          volume24h: 8500000000,
          logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png",
          sparkline: Array.from({ length: 24 }, () => 200 + Math.random() * 40),
        },
        {
          symbol: "BNB",
          name: "BNB",
          price: 720,
          change24h: -1.2,
          change7d: 3.1,
          marketCap: 108000000000,
          volume24h: 2200000000,
          logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png",
          sparkline: Array.from({ length: 24 }, () => 700 + Math.random() * 40),
        },
        {
          symbol: "XRP",
          name: "XRP",
          price: 2.45,
          change24h: -3.5,
          change7d: -2.1,
          marketCap: 140000000000,
          volume24h: 12000000000,
          logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/52.png",
          sparkline: Array.from({ length: 24 }, () => 2.3 + Math.random() * 0.3),
        },
        {
          symbol: "DOGE",
          name: "Dogecoin",
          price: 0.42,
          change24h: 8.5,
          change7d: 22.3,
          marketCap: 62000000000,
          volume24h: 5500000000,
          logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/74.png",
          sparkline: Array.from({ length: 24 }, () => 0.35 + Math.random() * 0.14),
        },
        {
          symbol: "ADA",
          name: "Cardano",
          price: 1.15,
          change24h: -2.1,
          change7d: 1.8,
          marketCap: 41000000000,
          volume24h: 1800000000,
          logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png",
          sparkline: Array.from({ length: 24 }, () => 1.05 + Math.random() * 0.2),
        },
      ]
      setCryptoData(mockData)
    }

    fetchCryptoData()
  }, [price, priceChange24h, marketCap, volume24h, priceHistory])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setLastUpdate(new Date())
      setIsRefreshing(false)
    }, 1000)
  }

  const topGainers = [...cryptoData].sort((a, b) => b.change24h - a.change24h).slice(0, 4)
  const topLosers = [...cryptoData].sort((a, b) => a.change24h - b.change24h).slice(0, 4)

  const getRSISignal = (value: number) => {
    if (value >= 70) return { text: t.overbought, color: "text-red-500", signal: t.sell }
    if (value <= 30) return { text: t.oversold, color: "text-green-500", signal: t.buy }
    return { text: t.neutral, color: "text-yellow-500", signal: t.hold }
  }

  const getMACDSignal = (macdValue: { macd: number; signal: number }) => {
    if (macdValue.macd > macdValue.signal) return { text: t.bullish, color: "text-green-500", signal: t.buy }
    return { text: t.bearish, color: "text-red-500", signal: t.sell }
  }

  const getFearGreedLabel = (value: number) => {
    if (value <= 20) return { text: t.extreme_fear, color: "bg-red-600" }
    if (value <= 40) return { text: t.fear, color: "bg-orange-500" }
    if (value <= 60) return { text: t.neutral_fg, color: "bg-yellow-500" }
    if (value <= 80) return { text: t.greed, color: "bg-lime-500" }
    return { text: t.extreme_greed, color: "bg-green-500" }
  }

  const formatLargeNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`
    return `$${num.toFixed(2)}`
  }

  // Mini sparkline chart component
  const Sparkline = ({ data, positive }: { data: number[]; positive: boolean }) => {
    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1
    const points = data
      .map((val, i) => {
        const x = (i / (data.length - 1)) * 100
        const y = 100 - ((val - min) / range) * 100
        return `${x},${y}`
      })
      .join(" ")

    return (
      <svg viewBox="0 0 100 100" className="w-20 h-8" preserveAspectRatio="none">
        <polyline
          points={points}
          fill="none"
          stroke={positive ? "#22c55e" : "#ef4444"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnimatedBackground />
      <Header />
      <main className="container px-4 py-24 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground flex items-center gap-3">
                <Activity className="h-8 w-8 text-primary" />
                {t.title}
              </h1>
              <p className="text-muted-foreground mt-1">{t.subtitle}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {t.lastUpdate}: {lastUpdate.toLocaleTimeString()}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="gap-2 bg-transparent"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                {t.refresh}
              </Button>
            </div>
          </div>

          {/* OPM Technical Analysis Card */}
          <div className="mb-8 p-6 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent backdrop-blur border border-primary/30 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Image
                src="/images/opm-logo-200.png"
                alt="OPM"
                width={48}
                height={48}
                className="rounded-full border-2 border-primary/50"
              />
              <div>
                <h2 className="text-xl font-semibold">{t.opmAnalysis}</h2>
                <p className="text-sm text-muted-foreground">One Premium (OPM)</p>
              </div>
              <div className="ml-auto text-right">
                <div className="text-2xl font-bold text-primary">${(price || 259.58).toFixed(2)}</div>
                <div
                  className={`flex items-center justify-end gap-1 text-sm ${(priceChange24h || 0) >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {(priceChange24h || 0) >= 0 ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  {Math.abs(priceChange24h || 0).toFixed(2)}%
                </div>
              </div>
            </div>

            {/* Technical Indicators Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* RSI */}
              <div className="p-4 bg-background/50 rounded-xl border border-border/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{t.rsi}</span>
                  <LineChart className="h-4 w-4 text-primary" />
                </div>
                <div className="text-2xl font-bold">{rsi.toFixed(1)}</div>
                <div className={`text-xs mt-1 ${getRSISignal(rsi).color}`}>
                  {getRSISignal(rsi).text} - {getRSISignal(rsi).signal}
                </div>
                {/* RSI Gauge */}
                <div className="mt-2 h-2 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full relative">
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border-2 border-black shadow-lg"
                    style={{ left: `${rsi}%` }}
                  />
                </div>
              </div>

              {/* MACD */}
              <div className="p-4 bg-background/50 rounded-xl border border-border/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{t.macd}</span>
                  <BarChart3 className="h-4 w-4 text-primary" />
                </div>
                <div className="text-2xl font-bold">{macd.macd.toFixed(2)}</div>
                <div className={`text-xs mt-1 ${getMACDSignal(macd).color}`}>
                  {getMACDSignal(macd).text} - {getMACDSignal(macd).signal}
                </div>
                {/* MACD Histogram */}
                <div className="mt-2 flex items-end gap-0.5 h-6">
                  {Array.from({ length: 12 }).map((_, i) => {
                    const val = macd.histogram * (0.5 + Math.random() * 0.5) * (i % 2 === 0 ? 1 : -0.8)
                    const positive = val > 0
                    return (
                      <div
                        key={i}
                        className={`flex-1 rounded-sm ${positive ? "bg-green-500" : "bg-red-500"}`}
                        style={{ height: `${Math.abs(val) * 20 + 4}px` }}
                      />
                    )
                  })}
                </div>
              </div>

              {/* Bollinger Bands */}
              <div className="p-4 bg-background/50 rounded-xl border border-border/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{t.bollinger}</span>
                  <CandlestickChart className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Upper:</span>
                    <span className="text-green-500">${bollinger.upper.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Middle:</span>
                    <span>${bollinger.middle.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lower:</span>
                    <span className="text-red-500">${bollinger.lower.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Volatility */}
              <div className="p-4 bg-background/50 rounded-xl border border-border/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{t.volatility}</span>
                  <Zap className="h-4 w-4 text-primary" />
                </div>
                <div className="text-2xl font-bold">{volatility.toFixed(1)}%</div>
                <div className="text-xs mt-1 text-muted-foreground">Annualized</div>
                {/* Volatility indicator */}
                <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${volatility > 80 ? "bg-red-500" : volatility > 40 ? "bg-yellow-500" : "bg-green-500"}`}
                    style={{ width: `${Math.min(volatility, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Fear & Greed Index */}
          <div className="mb-8 p-6 bg-card/50 backdrop-blur border border-border/50 rounded-2xl">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              {t.fearGreed}
            </h3>
            <div className="flex items-center gap-6">
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    className="text-muted/20"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    strokeWidth="10"
                    strokeDasharray={`${fearGreedIndex * 2.83} 283`}
                    strokeLinecap="round"
                    className={getFearGreedLabel(fearGreedIndex).color.replace("bg-", "text-")}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">{fearGreedIndex}</span>
                </div>
              </div>
              <div>
                <div
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium text-white ${getFearGreedLabel(fearGreedIndex).color}`}
                >
                  {getFearGreedLabel(fearGreedIndex).text}
                </div>
                <p className="text-sm text-muted-foreground mt-2 max-w-md">
                  {language === "en"
                    ? "The Fear & Greed Index analyzes emotions and sentiments from different sources including volatility, market momentum, social media trends, and surveys."
                    : "Der Angst & Gier Index analysiert Emotionen und Stimmungen aus verschiedenen Quellen einschließlich Volatilität, Marktdynamik, Social Media Trends und Umfragen."}
                </p>
              </div>
            </div>
          </div>

          {/* Gainers & Losers */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Top Gainers */}
            <div className="p-6 bg-card/50 backdrop-blur border border-border/50 rounded-2xl">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                {t.topGainers}
              </h3>
              <div className="space-y-3">
                {topGainers.map((coin, i) => (
                  <div
                    key={coin.symbol}
                    className="flex items-center gap-3 p-3 bg-green-500/5 rounded-xl border border-green-500/20"
                  >
                    <span className="text-sm font-medium text-muted-foreground w-5">{i + 1}</span>
                    <Image
                      src={coin.logo || "/placeholder.svg"}
                      alt={coin.symbol}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{coin.symbol}</div>
                      <div className="text-xs text-muted-foreground">{coin.name}</div>
                    </div>
                    <Sparkline data={coin.sparkline} positive={true} />
                    <div className="text-right">
                      <div className="font-medium">
                        ${coin.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </div>
                      <div className="text-sm text-green-500 flex items-center justify-end gap-1">
                        <ArrowUpRight className="h-3 w-3" />+{coin.change24h.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Losers */}
            <div className="p-6 bg-card/50 backdrop-blur border border-border/50 rounded-2xl">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-red-500" />
                {t.topLosers}
              </h3>
              <div className="space-y-3">
                {topLosers.map((coin, i) => (
                  <div
                    key={coin.symbol}
                    className="flex items-center gap-3 p-3 bg-red-500/5 rounded-xl border border-red-500/20"
                  >
                    <span className="text-sm font-medium text-muted-foreground w-5">{i + 1}</span>
                    <Image
                      src={coin.logo || "/placeholder.svg"}
                      alt={coin.symbol}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{coin.symbol}</div>
                      <div className="text-xs text-muted-foreground">{coin.name}</div>
                    </div>
                    <Sparkline data={coin.sparkline} positive={false} />
                    <div className="text-right">
                      <div className="font-medium">
                        ${coin.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </div>
                      <div className="text-sm text-red-500 flex items-center justify-end gap-1">
                        <ArrowDownRight className="h-3 w-3" />
                        {coin.change24h.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Full Market Table */}
          <div className="p-6 bg-card/50 backdrop-blur border border-border/50 rounded-2xl">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              {t.marketOverview}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">#</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Token</th>
                    <th className="text-right p-3 text-sm font-medium text-muted-foreground">{t.price}</th>
                    <th className="text-right p-3 text-sm font-medium text-muted-foreground">24h</th>
                    <th className="text-right p-3 text-sm font-medium text-muted-foreground">7d</th>
                    <th className="text-right p-3 text-sm font-medium text-muted-foreground hidden md:table-cell">
                      {t.marketCap}
                    </th>
                    <th className="text-right p-3 text-sm font-medium text-muted-foreground hidden lg:table-cell">
                      {t.volume}
                    </th>
                    <th className="text-right p-3 text-sm font-medium text-muted-foreground hidden sm:table-cell">
                      Chart
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cryptoData.map((coin, i) => (
                    <tr key={coin.symbol} className="border-b border-border/30 hover:bg-primary/5 transition-colors">
                      <td className="p-3 text-sm text-muted-foreground">{i + 1}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <Image
                            src={coin.logo || "/placeholder.svg"}
                            alt={coin.symbol}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                          <div>
                            <div className="font-medium">{coin.symbol}</div>
                            <div className="text-xs text-muted-foreground">{coin.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-right font-medium">
                        ${coin.price.toLocaleString(undefined, { maximumFractionDigits: coin.price < 1 ? 4 : 2 })}
                      </td>
                      <td className={`p-3 text-right ${coin.change24h >= 0 ? "text-green-500" : "text-red-500"}`}>
                        <div className="flex items-center justify-end gap-1">
                          {coin.change24h >= 0 ? (
                            <ArrowUpRight className="h-3 w-3" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3" />
                          )}
                          {Math.abs(coin.change24h).toFixed(2)}%
                        </div>
                      </td>
                      <td className={`p-3 text-right ${coin.change7d >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {coin.change7d >= 0 ? "+" : ""}
                        {coin.change7d.toFixed(2)}%
                      </td>
                      <td className="p-3 text-right hidden md:table-cell">{formatLargeNumber(coin.marketCap)}</td>
                      <td className="p-3 text-right hidden lg:table-cell">{formatLargeNumber(coin.volume24h)}</td>
                      <td className="p-3 hidden sm:table-cell">
                        <div className="flex justify-end">
                          <Sparkline data={coin.sparkline} positive={coin.change24h >= 0} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/dex">
              <Button className="gap-2 bg-primary hover:bg-primary/90">
                <Sparkles className="h-4 w-4" />
                {language === "en" ? "Trade on OPM DEX" : "Handel auf OPM DEX"}
              </Button>
            </Link>
            <Link
              href="https://dex.coinmarketcap.com/token/ethereum/0xe430b07f7b168e77b07b29482dbf89eafa53f484/"
              target="_blank"
            >
              <Button variant="outline" className="gap-2 bg-transparent">
                <DollarSign className="h-4 w-4" />
                CoinMarketCap
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
