"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For now, redirect to admin as default (demo mode)
    // In production, this would check auth status first
    const checkAuth = async () => {
      // Simulating auth check - in real app, check Convex Auth
      const userRole = localStorage.getItem("userRole") || "admin";
      
      setLoading(false);
      
      if (userRole === "admin") {
        router.replace("/admin");
      } else if (userRole === "scorer") {
        router.replace("/scorer");
      } else {
        router.replace("/parent");
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-text-secondary text-sm">Cargando...</p>
        </div>
      </div>
    );
  }

  return null;
}
