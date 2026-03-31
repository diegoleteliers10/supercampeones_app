"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LogIn, User, Shield, Clipboard, Users } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Demo login - in production this would use Convex Auth
    setTimeout(() => {
      if (email && password) {
        // Store role for demo purposes
        const role = email.includes("admin") ? "admin" : email.includes("scorer") ? "scorer" : "parent";
        localStorage.setItem("userRole", role);
        localStorage.setItem("userName", email.split("@")[0]);
        router.push("/" + role);
      } else {
        setError("Por favor ingresa email y contraseña");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-bg-secondary flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="w-20 h-20 rounded-2xl bg-accent mx-auto mb-4 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-12 h-12 text-white" fill="currentColor">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 2C12 2 14 6 14 12C14 18 12 22 12 22" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M2 12C2 12 6 14 12 14C18 14 22 12 22 12" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <circle cx="12" cy="12" r="3" fill="currentColor" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-text-primary">LigaKids</h1>
        <p className="text-sm text-text-muted">Gestión de ligas infantiles</p>
      </div>

      {/* Login Form */}
      <Card className="w-full max-w-sm">
        <CardHeader>
          <h2 className="text-lg font-semibold text-text-primary text-center">
            Iniciar Sesión
          </h2>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-error/10 text-error text-sm rounded-lg">
                {error}
              </div>
            )}
            <Input
              label="Email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" size="lg" loading={loading}>
              <LogIn className="w-5 h-5" />
              Entrar
            </Button>
            <p className="text-sm text-text-muted text-center">
              ¿No tienes cuenta?{" "}
              <Link href="/register" className="text-accent font-medium hover:underline">
                Regístrate
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>

      {/* Demo Roles */}
      <Card className="w-full max-w-sm mt-6">
        <CardContent className="p-4">
          <p className="text-xs text-text-muted text-center mb-3">
            Demo: usa cualquier email para entrar como:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => { setEmail("admin@test.com"); setPassword("123"); }}
              className="flex flex-col items-center gap-1 p-3 rounded-lg bg-bg-tertiary hover:bg-bg-secondary transition-colors"
            >
              <Shield className="w-5 h-5 text-accent" />
              <span className="text-xs font-medium">Admin</span>
            </button>
            <button
              onClick={() => { setEmail("scorer@test.com"); setPassword("123"); }}
              className="flex flex-col items-center gap-1 p-3 rounded-lg bg-bg-tertiary hover:bg-bg-secondary transition-colors"
            >
              <Clipboard className="w-5 h-5 text-success" />
              <span className="text-xs font-medium">Scorer</span>
            </button>
            <button
              onClick={() => { setEmail("parent@test.com"); setPassword("123"); }}
              className="flex flex-col items-center gap-1 p-3 rounded-lg bg-bg-tertiary hover:bg-bg-secondary transition-colors"
            >
              <Users className="w-5 h-5 text-warning" />
              <span className="text-xs font-medium">Padre</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
