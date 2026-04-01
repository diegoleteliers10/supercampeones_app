"use client";

import { cn } from "@/lib/utils";
import { Badge } from "./badge";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Card, CardContent } from "./card";

interface MatchCardProps {
  localTeam: {
    name: string;
    logoUrl?: string;
    primaryColor?: string;
  };
  visitorTeam: {
    name: string;
    logoUrl?: string;
    primaryColor?: string;
  };
  scoreLocal?: number;
  scoreVisitor?: number;
  status: "upcoming" | "live" | "completed" | "blocked";
  time?: string;
  field?: string;
  date?: string;
  onClick?: () => void;
  headerAction?: React.ReactNode;
  className?: string;
}

const statusConfig = {
  upcoming: {
    variant: "outline" as const,
    label: "Próximo",
    showLiveDot: false,
  },
  live: {
    variant: "live" as const,
    label: "En Vivo",
    showLiveDot: true,
  },
  completed: {
    variant: "secondary" as const,
    label: "Finalizado",
    showLiveDot: false,
  },
  blocked: {
    variant: "blocked" as const,
    label: "Bloqueado",
    showLiveDot: false,
  },
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getScoreColor(
  score: number | undefined,
  opponentScore: number | undefined,
  isWinner: boolean
) {
  if (score === undefined || opponentScore === undefined) return "text-foreground";
  if (score === opponentScore) return "text-muted-foreground";
  return isWinner ? "text-success font-bold" : "text-foreground";
}

export function MatchCard({
  localTeam,
  visitorTeam,
  scoreLocal,
  scoreVisitor,
  status,
  time,
  field,
  date,
  onClick,
  headerAction,
  className,
}: MatchCardProps) {
  const config = statusConfig[status];
  const isLive = status === "live";
  const isCompleted = status === "completed";
  const showScore = isLive || isCompleted;
  const localWins = showScore && scoreLocal !== undefined && scoreVisitor !== undefined && scoreLocal > scoreVisitor;
  const visitorWins = showScore && scoreLocal !== undefined && scoreVisitor !== undefined && scoreVisitor > scoreLocal;

  return (
    <Card
      className={cn(
        "w-full overflow-hidden transition-all duration-200",
        onClick && "cursor-pointer hover:shadow-lg hover:border-primary/30 active:scale-[0.99]",
        isLive && "ring-2 ring-success/30",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-4">
        {/* Header: Status + Time */}
        <div className="flex items-start justify-between gap-3">
          <Badge variant={config.variant} className="gap-1.5">
            {config.showLiveDot && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
              </span>
            )}
            {config.label}
          </Badge>
          <div className="flex items-center gap-2 ml-auto">
            <div className="text-right">
              {time && (
                <span className="text-sm font-mono font-medium text-muted-foreground">
                  {time}
                </span>
              )}
              {date && <p className="text-xs text-muted-foreground">{date}</p>}
            </div>
            {headerAction}
          </div>
        </div>

        {/* Teams and Score */}
        <div className="flex items-center justify-between gap-3">
          {/* Local Team */}
          <div className="flex-1 min-w-0 flex items-center gap-3">
            <Avatar
              size="lg"
              className="shrink-0"
              style={
                localTeam.primaryColor
                  ? {
                      backgroundColor: localTeam.primaryColor + "15",
                      borderColor: localTeam.primaryColor + "30",
                    }
                  : undefined
              }
            >
              {localTeam.logoUrl && (
                <AvatarImage src={localTeam.logoUrl} alt={localTeam.name} />
              )}
              <AvatarFallback
                style={
                  localTeam.primaryColor
                    ? { color: localTeam.primaryColor }
                    : undefined
                }
              >
                {getInitials(localTeam.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm text-foreground truncate leading-tight">
                {localTeam.name}
              </p>
              {field && (
                <p className="text-xs text-muted-foreground truncate">
                  Local
                </p>
              )}
            </div>
          </div>

          {/* Score */}
          <div
            className={cn(
              "flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-muted/50 min-w-[80px]",
              isLive && "bg-success/10"
            )}
          >
            {showScore ? (
              <>
                <span
                  className={cn(
                    "text-2xl font-bold font-mono tabular-nums",
                    getScoreColor(scoreLocal, scoreVisitor, localWins || false)
                  )}
                >
                  {scoreLocal}
                </span>
                <span className="text-lg text-muted-foreground">:</span>
                <span
                  className={cn(
                    "text-2xl font-bold font-mono tabular-nums",
                    getScoreColor(scoreVisitor, scoreLocal, visitorWins || false)
                  )}
                >
                  {scoreVisitor}
                </span>
              </>
            ) : (
              <span className="text-lg font-medium text-muted-foreground tracking-wide">
                VS
              </span>
            )}
          </div>

          {/* Visitor Team */}
          <div className="flex-1 min-w-0 flex items-center gap-3 justify-end">
            <div className="min-w-0 flex-1 text-right">
              <p className="font-semibold text-sm text-foreground truncate leading-tight">
                {visitorTeam.name}
              </p>
              {field && (
                <p className="text-xs text-muted-foreground truncate">
                  Visita
                </p>
              )}
            </div>
            <Avatar
              size="lg"
              className="shrink-0"
              style={
                visitorTeam.primaryColor
                  ? {
                      backgroundColor: visitorTeam.primaryColor + "15",
                      borderColor: visitorTeam.primaryColor + "30",
                    }
                  : undefined
              }
            >
              {visitorTeam.logoUrl && (
                <AvatarImage src={visitorTeam.logoUrl} alt={visitorTeam.name} />
              )}
              <AvatarFallback
                style={
                  visitorTeam.primaryColor
                    ? { color: visitorTeam.primaryColor }
                    : undefined
                }
              >
                {getInitials(visitorTeam.name)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Field Info */}
        {field && !status && (
          <div className="pt-3 border-t border-border/50">
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <title>Campo</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>
                Campo: <span className="font-medium text-foreground">{field}</span>
              </span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
