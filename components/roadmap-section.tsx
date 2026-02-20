"use client"

import { useLanguage } from "@/hooks/use-language"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, Circle, Rocket, TrendingUp, Globe, Crown, Building, Zap } from "lucide-react"

export function RoadmapSection() {
  const { t, language } = useLanguage()

  const phaseIcons = [Rocket, TrendingUp, Zap, Building, Globe, Crown]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-emerald-500" />
      case "in-progress":
        return <Clock className="h-5 w-5 text-primary animate-pulse" />
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-xs">
            {language === "de" ? "Abgeschlossen" : "Completed"}
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 animate-pulse text-xs">
            {language === "de" ? "In Bearbeitung" : "In Progress"}
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary" className="bg-muted text-muted-foreground text-xs">
            {language === "de" ? "Geplant" : "Upcoming"}
          </Badge>
        )
    }
  }

  const getPhaseColor = (status: string, index: number) => {
    if (status === "completed") return "from-emerald-500/20 to-emerald-500/5"
    if (status === "in-progress") return "from-primary/20 to-primary/5"
    return "from-secondary to-secondary/50"
  }

  return (
    <section
      id="roadmap"
      className="py-20 sm:py-32 relative overflow-hidden bg-gradient-to-b from-background to-secondary/10"
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container px-4 relative">
        <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Rocket className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              {language === "de" ? "Strategischer Entwicklungsplan" : "Strategic Development Plan"}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground">{t.roadmap.title}</h2>
          <p className="text-lg text-muted-foreground">{t.roadmap.subtitle}</p>

          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2 pt-4">
            <span className="text-sm text-muted-foreground">
              {language === "de" ? "Gesamtfortschritt" : "Overall Progress"}
            </span>
            <div className="w-48 h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-primary w-[40%] rounded-full" />
            </div>
            <span className="text-sm font-semibold text-primary">40%</span>
          </div>
        </div>

        {/* Timeline connector for desktop */}
        <div className="hidden xl:block absolute left-1/2 top-[500px] bottom-40 w-0.5 bg-gradient-to-b from-emerald-500/50 via-primary/30 to-muted -translate-x-1/2" />

        {/* Phase grid - 3 columns on large screens, 2 on medium, 1 on small */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {t.roadmap.phases.map((phase, index) => {
            const PhaseIcon = phaseIcons[index] || Rocket
            const isCompleted = phase.status === "completed"
            const isInProgress = phase.status === "in-progress"

            return (
              <Card
                key={phase.phase}
                className={`border-border/50 bg-card/80 backdrop-blur relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  isInProgress ? "border-primary/50 ring-1 ring-primary/20 shadow-lg shadow-primary/10" : ""
                } ${isCompleted ? "border-emerald-500/30" : ""}`}
              >
                {/* Top accent bar */}
                {isInProgress && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50 animate-shimmer" />
                )}
                {isCompleted && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500/50 via-emerald-500 to-emerald-500/50" />
                )}

                <CardContent className="p-6 space-y-4">
                  {/* Phase header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${getPhaseColor(phase.status, index)} border ${
                          isCompleted
                            ? "border-emerald-500/20"
                            : isInProgress
                              ? "border-primary/20"
                              : "border-border/50"
                        }`}
                      >
                        <PhaseIcon
                          className={`h-6 w-6 ${
                            isCompleted ? "text-emerald-500" : isInProgress ? "text-primary" : "text-muted-foreground"
                          }`}
                        />
                      </div>
                      <div>
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          {phase.phase}
                        </span>
                        <h3 className="text-lg font-bold text-foreground">{phase.title}</h3>
                      </div>
                    </div>
                  </div>

                  {/* Period and status */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-medium ${
                        isCompleted ? "text-emerald-500" : isInProgress ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {phase.period}
                    </span>
                    {getStatusBadge(phase.status)}
                  </div>

                  {/* Items list */}
                  <ul className="space-y-2 pt-2">
                    {phase.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm">
                        {isCompleted ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                        ) : isInProgress ? (
                          <div className="w-4 h-4 mt-0.5 shrink-0 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                          </div>
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground/50 mt-0.5 shrink-0" />
                        )}
                        <span
                          className={`leading-relaxed ${
                            isCompleted
                              ? "text-muted-foreground line-through opacity-70"
                              : isInProgress
                                ? "text-foreground"
                                : "text-muted-foreground"
                          }`}
                        >
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Vision statement */}
        <div className="mt-16 text-center max-w-3xl mx-auto">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-8">
              <Crown className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-3">
                {language === "de" ? "Vision 2030" : "Vision 2030"}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {language === "de"
                  ? "Bis 2030 wird OnePremium als vollständig dezentrale autonome Organisation operieren und ein globales Netzwerk von Premium-Diensten, strategischen Partnerschaften und institutionellen Investitionsmöglichkeiten für unsere Diamond-Elite-Inhaber bereitstellen."
                  : "By 2030, OnePremium will operate as a fully decentralized autonomous organization, providing a global network of premium services, strategic partnerships, and institutional investment opportunities for our Diamond Elite holders."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
