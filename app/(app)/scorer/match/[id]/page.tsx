"use client";

import { useState, use } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Header } from "@/components/ui/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Plus, Play, Square, Flag } from "lucide-react";

export default function MatchDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const match = useQuery(api.api.getPartido, { partidoId: params.id as any });
  const equipos = useQuery(api.api.listEquipos, {}) || [];
  const events = useQuery(api.api.listEventosPartido, { partidoId: params.id as any }) || [];
  const updatePartidoEstado = useMutation(api.api.updatePartidoEstado);
  const addGol = useMutation(api.api.addGol);
  const [goalForm, setGoalForm] = useState({ playerName: "", minute: "" });

  if (!match) {
    return (
      <div className="min-h-screen bg-bg-secondary p-4">
        <Card><CardContent className="p-6 text-center">Cargando partido...</CardContent></Card>
      </div>
    );
  }

  const localTeam = equipos.find((e: any) => e._id === match.equipoLocalId);
  const visitorTeam = equipos.find((e: any) => e._id === match.equipoVisitanteId);
  const isMatchActive = match.estado === "en_curso";
  const isMatchCompleted = match.estado === "finalizado";
  const localGoals = events.filter((e: any) => e.equipoId === match.equipoLocalId).length;
  const visitorGoals = events.filter((e: any) => e.equipoId === match.equipoVisitanteId).length;

  const syncScore = async (estado: "programado" | "en_curso" | "finalizado") => {
    await updatePartidoEstado({
      partidoId: params.id as any,
      estado,
      golesLocal: localGoals,
      golesVisitante: visitorGoals,
    });
  };

  return (
    <div className="min-h-screen bg-bg-secondary">
      <Header 
        title={`Partido ${match.ubicacion}`}
        subtitle={new Date(match.fecha).toLocaleString()}
      />

      <div className="p-4 space-y-4">
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant={match.estado === "en_curso" ? "live" : match.estado === "finalizado" ? "completed" : "upcoming"}>
                {match.estado === "en_curso" ? "En Vivo" : match.estado === "finalizado" ? "Finalizado" : "Programado"}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1 text-center">
                <Avatar name={localTeam?.nombre || "Local"} size="lg" className="mx-auto mb-2 text-white" style={{ backgroundColor: "#F59E0B" }} />
                <p className="font-semibold text-text-primary text-sm">{localTeam?.nombre || "Local"}</p>
              </div>
              <div className="px-4 text-center">
                <span className="text-4xl font-bold font-mono">{localGoals}</span>
                <span className="text-2xl text-text-muted mx-1">-</span>
                <span className="text-4xl font-bold font-mono">{visitorGoals}</span>
              </div>
              <div className="flex-1 text-center">
                <Avatar name={visitorTeam?.nombre || "Visita"} size="lg" className="mx-auto mb-2 text-white" style={{ backgroundColor: "#2563EB" }} />
                <p className="font-semibold text-text-primary text-sm">{visitorTeam?.nombre || "Visita"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {!isMatchActive && !isMatchCompleted && (
          <Button onClick={() => syncScore("en_curso")} size="lg" className="w-full">
            <Play className="w-5 h-5" />
            Iniciar Partido
          </Button>
        )}

        {isMatchActive && (
          <Button onClick={() => syncScore("finalizado")} variant="secondary" size="lg" className="w-full">
            <Square className="w-5 h-5" />
            Finalizar Partido
          </Button>
        )}

        {isMatchActive && (
          <Card>
            <CardContent className="p-4 space-y-3">
              <h2 className="font-semibold text-text-primary flex items-center gap-2">
                <Flag className="w-5 h-5 text-accent" />
                Registrar Gol
              </h2>
              <Input
                placeholder="Nombre del jugador"
                value={goalForm.playerName}
                onChange={(e) => setGoalForm((prev) => ({ ...prev, playerName: e.target.value }))}
              />
              <Input
                placeholder="Minuto"
                type="number"
                value={goalForm.minute}
                onChange={(e) => setGoalForm((prev) => ({ ...prev, minute: e.target.value }))}
              />
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={async () => {
                    await addGol({
                      partidoId: params.id as any,
                      equipoId: match.equipoLocalId,
                      jugador: goalForm.playerName || "Sin nombre",
                      minuto: goalForm.minute ? Number(goalForm.minute) : undefined,
                    });
                    await syncScore("en_curso");
                    setGoalForm({ playerName: "", minute: "" });
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Gol Local
                </Button>
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={async () => {
                    await addGol({
                      partidoId: params.id as any,
                      equipoId: match.equipoVisitanteId,
                      jugador: goalForm.playerName || "Sin nombre",
                      minuto: goalForm.minute ? Number(goalForm.minute) : undefined,
                    });
                    await syncScore("en_curso");
                    setGoalForm({ playerName: "", minute: "" });
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Gol Visita
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Eventos</h3>
            <div className="space-y-2">
              {events.length === 0 && <p className="text-sm text-text-muted">Sin goles registrados</p>}
              {events.map((event: any) => (
                <div key={event._id} className="text-sm flex justify-between">
                  <span>{event.jugador}</span>
                  <span className="font-mono text-text-muted">{event.minuto ?? "-"}'</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
