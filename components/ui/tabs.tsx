"use client";

import { cn } from "@/lib/utils";

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

function Tabs({ value, onValueChange, children, className }: TabsProps) {
  return (
    <div className={className} data-value={value}>
      {children}
    </div>
  );
}

function TabsList({ children, className }: TabsListProps) {
  return (
    <div className={cn(
      "flex items-center gap-1 p-1 bg-bg-tertiary rounded-xl",
      className
    )}>
      {children}
    </div>
  );
}

function TabsTrigger({ value, children, className }: TabsTriggerProps) {
  // Note: In a real implementation, this would use context
  // For now, we'll use a simple class-based approach
  return (
    <button
      type="button"
      role="tab"
      data-state="active"
      className={cn(
        "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
        "data-[state=active]:bg-white data-[state=active]:text-text-primary data-[state=active]:shadow-sm",
        "data-[state=inactive]:text-text-muted hover:text-text-secondary",
        className
      )}
    >
      {children}
    </button>
  );
}

export { Tabs, TabsList, TabsTrigger };
