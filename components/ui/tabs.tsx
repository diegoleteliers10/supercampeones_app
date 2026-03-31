"use client";

import { cn } from "@/lib/utils";
import { createContext, useContext } from "react";

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

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function Tabs({ value, onValueChange, children, className }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={className} data-value={value}>
        {children}
      </div>
    </TabsContext.Provider>
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
  const tabsContext = useContext(TabsContext);
  const isActive = tabsContext?.value === value;

  return (
    <button
      type="button"
      role="tab"
      data-state={isActive ? "active" : "inactive"}
      aria-selected={isActive}
      onClick={() => tabsContext?.onValueChange(value)}
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
