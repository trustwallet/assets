"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/hooks/use-language"
import { useWallet } from "@/hooks/use-wallet"
import { useOPMData } from "@/hooks/use-opm-data"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AnimatedBackground } from "@/components/animated-background"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ArrowDownUp,
  Settings,
  ChevronDown,
  Loader2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Droplets,
  BarChart3,
  Clock,
  ExternalLink,
  Wallet,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { OPM_TOKEN_ADDRESS, UNISWAP_BUY_URL, CMC_DEX_URL } from "@/lib/constants"

interface Token {
  symbol: string
  name: string
  address: string
  decimals: number
  logo: string
  balance?: number
}

const TOKENS: Token[] = [
  {
    symbol: "ETH",
    name: "Ethereum",
    address: "0x0000000000000000000000000000000000000000",
    decimals: 18,
    logo: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
  },
  {
    symbol: "OPM",
    name: "One Premium",
    address: OPM_TOKEN_ADDRESS,
    decimals: 18,
    logo: "/images/opm-logo-200.png",
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    decimals: 6,
    logo: "https://assets.coingecko.com/coins/images/325/small/Tether.png",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    decimals: 6,
    logo: "https://assets.coingecko.com/coins/images/6319/small/usdc.png",
  },
  {
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    decimals: 8,
    logo: "https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png",
  },
]

