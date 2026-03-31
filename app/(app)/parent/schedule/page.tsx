"use client";

import { useState } from "react";
import { Header } from "@/components/ui/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Calendar, Clock, MapPin } from "lucide-react";

const categories = [
  { value: "A", label: "Categoría A" },
  { value: "B", label: "Categoría B" },
  { value: "C", label: "Categoría C" },
];

const upcomingMatches = [
  {
    id: "1",
    round: "Fecha 3",
    date: "2024-03-31",
    matches: [
      {
        id: "5",
        localTeam: { name: "Los Tigres", primaryColor: "#F59E0B" },
        visitorTeam: { name: "Real Niños", primaryColor: "#2563EB" },
        time: "10:00",
        field: "Campo 1",
      },
      {
        id: "6",
        localTeam: { name: "Atlético Chiquito", primaryColor: "#10B981" },
        visitorTeam: { name: "Barcelona Kids", primaryColor: "#DC2626" },
        time: "11:00",
        field: "Campo 2",
      },
    ],
  },
  {
    id: "2",
    round: "Fecha 4",
    date: "2024-04-07",
    matches: [
      {
        id: "7",
        localTeam: { name: "PSG Junior", primaryColor: "#7C3AED" },
        visitorTeam: { name: "Los Tigres", primaryColor: "#F59E0B" },
        time: "10:00",
        field: "Campo 1",
      },
      {
        id: "8",
        localTeam: { name: "Milan Infantiles", primaryColor: "#EA580C" },
        visitorTeam: { name: "Bayern Chiquitos", primaryColor: "#DC2626" },
        time: "11:00",
        field: "Campo 2",
      },
    ],
  },
  {
    id: "3",
    round: "Fecha 5",
    date: "2024-04-14",
    matches: [
      {
        id: "9",
        localTeam: { name: "Real Niños", primaryColor: "#2563EB" },
        visitorTeam: { name: "Liverpool Jr", primaryColor: "#DC2626" },
        time: "10:00",
        field: "Campo 1",
      },
    ],
  },
];

export default function SchedulePage() {
  const [selectedCategory, setSelectedCategory] = useState("A");

  return (
    <div className="min-h-screen bg-bg-secondary">
      <Header title="Próximos Partidos" subtitle="Agenda completa" />

      <div className="p-4 space-y-4">
        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.value
                  ? "bg-accent text-white"
                  : "bg-white text-text-secondary border border-border hover:bg-bg-secondary"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Schedule */}
        <div className="space-y-4">
          {upcomingMatches.map((round) => (
            <div key={round.id}>
              {/* Round Header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-text-primary">{round.round}</p>
                  <p className="text-sm text-text-muted">
                    {new Date(round.date).toLocaleDateString("es-CL", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </p>
                </div>
              </div>

              {/* Matches */}
              <div className="space-y-3 pl-0 md:pl-13">
                {round.matches.map((match) => (
                  <Card key={match.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        {/* Local Team */}
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

                        {/* Time and Field */}
                        <div className="px-4 text-center">
                          <div className="flex items-center gap-1 text-sm">
                            <Clock className="w-4 h-4 text-accent" />
                            <span className="font-semibold text-text-primary">
                              {match.time}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-text-muted mt-1">
                            <MapPin className="w-3 h-3" />
                            {match.field}
                          </div>
                        </div>

                        {/* Visitor Team */}
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
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {upcomingMatches.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-text-muted" />
              <h3 className="font-semibold text-text-primary mb-1">Sin partidos programados</h3>
              <p className="text-sm text-text-muted">
                No hay partidos programados para esta categoría
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
