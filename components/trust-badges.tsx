"use client"

import { useLanguage } from "@/hooks/use-language"
import { Shield, Lock, FileCheck, Award, Scale, Building } from "lucide-react"

export function TrustBadges() {
  const { language } = useLanguage()

  const badges = [
    {
      icon: Shield,
      label: language === "de" ? "Geprüfter Smart Contract" : "Audited Smart Contract",
      detail: "Verified on Etherscan",
    },
    {
      icon: Lock,
      label: language === "de" ? "Sichere Infrastruktur" : "Secure Infrastructure",
      detail: "256-bit Encryption",
    },
    {
      icon: FileCheck,
      label: language === "de" ? "KYC/AML Konform" : "KYC/AML Compliant",
      detail: "EU Regulations",
    },
    {
      icon: Scale,
      label: language === "de" ? "Reguliert" : "Regulated",
      detail: "German GmbH",
    },
    {
      icon: Building,
      label: language === "de" ? "Registriert" : "Registered",
      detail: "HRB 123456 B",
    },
    {
      icon: Award,
      label: language === "de" ? "Premium Partner" : "Premium Partner",
      detail: "Verified Network",
    },
  ]

  return (
    <section className="py-12 border-y border-border/30 bg-secondary/20">
      <div className="container px-4">
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="flex items-center gap-3 px-4 py-2 rounded-lg bg-card/50 border border-border/30 hover:border-primary/30 transition-colors"
            >
              <badge.icon className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">{badge.label}</p>
                <p className="text-xs text-muted-foreground">{badge.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
