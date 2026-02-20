"use client"

import { useState, useEffect, useCallback } from "react"

interface LockStatus {
  isLocked: boolean
  isCreator: boolean
  firstReceiveDate: string | null
  unlockDate: string | null
  remainingSeconds: number
  remainingDays: number
  remainingHours: number
  remainingMinutes: number
  lockPeriodDays: number
  isLoading: boolean
  error: string | null
}

export function useLockStatus(address: string | null) {
  const [status, setStatus] = useState<LockStatus>({
    isLocked: false,
    isCreator: false,
    firstReceiveDate: null,
    unlockDate: null,
    remainingSeconds: 0,
    remainingDays: 0,
    remainingHours: 0,
    remainingMinutes: 0,
    lockPeriodDays: 365,
    isLoading: true,
    error: null,
  })

  const fetchLockStatus = useCallback(async () => {
    if (!address) {
      setStatus((prev) => ({ ...prev, isLoading: false }))
      return
    }

    try {
      const response = await fetch(`/api/token-data?action=lockStatus&address=${address}`)
      const data = await response.json()

      setStatus({
        isLocked: data.isLocked || false,
        isCreator: data.isCreator || false,
        firstReceiveDate: data.firstReceiveDate,
        unlockDate: data.unlockDate,
        remainingSeconds: data.remainingSeconds || 0,
        remainingDays: data.remainingDays || 0,
        remainingHours: data.remainingHours || 0,
        remainingMinutes: data.remainingMinutes || 0,
        lockPeriodDays: data.lockPeriodDays || 365,
        isLoading: false,
        error: data.error || null,
      })
    } catch (error) {
      setStatus((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to fetch lock status",
      }))
    }
  }, [address])

  useEffect(() => {
    fetchLockStatus()
    const interval = setInterval(() => {
      setStatus((prev) => {
        if (prev.remainingSeconds <= 0) return prev
        const newRemaining = prev.remainingSeconds - 1
        return {
          ...prev,
          remainingSeconds: newRemaining,
          remainingDays: Math.floor(newRemaining / (24 * 60 * 60)),
          remainingHours: Math.floor((newRemaining % (24 * 60 * 60)) / 3600),
          remainingMinutes: Math.floor((newRemaining % 3600) / 60),
          isLocked: newRemaining > 0,
        }
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [fetchLockStatus])

  return { ...status, refresh: fetchLockStatus }
}
