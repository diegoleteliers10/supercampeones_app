"use client";

import * as React from "react";
import { Avatar as AvatarPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function Avatar({
  className,
  size = "default",
  name,
  src,
  style,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & {
  size?: "default" | "sm" | "lg" | "xl";
  name?: string;
  src?: string;
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(
        "group/avatar relative flex shrink-0 rounded-full select-none overflow-hidden bg-muted after:absolute after:inset-0 after:rounded-full after:border after:border-border/50 after:transition-shadow",
        "data-[size=xl]:size-16 data-[size=lg]:size-12 data-[size=default]:size-10 data-[size=sm]:size-8",
        "hover:ring-2 hover:ring-primary/30 hover:ring-offset-2 hover:ring-offset-background",
        className,
      )}
      style={style}
      {...props}
    >
      {src && (
        <AvatarPrimitive.Image
          data-slot="avatar-image"
          src={src}
          alt={name}
          className={cn(
            "aspect-square size-full rounded-full object-cover transition-transform group-hover/avatar:scale-105",
          )}
        />
      )}
      <AvatarPrimitive.Fallback
        data-slot="avatar-fallback"
        className={cn(
          "flex size-full items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/5 text-foreground font-medium",
          "data-[size=xl]:text-lg data-[size=lg]:text-base data-[size=default]:text-sm data-[size=sm]:text-xs",
        )}
      >
        {name ? getInitials(name) : null}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(
        "aspect-square size-full rounded-full object-cover transition-transform group-hover/avatar:scale-105",
        className,
      )}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/5 text-foreground font-medium",
        "data-[size=xl]:text-lg data-[size=lg]:text-base data-[size=default]:text-sm data-[size=sm]:text-xs",
        className,
      )}
      {...props}
    />
  );
}

function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-success text-success-foreground ring-2 ring-background shadow-sm",
        "data-[size=xl]:size-5 data-[size=lg]:size-4 data-[size=default]:size-3 data-[size=sm]:size-2.5",
        className,
      )}
      {...props}
    />
  );
}

function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background *:data-[slot=avatar]:hover:ring-primary/30 *:data-[slot=avatar]:hover:z-10",
        className,
      )}
      {...props}
    />
  );
}

function AvatarGroupCount({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "relative flex size-10 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground ring-2 ring-background",
        className,
      )}
      {...props}
    />
  );
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge,
};
