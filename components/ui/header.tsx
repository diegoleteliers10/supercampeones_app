"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Logout01Icon,
  Menu01Icon,
  Settings02Icon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";

interface HeaderProps {
  title: string;
  subtitle?: string;
  user?: {
    name: string;
    email?: string;
    avatarUrl?: string;
    role?: "admin" | "scorer";
  };
  onLogout?: () => void | Promise<void>;
  onMenuClick?: () => void;
  onBackClick?: () => void;
  onSettingsClick?: () => void;
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
  onSettingsClick,
  showBackButton,
  className,
}: HeaderProps) {
  const router = useRouter();

  return (
    <header
      className={cn(
        "sticky top-0 z-50",
        "bg-background/80 backdrop-blur-lg",
        "border-b border-border/50",
        "h-16 px-4 flex items-center justify-between gap-4",
        className,
      )}
    >
      {/* Left: Menu button or back */}
      <div className="flex items-center gap-2">
        {showBackButton ? (
          <button
            type="button"
            onClick={() => {
              if (onBackClick) {
                onBackClick();
                return;
              }
              router.back();
            }}
            className={cn(
              "w-10 h-10 flex items-center justify-center rounded-xl",
              "text-muted-foreground hover:text-foreground",
              "hover:bg-muted active:bg-muted/80",
              "transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            )}
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
            className={cn(
              "w-10 h-10 flex items-center justify-center rounded-xl",
              "text-muted-foreground hover:text-foreground",
              "hover:bg-muted active:bg-muted/80",
              "transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            )}
            aria-label="Menú"
          >
            <HugeiconsIcon icon={Menu01Icon} className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-10" />
        )}
      </div>

      {/* Center: Title */}
      <div className="flex-1 text-center min-w-0">
        <h1 className="text-base font-semibold leading-tight truncate text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
        )}
      </div>

      {/* Right: User avatar or placeholder */}
      <div className="flex items-center gap-2">
        {onSettingsClick && (
          <button
            type="button"
            onClick={onSettingsClick}
            className={cn(
              "w-10 h-10 flex items-center justify-center rounded-xl",
              "text-muted-foreground hover:text-foreground",
              "hover:bg-muted active:bg-muted/80",
              "transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            )}
            aria-label="Configuración"
          >
            <HugeiconsIcon icon={Settings02Icon} className="w-5 h-5" />
          </button>
        )}

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(
                  "rounded-full",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  onLogout ? "cursor-pointer" : "cursor-default",
                  "transition-transform duration-200 hover:scale-105 active:scale-95",
                )}
                aria-label={onLogout ? "Abrir menú de cuenta" : "Cuenta"}
              >
                <Avatar data-size="sm">
                  {user.avatarUrl && (
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                  )}
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            {onLogout && (
              <DropdownMenuContent align="end" className="w-56 p-2">
                <DropdownMenuLabel className="p-2">
                  <div className="flex items-center gap-3">
                    <Avatar data-size="sm">
                      {user.avatarUrl && (
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                      )}
                      <AvatarFallback>
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      {user.email && (
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      )}
                      {user.role && (
                        <span
                          className={cn(
                            "inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider",
                            user.role === "admin"
                              ? "bg-primary/10 text-primary"
                              : "bg-secondary text-secondary-foreground",
                          )}
                        >
                          {user.role === "admin" ? "Admin" : "Anotador"}
                        </span>
                      )}
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="my-2 -mx-2 h-px bg-border/50" />
                {onSettingsClick && (
                  <DropdownMenuItem
                    onClick={onSettingsClick}
                    className="flex items-center gap-2 p-2 rounded-lg cursor-pointer"
                  >
                    <HugeiconsIcon
                      icon={Settings02Icon}
                      className="w-4 h-4 text-muted-foreground"
                    />
                    <span>Configuración</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={async () => {
                    await onLogout?.();
                  }}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-lg cursor-pointer",
                    "text-destructive focus:text-destructive",
                    "focus:bg-destructive/10",
                  )}
                >
                  <HugeiconsIcon icon={Logout01Icon} className="w-4 h-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            )}
          </DropdownMenu>
        ) : (
          <div className="w-10 h-10" />
        )}
      </div>
    </header>
  );
}
