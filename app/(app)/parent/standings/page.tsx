"use client";

import { useState } from "react";
import { Header } from "@/components/ui/header";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Trophy, Star } from "lucide-react";

const categories = [
  { value: "A", label: "Categoría A" },
  { value: "B", label: "Categoría B" },
  { value: "C", label: "Categoría C" },
];

const groups = [
  { value: "1", label: "Grupo 1" },
  { value: "2", label: "Grupo 2" },
];

// Demo standings data
const standingsData: Record<string, Record<string, any[]>> = {
  A: {
    "1": [
      { position: 1, team: { name: "Los Tigres", primaryColor: "#F59E0B" }, played: 5, won: 4, drawn: 1, lost: 0, goalsFor: 12, goalsAgainst: 4, goalDifference: 8, points: 13 },
      { position: 2, team: { name: "Real Niños", primaryColor: "#2563EB" }, played: 5, won: 3, drawn: 1, lost: 1, goalsFor: 8, goalsAgainst: 5, goalDifference: 3, points: 10 },
      { position: 3, team: { name: "Atlético Chiquito", primaryColor: "#10B981" }, played: 5, won: 2, drawn: 2, lost: 1, goalsFor: 6, goalsAgainst: 5, goalDifference: 1, points: 8 },
      { position: 4, team: { name: "Barcelona Kids", primaryColor: "#DC2626" }, played: 5, won: 1, drawn: 2, lost: 2, goalsFor: 5, goalsAgainst: 7, goalDifference: -2, points: 5 },
      { position: 5, team: { name: "PSG Junior", primaryColor: "#7C3AED" }, played: 5, won: 1, drawn: 1, lost: 3, goalsFor: 4, goalsAgainst: 8, goalDifference: -4, points: 4 },
      { position: 6, team: { name: "Milan Infantiles", primaryColor: "#EA580C" }, played: 5, won: 0, drawn: 1, lost: 4, goalsFor: 2, goalsAgainst: 8, goalDifference: -6, points: 1 },
    ],
    "2": [
      { position: 1, team: { name: "Bayern Chiquitos", primaryColor: "#DC2626" }, played: 4, won: 3, drawn: 1, lost: 0, goalsFor: 10, goalsAgainst: 3, goalDifference: 7, points: 10 },
      { position: 2, team: { name: "City Kids", primaryColor: "#60A5FA" }, played: 4, won: 2, drawn: 2, lost: 0, goalsFor: 7, goalsAgainst: 4, goalDifference: 3, points: 8 },
      { position: 3, team: { name: "Juve Chiquitos", primaryColor: "#1F2937" }, played: 4, won: 1, drawn: 1, lost: 2, goalsFor: 4, goalsAgainst: 6, goalDifference: -2, points: 4 },
      { position: 4, team: { name: "Liverpool Jr", primaryColor: "#DC2626" }, played: 4, won: 0, drawn: 0, lost: 4, goalsFor: 2, goalsAgainst: 10, goalDifference: -8, points: 0 },
    ],
  },
  B: {
    "1": [
      { position: 1, team: { name: "Arsenal Youth", primaryColor: "#EF4444" }, played: 3, won: 3, drawn: 0, lost: 0, goalsFor: 9, goalsAgainst: 1, goalDifference: 8, points: 9 },
      { position: 2, team: { name: "Chelsea Kids", primaryColor: "#2563EB" }, played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 5, goalsAgainst: 3, goalDifference: 2, points: 6 },
      { position: 3, team: { name: "Man United Jr", primaryColor: "#DC2626" }, played: 3, won: 1, drawn: 0, lost: 2, goalsFor: 3, goalsAgainst: 6, goalDifference: -3, points: 3 },
      { position: 4, team: { name: "Tottenham Pupi", primaryColor: "#FFFFFF" }, played: 3, won: 0, drawn: 0, lost: 3, goalsFor: 1, goalsAgainst: 8, goalDifference: -7, points: 0 },
    ],
    "2": [],
  },
  C: {
    "1": [],
    "2": [],
  },
};

