"use client"

import { useLanguage } from "@/hooks/use-language"
import { useOPMData } from "@/hooks/use-opm-data"
import { useWallet } from "@/hooks/use-wallet"
import { Header } from "./header"
import { HeroSection } from "./hero-section"
import { TrustBadges } from "./trust-badges"
import { StatsCounter } from "./stats-counter"
import { AboutSection } from "./about-section"
import { FeaturesSection } from "./features-section"
import { PartnersSection } from "./partners-section"
import { WhitepaperSection } from "./whitepaper-section"
import { RoadmapSection } from "./roadmap-section"
import { TokenomicsSection } from "./tokenomics-section"
import { TestimonialsSection } from "./testimonials-section"
import { CTASection } from "./cta-section"
import { ContactSection } from "./contact-section"
import { LogoSection } from "./logo-section"
import { Footer } from "./footer"

export function LandingPage() {
  const { t } = useLanguage()
  const opmData = useOPMData(null)
  const { connect } = useWallet()

  return (
    <div className="min-h-screen bg-background/80 backdrop-blur-sm">
      <Header />
      <main>
        <HeroSection priceUsd={opmData.priceUsd} holders={opmData.holders} marketCap={opmData.marketCap} />
        <TrustBadges />
        <StatsCounter />
        <AboutSection />
        <FeaturesSection />
        <LogoSection />
        <PartnersSection />
        <WhitepaperSection />
        <RoadmapSection />
        <TokenomicsSection />
        <TestimonialsSection />
        <CTASection onConnect={connect} />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
