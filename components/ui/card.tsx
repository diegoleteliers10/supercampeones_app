import * as React from "react";

import { cn } from "@/lib/utils";

function Card({
  className,
  size = "default",
  hover = true,
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm"; hover?: boolean }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      data-hover={hover}
      className={cn(
        "group/card flex flex-col gap-4 overflow-hidden rounded-xl bg-card py-4 text-sm text-card-foreground shadow-sm ring-1 ring-border/50 transition-shadow duration-200",
        hover && "hover:shadow-md hover:ring-primary/20 cursor-pointer",
        "data-[size=sm]:gap-3 data-[size=sm]:py-3",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "flex flex-col gap-1 px-4",
        "group-data-[size=sm]/card:px-3",
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-semibold text-base leading-tight text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-xs text-muted-foreground leading-relaxed", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("ml-auto flex items-center gap-1", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        "px-4 space-y-3",
        "group-data-[size=sm]/card:px-3",
        className,
      )}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center gap-2 px-4 pt-2 border-t border-border/50",
        "group-data-[size=sm]/card:px-3 group-data-[size=sm]/card:pt-1.5",
        className,
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
