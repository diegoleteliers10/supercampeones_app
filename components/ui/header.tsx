"use client";

import { cn } from "@/lib/utils";
import { Avatar } from "./avatar";
import { Menu, Bell } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  user?: {
    name: string;
    email?: string;
    avatarUrl?: string;
  };
  onMenuClick?: () => void;
  className?: string;
}

export function Header({ title, subtitle, user, onMenuClick, className }: HeaderProps) {
  return (
    <header className={cn(
      "sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border",
      "h-14 px-4 flex items-center justify-between",
      className
    )}>
      {/* Left: Menu button or back */}
      <div className="w-10">
        {onMenuClick && (
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
          <Avatar name={user.name} src={user.avatarUrl} size="sm" />
        ) : (
          <div className="w-8 h-8" />
        )}
      </div>
    </header>
  );
}
