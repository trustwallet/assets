"use client"

import { useWallet } from "@/hooks/use-wallet"
import { LandingPage } from "@/components/landing-page"
import { UserDashboard } from "@/components/user-dashboard"
import { AnimatedBackground } from "@/components/animated-background"
import { CookieConsent } from "@/components/cookie-consent"

function MainContent() {
  const { isConnected } = useWallet()

  if (isConnected) {
    return <UserDashboard />
  }

  return <LandingPage />
}

export default function Home() {
  return (
    <>
      <AnimatedBackground />
      <MainContent />
      <CookieConsent />
    </>
  )
}
