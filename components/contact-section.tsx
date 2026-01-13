"use client"

import { useLanguage } from "@/hooks/use-language"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Twitter, Send, Globe, ExternalLink } from "lucide-react"
import { CONTACT_EMAIL, TWITTER_URL, TELEGRAM_URL, WEBSITE_URL } from "@/lib/constants"

export function ContactSection() {
  const { language } = useLanguage()

  const title = language === "de" ? "Kontakt" : "Contact"
  const subtitle =
    language === "de"
      ? "Haben Sie Fragen? Unser Team steht Ihnen zur Verfügung."
      : "Have questions? Our team is here to help."
  const emailLabel = language === "de" ? "E-Mail senden" : "Send Email"
  const followLabel = language === "de" ? "Folgen Sie uns" : "Follow us"

  const socialLinks = [
    { icon: Twitter, href: TWITTER_URL, label: "Twitter / X", color: "hover:bg-blue-500/10 hover:text-blue-400" },
    { icon: Send, href: TELEGRAM_URL, label: "Telegram", color: "hover:bg-sky-500/10 hover:text-sky-400" },
    {
      icon: Globe,
      href: WEBSITE_URL,
      label: language === "de" ? "Webseite" : "Website",
      color: "hover:bg-primary/10 hover:text-primary",
    },
  ]

  return (
    <section id="contact" className="py-20 sm:py-32">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
        </div>

        <div className="max-w-xl mx-auto">
          <Card className="border-primary/20 bg-card/50 backdrop-blur overflow-hidden">
            <CardContent className="p-8 space-y-8">
              {/* Email */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">{emailLabel}</p>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-xl font-semibold text-primary hover:underline transition-colors"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </div>
                <Button
                  asChild
                  className="gap-2 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black"
                >
                  <a href={`mailto:${CONTACT_EMAIL}`}>
                    <Mail className="h-4 w-4" />
                    {emailLabel}
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </Button>
              </div>

              <hr className="border-border/50" />

              {/* Social Links */}
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">{followLabel}</p>
                <div className="flex justify-center gap-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary/30 border border-border/50 transition-all ${social.color}`}
                    >
                      <social.icon className="h-6 w-6" />
                      <span className="text-xs">{social.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
