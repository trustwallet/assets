"use client"

import { useLanguage } from "@/hooks/use-language"
import { useTransactions } from "@/hooks/use-transactions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowDownLeft, ArrowUpRight, ExternalLink, History } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { de, enUS } from "date-fns/locale"

interface TransactionsCardProps {
  address: string | null
}

export function TransactionsCard({ address }: TransactionsCardProps) {
  const { t, language } = useLanguage()
  const { transactions, isLoading } = useTransactions(address)

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return formatDistanceToNow(date, {
      addSuffix: true,
      locale: language === "de" ? de : enUS,
    })
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <History className="h-4 w-4 text-primary" />
          {t.dashboard.transactions}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 bg-secondary" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">{t.dashboard.noTransactions}</div>
        ) : (
          <div className="space-y-3">
            {transactions.slice(0, 5).map((tx) => (
              <a
                key={tx.hash}
                href={`https://etherscan.io/tx/${tx.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${tx.type === "in" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"}`}
                  >
                    {tx.type === "in" ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {tx.type === "in"
                        ? language === "de"
                          ? "Empfangen"
                          : "Received"
                        : language === "de"
                          ? "Gesendet"
                          : "Sent"}{" "}
                      {tx.value} OPM
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {tx.type === "in" ? (language === "de" ? "Von" : "From") : language === "de" ? "An" : "To"}:{" "}
                      {formatAddress(tx.type === "in" ? tx.from : tx.to)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{formatTime(tx.timestamp)}</span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
