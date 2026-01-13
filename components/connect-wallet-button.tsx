"use client"

import { Button } from "@/components/ui/button"
import { LogOut, Loader2 } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"

export function ConnectWalletButton() {
  const { isConnected, address, isConnecting, connect, disconnect, hasMetaMask, isMobile, error } = useWallet()

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 border border-border">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-medium text-foreground">{formatAddress(address)}</span>
        </div>
        <Button
          onClick={disconnect}
          variant="outline"
          className="min-h-[44px] border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive bg-transparent"
        >
          <LogOut className="h-5 w-5" />
          <span className="sr-only sm:not-sr-only sm:ml-2">Disconnect</span>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <Button
        onClick={connect}
        disabled={isConnecting}
        className="min-h-[44px] bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black font-semibold px-6"
      >
        {isConnecting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
              alt="MetaMask"
              className="mr-2 h-5 w-5"
            />
            {isMobile && !hasMetaMask ? "Open MetaMask" : "Connect Wallet"}
          </>
        )}
      </Button>
      {error && <p className="text-xs text-destructive max-w-[200px] text-right">{error}</p>}
    </div>
  )
}
