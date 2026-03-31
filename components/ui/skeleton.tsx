"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("skeleton rounded-lg", className)} />
  );
}

export function MatchCardSkeleton() {
  return (
    <div className="bg-white border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-4 w-12" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-full" />
          <Skeleton className="h-5 w-24" />
        </div>
        <Skeleton className="h-8 w-16" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="w-12 h-12 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 py-3 px-4 border-b border-border">
      <Skeleton className="h-5 w-6" />
      <Skeleton className="w-8 h-8 rounded-full" />
      <Skeleton className="h-5 w-32 flex-1" />
      <Skeleton className="h-5 w-8" />
      <Skeleton className="h-5 w-8" />
      <Skeleton className="h-5 w-8" />
      <Skeleton className="h-5 w-8" />
      <Skeleton className="h-5 w-10" />
    </div>
  );
}
