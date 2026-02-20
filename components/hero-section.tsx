"use client"

import Image from "next/image"
import { useLanguage } from "@/hooks/use-language"
import { useWallet } from "@/hooks/use-wallet"
import { Button } from "@/components/ui/button"
import { PriceTicker } from "./price-ticker"
import { Wallet, ArrowDown, TrendingUp, Users, BarChart3, Sparkles, Shield, Globe, FileCheck } from "lucide-react"

interface HeroSectionProps {
  priceUsd: number
  holders: number
  marketCap: number
}

export function HeroSection({ priceUsd, holders, marketCap }: HeroSectionProps) {
  const { t, language } = useLanguage()
  const { connect, isConnecting } = useWallet()

  const stats = [
    { icon: TrendingUp, label: t.hero.livePrice, value: priceUsd > 0 ? `$${priceUsd.toFixed(2)}` : "$259.58" },
    { icon: Users, label: t.hero.holders, value: `${holders}+` },
    {
      icon: BarChart3,
      label: t.hero.marketCap,
      value: marketCap > 0 ? `$${(marketCap / 1000000).toFixed(2)}M` : "$2.5M",
    },
  ]

  const tagline =
    language === "de"
      ? "Institutionelle Qualität. Transparente Governance."
      : "Institutional Grade. Transparent Governance."

  const subtitle =
    language === "de"
      ? "OnePremium ($OPM) ist ein ERC-20 Utility-Token auf der Ethereum-Blockchain, konzipiert für ein nachhaltiges Ökosystem mit realen Anwendungsfällen. Verifizierter Smart Contract, transparente Tokenomics, und ein klar definierter Nutzen für Inhaber."
      : "OnePremium ($OPM) is an ERC-20 utility token on the Ethereum blockchain, designed for a sustainable ecosystem with real-world use cases. Verified smart contract, transparent tokenomics, and clearly defined utility for holders."

  const features = [
    { icon: FileCheck, label: language === "de" ? "Verifizierter Contract" : "Verified Contract" },
    { icon: Shield, label: language === "de" ? "Audit in Prüfung" : "Audit Pending" },
    { icon: Globe, label: language === "de" ? "Ethereum Mainnet" : "Ethereum Mainnet" },
  ]

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none animate-glow-pulse" />
      <div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-2xl pointer-events-none animate-glow-pulse"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute top-1/2 right-1/3 w-48 h-48 bg-amber-500/5 rounded-full blur-xl pointer-events-none animate-glow-pulse"
        style={{ animationDelay: "2s" }}
      />

      <PriceTicker />

      <div className="container px-4 py-12 sm:py-20 relative z-10 flex-1 flex items-center">
        <div className="flex flex-col items-center text-center space-y-8 w-full">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/30 backdrop-blur animate-card-float">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-sm font-semibold text-primary">{tagline}</span>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-primary/40 rounded-full blur-3xl scale-150 animate-glow-pulse" />
            <div
              className="absolute inset-0 bg-amber-400/20 rounded-full blur-2xl scale-125 animate-glow-pulse"
              style={{ animationDelay: "0.5s" }}
            />
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 animate-pulse-glow rounded-full overflow-hidden border-4 border-primary/40 shadow-2xl shadow-primary/30">
              <Image
                src="/images/3bffe8d5-1382-49f5-92e7.jpeg"
                alt="OnePremium Token"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: "20s" }}>
              <div className="absolute top-0 left-1/2 w-2 h-2 bg-primary rounded-full -translate-x-1/2 -translate-y-4" />
            </div>
            <div
              className="absolute inset-0 animate-spin"
              style={{ animationDuration: "15s", animationDirection: "reverse" }}
            >
              <div className="absolute bottom-0 left-1/2 w-1.5 h-1.5 bg-amber-400 rounded-full -translate-x-1/2 translate-y-3" />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-4 max-w-4xl">
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-serif font-bold text-balance">
              <span className="text-gradient">OnePremium</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
              {subtitle}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {features.map((feature) => (
              <div
                key={feature.label}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50"
              >
                <feature.icon className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground">{feature.label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              onClick={connect}
              disabled={isConnecting}
              size="lg"
              className="gap-3 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:via-yellow-400 hover:to-amber-500 text-black font-bold min-w-[260px] h-16 text-lg shadow-xl shadow-primary/30 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-primary/40"
            >
              <Wallet className="h-6 w-6" />
              {isConnecting ? t.connect.connecting : t.hero.connectWallet}
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="border-primary/50 text-primary hover:bg-primary/10 bg-transparent h-16 text-lg transition-all hover:scale-105"
            >
              <a href="#about">
                {t.hero.learnMore}
                <ArrowDown className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-8 w-full max-w-3xl">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-3 p-5 rounded-2xl glass transition-all hover:scale-105 hover:bg-primary/10 animate-card-float"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="p-3 rounded-full bg-primary/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">{stat.label}</span>
                <span className="text-2xl font-bold text-gradient">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ArrowDown className="h-6 w-6 text-muted-foreground" />
      </div>
    </section>
  )
}
