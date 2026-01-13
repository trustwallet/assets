"use client"

import { useLanguage } from "@/hooks/use-language"
import Image from "next/image"

export function PartnersSection() {
  const { language } = useLanguage()

  const partners = [
    { name: "Ethereum", logo: "https://cryptologos.cc/logos/ethereum-eth-logo.svg" },
    { name: "Uniswap", logo: "https://cryptologos.cc/logos/uniswap-uni-logo.svg" },
    { name: "MetaMask", logo: "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" },
    { name: "CoinMarketCap", logo: "https://s2.coinmarketcap.com/static/cloud/img/branding/favicon.png" },
    { name: "Etherscan", logo: "https://etherscan.io/images/brandassets/etherscan-logo-circle.svg" },
  ]

  return (
    <section className="py-16 bg-secondary/10">
      <div className="container px-4">
        <p className="text-center text-sm text-muted-foreground mb-8">
          {language === "de" ? "Vertrauen von führenden Plattformen" : "Trusted by Leading Platforms"}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="relative w-20 h-20 md:w-24 md:h-24 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all"
            >
              <Image
                src={partner.logo || "/placeholder.svg"}
                alt={partner.name}
                fill
                className="object-contain p-2"
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