export default function StandingsPage() {
  const [selectedCategory, setSelectedCategory] = useState("A");
  const [selectedGroup, setSelectedGroup] = useState("1");

  const standings = standingsData[selectedCategory]?.[selectedGroup] || [];

  return (
    <div className="min-h-screen bg-bg-secondary">
      <Header title="Tabla de Posiciones" subtitle="LigaKids 2024-1" />

      <div className="p-4 space-y-4">
        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => {
                setSelectedCategory(cat.value);
                setSelectedGroup("1");
              }}
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

        {/* Group Filter */}
        <div className="flex gap-2">
          {groups.map((grp) => {
            const hasData = standingsData[selectedCategory]?.[grp.value]?.length > 0;
            return (
              <button
                key={grp.value}
                onClick={() => setSelectedGroup(grp.value)}
                disabled={!hasData}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedGroup === grp.value
                    ? "bg-accent-light text-accent border border-accent"
                    : "bg-white text-text-secondary border border-border hover:bg-bg-secondary disabled:opacity-50"
                }`}
              >
                {grp.label}
              </button>
            );
          })}
        </div>

        {/* Standings Table */}
        {standings.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-bg-tertiary text-xs font-medium text-text-muted uppercase tracking-wide border-b border-border">
                <div className="col-span-1">#</div>
                <div className="col-span-5">Equipo</div>
                <div className="col-span-1 text-center">PJ</div>
                <div className="col-span-1 text-center">PG</div>
                <div className="col-span-1 text-center">PE</div>
                <div className="col-span-1 text-center">PP</div>
                <div className="col-span-2 text-right">Pts</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-border">
                {standings.map((row, index) => (
                  <div
                    key={row.team.name}
                    className={`grid grid-cols-12 gap-2 px-4 py-3 items-center ${
                      index === 0 ? "bg-accent-subtle" : ""
                    }`}
                  >
                    {/* Position */}
                    <div className="col-span-1">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        row.position === 1
                          ? "bg-warning text-white"
                          : row.position <= 2
                          ? "bg-text-muted text-white"
                          : "bg-bg-tertiary text-text-secondary"
                      }`}>
                        {row.position}
                      </div>
                    </div>

                    {/* Team */}
                    <div className="col-span-5 flex items-center gap-2">
                      <Avatar
                        name={row.team.name}
                        size="sm"
                        className="text-white"
                        style={{ backgroundColor: row.team.primaryColor }}
                      />
                      <span className="font-medium text-text-primary text-sm truncate">
                        {row.team.name}
                      </span>
                      {row.position === 1 && (
                        <Trophy className="w-4 h-4 text-warning flex-shrink-0" />
                      )}
                    </div>

                    {/* Stats */}
                    <div className="col-span-1 text-center text-sm font-mono text-text-secondary">
                      {row.played}
                    </div>
                    <div className="col-span-1 text-center text-sm font-mono text-success">
                      {row.won}
                    </div>
                    <div className="col-span-1 text-center text-sm font-mono text-warning">
                      {row.drawn}
                    </div>
                    <div className="col-span-1 text-center text-sm font-mono text-error">
                      {row.lost}
                    </div>

                    {/* Points */}
                    <div className="col-span-2 text-right">
                      <span className={`text-base font-bold font-mono ${
                        row.position === 1 ? "text-accent" : "text-text-primary"
                      }`}>
                        {row.points}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Trophy className="w-12 h-12 mx-auto mb-3 text-text-muted" />
              <h3 className="font-semibold text-text-primary mb-1">Sin datos</h3>
              <p className="text-sm text-text-muted">
                No hay equipos registrados en {categories.find(c => c.value === selectedCategory)?.label} {groups.find(g => g.value === selectedGroup)?.label}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 text-xs text-text-muted">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-warning" />
            <span>1° Lugar</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full bg-accent-light border border-accent" />
            <span>Zona de playoffs</span>
          </div>
        </div>
      </div>
    </div>
  );
}
