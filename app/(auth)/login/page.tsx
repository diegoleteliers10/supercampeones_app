"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HugeiconsIcon } from "@hugeicons/react";
import { ClipboardIcon, Login01Icon, Shield01Icon } from "@hugeicons/core-free-icons";

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
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        setError(data.message || "No se pudo iniciar sesión");
        return;
      }

      localStorage.setItem("userRole", data.user.rol);
      localStorage.setItem("userName", data.user.nombre);
      localStorage.setItem("userEmail", data.user.email);
      router.push(data.redirectTo || "/");
    } catch {
      setError("No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role: string) => {
    const demoEmails: Record<string, string> = {
      admin: "admin@ligakids.cl",
      scorer: "planillero@ligakids.cl",
    };
    setEmail(demoEmails[role] || "");
    setPassword("demo123");
  };

  return (
    <div className="min-h-screen bg-muted/50 flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="w-20 h-20 rounded-2xl bg-primary mx-auto mb-4 flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            className="w-12 h-12 text-primary-foreground"
            fill="currentColor"
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M12 2C12 2 14 6 14 12C14 18 12 22 12 22"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M2 12C2 12 6 14 12 14C18 14 22 12 22 12"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
            <circle cx="12" cy="12" r="3" fill="currentColor" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold">LigaKids</h1>
        <p className="text-sm text-muted-foreground">
          Gestión de ligas infantiles
        </p>
      </div>

      {/* Login Form */}
      <Card className="w-full max-w-sm">
        <CardHeader>
          <h2 className="text-lg font-semibold text-center">Iniciar Sesión</h2>
          <p className="text-xs text-muted-foreground text-center">
            Accede como administrador o planillero
          </p>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              <HugeiconsIcon icon={Login01Icon} className="w-5 h-5 mr-2" />
              {loading ? "Entrando..." : "Entrar"}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              ¿No tienes cuenta?{" "}
              <Link
                href="/register"
                className="text-primary font-medium hover:underline"
              >
                Regístrate
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>

      {/* Demo Roles */}
      <Card className="w-full max-w-sm mt-6">
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground text-center mb-3">
            Demo: selecciona un rol para ingresar
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex flex-col items-center gap-1 h-auto py-4"
              onClick={() => handleDemoLogin("admin")}
            >
              <HugeiconsIcon icon={Shield01Icon} className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">Administrador</span>
              <span className="text-xs text-muted-foreground">
                Gestionar liga
              </span>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex flex-col items-center gap-1 h-auto py-4"
              onClick={() => handleDemoLogin("scorer")}
            >
              <HugeiconsIcon icon={ClipboardIcon} className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">Planillero</span>
              <span className="text-xs text-muted-foreground">
                Registrar goles
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Back to home */}
      <Link
        href="/"
        className="mt-6 text-sm text-muted-foreground hover:text-primary"
      >
        ← Ver como padre/espectador
      </Link>
    </div>
  );
}
