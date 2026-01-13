"use client"

import { useLanguage } from "@/hooks/use-language"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AnimatedBackground } from "@/components/animated-background"
import { ArrowLeft, Users, Linkedin, Twitter, Github, Building, Scale, Vote, Shield } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function TeamPage() {
  const { language } = useLanguage()

  const content = {
    en: {
      title: "Team & Governance",
      subtitle: "Transparent leadership and decentralized decision-making",
      teamTitle: "Core Team",
      teamDescription: "Our team combines expertise in blockchain technology, finance, and business development.",
      advisorsTitle: "Advisors",
      advisorsNote:
        "Advisory board to be announced. We are in discussions with industry experts in DeFi, compliance, and enterprise blockchain adoption.",
      governanceTitle: "Governance Model",
      governanceDescription:
        "OnePremium is transitioning towards a decentralized autonomous organization (DAO) structure.",
      governancePhases: [
        {
          title: "Current Phase: Foundation",
          description:
            "Core team manages operations with community input through governance proposals and voting mechanisms.",
        },
        {
          title: "Phase 2: Hybrid Governance",
          description:
            "Token holders gain voting rights on key decisions including treasury allocations, partnership approvals, and protocol upgrades.",
        },
        {
          title: "Phase 3: Full DAO",
          description:
            "Complete transition to decentralized governance with elected council members and on-chain voting for all major decisions.",
        },
      ],
      treasuryTitle: "Treasury Transparency",
      treasuryDescription:
        "All treasury operations are conducted through multi-signature wallets requiring multiple team member approvals.",
      treasuryItems: [
        "Multi-sig wallet requiring 3-of-5 signatures",
        "Monthly treasury reports published on-chain",
        "Community oversight of major expenditures",
        "Transparent allocation tracking",
      ],
      votingTitle: "Voting Rights",
      votingDescription: "Token holders can participate in governance based on their tier status:",
      votingTiers: [
        { tier: "Starter/Bronze", rights: "Forum participation, feedback submission" },
        { tier: "Silver/Gold", rights: "Proposal voting, community polls" },
        { tier: "Platinum/Diamond", rights: "Full voting rights, proposal creation, council eligibility" },
      ],
      disclaimer: "Team information will be updated as we expand. All team members undergo verification processes.",
    },
    de: {
      title: "Team & Governance",
      subtitle: "Transparente Führung und dezentralisierte Entscheidungsfindung",
      teamTitle: "Kernteam",
      teamDescription: "Unser Team vereint Expertise in Blockchain-Technologie, Finanzen und Geschäftsentwicklung.",
      advisorsTitle: "Berater",
      advisorsNote:
        "Beratergremium wird noch bekannt gegeben. Wir führen Gespräche mit Branchenexperten in DeFi, Compliance und Enterprise-Blockchain-Adoption.",
      governanceTitle: "Governance-Modell",
      governanceDescription:
        "OnePremium befindet sich im Übergang zu einer dezentralisierten autonomen Organisationsstruktur (DAO).",
      governancePhases: [
        {
          title: "Aktuelle Phase: Fundament",
          description:
            "Das Kernteam verwaltet den Betrieb mit Community-Input durch Governance-Vorschläge und Abstimmungsmechanismen.",
        },
        {
          title: "Phase 2: Hybride Governance",
          description:
            "Token-Inhaber erhalten Stimmrechte bei wichtigen Entscheidungen, einschließlich Treasury-Zuteilungen, Partnerschaftsgenehmigungen und Protokoll-Upgrades.",
        },
        {
          title: "Phase 3: Vollständige DAO",
          description:
            "Vollständiger Übergang zur dezentralisierten Governance mit gewählten Ratsmitgliedern und On-Chain-Abstimmungen für alle wichtigen Entscheidungen.",
        },
      ],
      treasuryTitle: "Treasury-Transparenz",
      treasuryDescription:
        "Alle Treasury-Operationen werden über Multi-Signatur-Wallets durchgeführt, die mehrere Teamgenehmigungen erfordern.",
      treasuryItems: [
        "Multi-Sig-Wallet erfordert 3-von-5 Signaturen",
        "Monatliche Treasury-Berichte on-chain veröffentlicht",
        "Community-Aufsicht bei größeren Ausgaben",
        "Transparente Zuweisungsverfolgung",
      ],
      votingTitle: "Stimmrechte",
      votingDescription: "Token-Inhaber können basierend auf ihrem Tier-Status an der Governance teilnehmen:",
      votingTiers: [
        { tier: "Starter/Bronze", rights: "Forumsteilnahme, Feedback-Einreichung" },
        { tier: "Silber/Gold", rights: "Vorschlagsabstimmung, Community-Umfragen" },
        { tier: "Platin/Diamant", rights: "Volle Stimmrechte, Vorschlagserstellung, Ratsberechtigung" },
      ],
      disclaimer:
        "Teaminformationen werden bei Erweiterung aktualisiert. Alle Teammitglieder durchlaufen Verifizierungsprozesse.",
    },
  }

  const t = content[language]

  const team = [
    {
      name: "To Be Announced",
      role: language === "de" ? "Gründer & CEO" : "Founder & CEO",
      description:
        language === "de"
          ? "Verifizierung ausstehend. Vollständiges Profil wird nach Abschluss der Compliance-Prüfungen veröffentlicht."
          : "Verification pending. Full profile will be published upon completion of compliance reviews.",
      image: "/professional-business-portrait-silhouette.jpg",
      social: { linkedin: "#", twitter: "#" },
    },
    {
      name: "To Be Announced",
      role: language === "de" ? "CTO" : "CTO",
      description:
        language === "de"
          ? "Blockchain-Entwicklung und Smart-Contract-Architektur. Profil wird nach Verifizierung veröffentlicht."
          : "Blockchain development and smart contract architecture. Profile to be published after verification.",
      image: "/tech-professional-portrait-silhouette.jpg",
      social: { linkedin: "#", github: "#" },
    },
    {
      name: "To Be Announced",
      role: language === "de" ? "Leiter Compliance" : "Head of Compliance",
      description:
        language === "de"
          ? "Regulatorische Compliance und rechtliche Angelegenheiten. Verifizierung läuft."
          : "Regulatory compliance and legal affairs. Verification in progress.",
      image: "/legal-professional-portrait-silhouette.jpg",
      social: { linkedin: "#" },
    },
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

        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-12 p-6 bg-card/50 backdrop-blur border border-border/50 rounded-xl text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Users className="h-8 w-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">{t.title}</h1>
            </div>
            <p className="text-muted-foreground">{t.subtitle}</p>
          </div>

          {/* Team Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-2 flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              {t.teamTitle}
            </h2>
            <p className="text-muted-foreground mb-6">{t.teamDescription}</p>

            <div className="grid gap-6 md:grid-cols-3">
              {team.map((member, index) => (
                <div key={index} className="p-6 bg-card/30 backdrop-blur border border-border/50 rounded-xl">
                  <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-secondary">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      fill
                      className="object-cover opacity-50"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground text-center">{member.name}</h3>
                  <p className="text-sm text-primary text-center mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground text-center mb-4">{member.description}</p>
                  <div className="flex justify-center gap-3">
                    {member.social.linkedin && (
                      <a
                        href={member.social.linkedin}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                    {member.social.twitter && (
                      <a
                        href={member.social.twitter}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Twitter className="h-4 w-4" />
                      </a>
                    )}
                    {member.social.github && (
                      <a
                        href={member.social.github}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground/70 mt-4 text-center italic">{t.disclaimer}</p>
          </div>

          {/* Advisors */}
          <div className="mb-12 p-6 bg-card/30 backdrop-blur border border-border/50 rounded-xl">
            <h2 className="text-xl font-semibold text-foreground mb-4">{t.advisorsTitle}</h2>
            <p className="text-muted-foreground">{t.advisorsNote}</p>
          </div>

          {/* Governance Model */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-2 flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              {t.governanceTitle}
            </h2>
            <p className="text-muted-foreground mb-6">{t.governanceDescription}</p>

            <div className="space-y-4">
              {t.governancePhases.map((phase, index) => (
                <div
                  key={index}
                  className={`p-5 rounded-xl border ${index === 0 ? "bg-primary/5 border-primary/30" : "bg-card/30 border-border/50"}`}
                >
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                    >
                      {index + 1}
                    </span>
                    {phase.title}
                  </h3>
                  <p className="text-sm text-muted-foreground ml-8">{phase.description}</p>
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
                <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Voting Rights */}
          <div className="p-6 bg-card/30 backdrop-blur border border-border/50 rounded-xl">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Vote className="h-5 w-5 text-primary" />
              {t.votingTitle}
            </h2>
            <p className="text-muted-foreground mb-4">{t.votingDescription}</p>
            <div className="space-y-3">
              {t.votingTiers.map((tier, index) => (
                <div key={index} className="flex items-start gap-4 p-3 bg-background/50 rounded-lg">
                  <div className="text-sm font-medium text-primary min-w-[120px]">{tier.tier}</div>
                  <div className="text-sm text-muted-foreground">{tier.rights}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
