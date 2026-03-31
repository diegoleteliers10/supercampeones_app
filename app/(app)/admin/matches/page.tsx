"use client";

import { useState } from "react";
import { Header } from "@/components/ui/header";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MatchCard } from "@/components/ui/match-card";
import { Plus, Calendar, Filter, X } from "lucide-react";

const rounds = [
  { id: "1", number: 1, date: "2024-03-17", matchCount: 4 },
  { id: "2", number: 2, date: "2024-03-24", matchCount: 4 },
  { id: "3", number: 3, date: "2024-03-31", matchCount: 4 },
];

const matchesByRound: Record<string, any[]> = {
  "1": [
    {
      id: "1",
      localTeam: { name: "Los Tigres", primaryColor: "#F59E0B" },
      visitorTeam: { name: "Real Niños", primaryColor: "#2563EB" },
      scoreLocal: 2,
      scoreVisitor: 1,
      status: "completed" as const,
      time: "10:00",
      field: "Campo 1",
    },
    {
      id: "2",
      localTeam: { name: "Atlético Chiquito", primaryColor: "#10B981" },
      visitorTeam: { name: "Barcelona Kids", primaryColor: "#DC2626" },
      status: "live" as const,
      time: "11:00",
      field: "Campo 2",
    },
  ],
  "2": [
    {
      id: "3",
      localTeam: { name: "PSG Junior", primaryColor: "#7C3AED" },
      visitorTeam: { name: "Milan Infantiles", primaryColor: "#EA580C" },
      status: "upcoming" as const,
      time: "10:00",
      field: "Campo 1",
    },
    {
      id: "4",
      localTeam: { name: "Bayern Chiquitos", primaryColor: "#DC2626" },
      visitorTeam: { name: "City Kids", primaryColor: "#60A5FA" },
      status: "upcoming" as const,
      time: "11:00",
      field: "Campo 2",
    },
  ],
  "3": [],
};

export default function MatchesPage() {
  const [selectedRound, setSelectedRound] = useState(rounds[0].id);
  const [showForm, setShowForm] = useState(false);

  const currentRound = rounds.find(r => r.id === selectedRound);
  const matches = matchesByRound[selectedRound] || [];

  const roundOptions = rounds.map(r => ({
    value: r.id,
    label: `Fecha ${r.number} - ${new Date(r.date).toLocaleDateString("es-CL", { day: "numeric", month: "short" })}`,
  }));

  return (
    <div className="min-h-screen bg-bg-secondary">
      <Header title="Partidos" subtitle="Programación de fechas" />

      <div className="p-4 space-y-4">
        {/* Round Selector */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Select
              options={roundOptions}
              value={selectedRound}
              onChange={(e) => setSelectedRound(e.target.value)}
            />
          </div>
          <Button onClick={() => setShowForm(true)} size="lg">
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        {/* Round Info */}
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent-light flex items-center justify-center">
                <Calendar className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="font-semibold text-text-primary">Fecha {currentRound?.number}</p>
                <p className="text-sm text-text-muted">
                  {currentRound && new Date(currentRound.date).toLocaleDateString("es-CL", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </p>
              </div>
            </div>
            <Badge variant={matches.length > 0 ? "completed" : "upcoming"}>
              {matches.length} partidos
            </Badge>
          </CardContent>
        </Card>

        {/* Add Match Form */}
        {showForm && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h3 className="font-semibold text-text-primary">Nuevo Partido</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select 
                label="Equipo Local" 
                options={[
                  { value: "1", label: "Los Tigres" },
                  { value: "2", label: "Real Niños" },
                  { value: "3", label: "Atlético Chiquito" },
                ]}
                value=""
                onChange={() => {}}
              />
              <Select 
                label="Equipo Visitante" 
                options={[
                  { value: "1", label: "Los Tigres" },
                  { value: "2", label: "Real Niños" },
                  { value: "3", label: "Atlético Chiquito" },
                ]}
                value=""
                onChange={() => {}}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Hora" type="time" defaultValue="10:00" />
                <Input label="Campo" placeholder="Campo 1" />
              </div>
              <Select 
                label="Planillero" 
                options={[
                  { value: "1", label: "Juan Pérez" },
                  { value: "2", label: "María García" },
                ]}
                value=""
                onChange={() => {}}
              />
            </CardContent>
            <CardFooter>
              <Button variant="secondary" onClick={() => setShowForm(false)} className="flex-1">
                Cancelar
              </Button>
              <Button className="flex-1">
                Crear Partido
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Matches List */}
        <div className="space-y-3">
          {matches.map((match) => (
            <MatchCard
              key={match.id}
              localTeam={match.localTeam}
              visitorTeam={match.visitorTeam}
              scoreLocal={match.scoreLocal}
              scoreVisitor={match.scoreVisitor}
              status={match.status}
              time={match.time}
              field={match.field}
              onClick={() => {}}
            />
          ))}
        </div>

        {/* Empty State */}
        {matches.length === 0 && !showForm && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-bg-tertiary flex items-center justify-center">
                <Calendar className="w-8 h-8 text-text-muted" />
              </div>
              <h3 className="font-semibold text-text-primary mb-1">Sin partidos</h3>
              <p className="text-sm text-text-muted mb-4">
                Esta fecha aún no tiene partidos programados
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4" />
                Agregar Partido
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
