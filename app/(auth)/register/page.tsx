"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ClipboardIcon,
  EyeIcon,
  Login01Icon,
  Shield01Icon,
  ViewOffIcon,
} from "@hugeicons/core-free-icons";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState("admin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const roleOptions = [
    { value: "admin", label: "Administrador" },
    { value: "scorer", label: "Planillero" },
  ];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          nombre: name,
          rol: role,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        setError(data.message || "No se pudo registrar");
        return;
      }

      localStorage.setItem("userRole", data.user.rol);
      localStorage.setItem("userName", data.user.nombre);
      localStorage.setItem("userEmail", data.user.email);
      router.push(data.redirectTo || "/");
    } catch {
      setError("No se pudo registrar");
    } finally {
      setLoading(false);
    }
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

      {/* Register Form */}
      <Card className="w-full max-w-sm">
        <CardHeader>
          <h2 className="text-lg font-semibold text-text-primary text-center">
            Crear Cuenta
          </h2>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-error/10 text-error text-sm rounded-lg">
                {error}
              </div>
            )}
            <Input
              label="Nombre completo"
              type="text"
              placeholder="Juan Pérez"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="relative">
              <Input
                label="Contraseña"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                className="absolute right-2.5 top-[2.6rem] -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-md text-text-muted hover:text-text-secondary"
              >
                {showPassword ? <HugeiconsIcon icon={ViewOffIcon} className="w-5 h-5" /> : <HugeiconsIcon icon={EyeIcon} className="w-5 h-5" />}
              </button>
            </div>

            <div className="relative">
              <Input
                label="Confirmar contraseña"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pr-11"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                className="absolute right-2.5 top-[2.6rem] -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-md text-text-muted hover:text-text-secondary"
              >
                {showConfirmPassword ? <HugeiconsIcon icon={ViewOffIcon} className="w-5 h-5" /> : <HugeiconsIcon icon={EyeIcon} className="w-5 h-5" />}
              </button>
            </div>
            <Select
              label="Rol"
              options={roleOptions}
              value={role}
              onChange={(value) => setRole(value)}
            />
            
            {/* Role Info */}
            <div className="p-3 bg-bg-tertiary rounded-lg">
              {role === "admin" && (
                <div className="flex items-start gap-3">
                  <HugeiconsIcon icon={Shield01Icon} className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">Rol: Administrador</p>
                    <p className="text-xs text-text-muted">
                      Gestionarás la liga, partidos y equipos.
                    </p>
                  </div>
                </div>
              )}
              {role === "scorer" && (
                <div className="flex items-start gap-3">
                  <HugeiconsIcon icon={ClipboardIcon} className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">Rol: Planillero</p>
                    <p className="text-xs text-text-muted">
                      Podrás gestionar partidos asignados, registrar goles y tarjetas fairplay.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" size="lg" loading={loading}>
              <HugeiconsIcon icon={Login01Icon} className="w-5 h-5" />
              Crear Cuenta
            </Button>
            <div className="w-full text-center text-sm text-text-muted">
              <span>¿Ya tienes cuenta? </span>
              <Link href="/login" className="text-accent font-medium hover:underline">
                Inicia sesión
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
