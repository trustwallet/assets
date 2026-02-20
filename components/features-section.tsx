"use client"

import { useLanguage } from "@/hooks/use-language"
import { Card, CardContent } from "@/components/ui/card"
import { Award, Shield, Handshake, Vote, Lock, Zap, Globe, Gem } from "lucide-react"

export function FeaturesSection() {
  const { t, language } = useLanguage()

  const icons = [Award, Shield, Handshake, Vote]

  const additionalFeatures = [
    {
      icon: Lock,
      title: language === "de" ? "365-Tage Token-Lock" : "365-Day Token Lock",
      description:
        language === "de"
          ? "Schutz vor Dumping durch obligatorische Halteperiode"
          : "Protection against dumping through mandatory holding period",
    },
    {
      icon: Zap,
      title: language === "de" ? "Sofortige Transaktionen" : "Instant Transactions",
      description: language === "de" ? "Schnelle Ethereum-basierte Übertragungen" : "Fast Ethereum-based transfers",
    },
    {
      icon: Globe,
      title: language === "de" ? "Globaler Zugang" : "Global Access",
      description:
        language === "de" ? "Weltweit verfügbar auf allen DEX-Plattformen" : "Available worldwide on all DEX platforms",
    },
    {
      icon: Gem,
      title: language === "de" ? "Premium Exklusivität" : "Premium Exclusivity",
      description:
        language === "de" ? "Limitiertes Angebot von nur 10.000 Token" : "Limited supply of only 10,000 tokens",
    },
  ]

  return (
    <section className="py-20 sm:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

      <div className="container px-4 relative">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="text-sm font-medium text-primary">
              {language === "de" ? "Warum OnePremium?" : "Why OnePremium?"}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6">
            {t.features.title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {language === "de"
              ? "Ein umfassendes Ökosystem für Premium-Token-Inhaber mit realen Vorteilen"
              : "A comprehensive ecosystem for premium token holders with real-world benefits"}
          </p>
        </div>

        {/* Main Features */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          {t.features.items.map((feature, index) => {
            const Icon = icons[index]
            return (
              <Card
                key={feature.title}
                className="border-border/50 bg-card/50 backdrop-blur group hover:border-primary/50 transition-all hover:-translate-y-1"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/10 transition-colors">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Additional Features */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {additionalFeatures.map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 rounded-xl bg-secondary/30 border border-border/30 hover:border-primary/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground text-sm">{feature.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
