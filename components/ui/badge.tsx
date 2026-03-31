"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  variant?: "upcoming" | "live" | "completed" | "blocked" | "fairplay";
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = "upcoming", children, className }: BadgeProps) {
  const variants = {
    upcoming: "bg-gray-100 text-gray-600",
    live: "bg-green-100 text-green-700",
    completed: "bg-blue-100 text-blue-700",
    blocked: "bg-red-100 text-red-700",
    fairplay: "bg-purple-100 text-purple-700",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
