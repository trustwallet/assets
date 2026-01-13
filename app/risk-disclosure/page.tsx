"use client"

import { useLanguage } from "@/hooks/use-language"
import { legalContent } from "@/lib/legal-content"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AnimatedBackground } from "@/components/animated-background"
import { ArrowLeft, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function RiskDisclosurePage() {
  const { language } = useLanguage()
  const content = legalContent[language].risk

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnimatedBackground />
      <Header />
      <main className="container px-4 py-24 relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          {language === "de" ? "Zurück zur Startseite" : "Back to Home"}
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="mb-8 p-6 bg-destructive/10 backdrop-blur border border-destructive/30 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="h-8 w-8 text-destructive" />
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">{content.title}</h1>
            </div>
            <p className="text-muted-foreground">
              {language === "de" ? "Zuletzt aktualisiert" : "Last updated"}: {content.lastUpdated}
            </p>
            <p className="mt-4 text-sm text-destructive font-medium">
              {language === "de"
                ? "WICHTIG: Lesen Sie dieses Dokument sorgfältig bevor Sie investieren"
                : "IMPORTANT: Read this document carefully before investing"}
            </p>
          </div>

          <div className="space-y-6">
            {content.sections.map((section, index) => (
              <div
                key={index}
                className={`p-6 backdrop-blur border rounded-xl ${
                  index === 0 ? "bg-destructive/5 border-destructive/20" : "bg-card/30 border-border/50"
                }`}
              >
                <h2 className="text-xl font-semibold text-foreground mb-4">{section.title}</h2>
                <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
