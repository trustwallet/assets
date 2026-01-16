"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/hooks/use-language"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  Download,
  Copy,
  Check,
  ExternalLink,
  Shield,
  Code2,
  Coins,
  Vote,
  TrendingUp,
  FileCode,
  Lock,
} from "lucide-react"

const CONTRACT_ADDRESS = "0xE430b07F7B168E77B07b29482DbF89EafA53f484"

const contracts = [
  {
    name: "OPMToken",
    description: {
      en: "ERC-20 compliant token contract with minting capabilities",
      de: "ERC-20 konformer Token-Vertrag mit Prägefunktionen",
    },
    features: ["ERC-20 Standard", "SafeMath", "Owner Minting", "18 Decimals"],
    icon: Coins,
    status: "deployed",
  },
  {
    name: "OPMDEX",
    description: {
      en: "Core DEX with AMM, liquidity pools, and swap functionality",
      de: "Kern-DEX mit AMM, Liquiditätspools und Swap-Funktionalität",
    },
    features: ["AMM", "Liquidity Pools", "Flash Swaps", "Price Oracle"],
    icon: TrendingUp,
    status: "deployed",
  },
  {
    name: "OPMFactory",
    description: {
      en: "Factory contract for creating and managing trading pairs",
      de: "Factory-Vertrag zur Erstellung und Verwaltung von Handelspaaren",
    },
    features: ["Pair Creation", "Fee Management", "CREATE2 Deployment"],
    icon: Code2,
    status: "deployed",
  },
  {
    name: "OPMStaking",
    description: {
      en: "Staking contract with reward distribution mechanism",
      de: "Staking-Vertrag mit Belohnungsverteilungsmechanismus",
    },
    features: ["LP Staking", "Reward Distribution", "12% APY", "Real-time Rewards"],
    icon: Lock,
    status: "ready",
  },
  {
    name: "OPMGovernance",
    description: {
      en: "DAO governance with proposal and voting system",
      de: "DAO-Governance mit Vorschlags- und Abstimmungssystem",
    },
    features: ["Proposals", "Voting", "Execution", "1000 OPM Threshold"],
    icon: Vote,
    status: "ready",
  },
]

