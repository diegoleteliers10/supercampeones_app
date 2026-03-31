"use client"

import { cn } from "@/lib/utils"
import { Badge } from "./badge"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { Card, CardContent } from "./card"

interface MatchCardProps {
  localTeam: {
    name: string
    logoUrl?: string
    primaryColor?: string
  }
  visitorTeam: {
    name: string
    logoUrl?: string
    primaryColor?: string
  }
  scoreLocal?: number
  scoreVisitor?: number
  status: "upcoming" | "live" | "completed" | "blocked"
  time?: string
  field?: string
  onClick?: () => void
  className?: string
}

const statusVariantMap = {
  upcoming: "outline" as const,
  live: "default" as const,
  completed: "secondary" as const,
  blocked: "destructive" as const,
}

const statusLabelMap = {
  upcoming: "Próximo",
  live: "En Vivo",
  completed: "Finalizado",
  blocked: "Bloqueado",
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function MatchCard({
  localTeam,
  visitorTeam,
  scoreLocal,
  scoreVisitor,
  status,
  time,
  field,
  onClick,
  className,
}: MatchCardProps) {
  const isLive = status === "live"
  const isCompleted = status === "completed"
  const showScore = isLive || isCompleted

  return (
    <Card
      className={cn(
        "w-full",
        onClick && "cursor-pointer hover:shadow-md transition-shadow",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <Badge variant={statusVariantMap[status]}>
            {isLive && (
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse" />
            )}
            {statusLabelMap[status]}
          </Badge>
          {time && (
            <span className="text-lg font-semibold font-mono tracking-tight text-muted-foreground">
              {time}
            </span>
          )}
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:gap-3">
          <div className="min-w-0 flex items-center gap-2.5">
            <Avatar
              style={
                localTeam.primaryColor
                  ? {
                      backgroundColor: localTeam.primaryColor + "20",
                      color: localTeam.primaryColor,
                    }
                  : undefined
              }
            >
              {localTeam.logoUrl && (
                <AvatarImage src={localTeam.logoUrl} alt={localTeam.name} />
              )}
              <AvatarFallback>{getInitials(localTeam.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm leading-tight truncate">
                {localTeam.name}
              </p>
            </div>
          </div>

          <div
            className={cn(
              "px-1 sm:px-2 flex items-center gap-1.5 sm:gap-2 justify-center",
              isLive && "animate-pulse"
            )}
          >
            {showScore ? (
              <>
                <span
                  className={cn(
                    "text-2xl sm:text-3xl leading-none font-bold font-mono",
                    scoreLocal != null && scoreVisitor != null
                      ? scoreLocal > scoreVisitor
                        ? "text-green-600"
                        : scoreLocal < scoreVisitor
                          ? "text-foreground"
                          : "text-muted-foreground"
                      : "text-foreground"
                  )}
                >
                  {scoreLocal}
                </span>
                <span className="text-lg sm:text-xl text-muted-foreground">-</span>
                <span
                  className={cn(
                    "text-2xl sm:text-3xl leading-none font-bold font-mono",
                    scoreLocal != null && scoreVisitor != null
                      ? scoreVisitor > scoreLocal
                        ? "text-green-600"
                        : scoreVisitor < scoreLocal
                          ? "text-foreground"
                          : "text-muted-foreground"
                      : "text-foreground"
                  )}
                >
                  {scoreVisitor}
                </span>
              </>
            ) : (
              <span className="text-xl sm:text-2xl uppercase tracking-wide text-muted-foreground font-medium">
                vs
              </span>
            )}
          </div>

          <div className="min-w-0 flex items-center gap-2.5 justify-end">
            <div className="min-w-0 flex-1 text-right">
              <p className="font-semibold text-sm leading-tight truncate">
                {visitorTeam.name}
              </p>
            </div>
            <Avatar
              style={
                visitorTeam.primaryColor
                  ? {
                      backgroundColor: visitorTeam.primaryColor + "20",
                      color: visitorTeam.primaryColor,
                    }
                  : undefined
              }
            >
              {visitorTeam.logoUrl && (
                <AvatarImage src={visitorTeam.logoUrl} alt={visitorTeam.name} />
              )}
              <AvatarFallback>{getInitials(visitorTeam.name)}</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {field && (
          <div className="mt-3 pt-3 border-t border-border/80">
            <p className="text-sm text-muted-foreground">
              Campo: <span className="font-medium text-foreground">{field}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
