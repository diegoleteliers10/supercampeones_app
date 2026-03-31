"use client";

import { useState } from "react";
import { Header } from "@/components/ui/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { MatchCard } from "@/components/ui/match-card";
import { ChevronDown, ChevronUp, Flag } from "lucide-react";

const results = [
  {
    id: "1",
    round: "Fecha 1",
    date: "2024-03-17",
    matches: [
      {
        id: "1",
        localTeam: { name: "Los Tigres", primaryColor: "#F59E0B" },
        visitorTeam: { name: "Real Niños", primaryColor: "#2563EB" },
        scoreLocal: 2,
        scoreVisitor: 1,
        status: "completed" as const,
        time: "10:00",
        field: "Campo 1",
        goals: [
          { team: "local", player: "Carlos García", minute: 15 },
          { team: "local", player: "Miguel Rodríguez", minute: 32 },
          { team: "visitor", player: "Sergio Jiménez", minute: 45 },
        ],
        fairplay: [{ team: "visitor", note: "Juego limpio" }],
      },
      {
        id: "2",
        localTeam: { name: "Atlético Chiquito", primaryColor: "#10B981" },
        visitorTeam: { name: "Barcelona Kids", primaryColor: "#DC2626" },
        scoreLocal: 0,
        scoreVisitor: 2,
        status: "completed" as const,
        time: "11:00",
        field: "Campo 2",
        goals: [
          { team: "visitor", player: "Jorge López", minute: 20 },
          { team: "visitor", player: "Raúl González", minute: 38 },
        ],
        fairplay: [],
      },
    ],
  },
  {
    id: "2",
    round: "Fecha 2",
    date: "2024-03-24",
    matches: [
      {
        id: "3",
        localTeam: { name: "PSG Junior", primaryColor: "#7C3AED" },
        visitorTeam: { name: "Milan Infantiles", primaryColor: "#EA580C" },
        scoreLocal: 1,
        scoreVisitor: 1,
        status: "completed" as const,
        time: "10:00",
        field: "Campo 1",
        goals: [
          { team: "local", player: "Pablo Torres", minute: 10 },
          { team: "visitor", player: "Antonio Ruiz", minute: 25 },
        ],
        fairplay: [{ team: "local", note: "Buen trato al rival" }],
      },
    ],
  },
];

export default function ResultsPage() {
  const [expandedRounds, setExpandedRounds] = useState<string[]>(["1"]);

  const toggleRound = (roundId: string) => {
    setExpandedRounds(prev =>
      prev.includes(roundId)
        ? prev.filter(id => id !== roundId)
        : [...prev, roundId]
    );
  };

  return (
    <div className="min-h-screen bg-bg-secondary">
      <Header title="Resultados" subtitle="Todas las fechas" />

      <div className="p-4 space-y-4">
        {results.map((round) => {
          const isExpanded = expandedRounds.includes(round.id);
          
          return (
            <div key={round.id}>
              {/* Round Header */}
              <button
                onClick={() => toggleRound(round.id)}
                className="w-full flex items-center justify-between p-3 bg-white border border-border rounded-xl mb-2"
              >
                <div className="flex items-center gap-3">
                  <Badge variant="completed">{round.round}</Badge>
                  <span className="text-sm text-text-muted">
                    {new Date(round.date).toLocaleDateString("es-CL", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-text-muted" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-text-muted" />
                )}
              </button>

              {/* Matches */}
              {isExpanded && (
                <div className="space-y-3">
                  {round.matches.map((match) => (
                    <Card key={match.id}>
                      <CardContent className="p-4">
                        {/* Teams and Score */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 flex-1">
                            <Avatar
                              name={match.localTeam.name}
                              size="sm"
                              className="text-white"
                              style={{ backgroundColor: match.localTeam.primaryColor }}
                            />
                            <span className="font-medium text-text-primary text-sm">
                              {match.localTeam.name}
                            </span>
                          </div>
                          <div className="px-3 flex items-center gap-2">
                            <span className={`font-bold font-mono ${
                              match.scoreLocal > match.scoreVisitor ? "text-success" : "text-text-primary"
                            }`}>
                              {match.scoreLocal}
                            </span>
                            <span className="text-text-muted">-</span>
                            <span className={`font-bold font-mono ${
                              match.scoreVisitor > match.scoreLocal ? "text-success" : "text-text-primary"
                            }`}>
                              {match.scoreVisitor}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 flex-1 justify-end">
                            <span className="font-medium text-text-primary text-sm">
                              {match.visitorTeam.name}
                            </span>
                            <Avatar
                              name={match.visitorTeam.name}
                              size="sm"
                              className="text-white"
                              style={{ backgroundColor: match.visitorTeam.primaryColor }}
                            />
                          </div>
                        </div>

                        {/* Goals */}
                        {match.goals.length > 0 && (
                          <div className="pt-3 border-t border-border">
                            <div className="flex items-center gap-1 mb-2">
                              <Flag className="w-3 h-3 text-accent" />
                              <span className="text-xs font-medium text-text-muted uppercase">
                                Goles
                              </span>
                            </div>
                            <div className="space-y-1">
                              {match.goals.map((goal, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between text-sm"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className={`font-medium ${
                                      goal.team === "local" ? "text-text-primary" : "text-text-secondary"
                                    }`}>
                                      {goal.player}
                                    </span>
                                  </div>
                                  <span className="font-mono text-xs text-accent">
                                    {goal.minute}'
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Fairplay */}
                        {match.fairplay.length > 0 && (
                          <div className="pt-3 mt-3 border-t border-border">
                            <div className="flex items-center gap-1 mb-2">
                              <span className="text-xs font-medium text-fairplay uppercase">
                                Fairplay
                              </span>
                            </div>
                            {match.fairplay.map((fp, idx) => (
                              <div key={idx} className="text-sm text-text-secondary">
                                {fp.team === "local" ? match.localTeam.name : match.visitorTeam.name}
                                {fp.note && <span className="text-text-muted"> - {fp.note}</span>}
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {results.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Flag className="w-12 h-12 mx-auto mb-3 text-text-muted" />
              <h3 className="font-semibold text-text-primary mb-1">Sin resultados</h3>
              <p className="text-sm text-text-muted">
                Aún no hay partidos completados
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