export default function DEXPage() {
  const { language } = useLanguage()
  const { isConnected, address, connect, isConnecting } = useWallet(true)
  const { price, priceChange24h, volume24h, marketCap } = useOPMData(address)

  const [fromToken, setFromToken] = useState<Token>(TOKENS[0])
  const [toToken, setToToken] = useState<Token>(TOKENS[1])
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [slippage, setSlippage] = useState(0.5)
  const [showSettings, setShowSettings] = useState(false)
  const [showFromTokenList, setShowFromTokenList] = useState(false)
  const [showToTokenList, setShowToTokenList] = useState(false)
  const [isSwapping, setIsSwapping] = useState(false)

  const content = {
    en: {
      title: "OPM DEX",
      subtitle: "Decentralized Exchange",
      swap: "Swap",
      from: "From",
      to: "To",
      balance: "Balance",
      connectWallet: "Connect Wallet",
      swapNow: "Swap Now",
      swapping: "Swapping...",
      selectToken: "Select Token",
      slippageTolerance: "Slippage Tolerance",
      transactionDeadline: "Transaction Deadline",
      minutes: "minutes",
      priceImpact: "Price Impact",
      minimumReceived: "Minimum Received",
      networkFee: "Network Fee",
      route: "Route",
      marketStats: "Market Statistics",
      price: "Price",
      change24h: "24h Change",
      volume24h: "24h Volume",
      marketCap: "Market Cap",
      liquidity: "Liquidity",
      recentTrades: "Recent Trades",
      noTrades: "No recent trades",
      insufficientBalance: "Insufficient Balance",
      enterAmount: "Enter Amount",
      viewOnEtherscan: "View on Etherscan",
      viewOnCMC: "View on CoinMarketCap",
      poweredBy: "Powered by Uniswap Protocol",
      warning: "Trading involves risk. Only trade with funds you can afford to lose.",
    },
    de: {
      title: "OPM DEX",
      subtitle: "Dezentralisierte Börse",
      swap: "Tauschen",
      from: "Von",
      to: "Nach",
      balance: "Guthaben",
      connectWallet: "Wallet verbinden",
      swapNow: "Jetzt tauschen",
      swapping: "Tausche...",
      selectToken: "Token auswählen",
      slippageTolerance: "Slippage-Toleranz",
      transactionDeadline: "Transaktionsfrist",
      minutes: "Minuten",
      priceImpact: "Preisauswirkung",
      minimumReceived: "Mindesterhalt",
      networkFee: "Netzwerkgebühr",
      route: "Route",
      marketStats: "Marktstatistiken",
      price: "Preis",
      change24h: "24h Änderung",
      volume24h: "24h Volumen",
      marketCap: "Marktkapitalisierung",
      liquidity: "Liquidität",
      recentTrades: "Letzte Trades",
      noTrades: "Keine aktuellen Trades",
      insufficientBalance: "Unzureichendes Guthaben",
      enterAmount: "Betrag eingeben",
      viewOnEtherscan: "Auf Etherscan ansehen",
      viewOnCMC: "Auf CoinMarketCap ansehen",
      poweredBy: "Powered by Uniswap Protocol",
      warning: "Trading birgt Risiken. Handeln Sie nur mit Geld, das Sie sich leisten können zu verlieren.",
    },
  }

  const t = content[language]

  // Calculate swap amounts based on price
  useEffect(() => {
    if (fromAmount && price) {
      const fromValue = Number.parseFloat(fromAmount)
      if (!isNaN(fromValue)) {
        let calculatedTo = 0
        if (fromToken.symbol === "ETH" && toToken.symbol === "OPM") {
          // ETH to OPM: assume ETH price ~$3500
          calculatedTo = (fromValue * 3500) / price
        } else if (fromToken.symbol === "OPM" && toToken.symbol === "ETH") {
          calculatedTo = (fromValue * price) / 3500
        } else if (fromToken.symbol === "OPM") {
          calculatedTo = fromValue * price
        } else if (toToken.symbol === "OPM") {
          calculatedTo = fromValue / price
        } else {
          calculatedTo = fromValue
        }
        setToAmount(calculatedTo.toFixed(6))
      }
    } else {
      setToAmount("")
    }
  }, [fromAmount, price, fromToken, toToken])

  const switchTokens = () => {
    setFromToken(toToken)
    setToToken(fromToken)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }

  const handleSwap = async () => {
    if (!isConnected) {
      connect()
      return
    }

    setIsSwapping(true)
    // Redirect to Uniswap for actual swap
    window.open(UNISWAP_BUY_URL, "_blank")
    setTimeout(() => setIsSwapping(false), 1000)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`
    if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`
    return `$${num.toFixed(2)}`
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnimatedBackground />
      <Header />
      <main className="container px-4 py-24 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Image src="/images/opm-logo-200.png" alt="OPM" width={48} height={48} className="rounded-full" />
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">{t.title}</h1>
            </div>
            <p className="text-muted-foreground">{t.subtitle}</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Swap Card */}
            <div className="lg:col-span-2">
              <div className="p-6 bg-card/50 backdrop-blur border border-border/50 rounded-2xl">
                {/* Settings */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">{t.swap}</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSettings(!showSettings)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </div>

                {showSettings && (
                  <div className="mb-6 p-4 bg-background/50 rounded-xl border border-border/30">
                    <div className="mb-4">
                      <label className="text-sm text-muted-foreground mb-2 block">{t.slippageTolerance}</label>
                      <div className="flex gap-2">
                        {[0.1, 0.5, 1.0].map((s) => (
                          <Button
                            key={s}
                            variant={slippage === s ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSlippage(s)}
                            className={slippage === s ? "bg-primary" : ""}
                          >
                            {s}%
                          </Button>
                        ))}
                        <Input
                          type="number"
                          value={slippage}
                          onChange={(e) => setSlippage(Number.parseFloat(e.target.value) || 0.5)}
                          className="w-20 text-center"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* From Token */}
                <div className="p-4 bg-background/50 rounded-xl border border-border/30 mb-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">{t.from}</span>
                    <span className="text-sm text-muted-foreground">
                      {t.balance}: {fromToken.balance?.toFixed(4) || "0.00"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      placeholder="0.0"
                      value={fromAmount}
                      onChange={(e) => setFromAmount(e.target.value)}
                      className="flex-1 text-2xl font-semibold bg-transparent border-none focus-visible:ring-0 p-0"
                    />
                    <div className="relative">
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 min-w-[140px] bg-transparent"
                        onClick={() => setShowFromTokenList(!showFromTokenList)}
                      >
                        <Image
                          src={fromToken.logo || "/placeholder.svg"}
                          alt={fromToken.symbol}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                        <span>{fromToken.symbol}</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      {showFromTokenList && (
                        <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto">
                          {TOKENS.filter((t) => t.symbol !== toToken.symbol).map((token) => (
                            <button
                              key={token.symbol}
                              className="w-full flex items-center gap-3 p-3 hover:bg-primary/10 transition-colors"
                              onClick={() => {
                                setFromToken(token)
                                setShowFromTokenList(false)
                              }}
                            >
                              <Image
                                src={token.logo || "/placeholder.svg"}
                                alt={token.symbol}
                                width={32}
                                height={32}
                                className="rounded-full"
                              />
                              <div className="text-left">
                                <div className="font-medium">{token.symbol}</div>
                                <div className="text-xs text-muted-foreground">{token.name}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Switch Button */}
                <div className="flex justify-center -my-3 relative z-10">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-card border-2 border-border hover:bg-primary/10 hover:border-primary transition-all"
                    onClick={switchTokens}
                  >
                    <ArrowDownUp className="h-4 w-4" />
                  </Button>
                </div>

                {/* To Token */}
                <div className="p-4 bg-background/50 rounded-xl border border-border/30 mt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">{t.to}</span>
                    <span className="text-sm text-muted-foreground">
                      {t.balance}: {toToken.balance?.toFixed(4) || "0.00"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      placeholder="0.0"
                      value={toAmount}
                      readOnly
                      className="flex-1 text-2xl font-semibold bg-transparent border-none focus-visible:ring-0 p-0"
                    />
                    <div className="relative">
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 min-w-[140px] bg-transparent"
                        onClick={() => setShowToTokenList(!showToTokenList)}
                      >
                        <Image
                          src={toToken.logo || "/placeholder.svg"}
                          alt={toToken.symbol}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                        <span>{toToken.symbol}</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      {showToTokenList && (
                        <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto">
                          {TOKENS.filter((t) => t.symbol !== fromToken.symbol).map((token) => (
                            <button
                              key={token.symbol}
                              className="w-full flex items-center gap-3 p-3 hover:bg-primary/10 transition-colors"
                              onClick={() => {
                                setToToken(token)
                                setShowToTokenList(false)
                              }}
                            >
                              <Image
                                src={token.logo || "/placeholder.svg"}
                                alt={token.symbol}
                                width={32}
                                height={32}
                                className="rounded-full"
                              />
                              <div className="text-left">
                                <div className="font-medium">{token.symbol}</div>
                                <div className="text-xs text-muted-foreground">{token.name}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Swap Details */}
                {fromAmount && toAmount && (
                  <div className="mt-4 p-4 bg-background/30 rounded-xl space-y-2 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>{t.priceImpact}</span>
                      <span className="text-green-500">{"<"}0.01%</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>{t.minimumReceived}</span>
                      <span>
                        {(Number.parseFloat(toAmount) * (1 - slippage / 100)).toFixed(6)} {toToken.symbol}
                      </span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>{t.networkFee}</span>
                      <span>~$2.50</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>{t.route}</span>
                      <span>
                        {fromToken.symbol} → {toToken.symbol}
                      </span>
                    </div>
                  </div>
                )}

                {/* Swap Button */}
                <Button
                  className="w-full mt-6 h-14 text-lg font-semibold bg-primary hover:bg-primary/90"
                  onClick={handleSwap}
                  disabled={isSwapping || isConnecting}
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : isSwapping ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      {t.swapping}
                    </>
                  ) : !isConnected ? (
                    <>
                      <Wallet className="h-5 w-5 mr-2" />
                      {t.connectWallet}
                    </>
                  ) : !fromAmount ? (
                    t.enterAmount
                  ) : (
                    t.swapNow
                  )}
                </Button>

                {/* Warning */}
                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-yellow-500/80">{t.warning}</p>
                </div>

                {/* Powered By */}
                <p className="text-center text-xs text-muted-foreground mt-4">{t.poweredBy}</p>
              </div>
            </div>

            {/* Market Stats */}
            <div className="space-y-4">
              {/* Price Card */}
              <div className="p-5 bg-card/50 backdrop-blur border border-border/50 rounded-xl">
                <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  {t.marketStats}
                </h3>

                <div className="flex items-center gap-3 mb-4">
                  <Image src="/images/opm-logo-200.png" alt="OPM" width={40} height={40} className="rounded-full" />
                  <div>
                    <div className="font-semibold">OPM</div>
                    <div className="text-sm text-muted-foreground">One Premium</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">{t.price}</span>
                    <span className="font-semibold text-primary">${price?.toFixed(2) || "259.58"}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">{t.change24h}</span>
                    <span
                      className={`font-semibold flex items-center gap-1 ${(priceChange24h || 0) >= 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {(priceChange24h || 0) >= 0 ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      {(priceChange24h || 0).toFixed(2)}%
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">{t.volume24h}</span>
                    <span className="font-medium">{formatNumber(volume24h || 45000)}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">{t.marketCap}</span>
                    <span className="font-medium">{formatNumber(marketCap || 2595800)}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">{t.liquidity}</span>
                    <span className="font-medium flex items-center gap-1">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      {formatNumber(125000)}
                    </span>
                  </div>
                </div>

                {/* Links */}
                <div className="mt-4 pt-4 border-t border-border/50 space-y-2">
                  <Link
                    href={`https://etherscan.io/token/${OPM_TOKEN_ADDRESS}`}
                    target="_blank"
                    className="flex items-center justify-between p-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span>{t.viewOnEtherscan}</span>
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                  <Link
                    href={CMC_DEX_URL}
                    target="_blank"
                    className="flex items-center justify-between p-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span>{t.viewOnCMC}</span>
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Recent Trades */}
              <div className="p-5 bg-card/50 backdrop-blur border border-border/50 rounded-xl">
                <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {t.recentTrades}
                </h3>

                <div className="space-y-2">
                  {[
                    { type: "buy", amount: "2.5", price: "259.80", time: "2m ago" },
                    { type: "sell", amount: "1.2", price: "259.45", time: "5m ago" },
                    { type: "buy", amount: "5.0", price: "259.60", time: "8m ago" },
                    { type: "buy", amount: "0.8", price: "259.55", time: "12m ago" },
                    { type: "sell", amount: "3.0", price: "259.30", time: "15m ago" },
                  ].map((trade, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-background/30 rounded-lg text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${trade.type === "buy" ? "bg-green-500" : "bg-red-500"}`}
                        />
                        <span className={trade.type === "buy" ? "text-green-500" : "text-red-500"}>
                          {trade.type === "buy" ? "Buy" : "Sell"}
                        </span>
                        <span className="text-muted-foreground">{trade.amount} OPM</span>
                      </div>
                      <div className="text-right">
                        <div className="text-foreground">${trade.price}</div>
                        <div className="text-xs text-muted-foreground">{trade.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
