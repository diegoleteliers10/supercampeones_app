"use client";

import { BottomNav } from "@/components/ui/bottom-nav";

export default function ScorerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg-secondary pb-20">
      <main className="min-h-screen">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
