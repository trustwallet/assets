"use client"

import { useLanguage } from "@/hooks/use-language"
import { OPMLogoSVG } from "./opm-logo-svg"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export function LogoSection() {
  const { language } = useLanguage()

  const downloadSVG = () => {
    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="500" height="500" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- OnePremium (OPM) Official Logo -->
  <!-- Outer ring -->
  <circle cx="100" cy="100" r="95" fill="url(#goldGradient)" />
  <circle cx="100" cy="100" r="90" fill="url(#goldGradientDark)" />
  
  <!-- Inner decorative ring -->
  <circle cx="100" cy="100" r="82" fill="none" stroke="url(#goldGradient)" strokeWidth="2" />
  <circle cx="100" cy="100" r="78" fill="none" stroke="url(#goldGradientLight)" strokeWidth="1" />
  
  <!-- Top text arc - ONEPREMIUM -->
  <path id="topArc" d="M 30 100 A 70 70 0 0 1 170 100" fill="none" />
  <text fill="url(#goldGradientText)" fontSize="14" fontWeight="bold" fontFamily="serif" letterSpacing="4">
    <textPath href="#topArc" startOffset="50%" textAnchor="middle">ONEPREMIUM</textPath>
  </text>
  
  <!-- Bottom text arc - OPM -->
  <path id="bottomArc" d="M 45 115 A 55 55 0 0 0 155 115" fill="none" />
  <text fill="url(#goldGradientText)" fontSize="16" fontWeight="bold" fontFamily="serif" letterSpacing="6">
    <textPath href="#bottomArc" startOffset="50%" textAnchor="middle">OPM</textPath>
  </text>
  
  <!-- Center circle background -->
  <circle cx="100" cy="100" r="55" fill="url(#goldGradientCenter)" />
  <circle cx="100" cy="100" r="52" fill="url(#goldGradientDark)" />
  
  <!-- Center O letter -->
  <text x="100" y="115" textAnchor="middle" fill="url(#goldGradientText)" fontSize="60" fontWeight="bold" fontFamily="serif">O</text>
  
  <!-- Decorative dots -->
  <circle cx="35" cy="100" r="3" fill="url(#goldGradientLight)" />
  <circle cx="165" cy="100" r="3" fill="url(#goldGradientLight)" />
  
  <!-- Gradient definitions -->
  <defs>
    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#D4A84B" />
      <stop offset="50%" stopColor="#C9963C" />
      <stop offset="100%" stopColor="#B8862D" />
    </linearGradient>
    <linearGradient id="goldGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#C9963C" />
      <stop offset="50%" stopColor="#B8862D" />
      <stop offset="100%" stopColor="#A67625" />
    </linearGradient>
    <linearGradient id="goldGradientLight" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#E5C06A" />
      <stop offset="50%" stopColor="#D4A84B" />
      <stop offset="100%" stopColor="#C9963C" />
    </linearGradient>
    <linearGradient id="goldGradientText" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#A67625" />
      <stop offset="50%" stopColor="#8B6320" />
      <stop offset="100%" stopColor="#70501A" />
    </linearGradient>
    <linearGradient id="goldGradientCenter" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#D4A84B" />
      <stop offset="100%" stopColor="#C9963C" />
    </linearGradient>
  </defs>
</svg>`

    const blob = new Blob([svgContent], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "onepremium-opm-logo.svg"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <section id="logo" className="py-20 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-950/10 to-transparent" />

      <div className="max-w-4xl mx-auto relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 mb-4">
            {language === "de" ? "Offizielles Logo" : "Official Logo"}
          </h2>
          <p className="text-amber-100/70 max-w-2xl mx-auto">
            {language === "de"
              ? "Das offizielle OnePremium (OPM) Logo repräsentiert Exzellenz, Vertrauen und die Zukunft des Premium-Krypto-Investments."
              : "The official OnePremium (OPM) logo represents excellence, trust, and the future of premium crypto investment."}
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-950/40 to-black/60 backdrop-blur-sm rounded-2xl border border-amber-500/20 p-8 md:p-12">
          <div className="flex flex-col items-center gap-8">
            {/* Logo Display */}
            <div className="relative">
              <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full" />
              <div className="relative bg-gradient-to-br from-black/80 to-amber-950/40 p-8 rounded-2xl border border-amber-500/30">
                <OPMLogoSVG size={200} />
              </div>
            </div>

            {/* Logo Info */}
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold text-amber-100">OnePremium (OPM)</h3>
              <p className="text-amber-100/60 text-sm max-w-md">
                {language === "de"
                  ? "Hochauflösendes SVG-Vektorlogo für alle Anwendungen geeignet. Skalierbar ohne Qualitätsverlust."
                  : "High-resolution SVG vector logo suitable for all applications. Scalable without quality loss."}
              </p>

              {/* Download Button */}
              <Button
                onClick={downloadSVG}
                className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-black font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-amber-500/25"
              >
                <Download className="w-5 h-5 mr-2" />
                {language === "de" ? "SVG Herunterladen" : "Download SVG"}
              </Button>
            </div>

            {/* Logo Specifications */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-4">
              {[
                { label: language === "de" ? "Format" : "Format", value: "SVG" },
                { label: language === "de" ? "Auflösung" : "Resolution", value: "Vector" },
                { label: language === "de" ? "Farben" : "Colors", value: "Gold" },
                { label: language === "de" ? "Lizenz" : "License", value: "Official" },
              ].map((spec, index) => (
                <div key={index} className="bg-black/30 rounded-xl p-4 text-center border border-amber-500/10">
                  <p className="text-amber-100/50 text-xs uppercase tracking-wider mb-1">{spec.label}</p>
                  <p className="text-amber-100 font-semibold">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
