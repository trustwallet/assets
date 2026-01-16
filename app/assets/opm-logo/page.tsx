"use client"

import { Button } from "@/components/ui/button"
import { Download, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const OPM_LOGO_URL = "/images/6f10bccb-b857-43f7-95dd.jpeg"

export default function OPMLogoAssetPage() {
  const handleDownload = async () => {
    try {
      const response = await fetch(OPM_LOGO_URL)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "opm-logo.png"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      // Fallback: open in new tab
      window.open(OPM_LOGO_URL, "_blank")
    }
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
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">OnePremium Official Logo</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            The official OnePremium (OPM) logo represents our commitment to excellence in digital asset management.
            Download the high-resolution logo for authorized use.
          </p>
        </div>

        {/* Logo Display */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-card border border-border rounded-2xl p-8 md:p-12 mb-8">
            <div className="flex justify-center mb-8">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                <Image
                  src={OPM_LOGO_URL || "/placeholder.svg"}
                  alt="OnePremium OPM Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleDownload} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                <Download className="w-4 h-4" />
                Download Logo
              </Button>
              <Button asChild variant="outline" className="gap-2 bg-transparent">
                <a href={OPM_LOGO_URL} target="_blank" rel="noopener noreferrer">
                  View Full Size
                </a>
              </Button>
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Specifications</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Format:</span>
                <span className="ml-2 text-foreground">PNG / JPEG</span>
              </div>
              <div>
                <span className="text-muted-foreground">Resolution:</span>
                <span className="ml-2 text-foreground">High Definition</span>
              </div>
              <div>
                <span className="text-muted-foreground">Primary Color:</span>
                <span className="ml-2 text-foreground">#D4A024 (Gold)</span>
              </div>
              <div>
                <span className="text-muted-foreground">License:</span>
                <span className="ml-2 text-foreground">Official Use Only</span>
              </div>
            </div>
          </div>

          {/* Usage Guidelines */}
          <div className="mt-6 bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Usage Guidelines</h2>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Use the logo without modifications to maintain brand integrity</li>
              <li>• Ensure adequate spacing around the logo (minimum 20% of logo width)</li>
              <li>• Do not distort, rotate, or change the logo proportions</li>
              <li>• The logo should be clearly visible against any background</li>
              <li>• For press and media inquiries: kontakt@onepremium.de</li>
            </ul>
          </div>

          {/* Brand Colors */}
          <div className="mt-6 bg-card border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Brand Colors</h2>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: "#D4A024" }}></div>
                <div>
                  <p className="text-sm font-medium text-foreground">Primary Gold</p>
                  <p className="text-xs text-muted-foreground">#D4A024</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: "#B8860B" }}></div>
                <div>
                  <p className="text-sm font-medium text-foreground">Dark Gold</p>
                  <p className="text-xs text-muted-foreground">#B8860B</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: "#8B6914" }}></div>
                <div>
                  <p className="text-sm font-medium text-foreground">Bronze</p>
                  <p className="text-xs text-muted-foreground">#8B6914</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
