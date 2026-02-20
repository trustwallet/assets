"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/hooks/use-language"
import { Button } from "@/components/ui/button"
import { X, Cookie, Settings } from "lucide-react"
import Link from "next/link"

export function CookieConsent() {
  const { language } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    preferences: false,
  })

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent")
    if (!consent) {
      setIsVisible(true)
    }
  }, [])

  const handleAcceptAll = () => {
    const allAccepted = { essential: true, analytics: true, preferences: true }
    localStorage.setItem("cookie_consent", JSON.stringify(allAccepted))
    setIsVisible(false)
  }

  const handleAcceptSelected = () => {
    localStorage.setItem("cookie_consent", JSON.stringify(preferences))
    setIsVisible(false)
  }

  const handleRejectAll = () => {
    const onlyEssential = { essential: true, analytics: false, preferences: false }
    localStorage.setItem("cookie_consent", JSON.stringify(onlyEssential))
    setIsVisible(false)
  }

  const content = {
    en: {
      title: "Cookie Consent",
      description:
        "We use cookies to enhance your experience. Essential cookies are required for the platform to function. You can manage your preferences below.",
      acceptAll: "Accept All",
      acceptSelected: "Accept Selected",
      rejectAll: "Essential Only",
      settings: "Cookie Settings",
      essential: "Essential Cookies",
      essentialDesc: "Required for basic platform functionality",
      analytics: "Analytics Cookies",
      analyticsDesc: "Help us understand how visitors use our site",
      preferences: "Preference Cookies",
      preferencesDesc: "Remember your settings and preferences",
      learnMore: "Learn more in our",
    },
    de: {
      title: "Cookie-Einwilligung",
      description:
        "Wir verwenden Cookies, um Ihre Erfahrung zu verbessern. Essentielle Cookies sind für die Funktion der Plattform erforderlich. Sie können Ihre Präferenzen unten verwalten.",
      acceptAll: "Alle akzeptieren",
      acceptSelected: "Ausgewählte akzeptieren",
      rejectAll: "Nur essentielle",
      settings: "Cookie-Einstellungen",
      essential: "Essentielle Cookies",
      essentialDesc: "Erforderlich für grundlegende Plattformfunktionalität",
      analytics: "Analyse-Cookies",
      analyticsDesc: "Helfen uns zu verstehen, wie Besucher unsere Seite nutzen",
      preferences: "Präferenz-Cookies",
      preferencesDesc: "Speichern Ihre Einstellungen und Präferenzen",
      learnMore: "Mehr erfahren in unserer",
    },
  }

  const t = content[language]

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="max-w-2xl mx-auto bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
        <div className="p-4 md:p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Cookie className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">{t.title}</h3>
            </div>
            <button onClick={handleRejectAll} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            {t.description}{" "}
            <Link href="/cookies" className="text-primary hover:underline">
              {t.learnMore} Cookie Policy
            </Link>
          </p>

          {showSettings && (
            <div className="space-y-3 mb-4 p-4 bg-background/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{t.essential}</p>
                  <p className="text-xs text-muted-foreground">{t.essentialDesc}</p>
                </div>
                <input type="checkbox" checked={preferences.essential} disabled className="h-4 w-4 accent-primary" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{t.analytics}</p>
                  <p className="text-xs text-muted-foreground">{t.analyticsDesc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                  className="h-4 w-4 accent-primary"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{t.preferences}</p>
                  <p className="text-xs text-muted-foreground">{t.preferencesDesc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.preferences}
                  onChange={(e) => setPreferences({ ...preferences, preferences: e.target.checked })}
                  className="h-4 w-4 accent-primary"
                />
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button onClick={handleAcceptAll} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {t.acceptAll}
            </Button>
            {showSettings ? (
              <Button onClick={handleAcceptSelected} variant="outline">
                {t.acceptSelected}
              </Button>
            ) : (
              <Button onClick={() => setShowSettings(true)} variant="outline" className="gap-2">
                <Settings className="h-4 w-4" />
                {t.settings}
              </Button>
            )}
            <Button onClick={handleRejectAll} variant="ghost" className="text-muted-foreground">
              {t.rejectAll}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
