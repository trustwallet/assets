"use client"

import { useLanguage } from "@/hooks/use-language"
import { Card, CardContent } from "@/components/ui/card"
import { Target, Eye, Heart, Shield, Award, TrendingUp } from "lucide-react"
import Image from "next/image"

export function AboutSection() {
  const { t, language } = useLanguage()

  const cards = [
    { icon: Target, title: t.about.mission.title, description: t.about.mission.description },
    { icon: Eye, title: t.about.vision.title, description: t.about.vision.description },
    { icon: Heart, title: t.about.values.title, description: t.about.values.items.join(" • ") },
  ]

  const highlights = [
    {
      icon: Shield,
      value: language === "de" ? "Geprüft" : "Audited",
      label: language === "de" ? "Smart Contract" : "Smart Contract",
    },
    {
      icon: Award,
      value: "ERC-20",
      label: language === "de" ? "Standard" : "Standard",
    },
    {
      icon: TrendingUp,
      value: "0%",
      label: language === "de" ? "Kauf-/Verkaufssteuer" : "Buy/Sell Tax",
    },
  ]

  return (
    <section
      id="about"
      className="py-20 sm:py-32 bg-gradient-to-b from-background to-secondary/20 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container px-4 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left: Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <span className="text-sm font-medium text-primary">
                {language === "de" ? "Über das Projekt" : "About the Project"}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground">{t.about.title}</h2>
            <p className="text-lg text-muted-foreground text-pretty leading-relaxed">{t.about.description}</p>

            {/* Highlights */}
            <div className="flex flex-wrap gap-4 pt-4">
              {highlights.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card/50 border border-border/30"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">{item.value}</p>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Image */}
          <div className="relative">
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-3xl blur-2xl" />
              <div className="relative w-full h-full rounded-3xl overflow-hidden border border-primary/20 bg-card/50 backdrop-blur p-8 flex items-center justify-center">
                <div className="relative w-48 h-48 md:w-64 md:h-64 animate-pulse-glow">
                  <Image
                    src="/images/3bffe8d5-1382-49f5-92e7.jpeg"
                    alt="OnePremium Token"
                    fill
                    className="object-contain rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission/Vision/Values Cards */}
        <div className="grid gap-6 sm:grid-cols-3">
          {cards.map((card, index) => (
            <Card
              key={card.title}
              className="border-border/50 bg-card/50 backdrop-blur hover:border-primary/50 transition-all hover:-translate-y-1 group"
            >
              <CardContent className="p-6 space-y-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/10 transition-colors">
                  <card.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{card.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
