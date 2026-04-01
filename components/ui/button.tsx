import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md border border-transparent text-xs/relaxed font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:border-ring active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary - Main actions, highest visual weight
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:shadow-md",
        // Destructive - Dangerous actions
        destructive:
          "bg-error text-error-foreground shadow-sm hover:bg-error/90 active:shadow-md",
        // Secondary - Less prominent actions
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70",
        // Outline - Neutral actions that need visibility
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground active:bg-muted/80",
        // Ghost - Subtle actions, minimal visual weight
        ghost: "hover:bg-muted hover:text-foreground active:bg-muted/50",
        // Link - For inline text actions
        link: "text-primary underline-offset-4 hover:underline",
        // Success - Positive confirmation actions
        success:
          "bg-success text-success-foreground shadow-sm hover:bg-success/90 active:shadow-md",
        // Warning - Caution actions
        warning:
          "bg-warning text-warning-foreground shadow-sm hover:bg-warning/90 active:shadow-md",
      },
      size: {
        default: "h-8 px-3 py-1.5",
        xs: "h-6 rounded-sm px-2 text-[0.625rem]",
        sm: "h-7 px-2.5 py-1 text-xs",
        lg: "h-10 px-4 py-2 text-sm",
        xl: "h-11 px-5 py-2.5 text-sm",
        icon: "size-8",
        "icon-xs": "size-6 rounded-sm",
        "icon-sm": "size-7",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";
  const isDisabled = disabled || loading;

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      disabled={isDisabled}
      className={cn(
        buttonVariants({ variant, size, className }),
        loading && "cursor-wait",
      )}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </Comp>
  );
}

export { Button, buttonVariants };
