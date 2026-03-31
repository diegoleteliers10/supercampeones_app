"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Logout01Icon,
  Menu01Icon,
} from "@hugeicons/core-free-icons";

interface HeaderProps {
  title: string;
  subtitle?: string;
  user?: {
    name: string;
    email?: string;
    avatarUrl?: string;
  };
  onLogout?: () => void | Promise<void>;
  onMenuClick?: () => void;
  onBackClick?: () => void;
  showBackButton?: boolean;
  className?: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function Header({
  title,
  subtitle,
  user,
  onLogout,
  onMenuClick,
  onBackClick,
  showBackButton,
  className,
}: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border",
        "h-14 px-4 flex items-center justify-between",
        className,
      )}
    >
      {/* Left: Menu button or back */}
      <div className="w-10">
        {showBackButton ? (
          <button
            type="button"
            onClick={onBackClick}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
            aria-label="Volver"
          >
            <HugeiconsIcon
              icon={ArrowLeft01Icon}
              className="w-5 h-5"
              aria-hidden="true"
            />
          </button>
        ) : onMenuClick ? (
          <button
            type="button"
            onClick={onMenuClick}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
            aria-label="Menú"
          >
            <HugeiconsIcon icon={Menu01Icon} className="w-5 h-5" />
          </button>
        ) : null}
      </div>

      {/* Center: Title */}
      <div className="flex-1 text-center">
        <h1 className="text-base font-bold leading-tight">{title}</h1>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>

      {/* Right: User avatar */}
      <div className="w-10 flex justify-end">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(
                  "rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  onLogout ? "cursor-pointer" : "cursor-default",
                )}
                aria-label={onLogout ? "Abrir menú de cuenta" : "Cuenta"}
              >
                <Avatar data-size="sm">
                  {user.avatarUrl && (
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                  )}
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            {onLogout && (
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={async () => {
                    await onLogout();
                  }}
                  className="text-destructive focus:text-destructive"
                >
                  <HugeiconsIcon icon={Logout01Icon} className="w-4 h-4 mr-2" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        ) : (
          <div className="w-8 h-8" />
        )}
      </div>
    </header>
  );
}
