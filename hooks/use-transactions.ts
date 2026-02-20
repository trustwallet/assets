"use client"

import { useState, useEffect, useCallback } from "react"

interface Transaction {
  hash: string
  from: string
  to: string
  value: string
  timestamp: string
  type: "in" | "out"
}

export function useTransactions(address: string | null) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = useCallback(async () => {
    if (!address) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/token-data?action=transactions&address=${address}`)

      if (!response.ok) {
        throw new Error("Failed to fetch transactions")
      }

      const data = await response.json()
      setTransactions(data.transactions || [])
    } catch (err) {
      setError("Failed to fetch transactions")
      setTransactions([])
    } finally {
      setIsLoading(false)
    }
  }, [address])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return { transactions, isLoading, error, refetch: fetchTransactions }
}
