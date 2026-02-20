"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/hooks/use-language"
import { TrendingUp, Users, Wallet, Globe } from "lucide-react"

interface StatProps {
  value: number
  suffix?: string
  prefix?: string
  label: string
  icon: typeof TrendingUp
}

function AnimatedStat({ value, suffix = "", prefix = "", label, icon: Icon }: StatProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = value / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value])

  return (
    <div className="text-center p-6 rounded-2xl bg-card/50 border border-border/30 hover:border-primary/30 transition-all hover:transform hover:scale-105">
      <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
        <Icon className="h-7 w-7 text-primary" />
      </div>
      <p className="text-3xl md:text-4xl font-bold text-foreground mb-2">
        {prefix}
        {count.toLocaleString()}
        {suffix}
      </p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

export function StatsCounter() {
  const { language } = useLanguage()

  const stats = [
    {
      value: 2595800,
      prefix: "$",
      label: language === "de" ? "Marktkapitalisierung" : "Market Cap",
      icon: TrendingUp,
    },
    {
      value: 10000,
      label: language === "de" ? "Gesamtangebot" : "Total Supply",
      icon: Wallet,
    },
    {
      value: 21,
      suffix: "+",
      label: language === "de" ? "Token-Inhaber" : "Token Holders",
      icon: Users,
    },
    {
      value: 15,
      suffix: "+",
      label: language === "de" ? "Länder" : "Countries",
      icon: Globe,
    },
  ]

  return (
    <section className="py-16 md:py-24">
      <div className="container px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <AnimatedStat key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  )
}
