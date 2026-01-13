"use client"

import { useState, useEffect, useCallback } from "react"

interface WalletToken {
  symbol: string
  name: string
  balance: string
  balanceRaw: string
  priceUsd: number
  valueUsd: number
  change24h: number
  logo: string
  isOPM?: boolean
}

export function useWalletTokens(address: string | null) {
  const [tokens, setTokens] = useState<WalletToken[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalValue, setTotalValue] = useState(0)

  const fetchTokens = useCallback(async () => {
    if (!address) {
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(`/api/token-data?action=walletTokens&address=${address}`)
      const data = await response.json()

      if (data.tokens) {
        setTokens(data.tokens)
        const total = data.tokens.reduce((sum: number, t: WalletToken) => sum + (t.valueUsd || 0), 0)
        setTotalValue(total)
      }
    } catch (error) {
      console.error("Failed to fetch wallet tokens:", error)
    } finally {
      setIsLoading(false)
    }
  }, [address])

  useEffect(() => {
    fetchTokens()
    const interval = setInterval(fetchTokens, 60000)
    return () => clearInterval(interval)
  }, [fetchTokens])

  return { tokens, totalValue, isLoading, refresh: fetchTokens }
}
