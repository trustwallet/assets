"use client"

import { useLanguage } from "@/hooks/use-language"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AnimatedBackground } from "@/components/animated-background"
import {
  ArrowLeft,
  Users,
  Building2,
  Scale,
  Vote,
  Shield,
  Globe,
  Mail,
  Award,
  Target,
  Eye,
  Sparkles,
  Rocket,
  Heart,
  Zap,
  Crown,
  Star,
  Gem,
  TrendingUp,
  Lock,
  CheckCircle2,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { CONTACT_EMAIL } from "@/lib/constants"

export default function TeamPage() {
  const { language } = useLanguage()

  const content = {
    en: {
      title: "Leadership & Governance",
      subtitle:
        "Building the future of premium digital assets with transparency, innovation, and unwavering commitment to excellence",

      // Hero Stats
      stats: [
        { value: "2024", label: "Founded" },
        { value: "10,000", label: "Total Supply" },
        { value: "21+", label: "Global Holders" },
        { value: "365", label: "Day Lock Period" },
      ],

      visionTitle: "Our Vision",
      visionText:
        "To establish OnePremium as the world's most prestigious ultra-scarce digital asset, creating generational wealth for our community through groundbreaking innovation, radical transparency, and an unwavering commitment to excellence that sets new standards in the digital asset industry.",

      missionTitle: "Our Mission",
      missionText:
        "Democratizing access to premium investment opportunities while maintaining the highest standards of security, regulatory compliance, and community-driven governance that puts token holders at the center of every decision.",

      valuesTitle: "Core Principles",
      values: [
        {
          icon: Eye,
          title: "Transparency",
          description:
            "Every decision, transaction, and development milestone openly communicated to our global community.",
        },
        {
          icon: Zap,
          title: "Innovation",
          description:
            "Continuously pioneering new boundaries in blockchain technology, DeFi solutions, and digital asset management.",
        },
        {
          icon: Shield,
          title: "Security",
          description:
            "Multi-layered, audited smart contracts and institutional-grade security measures protecting community assets.",
        },
        {
          icon: Heart,
          title: "Community",
          description:
            "Empowering token holders through progressive decentralization and shared success in our collective journey.",
        },
      ],

      leadershipTitle: "Executive Leadership",
      leadershipSubtitle: "Strategic Vision & Operational Excellence",
      leadershipDescription:
        "The OnePremium executive leadership operates with laser focus on long-term value creation, regulatory excellence, and community-first development. Our team brings together world-class expertise from institutional finance, enterprise blockchain development, and global regulatory compliance.",

      leadershipAreas: [
        {
          icon: Rocket,
          title: "Strategic Development",
          description: "Building sustainable growth through strategic partnerships and market expansion",
        },
        {
          icon: Scale,
          title: "Regulatory Compliance",
          description: "Ensuring full compliance with evolving global cryptocurrency regulations",
        },
        {
          icon: Users,
          title: "Community Governance",
          description: "Implementing progressive decentralization and community voting mechanisms",
        },
        {
          icon: TrendingUp,
          title: "Technology Roadmap",
          description: "Executing our ambitious vision through cutting-edge blockchain innovation",
        },
      ],

      advisorsTitle: "Advisory Network",
      advisorsText:
        "OnePremium maintains strategic relationships with industry-leading experts across DeFi protocols, regulatory frameworks, institutional investment, and enterprise blockchain adoption. Advisory partnerships are carefully selected through rigorous due diligence to ensure alignment with our vision and values.",

      governanceTitle: "Governance Evolution",
      governanceSubtitle: "Progressive Path to Full Decentralization",
      governancePhases: [
        {
          phase: "Phase 1",
          title: "Foundation Governance",
          period: "2024 - 2025",
          status: "active",
          description:
            "Core team manages daily operations with transparent community input through governance proposals, multi-channel feedback systems, and comprehensive quarterly reporting.",
          features: ["Community Proposals", "Transparent Reporting", "Feedback Integration"],
        },
        {
          phase: "Phase 2",
          title: "Hybrid Governance",
          period: "2026",
          status: "upcoming",
          description:
            "Token holders gain formal voting rights on strategic decisions including treasury allocations, partnership approvals, protocol upgrades, and community initiatives.",
          features: ["On-Chain Voting", "Treasury Oversight", "Partnership Approval"],
        },
        {
          phase: "Phase 3",
          title: "Full DAO Transition",
          period: "2027 - 2028",
          status: "planned",
          description:
            "Complete transition to decentralized autonomous organization with elected council members, on-chain governance for all major decisions, and community-owned treasury.",
          features: ["Elected Council", "Full DAO Control", "Community Treasury"],
        },
      ],

      treasuryTitle: "Treasury Transparency",
      treasuryDescription:
        "All treasury operations conducted with maximum transparency and institutional-grade security protocols:",
      treasuryItems: [
        { icon: Lock, text: "Multi-signature wallet requiring 3-of-5 executive approvals for all transactions" },
        { icon: CheckCircle2, text: "Monthly treasury reports published on-chain and across community platforms" },
        { icon: Users, text: "Community oversight committee for expenditures exceeding defined thresholds" },
        { icon: Eye, text: "Real-time allocation tracking via public blockchain explorer and dashboard" },
        { icon: Shield, text: "Annual third-party audits of treasury operations and security measures" },
      ],

      tierTitle: "Token Holder Rights",
      tierDescription: "Governance participation scales with your commitment level:",
      tiers: [
        {
          tier: "Starter / Bronze",
          icon: Star,
          color: "from-amber-700 to-amber-900",
          rights: "Community forum access, feedback submission, newsletter participation, public announcements",
        },
        {
          tier: "Silver / Gold",
          icon: Gem,
          color: "from-gray-400 to-yellow-500",
          rights: "Proposal voting, community polls, early announcements, priority support, quarterly calls",
        },
        {
          tier: "Platinum / Diamond",
          icon: Crown,
          color: "from-blue-400 to-purple-500",
          rights: "Full voting rights, proposal creation, council eligibility, direct team access, strategic input",
        },
      ],

      contactTitle: "Connect With Leadership",
      contactDescription: "For partnership inquiries, media requests, institutional relations, or governance matters:",
    },
    de: {
      title: "Führung & Governance",
      subtitle:
        "Die Zukunft premium digitaler Vermögenswerte mit Transparenz, Innovation und kompromisslosem Engagement für Exzellenz gestalten",

      stats: [
        { value: "2024", label: "Gegründet" },
        { value: "10.000", label: "Gesamtangebot" },
        { value: "21+", label: "Globale Inhaber" },
        { value: "365", label: "Tage Sperrfrist" },
      ],

      visionTitle: "Unsere Vision",
      visionText:
        "OnePremium als weltweit prestigeträchtigstes ultra-knappes digitales Asset zu etablieren und generationenübergreifenden Wohlstand für unsere Community durch bahnbrechende Innovation, radikale Transparenz und kompromissloses Engagement für Exzellenz zu schaffen.",

      missionTitle: "Unsere Mission",
      missionText:
        "Den Zugang zu Premium-Investitionsmöglichkeiten zu demokratisieren und dabei höchste Standards in Sicherheit, regulatorischer Compliance und community-gesteuerter Governance aufrechtzuerhalten.",

      valuesTitle: "Kernprinzipien",
      values: [
        {
          icon: Eye,
          title: "Transparenz",
          description:
            "Jede Entscheidung, Transaktion und Entwicklung wird offen an unsere globale Community kommuniziert.",
        },
        {
          icon: Zap,
          title: "Innovation",
          description: "Kontinuierliches Vorantreiben neuer Grenzen in Blockchain-Technologie und DeFi-Lösungen.",
        },
        {
          icon: Shield,
          title: "Sicherheit",
          description: "Mehrschichtige, geprüfte Smart Contracts und institutionelle Sicherheitsmaßnahmen.",
        },
        {
          icon: Heart,
          title: "Community",
          description: "Ermächtigung der Token-Inhaber durch progressive Dezentralisierung und geteilten Erfolg.",
        },
      ],

      leadershipTitle: "Führungsteam",
      leadershipSubtitle: "Strategische Vision & Operative Exzellenz",
      leadershipDescription:
        "Das OnePremium-Führungsteam arbeitet mit Fokus auf langfristige Wertschöpfung, regulatorische Exzellenz und community-first Entwicklung. Unser Team vereint Weltklasse-Expertise aus institutionellem Finanzwesen, Enterprise-Blockchain und globaler Compliance.",

      leadershipAreas: [
        {
          icon: Rocket,
          title: "Strategische Entwicklung",
          description: "Nachhaltiges Wachstum durch strategische Partnerschaften aufbauen",
        },
        {
          icon: Scale,
          title: "Regulatorische Compliance",
          description: "Vollständige Compliance mit globalen Kryptowährungsvorschriften",
        },
        {
          icon: Users,
          title: "Community Governance",
          description: "Progressive Dezentralisierung und Community-Abstimmungen implementieren",
        },
        {
          icon: TrendingUp,
          title: "Technologie-Roadmap",
          description: "Unsere Vision durch innovative Blockchain-Technologie umsetzen",
        },
      ],

      advisorsTitle: "Berater-Netzwerk",
      advisorsText:
        "OnePremium pflegt strategische Beziehungen zu branchenführenden Experten in DeFi, Regulierung, institutionellen Investitionen und Enterprise-Blockchain. Beratungspartnerschaften werden durch strenge Due Diligence ausgewählt.",

      governanceTitle: "Governance-Evolution",
      governanceSubtitle: "Progressiver Pfad zur vollständigen Dezentralisierung",
      governancePhases: [
        {
          phase: "Phase 1",
          title: "Stiftungs-Governance",
          period: "2024 - 2025",
          status: "active",
          description:
            "Kernteam verwaltet den täglichen Betrieb mit transparentem Community-Input durch Governance-Vorschläge und umfassende Berichterstattung.",
          features: ["Community-Vorschläge", "Transparente Berichte", "Feedback-Integration"],
        },
        {
          phase: "Phase 2",
          title: "Hybride Governance",
          period: "2026",
          status: "upcoming",
          description:
            "Token-Inhaber erhalten formelle Stimmrechte bei strategischen Entscheidungen einschließlich Treasury-Zuteilungen und Protokoll-Upgrades.",
          features: ["On-Chain Abstimmung", "Treasury-Aufsicht", "Partnerschafts-Genehmigung"],
        },
        {
          phase: "Phase 3",
          title: "Vollständige DAO",
          period: "2027 - 2028",
          status: "planned",
          description:
            "Vollständiger Übergang zur dezentralisierten autonomen Organisation mit gewählten Ratsmitgliedern und On-Chain-Governance.",
          features: ["Gewählter Rat", "Volle DAO-Kontrolle", "Community-Treasury"],
        },
      ],

      treasuryTitle: "Treasury-Transparenz",
      treasuryDescription:
        "Alle Treasury-Operationen mit maximaler Transparenz und institutionellen Sicherheitsprotokollen:",
      treasuryItems: [
        { icon: Lock, text: "Multi-Signatur-Wallet erfordert 3-von-5 Führungsgenehmigungen" },
        { icon: CheckCircle2, text: "Monatliche Treasury-Berichte on-chain veröffentlicht" },
        { icon: Users, text: "Community-Aufsichtsausschuss für große Ausgaben" },
        { icon: Eye, text: "Echtzeit-Verfolgung über öffentliches Dashboard" },
        { icon: Shield, text: "Jährliche Drittanbieter-Audits" },
      ],

      tierTitle: "Token-Inhaber-Rechte",
      tierDescription: "Governance-Teilnahme skaliert mit Ihrem Engagement:",
      tiers: [
        {
          tier: "Starter / Bronze",
          icon: Star,
          color: "from-amber-700 to-amber-900",
          rights: "Forum-Zugang, Feedback, Newsletter, öffentliche Ankündigungen",
        },
        {
          tier: "Silber / Gold",
          icon: Gem,
          color: "from-gray-400 to-yellow-500",
          rights: "Abstimmungen, Umfragen, frühe Ankündigungen, Prioritäts-Support",
        },
        {
          tier: "Platin / Diamant",
          icon: Crown,
          color: "from-blue-400 to-purple-500",
          rights: "Volle Stimmrechte, Vorschlagserstellung, Ratswahl, direkter Team-Kontakt",
        },
      ],

      contactTitle: "Kontakt zur Führung",
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

        <div className="max-w-6xl mx-auto">
          {/* Hero Header */}
          <div className="mb-16 text-center">
            <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6">
              <Building2 className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">{t.title}</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">{t.subtitle}</p>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 max-w-3xl mx-auto">
              {t.stats.map((stat, i) => (
                <div key={i} className="p-4 bg-card/50 backdrop-blur border border-border/50 rounded-xl">
                  <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Vision & Mission */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <div className="p-8 bg-gradient-to-br from-primary/10 to-transparent backdrop-blur border border-primary/20 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary/20 rounded-xl">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold">{t.visionTitle}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">{t.visionText}</p>
            </div>

            <div className="p-8 bg-gradient-to-br from-blue-500/10 to-transparent backdrop-blur border border-blue-500/20 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <Target className="h-6 w-6 text-blue-500" />
                </div>
                <h2 className="text-2xl font-semibold">{t.missionTitle}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">{t.missionText}</p>
            </div>
          </div>

          {/* Core Values */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-foreground mb-8 text-center flex items-center justify-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              {t.valuesTitle}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {t.values.map((value, index) => {
                const Icon = value.icon
                return (
                  <div
                    key={index}
                    className="p-6 bg-card/50 backdrop-blur border border-border/50 rounded-2xl text-center hover:border-primary/50 transition-all group"
                  >
                    <div className="inline-flex p-3 bg-primary/10 rounded-xl mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Executive Leadership */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-2 flex items-center justify-center gap-2">
                <Award className="h-6 w-6 text-primary" />
                {t.leadershipTitle}
              </h2>
              <p className="text-primary font-medium">{t.leadershipSubtitle}</p>
            </div>

            <div className="p-8 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur border border-border/50 rounded-2xl mb-6">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center border border-primary/30">
                    <Building2 className="h-12 w-12 text-primary" />
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground leading-relaxed">{t.leadershipDescription}</p>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {t.leadershipAreas.map((area, index) => {
                const Icon = area.icon
                return (
                  <div
                    key={index}
                    className="p-5 bg-card/30 backdrop-blur border border-border/50 rounded-xl flex items-start gap-4"
                  >
                    <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{area.title}</h3>
                      <p className="text-sm text-muted-foreground">{area.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Advisors */}
          <div className="mb-16 p-6 bg-card/30 backdrop-blur border border-border/50 rounded-2xl">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              {t.advisorsTitle}
            </h2>
            <p className="text-muted-foreground">{t.advisorsText}</p>
          </div>

          {/* Governance Evolution */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-2 flex items-center justify-center gap-2">
                <Scale className="h-6 w-6 text-primary" />
                {t.governanceTitle}
              </h2>
              <p className="text-muted-foreground">{t.governanceSubtitle}</p>
            </div>

            <div className="space-y-4">
              {t.governancePhases.map((phase, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-2xl border transition-all ${
                    phase.status === "active"
                      ? "bg-gradient-to-r from-primary/20 to-primary/5 border-primary/40 shadow-lg shadow-primary/10"
                      : phase.status === "upcoming"
                        ? "bg-gradient-to-r from-blue-500/10 to-transparent border-blue-500/30"
                        : "bg-card/30 border-border/50"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center ${
                          phase.status === "active"
                            ? "bg-primary text-primary-foreground"
                            : phase.status === "upcoming"
                              ? "bg-blue-500/20 text-blue-500 border border-blue-500/30"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <span className="text-xs font-medium">{phase.phase}</span>
                        <span className="text-lg font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                          {phase.title}
                          {phase.status === "active" && (
                            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                              {language === "de" ? "Aktuell" : "Current"}
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground">{phase.period}</p>
                      </div>
                    </div>
                    <div className="flex-1 md:ml-4">
                      <p className="text-sm text-muted-foreground mb-3">{phase.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {phase.features.map((feature, i) => (
                          <span
                            key={i}
                            className={`text-xs px-2 py-1 rounded-full ${
                              phase.status === "active"
                                ? "bg-primary/20 text-primary"
                                : phase.status === "upcoming"
                                  ? "bg-blue-500/20 text-blue-400"
                                  : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Treasury Transparency */}
          <div className="mb-16 p-6 bg-card/30 backdrop-blur border border-border/50 rounded-2xl">
            <h2 className="text-xl font-semibold text-foreground mb-2 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              {t.treasuryTitle}
            </h2>
            <p className="text-muted-foreground mb-6">{t.treasuryDescription}</p>
            <div className="space-y-3">
              {t.treasuryItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <div key={index} className="flex items-start gap-3 p-3 bg-background/50 rounded-xl">
                    <div className="p-1.5 bg-primary/10 rounded-lg">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">{item.text}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Token Holder Rights */}
          <div className="mb-16">
            <h2 className="text-xl font-semibold text-foreground mb-2 flex items-center gap-2">
              <Vote className="h-5 w-5 text-primary" />
              {t.tierTitle}
            </h2>
            <p className="text-muted-foreground mb-6">{t.tierDescription}</p>
            <div className="space-y-4">
              {t.tiers.map((tier, index) => {
                const Icon = tier.icon
                return (
                  <div
                    key={index}
                    className={`p-5 rounded-xl border border-border/50 bg-gradient-to-r ${tier.color} bg-opacity-10`}
                    style={{ background: `linear-gradient(to right, rgba(0,0,0,0.3), rgba(0,0,0,0.1))` }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex items-center gap-3 min-w-[160px]">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${tier.color}`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-semibold text-foreground">{tier.tier}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 text-muted-foreground hidden sm:block" />
                        <span className="text-sm text-muted-foreground">{tier.rights}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Contact */}
          <div className="p-8 bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur border border-primary/20 rounded-2xl text-center">
            <h2 className="text-xl font-semibold text-foreground mb-2 flex items-center justify-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              {t.contactTitle}
            </h2>
            <p className="text-muted-foreground mb-6">{t.contactDescription}</p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all hover:scale-105"
            >
              <Mail className="h-5 w-5" />
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
