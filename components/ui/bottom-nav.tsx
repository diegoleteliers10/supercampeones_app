"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Trophy, Calendar, ClipboardList, History } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export function BottomNav() {
  const pathname = usePathname();
  
  // Determine role from pathname
  let navItems: NavItem[];
  if (pathname.startsWith("/admin")) {
    navItems = [
      { label: "Inicio", href: "/admin", icon: <Home className="w-5 h-5" /> },
      { label: "Partidos", href: "/admin/matches", icon: <Calendar className="w-5 h-5" /> },
      { label: "Equipos", href: "/admin/teams", icon: <Users className="w-5 h-5" /> },
      { label: "Liga", href: "/admin/league", icon: <Trophy className="w-5 h-5" /> },
    ];
  } else if (pathname.startsWith("/scorer")) {
    navItems = [
      { label: "Partidos", href: "/scorer", icon: <ClipboardList className="w-5 h-5" /> },
      { label: "Historial", href: "/scorer/history", icon: <History className="w-5 h-5" /> },
    ];
  } else {
    navItems = [
      { label: "Inicio", href: "/parent", icon: <Home className="w-5 h-5" /> },
      { label: "Tabla", href: "/parent/standings", icon: <Trophy className="w-5 h-5" /> },
      { label: "Resultados", href: "/parent/results", icon: <Calendar className="w-5 h-5" /> },
      { label: "Próximos", href: "/parent/schedule", icon: <ClipboardList className="w-5 h-5" /> },
    ];
  }

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-50",
      "bg-white border-t border-border",
      "pb-safe-bottom bottom-nav"
    )}>
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 min-w-[64px] rounded-lg transition-colors",
                isActive
                  ? "text-accent"
                  : "text-text-muted hover:text-text-secondary"
              )}
            >
              <div className="relative">
                {item.icon}
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent rounded-full" />
                )}
              </div>
              <span className={cn(
                "text-xs font-medium",
                isActive && "font-semibold"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
