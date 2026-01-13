"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/hooks/use-language"
import { useWallet } from "@/hooks/use-wallet"
import { LanguageSwitcher } from "./language-switcher"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Wallet, LogOut } from "lucide-react"

export function Header() {
  const { t } = useLanguage()
  const { isConnected, address, connect, disconnect, isConnecting } = useWallet()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: "#about", label: t.nav.about },
    { href: "#whitepaper", label: t.nav.whitepaper },
    { href: "#roadmap", label: t.nav.roadmap },
    { href: "#tokenomics", label: t.nav.tokenomics },
    { href: "#contact", label: "Contact" },
  ]

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-primary/30">
            <Image src="/images/3bffe8d5-1382-49f5-92e7.jpeg" alt="OnePremium" fill className="object-cover" />
          </div>
          <span className="font-serif text-xl font-bold text-gradient">OnePremium</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          {isConnected ? (
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2 border-primary/50 text-primary bg-transparent">
                <Wallet className="h-4 w-4" />
                {formatAddress(address!)}
              </Button>
              <Button variant="ghost" size="icon" onClick={disconnect} className="text-muted-foreground">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              onClick={connect}
              disabled={isConnecting}
              size="sm"
              className="hidden sm:flex gap-2 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black"
            >
              <Wallet className="h-4 w-4" />
              {isConnecting ? t.connect.connecting : t.hero.connectWallet}
            </Button>
          )}

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-background border-border">
              <div className="flex flex-col gap-6 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
                <hr className="border-border" />
                {isConnected ? (
                  <>
                    <Button variant="outline" className="w-full gap-2 border-primary/50 text-primary bg-transparent">
                      <Wallet className="h-4 w-4" />
                      {formatAddress(address!)}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        disconnect()
                        setIsOpen(false)
                      }}
                      className="w-full gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => {
                      connect()
                      setIsOpen(false)
                    }}
                    disabled={isConnecting}
                    className="w-full gap-2 bg-gradient-to-r from-amber-600 to-yellow-500 text-black"
                  >
                    <Wallet className="h-4 w-4" />
                    {isConnecting ? t.connect.connecting : t.hero.connectWallet}
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
