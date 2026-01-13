"use client"

import Image from "next/image"
import { ConnectWalletButton } from "./connect-wallet-button"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 sm:h-20 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 sm:w-12 sm:h-12">
            <Image
              src="/images/3bffe8d5-1382-49f5-92e7.jpeg"
              alt="OnePremium Logo"
              fill
              className="object-contain rounded-full"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
              One<span className="text-primary">Premium</span>
            </h1>
            <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest">
              Luxury Ecosystem
            </span>
          </div>
        </div>
        <ConnectWalletButton />
      </div>
    </header>
  )
}
