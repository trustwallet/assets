"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/hooks/use-language"
import { useWallet } from "@/hooks/use-wallet"
import { useOPMData } from "@/hooks/use-opm-data"
import { useWalletTokens } from "@/hooks/use-wallet-tokens"
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
  BarChart3,
  ExternalLink,
  Wallet,
  RefreshCw,
  Percent,
  Zap,
  Shield,
  ArrowRight,
  Check,
  Copy,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { OPM_TOKEN_ADDRESS, CMC_DEX_URL } from "@/lib/constants"

interface Token {
  symbol: string
  name: string
  address: string
  decimals: number
  logo: string
  balance?: number
  priceUsd?: number
}

const SUPPORTED_TOKENS: Token[] = [
  {
    symbol: "ETH",
    name: "Ethereum",
    address: "0x0000000000000000000000000000000000000000",
    decimals: 18,
    logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png",
    priceUsd: 3900,
  },
  {
    symbol: "OPM",
    name: "One Premium",
    address: OPM_TOKEN_ADDRESS,
    decimals: 18,
    logo: "/images/opm-logo-200.png",
    priceUsd: 259.58,
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    decimals: 6,
    logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/825.png",
    priceUsd: 1,
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    decimals: 6,
    logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png",
    priceUsd: 1,
  },
  {
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    decimals: 8,
    logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/3717.png",
    priceUsd: 105000,
  },
  {
    symbol: "DAI",
    name: "Dai Stablecoin",
    address: "0x6B175474E89094C44Da98b954EesdfDCADE517D",
    decimals: 18,
    logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/4943.png",
    priceUsd: 1,
  },
]

const calculateAMMOutput = (
  inputAmount: number,
  inputReserve: number,
  outputReserve: number,
  fee = 0.003,
): { output: number; priceImpact: number; executionPrice: number } => {
  if (inputAmount <= 0 || inputReserve <= 0 || outputReserve <= 0) {
    return { output: 0, priceImpact: 0, executionPrice: 0 }
  }

  const inputWithFee = inputAmount * (1 - fee)
  const numerator = inputWithFee * outputReserve
  const denominator = inputReserve + inputWithFee
  const output = numerator / denominator

  const spotPrice = outputReserve / inputReserve
  const executionPrice = output / inputAmount
  const priceImpact = Math.abs((spotPrice - executionPrice) / spotPrice) * 100

  return { output, priceImpact, executionPrice }
}

const findOptimalRoute = (
  fromToken: Token,
  toToken: Token,
  amount: number,
): { route: string[]; output: number; priceImpact: number } => {
  // Direct route
  const directReserveIn = 1000000 * (fromToken.priceUsd || 1)
  const directReserveOut = 1000000 * (toToken.priceUsd || 1)
  const direct = calculateAMMOutput(amount * (fromToken.priceUsd || 1), directReserveIn, directReserveOut)

  // Route through ETH (if not already ETH)
  let viaEth = { output: 0, priceImpact: 100 }
  if (fromToken.symbol !== "ETH" && toToken.symbol !== "ETH") {
    const ethReserve = 1000000 * 3900
    const firstLeg = calculateAMMOutput(amount * (fromToken.priceUsd || 1), directReserveIn, ethReserve)
    const secondLeg = calculateAMMOutput(firstLeg.output, ethReserve, directReserveOut)
    viaEth = {
      output: secondLeg.output / (toToken.priceUsd || 1),
      priceImpact: firstLeg.priceImpact + secondLeg.priceImpact,
    }
  }

  // Choose best route
  const directOutput = direct.output / (toToken.priceUsd || 1)
  if (directOutput >= viaEth.output || fromToken.symbol === "ETH" || toToken.symbol === "ETH") {
    return {
      route: [fromToken.symbol, toToken.symbol],
      output: directOutput,
      priceImpact: direct.priceImpact,
    }
  }

  return {
    route: [fromToken.symbol, "ETH", toToken.symbol],
    output: viaEth.output,
    priceImpact: viaEth.priceImpact,
  }
}

