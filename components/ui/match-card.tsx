"use client";

import { cn } from "@/lib/utils";
import { Badge } from "./badge";
import { Avatar } from "./avatar";

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
  onClick?: () => void;
  className?: string;
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
  const isLive = status === "live";
  const isCompleted = status === "completed";
  const showScore = isLive || isCompleted;

  return (
    <div
      onClick={onClick}
      className={cn(
        "w-full bg-white border border-border rounded-2xl p-3.5 sm:p-4 shadow-sm transition-all duration-200",
        onClick && "cursor-pointer card-hover",
        className
      )}
    >
      {/* Status badge and time */}
      <div className="flex items-center justify-between mb-3">
        <Badge variant={status}>
          {isLive && <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse" />}
          {status === "upcoming" ? "Próximo" : status === "live" ? "En Vivo" : status === "completed" ? "Finalizado" : "Bloqueado"}
        </Badge>
        {time && (
          <span className="text-lg font-semibold font-mono tracking-tight text-text-secondary">
            {time}
          </span>
        )}
      </div>

      {/* Teams and Score */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:gap-3">
        {/* Local Team */}
        <div className="min-w-0 flex items-center gap-2.5">
          <Avatar
            name={localTeam.name}
            src={localTeam.logoUrl}
            size="md"
            style={localTeam.primaryColor ? { backgroundColor: localTeam.primaryColor + "20", color: localTeam.primaryColor } : undefined}
          />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-[clamp(0.95rem,3.5vw,1.1rem)] leading-tight text-text-primary truncate">
              {localTeam.name}
            </p>
          </div>
        </div>

        {/* Score */}
        <div className={cn(
          "px-1 sm:px-2 flex items-center gap-1.5 sm:gap-2 justify-center",
          isLive && "animate-scale-pop"
        )}>
          {showScore ? (
            <>
              <span className={cn(
                "text-[clamp(1.7rem,7vw,2.1rem)] leading-none font-bold font-mono",
                scoreLocal! > scoreVisitor! ? "text-success" : scoreLocal! < scoreVisitor! ? "text-text-primary" : "text-text-secondary"
              )}>
                {scoreLocal}
              </span>
              <span className="text-lg sm:text-xl text-text-muted">-</span>
              <span className={cn(
                "text-[clamp(1.7rem,7vw,2.1rem)] leading-none font-bold font-mono",
                scoreVisitor! > scoreLocal! ? "text-success" : scoreLocal! < scoreVisitor! ? "text-text-primary" : "text-text-secondary"
              )}>
                {scoreVisitor}
              </span>
            </>
          ) : (
            <span className="text-xl sm:text-2xl uppercase tracking-wide text-text-muted font-medium">vs</span>
          )}
        </div>

        {/* Visitor Team */}
        <div className="min-w-0 flex items-center gap-2.5 justify-end">
          <div className="min-w-0 flex-1 text-right">
            <p className="font-semibold text-[clamp(0.95rem,3.5vw,1.1rem)] leading-tight text-text-primary truncate">
              {visitorTeam.name}
            </p>
          </div>
          <Avatar
            name={visitorTeam.name}
            src={visitorTeam.logoUrl}
            size="md"
            style={visitorTeam.primaryColor ? { backgroundColor: visitorTeam.primaryColor + "20", color: visitorTeam.primaryColor } : undefined}
          />
        </div>
      </div>

      {/* Field */}
      {field && (
        <div className="mt-3 pt-3 border-t border-border/80">
          <p className="text-sm text-text-muted">
            Campo: <span className="font-medium text-text-secondary">{field}</span>
          </p>
        </div>
      )}
    </div>
  );
}
