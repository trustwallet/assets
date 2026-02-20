"use client"

import { useState, useEffect, useCallback } from "react"

interface OPMData {
  balance: string
  balanceRaw: bigint
  priceUsd: number
  priceChange24h: number
  valueUsd: number
  totalSupply: string
  marketCap: number
  volume24h: number
  liquidity: number
  holders: number
  isLoading: boolean
  error: string | null
}

export function useOPMData(address: string | null) {
  const [data, setData] = useState<OPMData>({
    balance: "0",
    balanceRaw: BigInt(0),
    priceUsd: 0,
    priceChange24h: 0,
    valueUsd: 0,
    totalSupply: "10,000",
    marketCap: 0,
    volume24h: 0,
    liquidity: 0,
    holders: 15,
    isLoading: true,
    error: null,
  })

  const fetchPrice = useCallback(async () => {
    try {
      const response = await fetch("/api/token-data?action=price")
      if (!response.ok) throw new Error("Failed to fetch price")
      return await response.json()
    } catch (error) {
      console.error("Price fetch error:", error)
      return {
        priceUsd: 0,
        priceChange24h: 0,
        volume24h: 0,
        marketCap: 0,
        liquidity: 0,
      }
    }
  }, [])

  const fetchBalance = useCallback(async (walletAddress: string) => {
    try {
      const response = await fetch(`/api/token-data?action=balance&address=${walletAddress}`)
      if (!response.ok) throw new Error("Failed to fetch balance")
      const result = await response.json()
      return {
        balance: result.balance,
        balanceRaw: BigInt(result.balanceRaw || "0"),
      }
    } catch (error) {
      console.error("Balance fetch error:", error)
      return { balance: "0", balanceRaw: BigInt(0) }
    }
  }, [])

  const fetchTotalSupply = useCallback(async () => {
    try {
      const response = await fetch("/api/token-data?action=totalSupply")
      if (!response.ok) throw new Error("Failed to fetch total supply")
      const result = await response.json()
      return result.totalSupply
    } catch (error) {
      console.error("Total supply fetch error:", error)
      return "10,000"
    }
  }, [])

  const fetchTokenInfo = useCallback(async () => {
    try {
      const response = await fetch("/api/token-data?action=tokenInfo")
      if (!response.ok) throw new Error("Failed to fetch token info")
      return await response.json()
    } catch (error) {
      console.error("Token info fetch error:", error)
      return { holders: 15 }
    }
  }, [])

  const refreshData = useCallback(async () => {
    setData((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const [priceData, totalSupply, tokenInfo] = await Promise.all([
        fetchPrice(),
        fetchTotalSupply(),
        fetchTokenInfo(),
      ])

      let balanceData = { balance: "0", balanceRaw: BigInt(0) }
      if (address) {
        balanceData = await fetchBalance(address)
      }

      const balanceNumber = Number(balanceData.balanceRaw) / 1e18
      const valueUsd = balanceNumber * priceData.priceUsd

      // Calculate market cap from total supply and price if not available
      const totalSupplyNum = Number.parseFloat(totalSupply.replace(/,/g, "")) || 10000
      const calculatedMarketCap = priceData.marketCap || totalSupplyNum * priceData.priceUsd

      setData({
        balance: balanceData.balance,
        balanceRaw: balanceData.balanceRaw,
        priceUsd: priceData.priceUsd,
        priceChange24h: priceData.priceChange24h,
        valueUsd,
        totalSupply,
        marketCap: calculatedMarketCap,
        volume24h: priceData.volume24h,
        liquidity: priceData.liquidity || 0,
        holders: tokenInfo.holders || 15,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      setData((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to fetch data",
      }))
    }
  }, [address, fetchPrice, fetchBalance, fetchTotalSupply, fetchTokenInfo])

  useEffect(() => {
    refreshData()
    const interval = setInterval(refreshData, 30000)
    return () => clearInterval(interval)
  }, [refreshData])

  return { ...data, refreshData }
}
