"use client"

import { useLanguage } from "@/hooks/use-language"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AnimatedBackground } from "@/components/animated-background"
import { ArrowLeft, Shield, CheckCircle, ExternalLink, FileText, Bug, Server, Lock, Award } from "lucide-react"
import Link from "next/link"
import { OPM_TOKEN_ADDRESS, SOLIDITYSCAN_AUDIT_URL } from "@/lib/constants"

export default function SecurityPage() {
  const { language } = useLanguage()

  const content = {
    en: {
      title: "Security & Audits",
      subtitle: "Transparency and trust through verified security",
      auditStatus: "Audit Status",
      completedAudit: "Security Audit Completed",
      completedDescription:
        "Our smart contract has been audited by SolidityScan, a leading automated security analysis platform. View the full audit report for complete transparency.",
      viewAudit: "View Audit Report",
      auditScore: "Security Score",
      auditProvider: "Audit Provider",
      pendingAudits: "Additional Audits Planned",
      pendingDescription:
        "We are also pursuing additional manual audits from recognized security firms to provide maximum assurance.",
      plannedAuditors: "Planned Security Partners",
      contractInfo: "Smart Contract Information",
      contractAddress: "Contract Address",
      network: "Network",
      verified: "Verified on Etherscan",
      viewContract: "View on Etherscan",
      securityMeasures: "Security Measures",
      measures: [
        {
          title: "Multi-Signature Treasury",
          description:
            "All treasury operations require multiple signatures from team members, preventing single points of failure.",
        },
        {
          title: "No Admin Keys",
          description:
            "The smart contract has no admin functions that could be used to manipulate token balances or transfers.",
        },
        {
          title: "Standard ERC-20",
          description:
            "Built on the battle-tested ERC-20 standard with no custom modifications that could introduce vulnerabilities.",
        },
        {
          title: "Transparent Operations",
          description: "All transactions are visible on-chain. No hidden minting, burning, or transfer restrictions.",
        },
      ],
      infrastructure: "Infrastructure Security",
      infrastructureItems: [
        "Website hosted on Vercel with DDoS protection",
        "All communications encrypted via TLS 1.3",
        "No private keys stored on servers",
        "Regular security assessments conducted",
        "Web3Auth integration for secure social logins",
      ],
      bugBounty: "Bug Bounty Program",
      bugBountyDescription:
        "We encourage responsible disclosure of security vulnerabilities. If you discover a potential security issue, please contact us at security@onepremium.de. Rewards are available for valid reports based on severity.",
      disclaimer: "Security Disclaimer",
      disclaimerText:
        "While we implement industry-standard security measures, no system is completely secure. Users are responsible for securing their own wallets and private keys. Never share your seed phrase or private keys with anyone.",
    },
    de: {
      title: "Sicherheit & Audits",
      subtitle: "Transparenz und Vertrauen durch verifizierte Sicherheit",
      auditStatus: "Audit-Status",
      completedAudit: "Sicherheitsaudit Abgeschlossen",
      completedDescription:
        "Unser Smart Contract wurde von SolidityScan, einer führenden automatisierten Sicherheitsanalyseplattform, geprüft. Sehen Sie den vollständigen Auditbericht für vollständige Transparenz ein.",
      viewAudit: "Auditbericht Ansehen",
      auditScore: "Sicherheitsbewertung",
      auditProvider: "Audit-Anbieter",
      pendingAudits: "Weitere Audits Geplant",
      pendingDescription:
        "Wir streben auch zusätzliche manuelle Audits von anerkannten Sicherheitsfirmen an, um maximale Sicherheit zu gewährleisten.",
      plannedAuditors: "Geplante Sicherheitspartner",
      contractInfo: "Smart-Contract-Informationen",
      contractAddress: "Vertragsadresse",
      network: "Netzwerk",
      verified: "Verifiziert auf Etherscan",
      viewContract: "Auf Etherscan ansehen",
      securityMeasures: "Sicherheitsmaßnahmen",
      measures: [
        {
          title: "Multi-Signatur-Treasury",
          description:
            "Alle Treasury-Operationen erfordern mehrere Signaturen von Teammitgliedern, um einzelne Ausfallpunkte zu verhindern.",
        },
        {
          title: "Keine Admin-Schlüssel",
          description:
            "Der Smart Contract hat keine Admin-Funktionen, die zur Manipulation von Token-Salden oder Transfers verwendet werden könnten.",
        },
        {
          title: "Standard ERC-20",
          description:
            "Basierend auf dem bewährten ERC-20-Standard ohne benutzerdefinierte Modifikationen, die Schwachstellen einführen könnten.",
        },
        {
          title: "Transparente Operationen",
          description:
            "Alle Transaktionen sind on-chain sichtbar. Kein verstecktes Minting, Burning oder Transferbeschränkungen.",
        },
      ],
      infrastructure: "Infrastruktur-Sicherheit",
      infrastructureItems: [
        "Website gehostet auf Vercel mit DDoS-Schutz",
        "Alle Kommunikation verschlüsselt via TLS 1.3",
        "Keine privaten Schlüssel auf Servern gespeichert",
        "Regelmäßige Sicherheitsbewertungen durchgeführt",
        "Web3Auth-Integration für sichere Social-Logins",
      ],
      bugBounty: "Bug-Bounty-Programm",
      bugBountyDescription:
        "Wir ermutigen zur verantwortungsvollen Offenlegung von Sicherheitslücken. Wenn Sie ein potenzielles Sicherheitsproblem entdecken, kontaktieren Sie uns bitte unter security@onepremium.de. Belohnungen sind für gültige Berichte basierend auf dem Schweregrad verfügbar.",
      disclaimer: "Sicherheitshinweis",
      disclaimerText:
        "Obwohl wir branchenübliche Sicherheitsmaßnahmen implementieren, ist kein System vollständig sicher. Benutzer sind für die Sicherung ihrer eigenen Wallets und privaten Schlüssel verantwortlich. Teilen Sie niemals Ihre Seed-Phrase oder privaten Schlüssel mit anderen.",
    },
  }

  const t = content[language]

  const auditors = [
    { name: "CertiK", status: "planned" },
    { name: "Quantstamp", status: "planned" },
    { name: "Hacken", status: "planned" },
  ]

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
          {/* Header */}
          <div className="mb-8 p-6 bg-card/50 backdrop-blur border border-border/50 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">{t.title}</h1>
            </div>
            <p className="text-muted-foreground">{t.subtitle}</p>
          </div>

          <div className="mb-8 p-6 bg-emerald-500/10 backdrop-blur border border-emerald-500/30 rounded-xl">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-emerald-500" />
              {t.auditStatus}
            </h2>

            <div className="p-4 bg-background/50 rounded-lg mb-4 border border-emerald-500/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <p className="font-semibold text-emerald-500 text-lg">{t.completedAudit}</p>
                  <p className="text-sm text-muted-foreground">{t.auditProvider}: SolidityScan</p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-4">{t.completedDescription}</p>

              <a
                href={SOLIDITYSCAN_AUDIT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-semibold"
              >
                <FileText className="h-5 w-5" />
                {t.viewAudit}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            {/* Additional Audits Planned */}
            <div className="p-4 bg-background/30 rounded-lg border border-border/30">
              <p className="font-medium text-foreground mb-2">{t.pendingAudits}</p>
              <p className="text-muted-foreground text-sm mb-3">{t.pendingDescription}</p>
              <h3 className="font-medium text-foreground mb-3 text-sm">{t.plannedAuditors}</h3>
              <div className="flex flex-wrap gap-3">
                {auditors.map((auditor) => (
                  <div
                    key={auditor.name}
                    className="px-4 py-2 bg-background/50 rounded-lg border border-border/50 text-sm text-muted-foreground"
                  >
                    {auditor.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contract Info */}
          <div className="mb-8 p-6 bg-card/30 backdrop-blur border border-border/50 rounded-xl">
            <h2 className="text-xl font-semibold text-foreground mb-4">{t.contractInfo}</h2>
            <div className="space-y-4">
              <div className="p-4 bg-background/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">{t.contractAddress}</p>
                <code className="text-xs md:text-sm text-primary break-all font-mono">{OPM_TOKEN_ADDRESS}</code>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">{t.network}:</span>
                  <span className="text-foreground font-medium">Ethereum Mainnet</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-500">
                  <CheckCircle className="h-4 w-4" />
                  {t.verified}
                </div>
              </div>
              <a
                href={`https://etherscan.io/token/${OPM_TOKEN_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm"
              >
                {t.viewContract}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Security Measures */}
          <div className="mb-8 p-6 bg-card/30 backdrop-blur border border-border/50 rounded-xl">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              {t.securityMeasures}
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {t.measures.map((measure, index) => (
                <div key={index} className="p-4 bg-background/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <h3 className="font-medium text-foreground">{measure.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{measure.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Infrastructure */}
          <div className="mb-8 p-6 bg-card/30 backdrop-blur border border-border/50 rounded-xl">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Server className="h-5 w-5 text-primary" />
              {t.infrastructure}
            </h2>
            <ul className="space-y-2">
              {t.infrastructureItems.map((item, index) => (
                <li key={index} className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Bug Bounty */}
          <div className="mb-8 p-6 bg-card/30 backdrop-blur border border-border/50 rounded-xl">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Bug className="h-5 w-5 text-primary" />
              {t.bugBounty}
            </h2>
            <p className="text-muted-foreground mb-4">{t.bugBountyDescription}</p>
            <a
              href="mailto:security@onepremium.de"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              security@onepremium.de
            </a>
          </div>

          {/* Disclaimer */}
          <div className="p-6 bg-muted/30 backdrop-blur border border-border/50 rounded-xl">
            <h2 className="text-lg font-semibold text-foreground mb-2">{t.disclaimer}</h2>
            <p className="text-sm text-muted-foreground">{t.disclaimerText}</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
