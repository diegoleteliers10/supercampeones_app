"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { LogIn, User, Shield, Clipboard, Users } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("parent");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const roleOptions = [
    { value: "parent", label: "Padre/Tutor" },
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

    // Demo registration - in production this would use Convex Auth
    setTimeout(() => {
      localStorage.setItem("userRole", role);
      localStorage.setItem("userName", name);
      router.push("/" + role);
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
            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              label="Confirmar contraseña"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Select
              label="Rol"
              options={roleOptions}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
            
            {/* Role Info */}
            <div className="p-3 bg-bg-tertiary rounded-lg">
              {role === "parent" && (
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">Rol: Padre/Tutor</p>
                    <p className="text-xs text-text-muted">
                      Podrás ver la tabla de posiciones, resultados y próximos partidos de tu equipo.
                    </p>
                  </div>
                </div>
              )}
              {role === "scorer" && (
                <div className="flex items-start gap-3">
                  <Clipboard className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
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
              <LogIn className="w-5 h-5" />
              Crear Cuenta
            </Button>
            <p className="text-sm text-text-muted text-center">
              ¿Ya tienes cuenta?{" "}
              <Link href="/login" className="text-accent font-medium hover:underline">
                Inicia sesión
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
