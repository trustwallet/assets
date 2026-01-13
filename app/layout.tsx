import type React from "react"
import type { Metadata, Viewport } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/hooks/use-language"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "OnePremium | The Sovereign Digital Asset",
  description:
    "OnePremium ($OPM) - A revolutionary Web3 ecosystem combining cryptocurrency, NFT fashion, DeFi tools, AI innovation, and premium digital experiences. Join the elite.",
  keywords: [
    "OnePremium",
    "OPM",
    "cryptocurrency",
    "token",
    "Ethereum",
    "ERC-20",
    "DeFi",
    "NFT",
    "Web3",
    "luxury crypto",
  ],
  manifest: "/manifest.json",
  openGraph: {
    title: "OnePremium | The Sovereign Digital Asset",
    description: "Join the elite Web3 ecosystem with $OPM token",
    type: "website",
    url: "https://onepremium.de",
  },
  twitter: {
    card: "summary_large_image",
    title: "OnePremium | The Sovereign Digital Asset",
    description: "Join the elite Web3 ecosystem with $OPM token",
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#D4A537",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${playfair.variable} ${inter.variable} font-sans antialiased`}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
