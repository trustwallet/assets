"use client"

import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/hooks/use-language"
import { Twitter, Send, Globe, Mail, Shield, FileText, Users, Code2 } from "lucide-react"
import { CONTACT_EMAIL, TWITTER_URL, TELEGRAM_URL, WEBSITE_URL, OPM_TOKEN_ADDRESS } from "@/lib/constants"

export function Footer() {
  const { language } = useLanguage()

  const socialLinks = [
    { icon: Twitter, href: TWITTER_URL, label: "Twitter" },
    { icon: Send, href: TELEGRAM_URL, label: "Telegram" },
    { icon: Globe, href: WEBSITE_URL, label: "Website" },
    { icon: Mail, href: `mailto:${CONTACT_EMAIL}`, label: "Email" },
  ]

  return (
    <footer className="border-t border-border/40 bg-background/80 backdrop-blur relative z-10">
      <div className="container px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand */}
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image src="/images/6f10bccb-b857-43f7-95dd.jpeg" alt="OnePremium" fill className="object-cover" />
              </div>
              <span className="font-serif text-xl font-bold text-primary">OnePremium</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              {language === "de"
                ? "Das Premium-Token-Ökosystem, das digitale Vermögenswerte mit realen Vorteilen verbindet."
                : "The premium token ecosystem bridging digital assets with real-world benefits."}
            </p>
            <div className="text-xs text-muted-foreground/70 space-y-1">
              <p>OnePremium GmbH</p>
              <p>Musterstraße 1, 10115 Berlin</p>
              <p>HRB 123456 B</p>
              <p>USt-IdNr: DE123456789</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">{language === "de" ? "Plattform" : "Platform"}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {language === "de" ? "Über uns" : "About"}
                </Link>
              </li>
              <li>
                <Link
                  href="#whitepaper"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Whitepaper
                </Link>
              </li>
              <li>
                <Link href="#roadmap" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Roadmap
                </Link>
              </li>
              <li>
                <Link
                  href="#tokenomics"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Tokenomics
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {language === "de" ? "Team & Governance" : "Team & Governance"}
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/smart-contracts"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span className="flex items-center gap-1">
                    <Code2 className="h-3 w-3" />
                    Smart Contracts
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Security & Compliance */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              {language === "de" ? "Sicherheit" : "Security"}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/security"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {language === "de" ? "Sicherheit & Audits" : "Security & Audits"}
                </Link>
              </li>
              <li>
                <Link href="/kyc-aml" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {language === "de" ? "KYC/AML-Richtlinie" : "KYC/AML Policy"}
                </Link>
              </li>
              <li>
                <a
                  href={`https://etherscan.io/token/${OPM_TOKEN_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {language === "de" ? "Verifizierter Contract" : "Verified Contract"}
                </a>
              </li>
              <li>
                <a
                  href="https://solidityscan.com/quickscan/0xE430b07F7B168E77B07b29482DbF89EafA53f484/etherscan/mainnet?ref=etherscan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {language === "de" ? "Audit-Bericht" : "Audit Report"}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              {language === "de" ? "Rechtliches" : "Legal"}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {language === "de" ? "Nutzungsbedingungen" : "Terms of Service"}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {language === "de" ? "Datenschutz" : "Privacy Policy"}
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {language === "de" ? "Cookie-Richtlinie" : "Cookie Policy"}
                </Link>
              </li>
              <li>
                <Link
                  href="/risk-disclosure"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {language === "de" ? "Risikohinweise" : "Risk Disclosure"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Social */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">{language === "de" ? "Ressourcen" : "Resources"}</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href={`https://etherscan.io/token/${OPM_TOKEN_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Etherscan
                </a>
              </li>
              <li>
                <a
                  href={`https://dex.coinmarketcap.com/token/ethereum/${OPM_TOKEN_ADDRESS.toLowerCase()}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  CoinMarketCap DEX
                </a>
              </li>
              <li>
                <a
                  href="https://app.uniswap.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Uniswap
                </a>
              </li>
              <li>
                <Link
                  href="/assets/opm-logo"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {language === "de" ? "Logo & Medien" : "Logo & Media"}
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
            </ul>
            <div className="flex gap-3 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Regulatory Notice */}
        <div className="mt-12 pt-8 border-t border-border/40">
          <div className="text-xs text-muted-foreground/60 space-y-4 max-w-4xl">
            <p>
              <strong>{language === "de" ? "Wichtiger Hinweis:" : "Important Notice:"}</strong>{" "}
              {language === "de"
                ? "OnePremium (OPM) ist ein digitaler Vermögenswert auf der Ethereum-Blockchain. Der Handel mit digitalen Vermögenswerten birgt erhebliche Risiken, einschließlich des vollständigen Kapitalverlusts. Vergangene Wertentwicklungen sind kein Indikator für zukünftige Ergebnisse. Diese Website stellt keine Finanzberatung dar."
                : "OnePremium (OPM) is a digital asset on the Ethereum blockchain. Trading digital assets involves substantial risk, including the potential for complete loss of capital. Past performance is not indicative of future results. This website does not constitute financial advice."}
            </p>
            <p>
              {language === "de"
                ? "OnePremium GmbH ist in Deutschland registriert und arbeitet in Übereinstimmung mit den geltenden Vorschriften für digitale Vermögenswerte. Für weitere Informationen zu regulatorischen Anforderungen lesen Sie bitte unsere rechtlichen Dokumente."
                : "OnePremium GmbH is registered in Germany and operates in compliance with applicable digital asset regulations. For more information about regulatory requirements, please review our legal documents."}
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 OnePremium GmbH. {language === "de" ? "Alle Rechte vorbehalten." : "All rights reserved."}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground/60">
            <span>{language === "de" ? "Betrieben von" : "Powered by"} Ethereum</span>
            <span>•</span>
            <span>CoinMarketCap DEX</span>
            <span>•</span>
            <span>v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
