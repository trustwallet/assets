"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { type Language, getTranslation } from "@/lib/translations"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: ReturnType<typeof getTranslation>
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")

  useEffect(() => {
    // Check browser language
    const browserLang = navigator.language.toLowerCase()
    if (browserLang.startsWith("de")) {
      setLanguageState("de")
    }
    // Check localStorage
    const savedLang = localStorage.getItem("opm-language") as Language
    if (savedLang && (savedLang === "en" || savedLang === "de")) {
      setLanguageState(savedLang)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("opm-language", lang)
  }

  const t = getTranslation(language)

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
