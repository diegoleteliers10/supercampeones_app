"use client";

import { cn, getInitials } from "@/lib/utils";

interface AvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  style?: React.CSSProperties;
}

export function Avatar({ name, src, size = "md", className, style }: AvatarProps) {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn(
          "rounded-full object-cover",
          sizes[size],
          className
        )}
        style={style}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full bg-accent-light text-accent flex items-center justify-center font-semibold",
        sizes[size],
        className
      )}
      style={style}
    >
      {getInitials(name)}
    </div>
  );
}
