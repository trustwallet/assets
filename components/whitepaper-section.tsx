"use client"

import { useLanguage } from "@/hooks/use-language"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, BookOpen, Shield, Scale, Sparkles } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function WhitepaperSection() {
  const { t, language } = useLanguage()

  const sections = Object.entries(t.whitepaper.sections).map(([key, value]) => ({
    id: key,
    title: value.title,
    content: value.content,
  }))

  const generateAndDownloadPDF = async () => {
    // Create whitepaper content for PDF
    const whitepaperContent = sections.map((s) => `${s.title}\n\n${s.content}`).join("\n\n---\n\n")

    const fullDocument = `
OnePremium (OPM) Technical Whitepaper
Version 2.0 - January 2026
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${whitepaperContent}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DISCLAIMER: This document is for informational purposes only and does not constitute 
financial, legal, or investment advice. Digital asset investments carry significant risk. 
Past performance does not guarantee future results.

Contact: kontakt@onepremium.de
Website: https://onepremium.de
Contract: 0xE430b07F7B168E77B07b29482DbF89EafA53f484

© ${new Date().getFullYear()} OnePremium. All rights reserved.
`

    // Create blob and download
    const blob = new Blob([fullDocument], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `OnePremium_Whitepaper_v2.0_${language.toUpperCase()}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <section
      id="whitepaper"
      className="py-20 sm:py-32 bg-gradient-to-b from-secondary/20 to-background relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-64 h-64 bg-primary/3 rounded-full blur-3xl" />

      <div className="container px-4 relative">
        <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">{t.whitepaper.subtitle}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-foreground">
            {t.whitepaper.title}
          </h2>
          <p className="text-muted-foreground">
            {language === "de"
              ? "Umfassende technische Dokumentation des OnePremium-Protokolls"
              : "Comprehensive technical documentation of the OnePremium protocol"}
          </p>
        </div>

        <Card className="max-w-5xl mx-auto border-border/50 bg-card/80 backdrop-blur shadow-2xl">
          <CardContent className="p-6 sm:p-10">
            {/* Header with download button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-8 border-b border-border">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">OnePremium Whitepaper</h3>
                  <p className="text-sm text-muted-foreground">{t.whitepaper.version}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-500">
                      <Shield className="h-3 w-3" />
                      {language === "de" ? "Geprüft" : "Audited"}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="inline-flex items-center gap-1 text-xs text-primary">
                      <Scale className="h-3 w-3" />
                      {language === "de" ? "Konform" : "Compliant"}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                onClick={generateAndDownloadPDF}
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
              >
                <Download className="h-4 w-4" />
                {t.whitepaper.downloadPdf}
              </Button>
            </div>

            {/* Key highlights */}
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <div className="p-4 rounded-lg bg-secondary/50 border border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">
                    {language === "de" ? "8 Kapitel" : "8 Chapters"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {language === "de" ? "Vollständige Protokoll-Dokumentation" : "Complete protocol documentation"}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50 border border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-semibold text-foreground">
                    {language === "de" ? "Sicherheit" : "Security"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {language === "de" ? "SolidityScan verifiziert" : "SolidityScan verified"}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50 border border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <Scale className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-semibold text-foreground">
                    {language === "de" ? "Governance" : "Governance"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {language === "de" ? "DAO-Transition 2028" : "DAO Transition 2028"}
                </p>
              </div>
            </div>

            {/* Accordion sections */}
            <Accordion type="single" collapsible className="w-full space-y-2">
              {sections.map((section, index) => (
                <AccordionItem
                  key={section.id}
                  value={section.id}
                  className="border border-border/50 rounded-lg px-4 bg-background/50 data-[state=open]:bg-secondary/30"
                >
                  <AccordionTrigger className="text-left font-semibold hover:text-primary hover:no-underline py-4">
                    <span className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {index + 1}
                      </span>
                      {section.title}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground whitespace-pre-line pb-6 pl-11 leading-relaxed">
                    {section.content}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Footer note */}
            <div className="mt-8 pt-6 border-t border-border/50">
              <p className="text-xs text-muted-foreground text-center">
                {language === "de"
                  ? "Dieses Dokument dient nur zu Informationszwecken und stellt keine Finanz-, Rechts- oder Anlageberatung dar. Digital-Asset-Investitionen sind mit erheblichen Risiken verbunden."
                  : "This document is for informational purposes only and does not constitute financial, legal, or investment advice. Digital asset investments carry significant risk."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
