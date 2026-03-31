"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  variant?: "upcoming" | "live" | "completed" | "blocked" | "fairplay";
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}

export function Badge({ variant = "upcoming", children, className, onClick, selected }: BadgeProps) {
  const variants = {
    upcoming: "bg-gray-100 text-gray-600 border border-gray-200",
    live: "bg-green-100 text-green-700 border border-green-200",
    completed: "bg-blue-100 text-blue-700 border border-blue-200",
    blocked: "bg-red-100 text-red-700 border border-red-200",
    fairplay: "bg-purple-100 text-purple-700 border border-purple-200",
  };

  const selectedStyles = selected
    ? "bg-accent text-white border-accent shadow-sm"
    : "";

  return (
    <span
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center whitespace-nowrap px-2.5 py-1 rounded-full text-xs font-medium leading-none transition-all",
        variants[variant],
        onClick ? "cursor-pointer hover:opacity-90 active:scale-95" : "",
        selectedStyles,
        className
      )}
    >
      {children}
    </span>
  );
}
