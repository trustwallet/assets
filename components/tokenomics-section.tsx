"use client"

import { useLanguage } from "@/hooks/use-language"
import { Card, CardContent } from "@/components/ui/card"
import { OPM_TOKEN_ADDRESS } from "@/lib/constants"
import { Copy, ExternalLink, Check, Shield, Lock, Users, Coins } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function TokenomicsSection() {
  const { t, language } = useLanguage()
  const [copied, setCopied] = useState(false)

  const tokenDetails = [
    {
      label: language === "de" ? "Gesamtangebot" : "Total Supply",
      value: "10,000 OPM",
      icon: Coins,
    },
    {
      label: language === "de" ? "Netzwerk" : "Network",
      value: "Ethereum (ERC-20)",
      icon: Shield,
    },
    {
      label: language === "de" ? "Dezimalstellen" : "Decimals",
      value: "18",
      icon: Lock,
    },
    {
      label: language === "de" ? "Inhaber" : "Holders",
      value: "21+",
      icon: Users,
    },
  ]

  const distribution = [
    { label: language === "de" ? "Öffentlicher Verkauf" : "Public Sale", percentage: 40, color: "#D4AF37" },
    { label: language === "de" ? "Team & Berater" : "Team & Advisors", percentage: 20, color: "#8B7355" },
    { label: language === "de" ? "Ökosystem" : "Ecosystem", percentage: 15, color: "#B8860B" },
    { label: language === "de" ? "Marketing" : "Marketing", percentage: 15, color: "#CD853F" },
    { label: language === "de" ? "Reserve" : "Reserve", percentage: 10, color: "#DAA520" },
  ]

  const copyAddress = () => {
    navigator.clipboard.writeText(OPM_TOKEN_ADDRESS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section
      id="tokenomics"
      className="py-20 sm:py-32 bg-gradient-to-b from-background to-secondary/20 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

      <div className="container px-4 relative">
        <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Coins className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              {language === "de" ? "Token-Ökonomie" : "Token Economics"}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground">
            {t.tokenomics.title}
          </h2>
          <p className="text-lg text-muted-foreground">{t.tokenomics.subtitle}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
          {/* Token Details */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardContent className="p-6 space-y-6">
              <h3 className="text-xl font-semibold text-foreground">
                {language === "de" ? "Token-Details" : "Token Details"}
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {tokenDetails.map((detail, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-secondary/50 border border-border/30 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <detail.icon className="h-4 w-4 text-primary" />
                      <span className="text-xs text-muted-foreground">{detail.label}</span>
                    </div>
                    <p className="text-lg font-bold text-foreground">{detail.value}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-border/30">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground">{t.tokenomics.details.taxBuy}</span>
                  <span className="font-semibold text-emerald-500">0%</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground">{t.tokenomics.details.taxSell}</span>
                  <span className="font-semibold text-emerald-500">0%</span>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-border/30">
                <span className="text-sm text-muted-foreground">{t.tokenomics.details.contract}</span>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 rounded-lg bg-secondary text-xs text-foreground truncate font-mono">
                    {OPM_TOKEN_ADDRESS}
                  </code>
                  <Button variant="ghost" size="icon" onClick={copyAddress} className="shrink-0">
                    {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" asChild className="shrink-0">
                    <a
                      href={`https://etherscan.io/token/${OPM_TOKEN_ADDRESS}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Distribution */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardContent className="p-6 space-y-6">
              <h3 className="text-xl font-semibold text-foreground">{t.tokenomics.distribution}</h3>

              {/* Visual Bar Chart */}
              <div className="space-y-4">
                {distribution.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-semibold text-foreground">{item.percentage}%</span>
                    </div>
                    <div className="h-3 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Pie visualization */}
              <div className="flex items-center justify-center pt-4">
                <div className="relative w-48 h-48">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    {
                      distribution.reduce(
                        (acc, item, index) => {
                          const startAngle = acc.offset
                          const angle = (item.percentage / 100) * 360
                          const endAngle = startAngle + angle
                          const largeArc = angle > 180 ? 1 : 0

                          const startX = 50 + 40 * Math.cos((startAngle * Math.PI) / 180)
                          const startY = 50 + 40 * Math.sin((startAngle * Math.PI) / 180)
                          const endX = 50 + 40 * Math.cos((endAngle * Math.PI) / 180)
                          const endY = 50 + 40 * Math.sin((endAngle * Math.PI) / 180)

                          acc.paths.push(
                            <path
                              key={index}
                              d={`M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArc} 1 ${endX} ${endY} Z`}
                              fill={item.color}
                              className="hover:opacity-80 transition-opacity cursor-pointer"
                            />,
                          )
                          acc.offset = endAngle
                          return acc
                        },
                        { paths: [] as JSX.Element[], offset: 0 },
                      ).paths
                    }
                    <circle cx="50" cy="50" r="25" fill="hsl(var(--card))" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">10K</p>
                      <p className="text-xs text-muted-foreground">OPM</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
