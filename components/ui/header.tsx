"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "./avatar";
import { LogOut, Menu } from "lucide-react";

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
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setOpen(false);
      }
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <header className={cn(
      "sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border",
      "h-14 px-4 flex items-center justify-between",
      className
    )}>
      {/* Left: Menu button or back */}
      <div className="w-10">
        {showBackButton ? (
          <button
            onClick={onBackClick}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-bg-secondary transition-colors"
          >
            <svg className="w-5 h-5 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        ) : onMenuClick && (
          <button
            onClick={onMenuClick}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-bg-secondary transition-colors"
          >
            <Menu className="w-5 h-5 text-text-primary" />
          </button>
        )}
      </div>

      {/* Center: Title */}
      <div className="flex-1 text-center">
        <h1 className="text-base font-bold text-text-primary leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-text-muted">{subtitle}</p>
        )}
      </div>

      {/* Right: User avatar */}
      <div className="w-10 flex justify-end">
        {user ? (
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => {
                if (!onLogout) return;
                setOpen((v) => !v);
              }}
              className={cn(
                "rounded-full",
                onLogout ? "cursor-pointer" : "cursor-default"
              )}
              aria-haspopup={onLogout ? "menu" : undefined}
              aria-expanded={onLogout ? open : undefined}
              aria-label={onLogout ? "Abrir menú de cuenta" : "Cuenta"}
            >
              <Avatar name={user.name} src={user.avatarUrl} size="sm" />
            </button>

            {onLogout && open && (
              <div
                role="menu"
                className={cn(
                  "absolute right-0 mt-2 w-48 rounded-xl border border-border bg-white shadow-lg",
                  "overflow-hidden"
                )}
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={async () => {
                    setOpen(false);
                    await onLogout();
                  }}
                  className={cn(
                    "w-full px-3 py-2 text-left text-sm",
                    "hover:bg-bg-secondary transition-colors",
                    "flex items-center gap-2 text-error"
                  )}
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="w-8 h-8" />
        )}
      </div>
    </header>
  );
}
