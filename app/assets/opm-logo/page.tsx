"use client"

import { OPMLogo } from "@/components/opm-logo-svg"
import { Button } from "@/components/ui/button"
import { Download, Copy, Check, ArrowLeft } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export default function OPMLogoAssetPage() {
  const [copied, setCopied] = useState(false)

  const svgCode = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FFD700"/>
      <stop offset="50%" style="stop-color:#FFA500"/>
      <stop offset="100%" style="stop-color:#B8860B"/>
    </linearGradient>
    <linearGradient id="innerGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FFE55C"/>
      <stop offset="50%" style="stop-color:#FFD700"/>
      <stop offset="100%" style="stop-color:#CC8400"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000000" floodOpacity="0.3"/>
    </filter>
  </defs>
  <circle cx="100" cy="100" r="95" fill="url(#goldGradient)" filter="url(#shadow)"/>
  <circle cx="100" cy="100" r="85" fill="none" stroke="#B8860B" strokeWidth="3"/>
  <circle cx="100" cy="100" r="75" fill="url(#innerGoldGradient)"/>
  <circle cx="100" cy="100" r="65" fill="none" stroke="#CC8400" strokeWidth="2"/>
  <path d="M 30 35 Q 100 25 170 35" fill="none" stroke="#8B4513" strokeWidth="1.5"/>
  <text x="100" y="42" textAnchor="middle" fill="#5D3A1A" fontFamily="Georgia, serif" fontSize="16" fontWeight="bold" letterSpacing="3">ONEPREMIUM</text>
  <text x="100" y="115" textAnchor="middle" fill="#5D3A1A" fontFamily="Georgia, serif" fontSize="72" fontWeight="bold">O</text>
  <circle cx="45" cy="100" r="3" fill="#FFE55C"/>
  <circle cx="155" cy="100" r="3" fill="#FFE55C"/>
  <path d="M 30 165 Q 100 175 170 165" fill="none" stroke="#8B4513" strokeWidth="1.5"/>
  <text x="100" y="175" textAnchor="middle" fill="#5D3A1A" fontFamily="Georgia, serif" fontSize="20" fontWeight="bold" letterSpacing="5">OPM</text>
</svg>`

  const handleDownload = () => {
    const blob = new Blob([svgCode], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "opm-logo.svg"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(svgCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-16">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">OnePremium Logo</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Official OnePremium (OPM) logo asset. Download the scalable vector graphic for your projects.
          </p>
        </div>

        {/* Logo Display */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-card border border-border rounded-2xl p-8 md:p-12 mb-8">
            <div className="flex justify-center mb-8">
              <div className="w-48 h-48 md:w-64 md:h-64">
                <OPMLogo />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleDownload} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                <Download className="w-4 h-4" />
                Download SVG
              </Button>
              <Button onClick={handleCopy} variant="outline" className="gap-2 bg-transparent">
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy SVG Code
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Specifications</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Format:</span>
                <span className="ml-2 text-foreground">SVG (Vector)</span>
              </div>
              <div>
                <span className="text-muted-foreground">Dimensions:</span>
                <span className="ml-2 text-foreground">200 x 200</span>
              </div>
              <div>
                <span className="text-muted-foreground">Primary Color:</span>
                <span className="ml-2 text-foreground">#FFD700 (Gold)</span>
              </div>
              <div>
                <span className="text-muted-foreground">License:</span>
                <span className="ml-2 text-foreground">Official Use</span>
              </div>
            </div>
          </div>

          {/* Usage Guidelines */}
          <div className="mt-6 bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Usage Guidelines</h2>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Use the logo without modifications to maintain brand integrity</li>
              <li>• Ensure adequate spacing around the logo</li>
              <li>• Do not distort or change the logo proportions</li>
              <li>• For press inquiries: kontakt@onepremium.de</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
