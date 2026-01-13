"use client"

import { useState, useCallback, useEffect } from "react"

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
      on: (event: string, callback: (...args: unknown[]) => void) => void
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void
    }
  }
}

export interface WalletState {
  isConnected: boolean
  address: string | null
  chainId: number | null
  isConnecting: boolean
  error: string | null
}

function detectMobile(): boolean {
  if (typeof window === "undefined") return false

  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i
  const isSmallScreen = window.innerWidth <= 768
  const hasTouchSupport = "ontouchstart" in window || navigator.maxTouchPoints > 0

  return mobileRegex.test(userAgent) || (isSmallScreen && hasTouchSupport)
}

function hasMetaMaskExtension(): boolean {
  if (typeof window === "undefined") return false
  return !!(window.ethereum && window.ethereum.isMetaMask)
}

function openMetaMaskDeepLink() {
  const currentUrl = window.location.href
  const dappUrl = currentUrl.replace(/^https?:\/\//, "")
  const metamaskDeepLink = `https://metamask.app.link/dapp/${dappUrl}`

  const isAndroid = /Android/i.test(navigator.userAgent)
  if (isAndroid) {
    const intentUrl = `intent://dapp/${dappUrl}#Intent;scheme=metamask;package=io.metamask;end`
    window.location.href = intentUrl
    setTimeout(() => {
      window.location.href = metamaskDeepLink
    }, 500)
  } else {
    window.location.href = metamaskDeepLink
  }
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    isConnected: false,
    address: null,
    chainId: null,
    isConnecting: false,
    error: null,
  })

  const checkConnection = useCallback(async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = (await window.ethereum.request({ method: "eth_accounts" })) as string[]
        if (accounts.length > 0) {
          const chainId = (await window.ethereum.request({ method: "eth_chainId" })) as string
          setState({
            isConnected: true,
            address: accounts[0],
            chainId: Number.parseInt(chainId, 16),
            isConnecting: false,
            error: null,
          })
        }
      } catch (error) {
        console.error("Failed to check connection:", error)
      }
    }
  }, [])

  const connect = useCallback(async () => {
    const isMobile = detectMobile()
    const hasMetaMask = hasMetaMaskExtension()

    // Mobile without MetaMask in browser - open MetaMask app
    if (isMobile && !hasMetaMask) {
      openMetaMaskDeepLink()
      return
    }

    // Desktop without MetaMask - prompt to install
    if (!hasMetaMask) {
      setState((prev) => ({
        ...prev,
        error: "MetaMask is not installed. Please install MetaMask extension.",
      }))
      window.open("https://metamask.io/download/", "_blank")
      return
    }

    setState((prev) => ({ ...prev, isConnecting: true, error: null }))

    try {
      const accounts = (await window.ethereum!.request({
        method: "eth_requestAccounts",
      })) as string[]

      const chainId = (await window.ethereum!.request({ method: "eth_chainId" })) as string

      setState({
        isConnected: true,
        address: accounts[0],
        chainId: Number.parseInt(chainId, 16),
        isConnecting: false,
        error: null,
      })
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: error instanceof Error ? error.message : "Failed to connect wallet",
      }))
    }
  }, [])

  const disconnect = useCallback(() => {
    setState({
      isConnected: false,
      address: null,
      chainId: null,
      isConnecting: false,
      error: null,
    })
  }, [])

  useEffect(() => {
    checkConnection()

    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = (accounts: unknown) => {
        const accs = accounts as string[]
        if (accs.length === 0) {
          disconnect()
        } else {
          setState((prev) => ({ ...prev, address: accs[0] }))
        }
      }

      const handleChainChanged = (chainId: unknown) => {
        setState((prev) => ({ ...prev, chainId: Number.parseInt(chainId as string, 16) }))
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)

      return () => {
        window.ethereum?.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum?.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [checkConnection, disconnect])

  return {
    ...state,
    connect,
    disconnect,
    hasMetaMask: typeof window !== "undefined" && hasMetaMaskExtension(),
    isMobile: typeof window !== "undefined" && detectMobile(),
  }
}
