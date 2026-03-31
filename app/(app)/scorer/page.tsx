"use client";

import { useState } from "react";
import { Header } from "@/components/ui/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MatchCard } from "@/components/ui/match-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardList, Play, History, Clock } from "lucide-react";
import Link from "next/link";

// Demo data
const assignedMatches = [
  {
    id: "1",
    localTeam: { name: "Atlético Chiquito", primaryColor: "#10B981" },
    visitorTeam: { name: "Barcelona Kids", primaryColor: "#DC2626" },
    scoreLocal: 0,
    scoreVisitor: 0,
    status: "live" as const,
    time: "11:00",
    field: "Campo 2",
    roundNumber: 2,
  },
  {
    id: "2",
    localTeam: { name: "PSG Junior", primaryColor: "#7C3AED" },
    visitorTeam: { name: "Milan Infantiles", primaryColor: "#EA580C" },
    status: "upcoming" as const,
    time: "12:00",
    field: "Campo 1",
    roundNumber: 2,
  },
];

const completedMatches = [
  {
    id: "3",
    localTeam: { name: "Los Tigres", primaryColor: "#F59E0B" },
    visitorTeam: { name: "Real Niños", primaryColor: "#2563EB" },
    scoreLocal: 2,
    scoreVisitor: 1,
    status: "completed" as const,
    time: "10:00",
    field: "Campo 1",
    roundNumber: 1,
  },
  {
    id: "4",
    localTeam: { name: "Bayern Chiquitos", primaryColor: "#DC2626" },
    visitorTeam: { name: "City Kids", primaryColor: "#60A5FA" },
    scoreLocal: 3,
    scoreVisitor: 3,
    status: "completed" as const,
    time: "11:00",
    field: "Campo 2",
    roundNumber: 1,
  },
];

export default function ScorerPage() {
  const [activeTab, setActiveTab] = useState<"assigned" | "history">("assigned");

  return (
    <div className="min-h-screen bg-bg-secondary">
      <Header title="Mis Partidos" subtitle="Planillero" />

      <div className="p-4 space-y-4">
        {/* Tab Switcher */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="assigned" className="flex gap-2">
              <Play className="w-4 h-4" />
              En curso
            </TabsTrigger>
            <TabsTrigger value="history" className="flex gap-2">
              <History className="w-4 h-4" />
              Historial
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Assigned Matches (Live + Upcoming) */}
        {activeTab === "assigned" && (
          <div className="space-y-4">
            {/* Live Matches */}
            <div>
              <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                En Vivo
              </h2>
              {assignedMatches.filter(m => m.status === "live").length > 0 ? (
                <div className="space-y-3">
                  {assignedMatches
                    .filter(m => m.status === "live")
                    .map((match) => (
                      <Link key={match.id} href={`/scorer/match/${match.id}`}>
                        <MatchCard
                          localTeam={match.localTeam}
                          visitorTeam={match.visitorTeam}
                          scoreLocal={match.scoreLocal}
                          scoreVisitor={match.scoreVisitor}
                          status={match.status}
                          time={match.time}
                          field={match.field}
                        />
                      </Link>
                    ))}
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

            {/* Upcoming Matches */}
            <div>
              <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
                Próximos Partidos
              </h2>
              {assignedMatches.filter(m => m.status === "upcoming").length > 0 ? (
                <div className="space-y-3">
                  {assignedMatches
                    .filter(m => m.status === "upcoming")
                    .map((match) => (
                      <MatchCard
                        key={match.id}
                        localTeam={match.localTeam}
                        visitorTeam={match.visitorTeam}
                        scoreLocal={match.scoreLocal}
                        scoreVisitor={match.scoreVisitor}
                        status={match.status}
                        time={match.time}
                        field={match.field}
                      />
                    ))}
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
        )}

        {/* Completed Matches History */}
        {activeTab === "history" && (
          <div className="space-y-3">
            {completedMatches.length > 0 ? (
              completedMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  localTeam={match.localTeam}
                  visitorTeam={match.visitorTeam}
                  scoreLocal={match.scoreLocal}
                  scoreVisitor={match.scoreVisitor}
                  status={match.status}
                  time={match.time}
                  field={match.field}
                />
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <History className="w-8 h-8 mx-auto mb-2 text-text-muted" />
                  <p className="text-sm text-text-muted">No hay partidos completados</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
