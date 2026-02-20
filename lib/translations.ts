export type Language = "en" | "de"

export const translations = {
  en: {
    // Header
    nav: {
      home: "Home",
      about: "About",
      whitepaper: "Whitepaper",
      roadmap: "Roadmap",
      tokenomics: "Tokenomics",
      dashboard: "Dashboard",
    },
    // Hero
    hero: {
      tagline: "Institutional-Grade Digital Asset Infrastructure",
      title: "OnePremium",
      subtitle:
        "A paradigm-defining digital asset engineered for sophisticated investors seeking unprecedented value preservation, institutional security, and exclusive ecosystem benefits.",
      connectWallet: "Access Portfolio",
      learnMore: "Explore Protocol",
      livePrice: "Live Valuation",
      holders: "Verified Holders",
      marketCap: "Market Capitalization",
    },
    // About
    about: {
      title: "The OnePremium Protocol",
      description:
        "OnePremium (OPM) represents the convergence of institutional-grade blockchain infrastructure and premium digital asset management. Our protocol establishes a new paradigm in decentralized finance, delivering unparalleled security, transparent governance, and exclusive holder benefits within a meticulously architected ecosystem.",
      mission: {
        title: "Strategic Mission",
        description:
          "To architect the definitive bridge between traditional wealth preservation methodologies and next-generation blockchain technology, establishing OnePremium as the preeminent choice for discerning digital asset holders.",
      },
      vision: {
        title: "Long-Term Vision",
        description:
          "A globally recognized digital asset ecosystem where OPM serves as the cornerstone for premium financial services, exclusive partnerships, and institutional-grade investment opportunities.",
      },
      values: {
        title: "Foundational Principles",
        items: [
          "Absolute Transparency",
          "Technological Excellence",
          "Community Sovereignty",
          "Uncompromising Security",
        ],
      },
    },
    // Features
    features: {
      title: "Competitive Advantages",
      items: [
        {
          title: "Tiered Benefit Architecture",
          description:
            "A sophisticated six-tier system delivering escalating benefits from 5% to 50% across partner networks.",
        },
        {
          title: "Audited Smart Contracts",
          description:
            "Ethereum-native deployment with comprehensive SolidityScan verification and continuous monitoring.",
        },
        {
          title: "Strategic Partner Ecosystem",
          description: "Curated network of premium service providers offering exclusive holder advantages.",
        },
        {
          title: "Decentralized Governance",
          description: "Token-weighted voting mechanisms ensuring community-driven protocol evolution.",
        },
      ],
    },
    // Whitepaper
    whitepaper: {
      title: "Technical Whitepaper",
      subtitle: "Comprehensive Protocol Documentation v2.0",
      downloadPdf: "Download Whitepaper",
      version: "Version 2.0 - January 2026",
      sections: {
        abstract: {
          title: "Executive Summary",
          content: `OnePremium (OPM) constitutes a paradigm-defining advancement in digital asset architecture, engineered to deliver institutional-grade security, transparent governance, and tangible holder value within the Ethereum ecosystem.

This technical documentation delineates our comprehensive approach to establishing a sustainable, value-accruing token economy that rewards committed stakeholders while facilitating access to an expanding network of premium services and exclusive opportunities.

The OnePremium protocol addresses fundamental inefficiencies in existing digital asset frameworks by implementing a sophisticated tier-based benefit system, rigorous security infrastructure, and a deflationary tokenomic model designed for long-term value preservation.`,
        },
        introduction: {
          title: "1. Introduction & Market Context",
          content: `1.1 Market Opportunity

The digital asset landscape has matured significantly since Bitcoin's inception, yet a substantial gap persists between tokenized value and real-world utility. OnePremium addresses this market inefficiency by establishing direct correlation between token ownership and premium benefit access.

1.2 Problem Statement

Current digital assets suffer from:
• Lack of tangible utility beyond speculation
• Insufficient holder incentive mechanisms
• Absence of institutional-grade security standards
• Limited governance participation frameworks

1.3 The OnePremium Solution

OPM delivers a vertically integrated ecosystem encompassing:
• Six-tier benefit architecture with escalating privileges
• Audited smart contract infrastructure
• Decentralized governance protocols
• Strategic partnership network
• 365-day commitment mechanism ensuring stakeholder alignment`,
        },
        technology: {
          title: "2. Technical Architecture",
          content: `2.1 Blockchain Infrastructure

OnePremium is deployed as an ERC-20 compliant token on Ethereum Mainnet, leveraging the network's unparalleled security, decentralization, and liquidity infrastructure.

Contract Address: 0xE430b07F7B168E77B07b29482DbF89EafA53f484
Network: Ethereum Mainnet (Chain ID: 1)
Token Standard: ERC-20
Decimals: 18

2.2 Smart Contract Security

Our smart contracts undergo rigorous security validation:
• SolidityScan automated vulnerability assessment
• Manual code review by senior blockchain engineers
• Continuous monitoring and anomaly detection
• Multi-signature treasury management (3-of-5)

2.3 Integration Architecture

• Alchemy Enterprise RPC infrastructure
• Infura redundant node connectivity
• Etherscan API integration for transparency
• CoinMarketCap DEX price oracle integration`,
        },
        tierSystem: {
          title: "3. Tier-Based Benefit Architecture",
          content: `3.1 Tier Structure Overview

The OnePremium tier system implements a sophisticated benefit escalation model rewarding committed stakeholders:

STARTER TIER (0.001 - 0.099 OPM)
• Ecosystem access privileges
• Basic partner discounts: 5%
• Community forum participation
• Educational resource access

BRONZE TIER (0.1 - 0.499 OPM)
• Enhanced partner discounts: 10%
• Priority customer support
• Monthly market intelligence reports
• Early announcement access

SILVER TIER (0.5 - 0.999 OPM)
• Premium partner discounts: 20%
• Quarterly governance voting rights
• Exclusive webinar access
• Partner pre-sale allocations

GOLD TIER (1.0 - 4.999 OPM)
• Elite partner discounts: 30%
• Full governance participation
• Annual holder summit invitation
• NFT collection eligibility

PLATINUM TIER (5.0 - 9.999 OPM)
• Maximum partner discounts: 40%
• Proposal submission rights
• Private consultation sessions
• Concierge service access

DIAMOND TIER (10+ OPM)
• Ultimate benefits package: 50%
• Board advisory participation
• Direct team communication channel
• Exclusive investment opportunities`,
        },
        economics: {
          title: "4. Tokenomic Framework",
          content: `4.1 Supply Architecture

Total Maximum Supply: 10,000 OPM
Current Circulating Supply: 10,000 OPM
Fully Diluted Valuation: ~$2,500,000 USD

4.2 Distribution Methodology

• Liquidity Provision: 40% (4,000 OPM)
  Deployed to Uniswap V3 for decentralized trading access

• Development Treasury: 25% (2,500 OPM)
  Funding ongoing protocol development and security audits

• Team Allocation: 15% (1,500 OPM)
  Subject to 24-month linear vesting schedule

• Marketing & Partnerships: 12% (1,200 OPM)
  Strategic initiatives and partner acquisition

• Community Rewards: 8% (800 OPM)
  Staking rewards and community incentive programs

4.3 Transaction Parameters

• Buy Tax: 0%
• Sell Tax: 0%
• Transfer Tax: 0%

4.4 Value Preservation Mechanisms

• 365-day commitment period for new acquisitions
• Tier-based benefit escalation incentivizing accumulation
• Strategic supply limitation (10,000 OPM maximum)`,
        },
        governance: {
          title: "5. Governance Framework",
          content: `5.1 Decentralized Decision Architecture

OnePremium implements progressive decentralization through token-weighted governance:

Governance Token: OPM
Voting Mechanism: Token-weighted proportional voting
Proposal Threshold: Gold tier minimum (1.0 OPM)
Quorum Requirement: 15% of circulating supply participation

5.2 Governance Scope

Token holders may propose and vote on:
• Protocol parameter modifications
• Treasury allocation decisions
• Partnership approval processes
• Roadmap prioritization
• Fee structure adjustments

5.3 Governance Timeline

Phase 1 (2024-2025): Foundation governance via team multisig
Phase 2 (2026-2027): Hybrid governance with community input
Phase 3 (2028+): Full DAO transition with on-chain execution`,
        },
        security: {
          title: "6. Security Infrastructure",
          content: `6.1 Smart Contract Security

Audit Status: Verified by SolidityScan
Audit Report: solidityscan.com/quickscan/0xE430b07F7B168E77B07b29482DbF89EafA53f484

Security Measures:
• Automated vulnerability scanning
• Reentrancy protection
• Integer overflow safeguards
• Access control validation

6.2 Operational Security

• Multi-signature treasury (3-of-5 signers)
• Hardware wallet key management
• Geographic key distribution
• Regular security assessment cycles

6.3 Incident Response

• 24/7 monitoring infrastructure
• Automated anomaly detection
• Documented response procedures
• Community communication protocols

6.4 Bug Bounty Program

Critical vulnerabilities: Up to $50,000 USD equivalent
High severity: Up to $10,000 USD equivalent
Medium severity: Up to $2,500 USD equivalent`,
        },
        legal: {
          title: "7. Legal & Compliance Framework",
          content: `7.1 Regulatory Positioning

OnePremium operates as a utility token providing access to ecosystem benefits. The token does not constitute:
• A security or investment contract
• A claim on company profits or assets
• A governance right in any legal entity

7.2 Jurisdictional Considerations

Users are responsible for compliance with applicable local regulations. OnePremium services may be restricted in certain jurisdictions.

7.3 Risk Acknowledgment

Digital asset investment involves substantial risk. Past performance does not guarantee future results. Users should conduct independent research and consult qualified advisors.

7.4 Contact Information

Legal Inquiries: kontakt@onepremium.de
Registered Jurisdiction: Germany
Website: onepremium.de`,
        },
        conclusion: {
          title: "8. Conclusion & Forward Outlook",
          content: `OnePremium represents a meticulously architected digital asset ecosystem designed for long-term value creation and holder benefit maximization.

Through our institutional-grade security infrastructure, transparent governance framework, and expanding partnership network, we are positioned to establish OPM as the definitive choice for sophisticated digital asset investors.

Our commitment to continuous improvement, community engagement, and technological excellence ensures OnePremium will remain at the forefront of digital asset innovation through 2030 and beyond.

We invite discerning investors to join us in building the future of premium digital assets.

— The OnePremium Team`,
        },
      },
    },
    // Roadmap - Extended to 2030
    roadmap: {
      title: "Strategic Development Roadmap",
      subtitle: "Comprehensive Vision Through 2030",
      phases: [
        {
          phase: "Phase 1",
          title: "Foundation & Launch",
          period: "Q1-Q4 2024",
          status: "completed",
          items: [
            "Smart contract development and Ethereum mainnet deployment",
            "SolidityScan security audit completion and verification",
            "Platform architecture and dashboard infrastructure",
            "Uniswap V3 liquidity pool establishment",
            "CoinMarketCap and CoinGecko listing approval",
            "Initial community building and social presence",
          ],
        },
        {
          phase: "Phase 2",
          title: "Infrastructure Expansion",
          period: "Q1-Q4 2025",
          status: "completed",
          items: [
            "Six-tier benefit system full implementation",
            "365-day commitment mechanism activation",
            "Advanced user dashboard with portfolio analytics",
            "Multi-wallet detection and aggregation",
            "Real-time price oracle integration",
            "German language localization deployment",
          ],
        },
        {
          phase: "Phase 3",
          title: "Ecosystem Growth",
          period: "Q1-Q2 2026",
          status: "in-progress",
          items: [
            "Strategic partnership network expansion",
            "Mobile application development (iOS/Android)",
            "Staking protocol with competitive APY",
            "Governance portal beta launch",
            "Premium partner onboarding program",
            "Cross-chain bridge research and development",
          ],
        },
        {
          phase: "Phase 4",
          title: "Market Penetration",
          period: "Q3-Q4 2026",
          status: "upcoming",
          items: [
            "Centralized exchange listing applications",
            "NFT collection for Diamond tier holders",
            "OnePremium debit card pilot program",
            "Institutional investor relations program",
            "Advanced analytics and reporting suite",
            "Regional ambassador network establishment",
          ],
        },
        {
          phase: "Phase 5",
          title: "Global Expansion",
          period: "2027-2028",
          status: "upcoming",
          items: [
            "Multi-chain deployment (Polygon, Arbitrum, Base)",
            "OnePremium Marketplace for premium goods",
            "Real estate partnership integration",
            "Travel and hospitality partner network",
            "Enterprise B2B solution offerings",
            "Full DAO governance transition initiation",
          ],
        },
        {
          phase: "Phase 6",
          title: "Industry Leadership",
          period: "2029-2030",
          status: "upcoming",
          items: [
            "Complete decentralized autonomous organization",
            "Global premium service integration network",
            "OnePremium Foundation establishment",
            "Academic research partnership program",
            "Regulatory framework advocacy initiatives",
            "Next-generation protocol development (OPM 2.0)",
          ],
        },
      ],
    },
    // Tokenomics
    tokenomics: {
      title: "Tokenomic Architecture",
      subtitle: "Engineered for Sustainable Value Appreciation",
      totalSupply: "Maximum Supply",
      distribution: "Strategic Distribution",
      items: [
        { label: "Liquidity Provision", percentage: 40, color: "#D4AF37" },
        { label: "Development Treasury", percentage: 25, color: "#B8860B" },
        { label: "Team Allocation", percentage: 15, color: "#8B7355" },
        { label: "Marketing & Partnerships", percentage: 12, color: "#CD853F" },
        { label: "Community Rewards", percentage: 8, color: "#DAA520" },
      ],
      details: {
        contract: "Contract Address",
        network: "Network",
        decimals: "Decimals",
        taxBuy: "Buy Tax",
        taxSell: "Sell Tax",
      },
    },
    // Dashboard
    dashboard: {
      title: "Portfolio Command Center",
      portfolio: "Asset Holdings",
      price: "Current Valuation",
      change24h: "24h Performance",
      marketStats: "Market Intelligence",
      totalSupply: "Total Supply",
      marketCap: "Market Capitalization",
      volume24h: "24h Trading Volume",
      tierStatus: "Membership Tier",
      discount: "Benefit Level",
      progressTo: "Progress to",
      needed: "required",
      maxTier: "Diamond Elite Status Achieved",
      quickActions: "Quick Operations",
      buyOpm: "Acquire OPM",
      purchaseTokens: "Purchase tokens",
      swap: "Exchange",
      exchangeTokens: "Swap tokens",
      stake: "Stake",
      earnRewards: "Generate yield",
      referral: "Referral",
      inviteFriends: "Invite associates",
      comingSoon: "Coming Soon",
      transactions: "Transaction History",
      noTransactions: "No transactions recorded",
    },
    // Connect Prompt
    connect: {
      welcome: "Welcome to",
      description: "Connect your wallet to access your exclusive command center and manage your OPM portfolio",
      connectButton: "Connect Wallet",
      connecting: "Establishing Connection...",
      features: {
        secure: "Bank-Grade Security",
        instant: "Instant Portfolio Access",
        exclusive: "Exclusive Member Benefits",
      },
    },
    // Footer
    footer: {
      rights: "All rights reserved.",
      poweredBy: "Secured by Ethereum",
      livePrice: "Real-time pricing via CoinMarketCap DEX",
      links: {
        whitepaper: "Whitepaper",
        roadmap: "Roadmap",
        tokenomics: "Tokenomics",
        community: "Community",
      },
      social: {
        twitter: "Twitter",
        telegram: "Telegram",
        discord: "Discord",
      },
    },
    // Common
    common: {
      loading: "Loading...",
      error: "Error",
      refresh: "Refresh",
      viewMore: "View Details",
      backToTop: "Return to Top",
    },
  },
  de: {
    // Header
    nav: {
      home: "Startseite",
      about: "Über uns",
      whitepaper: "Whitepaper",
      roadmap: "Roadmap",
      tokenomics: "Tokenomics",
      dashboard: "Dashboard",
    },
    // Hero
    hero: {
      tagline: "Institutionelle Digital-Asset-Infrastruktur",
      title: "OnePremium",
      subtitle:
        "Ein paradigmendefinierender digitaler Vermögenswert, entwickelt für anspruchsvolle Investoren, die beispiellose Werterhaltung, institutionelle Sicherheit und exklusive Ökosystem-Vorteile suchen.",
      connectWallet: "Portfolio Zugang",
      learnMore: "Protokoll erkunden",
      livePrice: "Live-Bewertung",
      holders: "Verifizierte Inhaber",
      marketCap: "Marktkapitalisierung",
    },
    // About
    about: {
      title: "Das OnePremium Protokoll",
      description:
        "OnePremium (OPM) repräsentiert die Konvergenz von institutioneller Blockchain-Infrastruktur und Premium-Digital-Asset-Management. Unser Protokoll etabliert ein neues Paradigma in der dezentralen Finanzwelt und liefert beispiellose Sicherheit, transparente Governance und exklusive Inhaber-Vorteile innerhalb eines sorgfältig architektieren Ökosystems.",
      mission: {
        title: "Strategische Mission",
        description:
          "Die definitive Brücke zwischen traditionellen Vermögenserhaltungsmethoden und Blockchain-Technologie der nächsten Generation zu architektieren und OnePremium als die führende Wahl für anspruchsvolle Digital-Asset-Inhaber zu etablieren.",
      },
      vision: {
        title: "Langfristige Vision",
        description:
          "Ein global anerkanntes Digital-Asset-Ökosystem, in dem OPM als Grundstein für Premium-Finanzdienstleistungen, exklusive Partnerschaften und institutionelle Investitionsmöglichkeiten dient.",
      },
      values: {
        title: "Grundlegende Prinzipien",
        items: [
          "Absolute Transparenz",
          "Technologische Exzellenz",
          "Community-Souveränität",
          "Kompromisslose Sicherheit",
        ],
      },
    },
    // Features
    features: {
      title: "Wettbewerbsvorteile",
      items: [
        {
          title: "Stufen-basierte Vorteilsarchitektur",
          description:
            "Ein ausgeklügeltes Sechs-Stufen-System mit eskalierenden Vorteilen von 5% bis 50% über Partnernetzwerke.",
        },
        {
          title: "Geprüfte Smart Contracts",
          description:
            "Ethereum-native Bereitstellung mit umfassender SolidityScan-Verifizierung und kontinuierlicher Überwachung.",
        },
        {
          title: "Strategisches Partner-Ökosystem",
          description: "Kuratiertes Netzwerk von Premium-Dienstleistern mit exklusiven Inhaber-Vorteilen.",
        },
        {
          title: "Dezentrale Governance",
          description: "Token-gewichtete Abstimmungsmechanismen für community-gesteuerte Protokoll-Evolution.",
        },
      ],
    },
    // Whitepaper
    whitepaper: {
      title: "Technisches Whitepaper",
      subtitle: "Umfassende Protokoll-Dokumentation v2.0",
      downloadPdf: "Whitepaper herunterladen",
      version: "Version 2.0 - Januar 2026",
      sections: {
        abstract: {
          title: "Zusammenfassung",
          content: `OnePremium (OPM) stellt einen paradigmendefinierenden Fortschritt in der Digital-Asset-Architektur dar, entwickelt um institutionelle Sicherheit, transparente Governance und greifbaren Inhaber-Wert innerhalb des Ethereum-Ökosystems zu liefern.

Diese technische Dokumentation beschreibt unseren umfassenden Ansatz zur Etablierung einer nachhaltigen, wertsteigernden Token-Ökonomie, die engagierte Stakeholder belohnt und gleichzeitig Zugang zu einem expandierenden Netzwerk von Premium-Dienstleistungen und exklusiven Möglichkeiten ermöglicht.

Das OnePremium-Protokoll adressiert fundamentale Ineffizienzen in bestehenden Digital-Asset-Frameworks durch Implementierung eines ausgeklügelten stufen-basierten Vorteilssystems, rigoroser Sicherheitsinfrastruktur und eines deflationären Tokenomik-Modells für langfristige Werterhaltung.`,
        },
        introduction: {
          title: "1. Einführung & Marktkontext",
          content: `1.1 Marktchance

Die Digital-Asset-Landschaft hat sich seit Bitcoins Entstehung erheblich weiterentwickelt, doch eine substantielle Lücke besteht weiterhin zwischen tokenisiertem Wert und realem Nutzen. OnePremium adressiert diese Marktineffizienz durch Etablierung direkter Korrelation zwischen Token-Besitz und Premium-Vorteilszugang.

1.2 Problemstellung

Aktuelle digitale Vermögenswerte leiden unter:
• Mangel an greifbarem Nutzen über Spekulation hinaus
• Unzureichende Inhaber-Anreizmechanismen
• Fehlen institutioneller Sicherheitsstandards
• Begrenzte Governance-Teilnahmerahmen

1.3 Die OnePremium-Lösung

OPM liefert ein vertikal integriertes Ökosystem umfassend:
• Sechs-Stufen-Vorteilsarchitektur mit eskalierenden Privilegien
• Geprüfte Smart-Contract-Infrastruktur
• Dezentrale Governance-Protokolle
• Strategisches Partnernetzwerk
• 365-Tage-Commitment-Mechanismus zur Stakeholder-Ausrichtung`,
        },
        technology: {
          title: "2. Technische Architektur",
          content: `2.1 Blockchain-Infrastruktur

OnePremium wird als ERC-20-konformer Token auf Ethereum Mainnet bereitgestellt und nutzt die unübertroffene Sicherheit, Dezentralisierung und Liquiditätsinfrastruktur des Netzwerks.

Vertragsadresse: 0xE430b07F7B168E77B07b29482DbF89EafA53f484
Netzwerk: Ethereum Mainnet (Chain ID: 1)
Token-Standard: ERC-20
Dezimalstellen: 18

2.2 Smart-Contract-Sicherheit

Unsere Smart Contracts durchlaufen rigorose Sicherheitsvalidierung:
• SolidityScan automatisierte Schwachstellenbewertung
• Manuelle Code-Überprüfung durch Senior-Blockchain-Ingenieure
• Kontinuierliche Überwachung und Anomalieerkennung
• Multi-Signatur-Treasury-Management (3-von-5)

2.3 Integrationsarchitektur

• Alchemy Enterprise RPC-Infrastruktur
• Infura redundante Konnektivität
• Etherscan API-Integration für Transparenz
• CoinMarketCap DEX Preis-Oracle-Integration`,
        },
        tierSystem: {
          title: "3. Stufen-basierte Vorteilsarchitektur",
          content: `3.1 Stufenstruktur-Übersicht

Das OnePremium-Stufensystem implementiert ein ausgeklügeltes Vorteilseskalationsmodell zur Belohnung engagierter Stakeholder:

STARTER-STUFE (0,001 - 0,099 OPM)
• Ökosystem-Zugangsberechtigungen
• Basis-Partnerrabatte: 5%
• Community-Forum-Teilnahme
• Zugang zu Bildungsressourcen

BRONZE-STUFE (0,1 - 0,499 OPM)
• Verbesserte Partnerrabatte: 10%
• Prioritäts-Kundensupport
• Monatliche Marktintelligenz-Berichte
• Früher Ankündigungszugang

SILBER-STUFE (0,5 - 0,999 OPM)
• Premium-Partnerrabatte: 20%
• Vierteljährliche Governance-Stimmrechte
• Exklusiver Webinar-Zugang
• Partner-Vorverkaufszuteilungen

GOLD-STUFE (1,0 - 4,999 OPM)
• Elite-Partnerrabatte: 30%
• Volle Governance-Teilnahme
• Einladung zum jährlichen Inhaber-Gipfel
• NFT-Kollektion-Berechtigung

PLATIN-STUFE (5,0 - 9,999 OPM)
• Maximum-Partnerrabatte: 40%
• Vorschlagseinreichungsrechte
• Private Beratungssitzungen
• Concierge-Service-Zugang

DIAMANT-STUFE (10+ OPM)
• Ultimatives Vorteilspaket: 50%
• Beirats-Teilnahme
• Direkter Team-Kommunikationskanal
• Exklusive Investitionsmöglichkeiten`,
        },
        economics: {
          title: "4. Tokenomisches Framework",
          content: `4.1 Angebotsarchitektur

Maximales Gesamtangebot: 10.000 OPM
Aktuelles zirkulierendes Angebot: 10.000 OPM
Voll verwässerte Bewertung: ~2.500.000 USD

4.2 Verteilungsmethodik

• Liquiditätsbereitstellung: 40% (4.000 OPM)
  Auf Uniswap V3 für dezentralen Handelszugang bereitgestellt

• Entwicklungs-Treasury: 25% (2.500 OPM)
  Finanzierung laufender Protokollentwicklung und Sicherheitsaudits

• Team-Zuteilung: 15% (1.500 OPM)
  Unterliegt 24-monatigem linearem Vesting-Zeitplan

• Marketing & Partnerschaften: 12% (1.200 OPM)
  Strategische Initiativen und Partnerakquise

• Community-Belohnungen: 8% (800 OPM)
  Staking-Belohnungen und Community-Anreizprogramme

4.3 Transaktionsparameter

• Kaufsteuer: 0%
• Verkaufssteuer: 0%
• Transfersteuer: 0%

4.4 Werterhaltungsmechanismen

• 365-Tage-Commitment-Periode für neue Akquisitionen
• Stufen-basierte Vorteilseskalation als Akkumulationsanreiz
• Strategische Angebotslimitierung (10.000 OPM Maximum)`,
        },
        governance: {
          title: "5. Governance-Framework",
          content: `5.1 Dezentrale Entscheidungsarchitektur

OnePremium implementiert progressive Dezentralisierung durch token-gewichtete Governance:

Governance-Token: OPM
Abstimmungsmechanismus: Token-gewichtete proportionale Abstimmung
Vorschlagsschwelle: Gold-Stufe Minimum (1,0 OPM)
Quorum-Anforderung: 15% des zirkulierenden Angebots Teilnahme

5.2 Governance-Umfang

Token-Inhaber können vorschlagen und abstimmen über:
• Protokoll-Parametermodifikationen
• Treasury-Allokationsentscheidungen
• Partnerschaftsgenehmigungsprozesse
• Roadmap-Priorisierung
• Gebührenstrukturanpassungen

5.3 Governance-Zeitplan

Phase 1 (2024-2025): Grundlagen-Governance via Team-Multisig
Phase 2 (2026-2027): Hybrid-Governance mit Community-Input
Phase 3 (2028+): Volle DAO-Transition mit On-Chain-Ausführung`,
        },
        security: {
          title: "6. Sicherheitsinfrastruktur",
          content: `6.1 Smart-Contract-Sicherheit

Audit-Status: Verifiziert durch SolidityScan
Audit-Bericht: solidityscan.com/quickscan/0xE430b07F7B168E77B07b29482DbF89EafA53f484

Sicherheitsmaßnahmen:
• Automatisierte Schwachstellen-Scans
• Reentrancy-Schutz
• Integer-Overflow-Absicherungen
• Zugriffskontroll-Validierung

6.2 Betriebssicherheit

• Multi-Signatur-Treasury (3-von-5 Unterzeichner)
• Hardware-Wallet-Schlüsselmanagement
• Geografische Schlüsselverteilung
• Regelmäßige Sicherheitsbewertungszyklen

6.3 Incident Response

• 24/7 Überwachungsinfrastruktur
• Automatisierte Anomalieerkennung
• Dokumentierte Reaktionsverfahren
• Community-Kommunikationsprotokolle

6.4 Bug-Bounty-Programm

Kritische Schwachstellen: Bis zu 50.000 USD Äquivalent
Hoher Schweregrad: Bis zu 10.000 USD Äquivalent
Mittlerer Schweregrad: Bis zu 2.500 USD Äquivalent`,
        },
        legal: {
          title: "7. Rechts- & Compliance-Framework",
          content: `7.1 Regulatorische Positionierung

OnePremium operiert als Utility-Token, der Zugang zu Ökosystem-Vorteilen bietet. Der Token stellt nicht dar:
• Ein Wertpapier oder Investmentvertrag
• Einen Anspruch auf Unternehmensgewinne oder -vermögen
• Ein Governance-Recht in einer juristischen Person

7.2 Jurisdiktionelle Überlegungen

Nutzer sind für die Einhaltung anwendbarer lokaler Vorschriften verantwortlich. OnePremium-Dienste können in bestimmten Jurisdiktionen eingeschränkt sein.

7.3 Risikoanerkennung

Digital-Asset-Investitionen beinhalten erhebliche Risiken. Vergangene Performance garantiert keine zukünftigen Ergebnisse. Nutzer sollten unabhängige Recherchen durchführen und qualifizierte Berater konsultieren.

7.4 Kontaktinformationen

Rechtliche Anfragen: kontakt@onepremium.de
Registrierte Jurisdiktion: Deutschland
Website: onepremium.de`,
        },
        conclusion: {
          title: "8. Fazit & Zukunftsausblick",
          content: `OnePremium repräsentiert ein sorgfältig architektiertes Digital-Asset-Ökosystem, das auf langfristige Wertschöpfung und Maximierung der Inhaber-Vorteile ausgelegt ist.

Durch unsere institutionelle Sicherheitsinfrastruktur, transparentes Governance-Framework und expandierendes Partnernetzwerk sind wir positioniert, OPM als die definitive Wahl für anspruchsvolle Digital-Asset-Investoren zu etablieren.

Unser Engagement für kontinuierliche Verbesserung, Community-Einbindung und technologische Exzellenz stellt sicher, dass OnePremium an der Spitze der Digital-Asset-Innovation bis 2030 und darüber hinaus bleiben wird.

Wir laden anspruchsvolle Investoren ein, gemeinsam mit uns die Zukunft der Premium-Digital-Assets aufzubauen.

— Das OnePremium Team`,
        },
      },
    },
    // Roadmap - Extended to 2030
    roadmap: {
      title: "Strategische Entwicklungs-Roadmap",
      subtitle: "Umfassende Vision bis 2030",
      phases: [
        {
          phase: "Phase 1",
          title: "Grundlegung & Launch",
          period: "Q1-Q4 2024",
          status: "completed",
          items: [
            "Smart-Contract-Entwicklung und Ethereum-Mainnet-Deployment",
            "SolidityScan-Sicherheitsaudit-Abschluss und Verifizierung",
            "Plattform-Architektur und Dashboard-Infrastruktur",
            "Uniswap V3 Liquiditätspool-Etablierung",
            "CoinMarketCap und CoinGecko Listing-Genehmigung",
            "Initialer Community-Aufbau und soziale Präsenz",
          ],
        },
        {
          phase: "Phase 2",
          title: "Infrastruktur-Expansion",
          period: "Q1-Q4 2025",
          status: "completed",
          items: [
            "Sechs-Stufen-Vorteilssystem vollständige Implementierung",
            "365-Tage-Commitment-Mechanismus-Aktivierung",
            "Erweitertes Benutzer-Dashboard mit Portfolio-Analytik",
            "Multi-Wallet-Erkennung und Aggregation",
            "Echtzeit-Preis-Oracle-Integration",
            "Deutsche Sprachlokalisierung-Deployment",
          ],
        },
        {
          phase: "Phase 3",
          title: "Ökosystem-Wachstum",
          period: "Q1-Q2 2026",
          status: "in-progress",
          items: [
            "Strategische Partnernetzwerk-Expansion",
            "Mobile Anwendungsentwicklung (iOS/Android)",
            "Staking-Protokoll mit wettbewerbsfähigem APY",
            "Governance-Portal Beta-Launch",
            "Premium-Partner-Onboarding-Programm",
            "Cross-Chain-Bridge Forschung und Entwicklung",
          ],
        },
        {
          phase: "Phase 4",
          title: "Marktdurchdringung",
          period: "Q3-Q4 2026",
          status: "upcoming",
          items: [
            "Zentralisierte Börsen-Listing-Anträge",
            "NFT-Kollektion für Diamant-Stufen-Inhaber",
            "OnePremium Debitkarten-Pilotprogramm",
            "Institutionelle Investor-Relations-Programm",
            "Erweiterte Analytik- und Berichtssuite",
            "Regionale Botschafter-Netzwerk-Etablierung",
          ],
        },
        {
          phase: "Phase 5",
          title: "Globale Expansion",
          period: "2027-2028",
          status: "upcoming",
          items: [
            "Multi-Chain-Deployment (Polygon, Arbitrum, Base)",
            "OnePremium Marketplace für Premium-Güter",
            "Immobilien-Partnerschafts-Integration",
            "Reise- und Gastgewerbe-Partnernetzwerk",
            "Enterprise B2B-Lösungsangebote",
            "Volle DAO-Governance-Transitions-Initiierung",
          ],
        },
        {
          phase: "Phase 6",
          title: "Branchenführerschaft",
          period: "2029-2030",
          status: "upcoming",
          items: [
            "Vollständige dezentrale autonome Organisation",
            "Globales Premium-Service-Integrationsnetzwerk",
            "OnePremium Foundation Gründung",
            "Akademisches Forschungs-Partnerschaftsprogramm",
            "Regulatorische Framework-Advocacy-Initiativen",
            "Protokoll-Entwicklung der nächsten Generation (OPM 2.0)",
          ],
        },
      ],
    },
    // Tokenomics
    tokenomics: {
      title: "Tokenomische Architektur",
      subtitle: "Entwickelt für nachhaltige Wertsteigerung",
      totalSupply: "Maximales Angebot",
      distribution: "Strategische Verteilung",
      items: [
        { label: "Liquiditätsbereitstellung", percentage: 40, color: "#D4AF37" },
        { label: "Entwicklungs-Treasury", percentage: 25, color: "#B8860B" },
        { label: "Team-Zuteilung", percentage: 15, color: "#8B7355" },
        { label: "Marketing & Partnerschaften", percentage: 12, color: "#CD853F" },
        { label: "Community-Belohnungen", percentage: 8, color: "#DAA520" },
      ],
      details: {
        contract: "Vertragsadresse",
        network: "Netzwerk",
        decimals: "Dezimalstellen",
        taxBuy: "Kaufsteuer",
        taxSell: "Verkaufssteuer",
      },
    },
    // Dashboard
    dashboard: {
      title: "Portfolio-Kommandozentrale",
      portfolio: "Vermögensbestände",
      price: "Aktuelle Bewertung",
      change24h: "24h Performance",
      marketStats: "Marktintelligenz",
      totalSupply: "Gesamtangebot",
      marketCap: "Marktkapitalisierung",
      volume24h: "24h Handelsvolumen",
      tierStatus: "Mitgliedschaftsstufe",
      discount: "Vorteilsstufe",
      progressTo: "Fortschritt zu",
      needed: "benötigt",
      maxTier: "Diamant-Elite-Status erreicht",
      quickActions: "Schnelloperationen",
      buyOpm: "OPM erwerben",
      purchaseTokens: "Tokens kaufen",
      swap: "Tauschen",
      exchangeTokens: "Tokens wechseln",
      stake: "Staking",
      earnRewards: "Rendite generieren",
      referral: "Empfehlung",
      inviteFriends: "Kontakte einladen",
      comingSoon: "Demnächst",
      transactions: "Transaktionsverlauf",
      noTransactions: "Keine Transaktionen erfasst",
    },
    // Connect Prompt
    connect: {
      welcome: "Willkommen bei",
      description:
        "Verbinden Sie Ihre Wallet, um Zugang zu Ihrer exklusiven Kommandozentrale zu erhalten und Ihr OPM-Portfolio zu verwalten",
      connectButton: "Wallet verbinden",
      connecting: "Verbindung wird hergestellt...",
      features: {
        secure: "Bank-Grade Sicherheit",
        instant: "Sofortiger Portfolio-Zugang",
        exclusive: "Exklusive Mitglieder-Vorteile",
      },
    },
    // Footer
    footer: {
      rights: "Alle Rechte vorbehalten.",
      poweredBy: "Gesichert durch Ethereum",
      livePrice: "Echtzeit-Preise via CoinMarketCap DEX",
      links: {
        whitepaper: "Whitepaper",
        roadmap: "Roadmap",
        tokenomics: "Tokenomics",
        community: "Community",
      },
      social: {
        twitter: "Twitter",
        telegram: "Telegram",
        discord: "Discord",
      },
    },
    // Common
    common: {
      loading: "Laden...",
      error: "Fehler",
      refresh: "Aktualisieren",
      viewMore: "Details anzeigen",
      backToTop: "Nach oben",
    },
  },
}

export function getTranslation(language: Language) {
  return translations[language]
}
