"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Header } from "@/components/ui/header";
import { Card, CardContent } from "@/components/ui/card";
import { MatchCard } from "@/components/ui/match-card";
import { ClipboardList, Clock } from "lucide-react";
import Link from "next/link";

export default function ScorerPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  useEffect(() => {
    setUserEmail(localStorage.getItem("userEmail"));
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

  const liveMatches = partidos.filter((m: any) => m.estado === "en_curso");
  const upcomingMatches = partidos.filter((m: any) => m.estado === "programado");

  return (
    <div className="min-h-screen bg-bg-secondary">
      <Header title="Mis Partidos" subtitle="Planillero" />

      <div className="p-4 space-y-4">
        {/* En vivo + Próximos (navegación por barra inferior: Partidos) */}
        <div>
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            En Vivo
          </h2>
          {liveMatches.length > 0 ? (
            <div className="space-y-3">
              {liveMatches.map((match: any) => {
                const local = getEquipoById(match.equipoLocalId);
                const visitante = getEquipoById(match.equipoVisitanteId);
                return (
                  <Link key={match._id} href={`/scorer/match/${match._id}`} className="block w-full">
                    <MatchCard
                      className="mx-auto w-full max-w-[calc(100dvw-2rem)]"
                      localTeam={{ name: local?.nombre || "Equipo local" }}
                      visitorTeam={{ name: visitante?.nombre || "Equipo visita" }}
                      scoreLocal={match.golesLocal ?? 0}
                      scoreVisitor={match.golesVisitante ?? 0}
                      status={toStatus(match.estado)}
                      time={getTime(match.fecha)}
                      field={match.ubicacion}
                    />
                  </Link>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="w-8 h-8 mx-auto mb-2 text-text-muted" />
                <p className="text-sm text-text-muted">No hay partidos en vivo</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
            Próximos Partidos
          </h2>
          {upcomingMatches.length > 0 ? (
            <div className="space-y-3">
              {upcomingMatches.map((match: any) => {
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
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <ClipboardList className="w-8 h-8 mx-auto mb-2 text-text-muted" />
                <p className="text-sm text-text-muted">No hay partidos próximos asignados</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
