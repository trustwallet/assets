"use client"

import { useLockStatus } from "@/hooks/use-lock-status"
import { useLanguage } from "@/hooks/use-language"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Lock, Unlock, Calendar, AlertTriangle, Crown, Sparkles } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface LockStatusCardProps {
  address: string | null
}

export function LockStatusCard({ address }: LockStatusCardProps) {
  const { language } = useLanguage()
  const lockStatus = useLockStatus(address)

  const labels = {
    en: {
      title: "Token Lock Status",
      locked: "Tokens Locked",
      unlocked: "Tokens Unlocked",
      creator: "Creator Wallet",
      lockPeriod: "Lock Period",
      days: "days",
      hours: "hours",
      minutes: "min",
      seconds: "sec",
      remaining: "Time Remaining",
      unlockDate: "Unlock Date",
      receiveDate: "First Received",
      canSwap: "You can swap your OPM tokens freely",
      cannotSwap: "Hold tight! Your tokens are building value",
      creatorMessage: "As the creator, your tokens are always unlocked",
      progress: "Journey to Freedom",
      countdown: "Countdown",
    },
    de: {
      title: "Token-Sperrstatus",
      locked: "Token gesperrt",
      unlocked: "Token entsperrt",
      creator: "Ersteller-Wallet",
      lockPeriod: "Sperrfrist",
      days: "Tage",
      hours: "Std",
      minutes: "Min",
      seconds: "Sek",
      remaining: "Verbleibende Zeit",
      unlockDate: "Entsperrdatum",
      receiveDate: "Erstmals erhalten",
      canSwap: "Sie können Ihre OPM-Token frei tauschen",
      cannotSwap: "Durchhalten! Ihre Token bauen Wert auf",
      creatorMessage: "Als Ersteller sind Ihre Token immer entsperrt",
      progress: "Weg zur Freiheit",
      countdown: "Countdown",
    },
  }

  const t = labels[language]

  if (lockStatus.isLoading) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Lock className="h-4 w-4 text-primary" />
            {t.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-12 bg-secondary" />
          <Skeleton className="h-8 bg-secondary" />
          <Skeleton className="h-4 bg-secondary" />
        </CardContent>
      </Card>
    )
  }

  const progressPercentage = lockStatus.firstReceiveDate
    ? Math.min(100, ((365 - lockStatus.remainingDays) / 365) * 100)
    : 100

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—"
    return new Date(dateStr).toLocaleDateString(language === "de" ? "de-DE" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (lockStatus.isCreator) {
    return (
      <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-card to-primary/5 backdrop-blur relative overflow-hidden">
        <div className="absolute inset-0 animate-shimmer pointer-events-none" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Crown className="h-4 w-4 text-primary" />
              {t.title}
            </span>
            <Badge className="border-primary/50 text-primary bg-primary/10 gap-1">
              <Crown className="h-3 w-3" />
              {t.creator}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 relative">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20">
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            <p className="text-sm text-primary font-medium">{t.creatorMessage}</p>
          </div>
          <div className="flex items-center justify-center py-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center animate-pulse-glow">
                <Unlock className="h-12 w-12 text-primary" />
              </div>
              <div
                className="absolute -inset-2 rounded-full border-2 border-primary/30 border-dashed animate-spin"
                style={{ animationDuration: "10s" }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className={`border-border/50 backdrop-blur relative overflow-hidden ${
        lockStatus.isLocked
          ? "bg-gradient-to-br from-amber-950/30 via-card to-amber-950/10"
          : "bg-gradient-to-br from-emerald-950/30 via-card to-emerald-950/10"
      }`}
    >
      <div className="absolute inset-0 animate-shimmer pointer-events-none" />
      {lockStatus.isLocked && (
        <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl animate-glow-pulse" />
      )}
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            {lockStatus.isLocked ? (
              <Lock className="h-4 w-4 text-amber-500" />
            ) : (
              <Unlock className="h-4 w-4 text-emerald-500" />
            )}
            {t.title}
          </span>
          <Badge
            variant="outline"
            className={
              lockStatus.isLocked
                ? "border-amber-500/50 text-amber-500 bg-amber-500/10"
                : "border-emerald-500/50 text-emerald-500 bg-emerald-500/10"
            }
          >
            {lockStatus.isLocked ? t.locked : t.unlocked}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 relative">
        {/* Status Message */}
        <div
          className={`flex items-start gap-3 p-3 rounded-lg ${
            lockStatus.isLocked
              ? "bg-amber-500/10 border border-amber-500/20"
              : "bg-emerald-500/10 border border-emerald-500/20"
          }`}
        >
          {lockStatus.isLocked ? (
            <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
          ) : (
            <Unlock className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
          )}
          <p className={`text-sm ${lockStatus.isLocked ? "text-amber-200" : "text-emerald-200"}`}>
            {lockStatus.isLocked ? t.cannotSwap : t.canSwap}
          </p>
        </div>

        {lockStatus.isLocked && lockStatus.firstReceiveDate && (
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20">
            <p className="text-xs text-amber-400 mb-3 text-center font-medium">{t.countdown}</p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: lockStatus.remainingDays, label: t.days },
                { value: lockStatus.remainingHours, label: t.hours },
                { value: lockStatus.remainingMinutes, label: t.minutes },
                { value: Math.floor(lockStatus.remainingSeconds % 60), label: t.seconds },
              ].map((item, idx) => (
                <div key={idx} className="relative">
                  <div className="bg-background/80 rounded-lg p-2 text-center border border-amber-500/30 transition-all hover:border-amber-500/50 hover:scale-105">
                    <span className="text-2xl font-bold text-gradient tabular-nums">
                      {String(item.value).padStart(2, "0")}
                    </span>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">{item.label}</p>
                  </div>
                  {idx < 3 && (
                    <span className="absolute top-1/2 -right-1 transform -translate-y-1/2 text-amber-500/50 text-lg font-bold">
                      :
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progress */}
        {lockStatus.firstReceiveDate && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{t.progress}</span>
              <span className="text-primary font-medium">{progressPercentage.toFixed(1)}%</span>
            </div>
            <div className="relative">
              <Progress value={progressPercentage} className="h-3 bg-secondary" />
              <div
                className="absolute top-0 h-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-500 rounded-full transition-all"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Dates */}
        {lockStatus.firstReceiveDate && (
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-3 w-3 text-primary" />
                <p className="text-muted-foreground">{t.receiveDate}</p>
              </div>
              <p className="text-foreground font-medium">{formatDate(lockStatus.firstReceiveDate)}</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
              <div className="flex items-center gap-2 mb-1">
                <Unlock className="h-3 w-3 text-emerald-500" />
                <p className="text-muted-foreground">{t.unlockDate}</p>
              </div>
              <p className="text-foreground font-medium">{formatDate(lockStatus.unlockDate)}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
