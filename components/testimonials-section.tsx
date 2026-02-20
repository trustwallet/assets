"use client"

import { useLanguage } from "@/hooks/use-language"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

export function TestimonialsSection() {
  const { language } = useLanguage()

  const testimonials = [
    {
      quote:
        language === "de"
          ? "OnePremium bietet ein einzigartiges Wertversprechen mit seinem exklusiven Tier-System und realen Vorteilen."
          : "OnePremium offers a unique value proposition with its exclusive tier system and real-world benefits.",
      author: "Investment Analyst",
      role: language === "de" ? "Krypto-Forschung" : "Crypto Research",
      rating: 5,
    },
    {
      quote:
        language === "de"
          ? "Der transparente Ansatz und die institutionelle Compliance machen dies zu einer vertrauenswürdigen Investition."
          : "The transparent approach and institutional-grade compliance make this a trustworthy investment.",
      author: "Portfolio Manager",
      role: language === "de" ? "Digital Assets Fund" : "Digital Assets Fund",
      rating: 5,
    },
    {
      quote:
        language === "de"
          ? "Endlich ein Token mit echtem Nutzen und einem professionellen Team dahinter."
          : "Finally a token with real utility and a professional team behind it.",
      author: "Early Investor",
      role: language === "de" ? "OPM Diamond Holder" : "OPM Diamond Holder",
      rating: 5,
    },
  ]

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-background to-secondary/10">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            {language === "de" ? "Was unsere Investoren sagen" : "What Our Investors Say"}
          </h2>
          <p className="text-lg text-muted-foreground">
            {language === "de"
              ? "Vertrauenswürdige Meinungen aus der Krypto-Community"
              : "Trusted opinions from the crypto community"}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="border-border/30 bg-card/50 backdrop-blur hover:border-primary/30 transition-all"
            >
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-primary/30 mb-4" />
                <p className="text-foreground mb-6 leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