export default function DEXPage() {
  const { language } = useLanguage()
  const { isConnected, address, connect, isConnecting } = useWallet(true)
  const { price, priceChange24h, volume24h, marketCap } = useOPMData(address)
  const {
    tokens: walletTokens,
    totalValue,
    isLoading: tokensLoading,
    refresh: refreshTokens,
  } = useWalletTokens(address)

  const [fromToken, setFromToken] = useState<Token>(SUPPORTED_TOKENS[0])
  const [toToken, setToToken] = useState<Token>(SUPPORTED_TOKENS[1])
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [slippage, setSlippage] = useState(0.5)
  const [showSettings, setShowSettings] = useState(false)
  const [showFromTokenList, setShowFromTokenList] = useState(false)
  const [showToTokenList, setShowToTokenList] = useState(false)
  const [isSwapping, setIsSwapping] = useState(false)
  const [swapRoute, setSwapRoute] = useState<string[]>([])
  const [priceImpact, setPriceImpact] = useState(0)
  const [copiedAddress, setCopiedAddress] = useState(false)
  const [activeTab, setActiveTab] = useState<"swap" | "assets">("swap")

  const content = {
    en: {
      title: "OPM DEX",
      subtitle: "Decentralized Exchange with Advanced AMM Algorithm",
      swap: "Swap",
      assets: "Your Assets",
      from: "From",
      to: "To",
      balance: "Balance",
      connectWallet: "Connect Wallet",
      swapNow: "Swap via Uniswap",
      swapping: "Processing...",
      selectToken: "Select Token",
      slippageTolerance: "Slippage Tolerance",
      priceImpact: "Price Impact",
      minimumReceived: "Minimum Received",
      networkFee: "Network Fee",
      route: "Optimal Route",
      marketStats: "OPM Market Data",
      price: "Price",
      change24h: "24h Change",
      volume24h: "24h Volume",
      marketCap: "Market Cap",
      enterAmount: "Enter Amount",
      insufficientBalance: "Insufficient Balance",
      viewOnEtherscan: "View on Etherscan",
      viewOnCMC: "View on CoinMarketCap",
      poweredBy: "Powered by Uniswap V3 Protocol",
      warning: "Trading involves significant risk. Only trade with funds you can afford to lose.",
      totalValue: "Total Portfolio Value",
      noAssets: "No assets found in wallet",
      refreshing: "Refreshing...",
      copyAddress: "Copy Address",
      addressCopied: "Address Copied!",
      ammInfo: "Constant Product AMM (x × y = k)",
      optimalRouting: "Smart routing finds the best price across liquidity pools",
    },
    de: {
      title: "OPM DEX",
      subtitle: "Dezentralisierte Börse mit Fortgeschrittenem AMM-Algorithmus",
      swap: "Tauschen",
      assets: "Ihre Vermögenswerte",
      from: "Von",
      to: "Nach",
      balance: "Guthaben",
      connectWallet: "Wallet verbinden",
      swapNow: "Über Uniswap tauschen",
      swapping: "Verarbeitung...",
      selectToken: "Token auswählen",
      slippageTolerance: "Slippage-Toleranz",
      priceImpact: "Preisauswirkung",
      minimumReceived: "Mindesterhalt",
      networkFee: "Netzwerkgebühr",
      route: "Optimale Route",
      marketStats: "OPM Marktdaten",
      price: "Preis",
      change24h: "24h Änderung",
      volume24h: "24h Volumen",
      marketCap: "Marktkapitalisierung",
      enterAmount: "Betrag eingeben",
      insufficientBalance: "Unzureichendes Guthaben",
      viewOnEtherscan: "Auf Etherscan ansehen",
      viewOnCMC: "Auf CoinMarketCap ansehen",
      poweredBy: "Powered by Uniswap V3 Protocol",
      warning:
        "Der Handel birgt erhebliche Risiken. Handeln Sie nur mit Geldern, die Sie sich leisten können zu verlieren.",
      totalValue: "Gesamtportfoliowert",
      noAssets: "Keine Vermögenswerte in der Wallet gefunden",
      refreshing: "Aktualisierung...",
      copyAddress: "Adresse kopieren",
      addressCopied: "Adresse kopiert!",
      ammInfo: "Konstantes Produkt AMM (x × y = k)",
      optimalRouting: "Smart-Routing findet den besten Preis über Liquiditätspools",
    },
  }

  const t = content[language]

  useEffect(() => {
    if (walletTokens.length > 0) {
      SUPPORTED_TOKENS.forEach((token) => {
        const walletToken = walletTokens.find((wt) => wt.symbol.toUpperCase() === token.symbol.toUpperCase())
        if (walletToken) {
          token.balance = Number.parseFloat(walletToken.balance)
          token.priceUsd = walletToken.priceUsd
        }
      })
    }
  }, [walletTokens])

  useEffect(() => {
    if (fromAmount && Number.parseFloat(fromAmount) > 0) {
      const amount = Number.parseFloat(fromAmount)
      const { route, output, priceImpact: impact } = findOptimalRoute(fromToken, toToken, amount)
      setToAmount(output.toFixed(6))
      setSwapRoute(route)
      setPriceImpact(impact)
    } else {
      setToAmount("")
      setSwapRoute([])
      setPriceImpact(0)
    }
  }, [fromAmount, fromToken, toToken, price])

  const switchTokens = () => {
    setFromToken(toToken)
    setToToken(fromToken)
    setFromAmount(toAmount)
  }

  const handleSwap = async () => {
    if (!isConnected) {
      connect()
      return
    }

    setIsSwapping(true)

    // Build Uniswap URL with parameters
    const uniswapUrl = `https://app.uniswap.org/#/swap?inputCurrency=${fromToken.address}&outputCurrency=${toToken.address}&exactAmount=${fromAmount}&exactField=input`
    window.open(uniswapUrl, "_blank")

    setTimeout(() => setIsSwapping(false), 1000)
  }

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopiedAddress(true)
      setTimeout(() => setCopiedAddress(false), 2000)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`
    if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`
    return `$${num.toFixed(2)}`
  }

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

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

            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full text-sm">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-primary font-medium">{t.ammInfo}</span>
            </div>
          </div>

          {isConnected && address && (
            <div className="mb-6 p-4 bg-gradient-to-r from-green-500/10 to-primary/10 border border-green-500/30 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Connected Wallet</p>
                  <p className="font-mono font-medium">{formatAddress(address)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={copyAddress} className="gap-2 bg-transparent">
                  {copiedAddress ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copiedAddress ? t.addressCopied : t.copyAddress}
                </Button>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{t.totalValue}</p>
                  <p className="text-lg font-bold text-primary">${totalValue.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}

          {isConnected && (
            <div className="flex gap-2 mb-6">
              <Button
                variant={activeTab === "swap" ? "default" : "outline"}
                onClick={() => setActiveTab("swap")}
                className={activeTab === "swap" ? "bg-primary" : "bg-transparent"}
              >
                <ArrowDownUp className="h-4 w-4 mr-2" />
                {t.swap}
              </Button>
              <Button
                variant={activeTab === "assets" ? "default" : "outline"}
                onClick={() => setActiveTab("assets")}
                className={activeTab === "assets" ? "bg-primary" : "bg-transparent"}
              >
                <Wallet className="h-4 w-4 mr-2" />
                {t.assets}
              </Button>
            </div>
          )}

          {isConnected && activeTab === "assets" && (
            <div className="mb-8 p-6 bg-card/50 backdrop-blur border border-border/50 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-primary" />
                  {t.assets}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshTokens}
                  disabled={tokensLoading}
                  className="gap-2 bg-transparent"
                >
                  <RefreshCw className={`h-4 w-4 ${tokensLoading ? "animate-spin" : ""}`} />
                  {tokensLoading ? t.refreshing : "Refresh"}
                </Button>
              </div>

              {walletTokens.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">{t.noAssets}</p>
              ) : (
                <div className="space-y-3">
                  {walletTokens.map((token) => (
                    <div
                      key={token.symbol}
                      className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border/30 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Image
                          src={token.logo || "/placeholder.svg"}
                          alt={token.symbol}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                        <div>
                          <div className="font-semibold">{token.symbol}</div>
                          <div className="text-sm text-muted-foreground">{token.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{Number.parseFloat(token.balance).toFixed(4)}</div>
                        <div className="text-sm text-muted-foreground">${token.valueUsd.toFixed(2)}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm ${token.change24h >= 0 ? "text-green-500" : "text-red-500"}`}>
                          {token.change24h >= 0 ? "+" : ""}
                          {token.change24h.toFixed(2)}%
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const foundToken = SUPPORTED_TOKENS.find((t) => t.symbol === token.symbol)
                            if (foundToken) {
                              setFromToken(foundToken)
                              setActiveTab("swap")
                            }
                          }}
                          className="text-xs text-primary hover:text-primary/80"
                        >
                          Swap <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Swap Interface */}
          {(!isConnected || activeTab === "swap") && (
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
                        <label className="text-sm text-muted-foreground mb-2 block flex items-center gap-2">
                          <Percent className="h-4 w-4" />
                          {t.slippageTolerance}
                        </label>
                        <div className="flex gap-2">
                          {[0.1, 0.5, 1.0, 3.0].map((s) => (
                            <Button
                              key={s}
                              variant={slippage === s ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSlippage(s)}
                              className={slippage === s ? "bg-primary" : "bg-transparent"}
                            >
                              {s}%
                            </Button>
                          ))}
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
                            {SUPPORTED_TOKENS.filter((t) => t.symbol !== toToken.symbol).map((token) => (
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
                                <div className="text-left flex-1">
                                  <div className="font-medium">{token.symbol}</div>
                                  <div className="text-xs text-muted-foreground">{token.name}</div>
                                </div>
                                {token.balance && (
                                  <div className="text-right text-sm text-muted-foreground">
                                    {token.balance.toFixed(4)}
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    {fromAmount && fromToken.priceUsd && (
                      <div className="text-sm text-muted-foreground mt-2">
                        ≈ ${(Number.parseFloat(fromAmount) * fromToken.priceUsd).toFixed(2)}
                      </div>
                    )}
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
                            {SUPPORTED_TOKENS.filter((t) => t.symbol !== fromToken.symbol).map((token) => (
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
                    {toAmount && toToken.priceUsd && (
                      <div className="text-sm text-muted-foreground mt-2">
                        ≈ ${(Number.parseFloat(toAmount) * toToken.priceUsd).toFixed(2)}
                      </div>
                    )}
                  </div>

                  {fromAmount && toAmount && (
                    <div className="mt-4 p-4 bg-background/30 rounded-xl space-y-3 text-sm">
                      <div className="flex justify-between text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <TrendingDown className="h-3 w-3" />
                          {t.priceImpact}
                        </span>
                        <span
                          className={
                            priceImpact > 3 ? "text-red-500" : priceImpact > 1 ? "text-yellow-500" : "text-green-500"
                          }
                        >
                          {priceImpact.toFixed(2)}%
                        </span>
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
                      <div className="flex justify-between items-center text-muted-foreground">
                        <span>{t.route}</span>
                        <div className="flex items-center gap-1">
                          {swapRoute.map((symbol, i) => (
                            <span key={i} className="flex items-center">
                              <span className="px-2 py-0.5 bg-primary/10 rounded text-primary text-xs font-medium">
                                {symbol}
                              </span>
                              {i < swapRoute.length - 1 && <ArrowRight className="h-3 w-3 mx-1" />}
                            </span>
                          ))}
                        </div>
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
                      <>
                        <ExternalLink className="h-5 w-5 mr-2" />
                        {t.swapNow}
                      </>
                    )}
                  </Button>

                  {/* Warning */}
                  <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-yellow-500/80">{t.warning}</p>
                  </div>

                  <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Shield className="h-4 w-4 text-primary" />
                      {t.optimalRouting}
                    </div>
                  </div>

                  <p className="text-center text-xs text-muted-foreground mt-4">{t.poweredBy}</p>
                </div>
              </div>

              {/* Market Stats Sidebar */}
              <div className="space-y-4">
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
                        {Math.abs(priceChange24h || 0).toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                      <span className="text-sm text-muted-foreground">{t.volume24h}</span>
                      <span className="font-semibold">{formatNumber(volume24h || 259.5)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                      <span className="text-sm text-muted-foreground">{t.marketCap}</span>
                      <span className="font-semibold">{formatNumber(marketCap || 2500000)}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2">
                    <Link href={`https://etherscan.io/token/${OPM_TOKEN_ADDRESS}`} target="_blank">
                      <Button variant="outline" size="sm" className="w-full gap-2 bg-transparent">
                        <ExternalLink className="h-4 w-4" />
                        {t.viewOnEtherscan}
                      </Button>
                    </Link>
                    <Link href={CMC_DEX_URL} target="_blank">
                      <Button variant="outline" size="sm" className="w-full gap-2 bg-transparent">
                        <ExternalLink className="h-4 w-4" />
                        {t.viewOnCMC}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
