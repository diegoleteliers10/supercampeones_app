"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Home01Icon,
  UserGroupIcon,
  CrownIcon,
  Calendar01Icon,
  ClipboardIcon,
  TransactionHistoryIcon,
} from "@hugeicons/core-free-icons";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export function BottomNav() {
  const pathname = usePathname();

  // Determine role from pathname
  let navItems: NavItem[] | null = null;
  if (pathname.startsWith("/admin")) {
    navItems = [
      {
        label: "Inicio",
        href: "/admin",
        icon: <HugeiconsIcon icon={Home01Icon} className="w-5 h-5" />,
      },
      {
        label: "Partidos",
        href: "/admin/matches",
        icon: <HugeiconsIcon icon={Calendar01Icon} className="w-5 h-5" />,
      },
      {
        label: "Equipos",
        href: "/admin/teams",
        icon: <HugeiconsIcon icon={UserGroupIcon} className="w-5 h-5" />,
      },
      {
        label: "Liga",
        href: "/admin/league",
        icon: <HugeiconsIcon icon={CrownIcon} className="w-5 h-5" />,
      },
    ];
  } else if (pathname.startsWith("/scorer")) {
    navItems = [
      {
        label: "Partidos",
        href: "/scorer",
        icon: <HugeiconsIcon icon={ClipboardIcon} className="w-5 h-5" />,
      },
      {
        label: "Historial",
        href: "/scorer/history",
        icon: (
          <HugeiconsIcon icon={TransactionHistoryIcon} className="w-5 h-5" />
        ),
      },
    ];
  }

  if (!navItems) return null;

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-background border-t border-border",
        "pb-safe-bottom bottom-nav",
      )}
    >
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isAdminHomeItem = item.href === "/admin";
          const isScorerPartidosItem = item.href === "/scorer";
          const isScorerHistoryItem = item.href === "/scorer/history";
          const isActive = isAdminHomeItem
            ? pathname === "/admin"
            : isScorerPartidosItem
              ? pathname === "/scorer" || pathname.startsWith("/scorer/match/")
              : isScorerHistoryItem
                ? pathname === "/scorer/history" ||
                  pathname.startsWith("/scorer/history/")
                : pathname === item.href ||
                  pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 min-w-[64px] rounded-lg transition-colors",
                isActive
                  ? "text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              <div className="relative">
                {item.icon}
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-medium",
                  isActive && "font-semibold",
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
