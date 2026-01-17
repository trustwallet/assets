"use client"

import { useLanguage } from "@/hooks/use-language"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AnimatedBackground } from "@/components/animated-background"
import {
  ArrowLeft,
  Users,
  Building,
  Scale,
  Vote,
  Shield,
  Globe,
  Mail,
  Award,
  Target,
  Eye,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { CONTACT_EMAIL } from "@/lib/constants"

export default function TeamPage() {
  const { language } = useLanguage()

  const content = {
    en: {
      title: "Leadership & Governance",
      subtitle: "Building the future of premium digital assets with transparency and innovation",
      visionTitle: "Our Vision",
      visionText:
        "To establish OnePremium as the world's leading ultra-scarce digital asset, creating unprecedented value for our community through innovation, transparency, and unwavering commitment to excellence.",
      missionTitle: "Our Mission",
      missionText:
        "Democratizing access to premium investment opportunities while maintaining the highest standards of security, compliance, and community governance.",
      valuesTitle: "Core Values",
      values: [
        {
          title: "Transparency",
          description: "Every decision, transaction, and development is openly communicated to our community.",
        },
        {
          title: "Innovation",
          description: "Continuously pushing boundaries in blockchain technology and DeFi solutions.",
        },
        {
          title: "Security",
          description: "Implementing industry-leading security measures to protect community assets.",
        },
        {
          title: "Community",
          description: "Empowering token holders through decentralized governance and shared success.",
        },
      ],
      leadershipTitle: "Executive Leadership",
      leadershipDescription:
        "Our leadership team combines decades of experience in blockchain technology, financial services, and enterprise development.",
      ceo: {
        name: "Executive Team",
        role: "Strategic Leadership",
        description:
          "The OnePremium executive team operates with a focus on long-term value creation, regulatory compliance, and community-driven development. Our leadership brings together expertise from traditional finance, blockchain technology, and enterprise software development.",
        highlights: [
          "Strategic partnership development",
          "Regulatory compliance oversight",
          "Community governance implementation",
          "Technology roadmap execution",
        ],
      },
      advisorsTitle: "Advisory Board",
      advisorsNote:
        "OnePremium is actively building relationships with industry experts in DeFi, regulatory compliance, institutional investment, and enterprise blockchain adoption. Advisory appointments will be announced following completion of due diligence processes.",
      governanceTitle: "Governance Framework",
      governanceDescription:
        "OnePremium operates under a progressive decentralization model, transitioning from foundation oversight to full community governance.",
      governancePhases: [
        {
          title: "Phase 1: Foundation Governance (Current)",
          status: "active",
          description:
            "Core team manages daily operations with community input through governance proposals, feedback channels, and transparent reporting.",
        },
        {
          title: "Phase 2: Hybrid Governance (2026)",
          status: "upcoming",
          description:
            "Token holders gain formal voting rights on key decisions including treasury allocations, partnership approvals, and protocol upgrades.",
        },
        {
          title: "Phase 3: Full DAO (2027-2028)",
          status: "planned",
          description:
            "Complete transition to decentralized autonomous organization with elected council members and on-chain voting for all major decisions.",
        },
      ],
      treasuryTitle: "Treasury Management",
      treasuryDescription:
        "All treasury operations are conducted with maximum transparency and security through multi-signature protocols.",
      treasuryItems: [
        "Multi-signature wallet requiring 3-of-5 executive approvals",
        "Monthly treasury reports published on-chain and community platforms",
        "Community oversight committee for expenditures exceeding threshold",
        "Real-time allocation tracking via public dashboard",
        "Annual third-party audits of treasury operations",
      ],
      votingTitle: "Token Holder Rights",
      votingDescription: "OnePremium token holders participate in governance based on their tier status:",
      votingTiers: [
        { tier: "Starter / Bronze", rights: "Community forum access, feedback submission, newsletter participation" },
        { tier: "Silver / Gold", rights: "Proposal voting, community polls, early access to announcements" },
        {
          tier: "Platinum / Diamond",
          rights: "Full voting rights, proposal creation, council election eligibility, direct team communication",
        },
      ],
      contactTitle: "Contact Leadership",
      contactDescription: "For partnership inquiries, media requests, or governance matters:",
    },
    de: {
      title: "Führung & Governance",
      subtitle: "Die Zukunft premium digitaler Assets mit Transparenz und Innovation gestalten",
      visionTitle: "Unsere Vision",
      visionText:
        "OnePremium als weltweit führendes ultra-knappes digitales Asset zu etablieren und beispiellosen Wert für unsere Community durch Innovation, Transparenz und kompromissloses Engagement für Exzellenz zu schaffen.",
      missionTitle: "Unsere Mission",
      missionText:
        "Den Zugang zu Premium-Investitionsmöglichkeiten zu demokratisieren und dabei höchste Standards in Sicherheit, Compliance und Community-Governance aufrechtzuerhalten.",
      valuesTitle: "Kernwerte",
      values: [
        {
          title: "Transparenz",
          description: "Jede Entscheidung, Transaktion und Entwicklung wird offen an unsere Community kommuniziert.",
        },
        {
          title: "Innovation",
          description: "Kontinuierliches Vorantreiben der Grenzen in Blockchain-Technologie und DeFi-Lösungen.",
        },
        {
          title: "Sicherheit",
          description: "Implementierung branchenführender Sicherheitsmaßnahmen zum Schutz der Community-Assets.",
        },
        {
          title: "Community",
          description: "Ermächtigung der Token-Inhaber durch dezentralisierte Governance und geteilten Erfolg.",
        },
      ],
      leadershipTitle: "Führungsteam",
      leadershipDescription:
        "Unser Führungsteam vereint jahrzehntelange Erfahrung in Blockchain-Technologie, Finanzdienstleistungen und Unternehmensentwicklung.",
      ceo: {
        name: "Führungsteam",
        role: "Strategische Leitung",
        description:
          "Das OnePremium-Führungsteam arbeitet mit Fokus auf langfristige Wertschöpfung, regulatorische Compliance und community-gesteuerte Entwicklung. Unsere Führung vereint Expertise aus traditionellem Finanzwesen, Blockchain-Technologie und Enterprise-Softwareentwicklung.",
        highlights: [
          "Strategische Partnerschaftsentwicklung",
          "Regulatorische Compliance-Überwachung",
          "Community-Governance-Implementierung",
          "Technologie-Roadmap-Ausführung",
        ],
      },
      advisorsTitle: "Beratergremium",
      advisorsNote:
        "OnePremium baut aktiv Beziehungen zu Branchenexperten in DeFi, regulatorischer Compliance, institutionellen Investitionen und Enterprise-Blockchain-Adoption auf. Beraterernennungen werden nach Abschluss der Due-Diligence-Prozesse bekannt gegeben.",
      governanceTitle: "Governance-Rahmenwerk",
      governanceDescription:
        "OnePremium operiert unter einem progressiven Dezentralisierungsmodell mit Übergang von Stiftungsaufsicht zu vollständiger Community-Governance.",
      governancePhases: [
        {
          title: "Phase 1: Stiftungs-Governance (Aktuell)",
          status: "active",
          description:
            "Kernteam verwaltet den täglichen Betrieb mit Community-Input durch Governance-Vorschläge, Feedback-Kanäle und transparente Berichterstattung.",
        },
        {
          title: "Phase 2: Hybride Governance (2026)",
          status: "upcoming",
          description:
            "Token-Inhaber erhalten formelle Stimmrechte bei wichtigen Entscheidungen einschließlich Treasury-Zuteilungen, Partnerschaftsgenehmigungen und Protokoll-Upgrades.",
        },
        {
          title: "Phase 3: Vollständige DAO (2027-2028)",
          status: "planned",
          description:
            "Vollständiger Übergang zur dezentralisierten autonomen Organisation mit gewählten Ratsmitgliedern und On-Chain-Abstimmungen für alle wichtigen Entscheidungen.",
        },
      ],
      treasuryTitle: "Treasury-Management",
      treasuryDescription:
        "Alle Treasury-Operationen werden mit maximaler Transparenz und Sicherheit durch Multi-Signatur-Protokolle durchgeführt.",
      treasuryItems: [
        "Multi-Signatur-Wallet erfordert 3-von-5 Führungsgenehmigungen",
        "Monatliche Treasury-Berichte on-chain und auf Community-Plattformen veröffentlicht",
        "Community-Aufsichtsausschuss für Ausgaben über Schwellenwert",
        "Echtzeit-Zuweisungsverfolgung über öffentliches Dashboard",
        "Jährliche Drittanbieter-Audits der Treasury-Operationen",
      ],
      votingTitle: "Token-Inhaber-Rechte",
      votingDescription: "OnePremium Token-Inhaber nehmen basierend auf ihrem Tier-Status an der Governance teil:",
      votingTiers: [
        { tier: "Starter / Bronze", rights: "Community-Forum-Zugang, Feedback-Einreichung, Newsletter-Teilnahme" },
        { tier: "Silber / Gold", rights: "Vorschlagsabstimmung, Community-Umfragen, früher Zugang zu Ankündigungen" },
        {
          tier: "Platin / Diamant",
          rights: "Volle Stimmrechte, Vorschlagserstellung, Ratswahl-Berechtigung, direkter Team-Kontakt",
        },
      ],
      contactTitle: "Führung kontaktieren",
      contactDescription: "Für Partnerschaftsanfragen, Medienanfragen oder Governance-Angelegenheiten:",
    },
  }

  const t = content[language]

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

        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-12 p-8 bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur border border-primary/20 rounded-2xl text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="p-3 bg-primary/20 rounded-full">
                <Users className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">{t.title}</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t.subtitle}</p>
          </div>

          {/* Vision & Mission */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="p-6 bg-card/50 backdrop-blur border border-border/50 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Eye className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">{t.visionTitle}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">{t.visionText}</p>
            </div>

            <div className="p-6 bg-card/50 backdrop-blur border border-border/50 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">{t.missionTitle}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">{t.missionText}</p>
            </div>
          </div>

          {/* Core Values */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              {t.valuesTitle}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {t.values.map((value, index) => (
                <div
                  key={index}
                  className="p-5 bg-card/30 backdrop-blur border border-border/50 rounded-xl text-center"
                >
                  <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Executive Leadership */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-2 flex items-center gap-2">
              <Building className="h-6 w-6 text-primary" />
              {t.leadershipTitle}
            </h2>
            <p className="text-muted-foreground mb-6">{t.leadershipDescription}</p>

            <div className="p-6 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur border border-border/50 rounded-xl">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-4 bg-primary/10 rounded-xl">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{t.ceo.name}</h3>
                  <p className="text-primary">{t.ceo.role}</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">{t.ceo.description}</p>
              <div className="grid sm:grid-cols-2 gap-2">
                {t.ceo.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {highlight}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Advisors */}
          <div className="mb-12 p-6 bg-card/30 backdrop-blur border border-border/50 rounded-xl">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              {t.advisorsTitle}
            </h2>
            <p className="text-muted-foreground">{t.advisorsNote}</p>
          </div>

          {/* Governance Model */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-2 flex items-center gap-2">
              <Scale className="h-6 w-6 text-primary" />
              {t.governanceTitle}
            </h2>
            <p className="text-muted-foreground mb-6">{t.governanceDescription}</p>

            <div className="space-y-4">
              {t.governancePhases.map((phase, index) => (
                <div
                  key={index}
                  className={`p-5 rounded-xl border transition-all ${
                    phase.status === "active"
                      ? "bg-primary/10 border-primary/40 shadow-lg shadow-primary/5"
                      : phase.status === "upcoming"
                        ? "bg-blue-500/5 border-blue-500/30"
                        : "bg-card/30 border-border/50"
                  }`}
                >
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-3">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        phase.status === "active"
                          ? "bg-primary text-primary-foreground"
                          : phase.status === "upcoming"
                            ? "bg-blue-500/20 text-blue-500 border border-blue-500/30"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {index + 1}
                    </span>
                    {phase.title}
                    {phase.status === "active" && (
                      <span className="ml-auto text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                        {language === "de" ? "Aktuell" : "Current"}
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground ml-11">{phase.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Treasury Transparency */}
          <div className="mb-12 p-6 bg-card/30 backdrop-blur border border-border/50 rounded-xl">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              {t.treasuryTitle}
            </h2>
            <p className="text-muted-foreground mb-4">{t.treasuryDescription}</p>
            <ul className="space-y-2">
              {t.treasuryItems.map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Voting Rights */}
          <div className="mb-12 p-6 bg-card/30 backdrop-blur border border-border/50 rounded-xl">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Vote className="h-5 w-5 text-primary" />
              {t.votingTitle}
            </h2>
            <p className="text-muted-foreground mb-4">{t.votingDescription}</p>
            <div className="space-y-3">
              {t.votingTiers.map((tier, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-4 bg-background/50 rounded-lg"
                >
                  <div className="text-sm font-medium text-primary min-w-[140px]">{tier.tier}</div>
                  <div className="text-sm text-muted-foreground">{tier.rights}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur border border-primary/20 rounded-xl text-center">
            <h2 className="text-xl font-semibold text-foreground mb-2 flex items-center justify-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              {t.contactTitle}
            </h2>
            <p className="text-muted-foreground mb-4">{t.contactDescription}</p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              <Mail className="h-4 w-4" />
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
