"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Header } from "@/components/ui/header";
import { Card, CardContent } from "@/components/ui/card";
import { MatchCard } from "@/components/ui/match-card";
import { HugeiconsIcon } from "@hugeicons/react";
import { TransactionHistoryIcon } from "@hugeicons/core-free-icons";

export default function ScorerHistoryPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("Planillero");
  useEffect(() => {
    setUserEmail(localStorage.getItem("userEmail"));
    setUserName(localStorage.getItem("userName") || "Planillero");
  }, []);
  const currentUser = useQuery(api.api.getUsuarioByEmail, userEmail ? { email: userEmail } : "skip");
  const partidos = useQuery(
    api.api.listPartidos,
    currentUser?._id ? { planilleroId: currentUser._id as any } : {}
  ) || [];
  const equipos = useQuery(api.api.listEquipos, {}) || [];

  const getEquipoById = (id: string) => equipos.find((e: any) => e._id === id);
  const toStatus = (estado: string) =>
    estado === "en_curso" ? "live" : estado === "finalizado" ? "completed" : "upcoming";
  const getTime = (fecha?: number) =>
    fecha ? new Date(fecha).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : undefined;

  const completedMatches = partidos.filter((m: any) => m.estado === "finalizado");
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      localStorage.removeItem("userRole");
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");
      window.location.href = "/login";
    }
  };

  return (
    <div className="min-h-screen bg-bg-secondary">
      <Header
        title="Historial"
        subtitle="Partidos finalizados"
        user={{ name: userName, email: userEmail || undefined, role: "scorer" }}
        onLogout={handleLogout}
      />

      <div className="p-4 space-y-3">
        {completedMatches.length > 0 ? (
          completedMatches.map((match: any) => {
            const local = getEquipoById(match.equipoLocalId);
            const visitante = getEquipoById(match.equipoVisitanteId);
            return (
              <MatchCard
                key={match._id}
                className="mx-auto w-full max-w-[calc(100dvw-2rem)]"
                localTeam={{ name: local?.nombre || "Equipo local" }}
                visitorTeam={{ name: visitante?.nombre || "Equipo visita" }}
                scoreLocal={match.golesLocal ?? 0}
                scoreVisitor={match.golesVisitante ?? 0}
                status={toStatus(match.estado)}
                time={getTime(match.fecha)}
                field={match.ubicacion}
              />
            );
          })
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <HugeiconsIcon icon={TransactionHistoryIcon} className="w-8 h-8 mx-auto mb-2 text-text-muted" />
              <p className="text-sm text-text-muted">No hay partidos completados</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