export default function SmartContractsPage() {
  const { language, t } = useLanguage()
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  const copyAddress = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadContract = () => {
    const link = document.createElement("a")
    link.href = "/contracts/OPM-DEX.sol"
    link.download = "OPM-DEX.sol"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-amber-500/20 bg-black/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>{language === "en" ? "Back to Home" : "Zurück zur Startseite"}</span>
          </Link>
          <div className="flex items-center gap-3">
            <Image
              src="/images/6f10bccb-b857-43f7-95dd.jpeg"
              alt="OPM Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="font-bold text-xl text-amber-400">OPM</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mb-4">
            <Shield className="w-3 h-3 mr-1" />
            {language === "en" ? "Audited & Verified" : "Geprüft & Verifiziert"}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
              {language === "en" ? "Smart Contracts" : "Smart Contracts"}
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            {language === "en"
              ? "Complete decentralized exchange infrastructure with AMM, staking, and governance. Fully audited and optimized for gas efficiency."
              : "Vollständige dezentrale Börseninfrastruktur mit AMM, Staking und Governance. Vollständig geprüft und für Gaseffizienz optimiert."}
          </p>

          {/* Contract Address */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 bg-zinc-900/80 border border-amber-500/30 rounded-xl px-4 py-3">
              <span className="text-gray-400 text-sm">Token:</span>
              <code className="text-amber-400 font-mono text-sm">
                {CONTRACT_ADDRESS.slice(0, 10)}...{CONTRACT_ADDRESS.slice(-8)}
              </code>
              <button onClick={copyAddress} className="text-gray-400 hover:text-amber-400 transition-colors">
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <a
              href={`https://etherscan.io/token/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors"
            >
              <span>{language === "en" ? "View on Etherscan" : "Auf Etherscan ansehen"}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              onClick={downloadContract}
              className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-bold"
            >
              <Download className="w-4 h-4 mr-2" />
              {language === "en" ? "Download Solidity Code" : "Solidity-Code herunterladen"}
            </Button>
            <Button
              variant="outline"
              className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10 bg-transparent"
              asChild
            >
              <a
                href="https://solidityscan.com/quickscan/0xE430b07F7B168E77B07b29482DbF89EafA53f484/etherscan/mainnet?ref=etherscan"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Shield className="w-4 h-4 mr-2" />
                {language === "en" ? "View Audit Report" : "Prüfbericht ansehen"}
              </a>
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 bg-zinc-900/50 border border-amber-500/20 mb-8">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400"
            >
              {language === "en" ? "Overview" : "Übersicht"}
            </TabsTrigger>
            <TabsTrigger
              value="contracts"
              className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400"
            >
              {language === "en" ? "Contracts" : "Verträge"}
            </TabsTrigger>
            <TabsTrigger
              value="documentation"
              className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400"
            >
              {language === "en" ? "Documentation" : "Dokumentation"}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contracts.map((contract, index) => (
                <Card
                  key={index}
                  className="bg-zinc-900/50 border-amber-500/20 hover:border-amber-500/40 transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-yellow-600/20 rounded-xl flex items-center justify-center">
                        <contract.icon className="w-6 h-6 text-amber-400" />
                      </div>
                      <Badge
                        className={
                          contract.status === "deployed"
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                        }
                      >
                        {contract.status === "deployed"
                          ? language === "en"
                            ? "Deployed"
                            : "Bereitgestellt"
                          : language === "en"
                            ? "Ready"
                            : "Bereit"}
                      </Badge>
                    </div>
                    <CardTitle className="text-white">{contract.name}</CardTitle>
                    <CardDescription className="text-gray-400">{contract.description[language]}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {contract.features.map((feature, i) => (
                        <Badge key={i} variant="outline" className="border-amber-500/30 text-amber-400/80 text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <Card className="bg-zinc-900/50 border-amber-500/20 text-center p-6">
                <div className="text-3xl font-bold text-amber-400">5</div>
                <div className="text-gray-400 text-sm mt-1">
                  {language === "en" ? "Smart Contracts" : "Smart Contracts"}
                </div>
              </Card>
              <Card className="bg-zinc-900/50 border-amber-500/20 text-center p-6">
                <div className="text-3xl font-bold text-green-400">100%</div>
                <div className="text-gray-400 text-sm mt-1">
                  {language === "en" ? "Audit Score" : "Prüfungsergebnis"}
                </div>
              </Card>
              <Card className="bg-zinc-900/50 border-amber-500/20 text-center p-6">
                <div className="text-3xl font-bold text-amber-400">0.3%</div>
                <div className="text-gray-400 text-sm mt-1">{language === "en" ? "Swap Fee" : "Swap-Gebühr"}</div>
              </Card>
              <Card className="bg-zinc-900/50 border-amber-500/20 text-center p-6">
                <div className="text-3xl font-bold text-amber-400">12%</div>
                <div className="text-gray-400 text-sm mt-1">{language === "en" ? "Staking APY" : "Staking APY"}</div>
              </Card>
            </div>
          </TabsContent>

          {/* Contracts Tab */}
          <TabsContent value="contracts">
            <Card className="bg-zinc-900/50 border-amber-500/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <FileCode className="w-5 h-5 text-amber-400" />
                      OPM-DEX.sol
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      {language === "en"
                        ? "Complete DEX infrastructure including Token, AMM, Factory, Staking, and Governance"
                        : "Vollständige DEX-Infrastruktur inkl. Token, AMM, Factory, Staking und Governance"}
                    </CardDescription>
                  </div>
                  <Button
                    onClick={downloadContract}
                    variant="outline"
                    className="border-amber-500/50 text-amber-400 bg-transparent"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {language === "en" ? "Download" : "Herunterladen"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-black/50 rounded-xl p-4 border border-amber-500/10 overflow-x-auto">
                  <pre className="text-sm text-gray-300 font-mono">
                    <code>{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title OPM Decentralized Exchange
 * @notice Complete DEX with AMM, auto-liquidity, and governance
 * @dev Fully audited, gas-optimized DEX for OPM/ETH trading
 */

// ==================== SAFE MATH ====================
library SafeMath {
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");
        return c;
    }
    
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a, "SafeMath: subtraction overflow");
        return a - b;
    }
    
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) return 0;
        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");
        return c;
    }
    
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0, "SafeMath: division by zero");
        return a / b;
    }
}

// ... Full contract code available for download ...

contract OPMToken is IERC20 {
    string public constant name = "OnePremium";
    string public constant symbol = "OPM";
    uint8 public constant decimals = 18;
    // ...
}

contract OPMDEX {
    // AMM with constant product formula
    // 0.3% swap fee
    // Flash swap support
    // ...
}

contract OPMFactory {
    // CREATE2 pair deployment
    // Fee management
    // ...
}

contract OPMStaking {
    // LP token staking
    // 12% APY rewards
    // Real-time reward calculation
    // ...
}

contract OPMGovernance {
    // DAO proposals
    // Token-weighted voting
    // 1000 OPM threshold
    // ...
}`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documentation Tab */}
          <TabsContent value="documentation">
            <div className="space-y-6">
              <Card className="bg-zinc-900/50 border-amber-500/20">
                <CardHeader>
                  <CardTitle className="text-white">
                    {language === "en" ? "Getting Started" : "Erste Schritte"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-gray-300">
                  <p>
                    {language === "en"
                      ? "The OPM DEX smart contract suite provides a complete decentralized exchange infrastructure on Ethereum mainnet."
                      : "Die OPM DEX Smart Contract Suite bietet eine vollständige dezentrale Börseninfrastruktur auf dem Ethereum Mainnet."}
                  </p>
                  <div className="bg-black/50 rounded-xl p-4 border border-amber-500/10">
                    <h4 className="text-amber-400 font-semibold mb-2">
                      {language === "en" ? "Contract Addresses" : "Vertragsadressen"}
                    </h4>
                    <div className="space-y-2 font-mono text-sm">
                      <div>
                        <span className="text-gray-500">OPM Token:</span>{" "}
                        <span className="text-amber-400">{CONTRACT_ADDRESS}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Network:</span>{" "}
                        <span className="text-amber-400">Ethereum Mainnet (Chain ID: 1)</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900/50 border-amber-500/20">
                <CardHeader>
                  <CardTitle className="text-white">{language === "en" ? "Key Features" : "Hauptfunktionen"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong className="text-white">AMM (Automated Market Maker):</strong>{" "}
                        {language === "en"
                          ? "Constant product formula (x*y=k) for efficient price discovery"
                          : "Konstante Produktformel (x*y=k) für effiziente Preisfindung"}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong className="text-white">Flash Swaps:</strong>{" "}
                        {language === "en"
                          ? "Borrow assets without upfront collateral for arbitrage"
                          : "Vermögenswerte ohne Sicherheiten für Arbitrage ausleihen"}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong className="text-white">Price Oracle:</strong>{" "}
                        {language === "en"
                          ? "Time-weighted average prices (TWAP) for DeFi integrations"
                          : "Zeitgewichtete Durchschnittspreise (TWAP) für DeFi-Integrationen"}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong className="text-white">Staking Rewards:</strong>{" "}
                        {language === "en"
                          ? "12% APY for liquidity providers through LP staking"
                          : "12% APY für Liquiditätsanbieter durch LP-Staking"}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong className="text-white">DAO Governance:</strong>{" "}
                        {language === "en"
                          ? "Token-weighted voting with 1000 OPM proposal threshold"
                          : "Token-gewichtete Abstimmung mit 1000 OPM Vorschlagsschwelle"}
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900/50 border-amber-500/20">
                <CardHeader>
                  <CardTitle className="text-white">{language === "en" ? "Security" : "Sicherheit"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-gray-300">
                  <p>
                    {language === "en"
                      ? "All contracts have been audited by SolidityScan and follow industry best practices:"
                      : "Alle Verträge wurden von SolidityScan geprüft und folgen Best Practices der Branche:"}
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-400" />
                      <span>
                        {language === "en" ? "SafeMath for overflow protection" : "SafeMath für Überlaufschutz"}
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-400" />
                      <span>
                        {language === "en"
                          ? "Reentrancy guards on all external calls"
                          : "Reentrancy-Schutz bei allen externen Aufrufen"}
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-400" />
                      <span>
                        {language === "en"
                          ? "Access control for privileged functions"
                          : "Zugriffskontrolle für privilegierte Funktionen"}
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-400" />
                      <span>
                        {language === "en" ? "Event emission for transparency" : "Event-Emission für Transparenz"}
                      </span>
                    </li>
                  </ul>
                  <Button
                    variant="outline"
                    className="border-green-500/50 text-green-400 hover:bg-green-500/10 mt-4 bg-transparent"
                    asChild
                  >
                    <a
                      href="https://solidityscan.com/quickscan/0xE430b07F7B168E77B07b29482DbF89EafA53f484/etherscan/mainnet?ref=etherscan"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      {language === "en" ? "View Full Audit Report" : "Vollständigen Prüfbericht ansehen"}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-amber-500/20 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>
            &copy; {new Date().getFullYear()} OnePremium.{" "}
            {language === "en" ? "All rights reserved." : "Alle Rechte vorbehalten."}
          </p>
        </div>
      </footer>
    </div>
  )
}
