"use client"

import { Button } from "@/components/ui/button"
import { Download, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const OPM_LOGO_URL = "/images/opm-logo-full.png"
const OPM_LOGO_200_URL = "/images/opm-logo-200.png"

export default function OPMLogoAssetPage() {
  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = blobUrl
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(blobUrl)
    } catch (error) {
      window.open(url, "_blank")
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

        {/* Logo Display - Main and 200px versions */}
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-lg font-semibold text-foreground mb-4 text-center">Full Size</h2>
              <div className="flex justify-center mb-6">
                <div className="relative w-64 h-64">
                  <Image
                    src={OPM_LOGO_URL || "/placeholder.svg"}
                    alt="OnePremium OPM Logo - Full Size"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              <div className="text-center text-sm text-muted-foreground mb-4">Original Resolution</div>
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => handleDownload(OPM_LOGO_URL, "opm-logo-full.png")}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Full Size
                </Button>
                <Button asChild variant="outline" className="w-full gap-2 bg-transparent">
                  <a href={OPM_LOGO_URL} target="_blank" rel="noopener noreferrer">
                    View Full Size
                  </a>
                </Button>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h2 className="text-lg font-semibold text-foreground mb-4 text-center">200 x 200 px</h2>
              <div className="flex justify-center mb-6">
                <div className="relative w-[200px] h-[200px] border border-dashed border-border rounded-lg flex items-center justify-center">
                  <Image
                    src={OPM_LOGO_200_URL || "/placeholder.svg"}
                    alt="OnePremium OPM Logo - 200x200"
                    width={200}
                    height={200}
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              <div className="text-center text-sm text-muted-foreground mb-4">200 x 200 pixels</div>
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => handleDownload(OPM_LOGO_200_URL, "opm-logo-200x200.png")}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download 200x200
                </Button>
                <Button asChild variant="outline" className="w-full gap-2 bg-transparent">
                  <a href={OPM_LOGO_200_URL} target="_blank" rel="noopener noreferrer">
                    View 200x200
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-card border border-border rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Specifications</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Format:</span>
                <span className="ml-2 text-foreground">PNG</span>
              </div>
              <div>
                <span className="text-muted-foreground">Full Size:</span>
                <span className="ml-2 text-foreground">Original HD</span>
              </div>
              <div>
                <span className="text-muted-foreground">Small Size:</span>
                <span className="ml-2 text-foreground">200 x 200 px</span>
              </div>
              <div>
                <span className="text-muted-foreground">License:</span>
                <span className="ml-2 text-foreground">Official Use Only</span>
              </div>
            </div>
          </div>

          {/* Usage Guidelines */}
          <div className="bg-card border border-border rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Usage Guidelines</h2>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Use the logo without modifications to maintain brand integrity</li>
              <li>• Ensure adequate spacing around the logo (minimum 20% of logo width)</li>
              <li>• Do not distort, rotate, or change the logo proportions</li>
              <li>• The logo should be clearly visible against any background</li>
              <li>• Use 200x200 version for profile pictures, favicons, and small displays</li>
              <li>• For press and media inquiries: kontakt@onepremium.de</li>
            </ul>
          </div>

          {/* Brand Colors */}
          <div className="bg-card border border-border rounded-xl p-6">
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
