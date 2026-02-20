"use client"

import { useState } from "react"
import { useLanguage } from "@/hooks/use-language"
import { useWallet } from "@/hooks/use-wallet"
import { useLockStatus } from "@/hooks/use-lock-status"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Send, Download, Copy, Check, AlertTriangle, Loader2, ExternalLink, QrCode } from "lucide-react"
import { OPM_TOKEN_ADDRESS } from "@/lib/constants"
import Image from "next/image"

interface SendReceiveModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  balance: string
  priceUsd: number
}

export function SendReceiveModal({ open, onOpenChange, balance, priceUsd }: SendReceiveModalProps) {
  const { language } = useLanguage()
  const { address } = useWallet()
  const lockStatus = useLockStatus(address)
  const [copied, setCopied] = useState(false)
  const [sendAddress, setSendAddress] = useState("")
  const [sendAmount, setSendAmount] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const labels = {
    en: {
      title: "Send & Receive OPM",
      send: "Send",
      receive: "Receive",
      recipientAddress: "Recipient Address",
      amount: "Amount",
      max: "MAX",
      balance: "Balance",
      usdValue: "USD Value",
      sendTokens: "Send OPM",
      sending: "Sending...",
      yourAddress: "Your OPM Wallet Address",
      copyAddress: "Copy Address",
      copied: "Copied!",
      scanQr: "Scan to receive OPM",
      tokenContract: "Token Contract",
      lockedWarning: "Your tokens are locked. You cannot send OPM until the lock period ends.",
      networkFee: "Network fee will be paid in ETH",
      txSuccess: "Transaction submitted!",
      viewOnEtherscan: "View on Etherscan",
      invalidAddress: "Invalid Ethereum address",
      invalidAmount: "Invalid amount",
      insufficientBalance: "Insufficient balance",
    },
    de: {
      title: "OPM Senden & Empfangen",
      send: "Senden",
      receive: "Empfangen",
      recipientAddress: "Empfänger-Adresse",
      amount: "Betrag",
      max: "MAX",
      balance: "Guthaben",
      usdValue: "USD-Wert",
      sendTokens: "OPM Senden",
      sending: "Senden...",
      yourAddress: "Ihre OPM-Wallet-Adresse",
      copyAddress: "Adresse kopieren",
      copied: "Kopiert!",
      scanQr: "Scannen um OPM zu empfangen",
      tokenContract: "Token-Vertrag",
      lockedWarning: "Ihre Token sind gesperrt. Sie können OPM erst nach Ablauf der Sperrfrist senden.",
      networkFee: "Netzwerkgebühr wird in ETH bezahlt",
      txSuccess: "Transaktion eingereicht!",
      viewOnEtherscan: "Auf Etherscan anzeigen",
      invalidAddress: "Ungültige Ethereum-Adresse",
      invalidAmount: "Ungültiger Betrag",
      insufficientBalance: "Unzureichendes Guthaben",
    },
  }

  const t = labels[language]

  const copyToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSetMax = () => {
    setSendAmount(balance.replace(/,/g, ""))
  }

  const validateSend = (): string | null => {
    if (!sendAddress || !sendAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      return t.invalidAddress
    }
    const amount = Number.parseFloat(sendAmount)
    if (isNaN(amount) || amount <= 0) {
      return t.invalidAmount
    }
    const balanceNum = Number.parseFloat(balance.replace(/,/g, ""))
    if (amount > balanceNum) {
      return t.insufficientBalance
    }
    return null
  }

  const handleSend = async () => {
    const validationError = validateSend()
    if (validationError) {
      setError(validationError)
      return
    }

    if (lockStatus.isLocked && !lockStatus.isCreator) {
      setError(t.lockedWarning)
      return
    }

    setError(null)
    setIsSending(true)

    try {
      if (typeof window !== "undefined" && window.ethereum) {
        const amount = Number.parseFloat(sendAmount)
        const amountWei = BigInt(Math.floor(amount * 1e18)).toString(16)

        // ERC20 transfer function signature + params
        const transferFunctionSig = "0xa9059cbb"
        const paddedAddress = sendAddress.slice(2).padStart(64, "0")
        const paddedAmount = amountWei.padStart(64, "0")
        const data = transferFunctionSig + paddedAddress + paddedAmount

        const txHash = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: address,
              to: OPM_TOKEN_ADDRESS,
              data: data,
              gas: "0x186A0", // 100000 gas
            },
          ],
        })

        setTxHash(txHash as string)
        setSendAddress("")
        setSendAmount("")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transaction failed")
    } finally {
      setIsSending(false)
    }
  }

  const usdValue = Number.parseFloat(sendAmount || "0") * priceUsd

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Image
              src="/images/3bffe8d5-1382-49f5-92e7.jpeg"
              alt="OPM"
              width={24}
              height={24}
              className="rounded-full"
            />
            {t.title}
          </DialogTitle>
          <DialogDescription className="sr-only">Send or receive OPM tokens</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="send" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-secondary">
            <TabsTrigger
              value="send"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Send className="h-4 w-4" />
              {t.send}
            </TabsTrigger>
            <TabsTrigger
              value="receive"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Download className="h-4 w-4" />
              {t.receive}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="send" className="space-y-4 mt-4">
            {/* Locked Warning */}
            {lockStatus.isLocked && !lockStatus.isCreator && (
              <Card className="border-amber-500/50 bg-amber-500/10">
                <CardContent className="p-3 flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                  <p className="text-sm text-amber-200">{t.lockedWarning}</p>
                </CardContent>
              </Card>
            )}

            {/* Success Message */}
            {txHash && (
              <Card className="border-emerald-500/50 bg-emerald-500/10">
                <CardContent className="p-3 space-y-2">
                  <p className="text-sm text-emerald-200 flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    {t.txSuccess}
                  </p>
                  <Button variant="outline" size="sm" asChild className="w-full bg-transparent">
                    <a href={`https://etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer">
                      {t.viewOnEtherscan}
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Recipient Address */}
            <div className="space-y-2">
              <Label htmlFor="recipient">{t.recipientAddress}</Label>
              <Input
                id="recipient"
                placeholder="0x..."
                value={sendAddress}
                onChange={(e) => setSendAddress(e.target.value)}
                className="font-mono text-sm bg-secondary border-border"
                disabled={lockStatus.isLocked && !lockStatus.isCreator}
              />
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="amount">{t.amount}</Label>
                <span className="text-xs text-muted-foreground">
                  {t.balance}: {balance} OPM
                </span>
              </div>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.0"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  className="pr-16 font-mono bg-secondary border-border"
                  disabled={lockStatus.isLocked && !lockStatus.isCreator}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-xs text-primary hover:text-primary/80"
                  onClick={handleSetMax}
                  disabled={lockStatus.isLocked && !lockStatus.isCreator}
                >
                  {t.max}
                </Button>
              </div>
              {sendAmount && (
                <p className="text-xs text-muted-foreground">
                  {t.usdValue}: $
                  {usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              )}
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-destructive flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                {error}
              </p>
            )}

            {/* Network Fee Notice */}
            <p className="text-xs text-muted-foreground text-center">{t.networkFee}</p>

            {/* Send Button */}
            <Button
              className="w-full bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black font-semibold"
              onClick={handleSend}
              disabled={isSending || (lockStatus.isLocked && !lockStatus.isCreator)}
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.sending}
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  {t.sendTokens}
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="receive" className="space-y-4 mt-4">
            {/* QR Code Placeholder */}
            <div className="flex flex-col items-center gap-4 p-6 rounded-xl bg-secondary/50 border border-border">
              <div className="w-40 h-40 bg-white rounded-xl flex items-center justify-center p-2">
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
                  <QrCode className="h-20 w-20 text-primary" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{t.scanQr}</p>
            </div>

            {/* Wallet Address */}
            <div className="space-y-2">
              <Label>{t.yourAddress}</Label>
              <div className="flex gap-2">
                <Input value={address || ""} readOnly className="font-mono text-xs bg-secondary border-border" />
                <Button variant="outline" size="icon" onClick={copyToClipboard} className="shrink-0 bg-transparent">
                  {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Token Contract */}
            <div className="space-y-2">
              <Label>{t.tokenContract}</Label>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 border border-border">
                <Image
                  src="/images/3bffe8d5-1382-49f5-92e7.jpeg"
                  alt="OPM"
                  width={20}
                  height={20}
                  className="rounded-full"
                />
                <span className="font-mono text-xs text-muted-foreground truncate">{OPM_TOKEN_ADDRESS}</span>
                <Badge variant="outline" className="shrink-0 text-xs">
                  ERC-20
                </Badge>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
