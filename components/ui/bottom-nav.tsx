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
  isActive?: boolean;
}

function NavLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
  return (
    <Link
      href={item.href}
      className={cn(
        "relative flex flex-col items-center justify-center gap-1 px-4 py-2 min-w-[72px] h-16 rounded-xl transition-all duration-200",
        isActive
          ? "text-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50 active:bg-muted",
      )}
    >
      {/* Active indicator */}
      {isActive && (
        <span className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full" />
      )}

      {/* Icon with active state background */}
      <span
        className={cn(
          "relative p-2 rounded-lg transition-all duration-200",
          isActive && "bg-primary/10 text-primary",
          !isActive && "group-hover:bg-muted",
        )}
      >
        {item.icon}

        {/* Active dot indicator below icon */}
        {isActive && (
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
        )}
      </span>

      {/* Label */}
      <span
        className={cn(
          "text-xs font-medium transition-colors",
          isActive ? "font-semibold text-primary" : "text-muted-foreground",
        )}
      >
        {item.label}
      </span>
    </Link>
  );
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

  // Determine active state for each item
  const isActive = (item: NavItem): boolean => {
    if (item.href === "/admin") {
      return pathname === "/admin";
    }
    if (item.href === "/scorer") {
      return pathname === "/scorer" || pathname.startsWith("/scorer/match/");
    }
    if (item.href === "/scorer/history") {
      return (
        pathname === "/scorer/history" ||
        pathname.startsWith("/scorer/history/")
      );
    }
    return pathname === item.href || pathname.startsWith(item.href + "/");
  };

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-background/95 backdrop-blur-xl",
        "border-t border-border/50",
        "pb-safe-bottom bottom-nav",
        "safe-bottom",
      )}
    >
      {/* Gradient overlay at top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} isActive={isActive(item)} />
        ))}
      </div>
    </nav>
  );
}
