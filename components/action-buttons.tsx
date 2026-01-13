"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRightLeft, PiggyBank, Gift, ShoppingCart, ExternalLink, Sparkles } from "lucide-react"

interface ActionButtonsProps {
  isConnected: boolean
}

export function ActionButtons({ isConnected }: ActionButtonsProps) {
  const actions = [
    {
      label: "Buy OPM",
      icon: ShoppingCart,
      description: "Purchase tokens",
      href: "https://dex.coinmarketcap.com/token/ethereum/0xe430b07f7b168e77b07b29482dbf89eafa53f484/",
      primary: true,
    },
    {
      label: "Swap",
      icon: ArrowRightLeft,
      description: "Exchange tokens",
      href: "https://app.uniswap.org/",
      primary: false,
    },
    {
      label: "Stake",
      icon: PiggyBank,
      description: "Earn rewards",
      onClick: () => {},
      primary: false,
      disabled: true,
      comingSoon: true,
    },
    {
      label: "Referral",
      icon: Gift,
      description: "Invite friends",
      onClick: () => {},
      primary: false,
      disabled: true,
      comingSoon: true,
    },
  ]

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Sparkles className="h-4 w-4 text-primary" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant={action.primary ? "default" : "outline"}
              disabled={!isConnected || action.disabled}
              onClick={action.onClick}
              asChild={!!action.href && isConnected}
              className={`
                relative h-auto flex-col gap-1 p-4 min-h-[80px]
                ${
                  action.primary
                    ? "bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black"
                    : "border-border hover:border-primary/50 hover:bg-primary/5"
                }
              `}
            >
              {action.href && isConnected ? (
                <a
                  href={action.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1"
                >
                  <action.icon className="h-5 w-5" />
                  <span className="text-sm font-semibold">{action.label}</span>
                  <span className={`text-xs ${action.primary ? "text-black/70" : "text-muted-foreground"}`}>
                    {action.description}
                  </span>
                  <ExternalLink className="absolute top-2 right-2 h-3 w-3 opacity-50" />
                </a>
              ) : (
                <>
                  <action.icon className="h-5 w-5" />
                  <span className="text-sm font-semibold">{action.label}</span>
                  <span className={`text-xs ${action.primary ? "text-black/70" : "text-muted-foreground"}`}>
                    {action.comingSoon ? "Coming Soon" : action.description}
                  </span>
                </>
              )}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
