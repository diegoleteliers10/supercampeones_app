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
        "bg-white border border-border rounded-xl p-4 transition-all duration-200",
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
          <span className="text-sm text-text-secondary font-medium">
            {time}
          </span>
        )}
      </div>

      {/* Teams and Score */}
      <div className="flex items-center justify-between">
        {/* Local Team */}
        <div className="flex-1 flex items-center gap-3">
          <Avatar
            name={localTeam.name}
            src={localTeam.logoUrl}
            size="lg"
            className={localTeam.primaryColor ? "" : ""}
            style={localTeam.primaryColor ? { backgroundColor: localTeam.primaryColor + "20", color: localTeam.primaryColor } : undefined}
          />
          <div className="min-w-0">
            <p className="font-semibold text-text-primary truncate">
              {localTeam.name}
            </p>
          </div>
        </div>

        {/* Score */}
        <div className={cn(
          "px-4 flex items-center gap-2",
          isLive && "animate-scale-pop"
        )}>
          {showScore ? (
            <>
              <span className={cn(
                "text-3xl font-bold font-mono",
                scoreLocal! > scoreVisitor! ? "text-success" : scoreLocal! < scoreVisitor! ? "text-text-primary" : "text-text-secondary"
              )}>
                {scoreLocal}
              </span>
              <span className="text-xl text-text-muted">-</span>
              <span className={cn(
                "text-3xl font-bold font-mono",
                scoreVisitor! > scoreLocal! ? "text-success" : scoreLocal! < scoreVisitor! ? "text-text-primary" : "text-text-secondary"
              )}>
                {scoreVisitor}
              </span>
            </>
          ) : (
            <span className="text-2xl text-text-muted font-light">vs</span>
          )}
        </div>

        {/* Visitor Team */}
        <div className="flex-1 flex items-center gap-3 justify-end">
          <div className="min-w-0 text-right">
            <p className="font-semibold text-text-primary truncate">
              {visitorTeam.name}
            </p>
          </div>
          <Avatar
            name={visitorTeam.name}
            src={visitorTeam.logoUrl}
            size="lg"
            style={visitorTeam.primaryColor ? { backgroundColor: visitorTeam.primaryColor + "20", color: visitorTeam.primaryColor } : undefined}
          />
        </div>
      </div>

      {/* Field */}
      {field && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs text-text-muted">
            Campo: <span className="font-medium text-text-secondary">{field}</span>
          </p>
        </div>
      )}
    </div>
  );
}
