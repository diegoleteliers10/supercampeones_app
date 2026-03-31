"use client";

import { cn } from "@/lib/utils";
import { forwardRef, SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  placeholder?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, placeholder, options, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              "w-full h-11 px-3 pr-10 rounded-lg border bg-white text-text-primary appearance-none cursor-pointer",
              "transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent",
              error ? "border-error focus:ring-error" : "border-border",
              "disabled:bg-bg-tertiary disabled:cursor-not-allowed",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" />
        </div>
        {error && (
          <p className="mt-1 text-sm text-error">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
