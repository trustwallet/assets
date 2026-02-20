"use client"

import { useLanguage } from "@/hooks/use-language"
import { Button } from "@/components/ui/button"
import { ArrowRight, Wallet, FileText } from "lucide-react"
import { UNISWAP_BUY_URL } from "@/lib/constants"

interface CTASectionProps {
  onConnect?: () => void
}

export function CTASection({ onConnect }: CTASectionProps) {
  const { language } = useLanguage()

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container px-4 relative">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground">
            {language === "de" ? "Bereit, Teil von OnePremium zu werden?" : "Ready to Join OnePremium?"}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {language === "de"
              ? "Beginnen Sie noch heute Ihre Reise ins Premium-Token-Ökosystem und erschließen Sie exklusive Vorteile."
              : "Start your journey into the premium token ecosystem today and unlock exclusive benefits."}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              onClick={onConnect}
              className="w-full sm:w-auto gap-2 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black font-semibold shadow-lg shadow-primary/25 min-h-[56px] text-lg px-8"
            >
              <Wallet className="h-5 w-5" />
              {language === "de" ? "Wallet verbinden" : "Connect Wallet"}
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="w-full sm:w-auto gap-2 border-primary/30 hover:bg-primary/10 bg-transparent min-h-[56px] text-lg px-8"
            >
              <a href={UNISWAP_BUY_URL} target="_blank" rel="noopener noreferrer">
                <FileText className="h-5 w-5" />
                {language === "de" ? "OPM kaufen" : "Buy OPM"}
              </a>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground pt-4">
            {language === "de"
              ? "Investitionen in digitale Vermögenswerte sind mit Risiken verbunden. Bitte lesen Sie unsere "
              : "Investing in digital assets involves risk. Please read our "}
            <a href="/risk-disclosure" className="text-primary hover:underline">
              {language === "de" ? "Risikohinweise" : "Risk Disclosure"}
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  )
}
