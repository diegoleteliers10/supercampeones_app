"use client";

import { Header } from "@/components/ui/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Trophy, Clock } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  // Demo data - in production this would come from Convex
  const stats = {
    activeLeagues: 2,
    totalTeams: 16,
    upcomingMatches: 8,
    activeMatches: 1,
  };

  const recentMatches = [
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
      scoreLocal: 0,
      scoreVisitor: 0,
      status: "live" as const,
      time: "11:00",
      field: "Campo 2",
    },
    {
      id: "3",
      localTeam: { name: "PSG Junior", primaryColor: "#7C3AED" },
      visitorTeam: { name: "Milan Infantiles", primaryColor: "#EA580C" },
      status: "upcoming" as const,
      time: "12:00",
      field: "Campo 1",
    },
  ];

  return (
    <div className="min-h-screen bg-bg-secondary">
      <Header 
        title="Dashboard" 
        subtitle="LigaKids Admin"
        user={{ name: "Admin User", email: "admin@ligakids.cl" }}
      />

      <div className="p-4 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent-light flex items-center justify-center">
                <Trophy className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-text-primary">{stats.activeLeagues}</p>
                <p className="text-xs text-text-muted">Ligas activas</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent-light flex items-center justify-center">
                <Users className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-text-primary">{stats.totalTeams}</p>
                <p className="text-xs text-text-muted">Equipos</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-text-primary">{stats.upcomingMatches}</p>
                <p className="text-xs text-text-muted">Partidos próximos</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-warning animate-pulse" />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-text-primary">{stats.activeMatches}</p>
                <p className="text-xs text-text-muted">En juego</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-bold text-text-primary mb-3">Acciones rápidas</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/admin/league" className="block">
              <Card hover>
                <CardContent className="p-4 flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-semibold text-text-primary text-sm text-center">Gestionar Liga</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/teams" className="block">
              <Card hover>
                <CardContent className="p-4 flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-semibold text-text-primary text-sm text-center">Equipos</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/matches" className="block">
              <Card hover>
                <CardContent className="p-4 flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-semibold text-text-primary text-sm text-center">Partidos</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/scorers" className="block">
              <Card hover>
                <CardContent className="p-4 flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-semibold text-text-primary text-sm text-center">Planilleros</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Recent Matches */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-text-primary">Partidos recientes</h2>
            <Link href="/admin/matches" className="text-sm text-accent font-medium hover:underline">
              Ver todos
            </Link>
          </div>
          
          <div className="space-y-3">
            {recentMatches.map((match) => (
              <Card key={match.id} hover className="cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge 
                      variant={
                        match.status === "live" ? "live" : 
                        match.status === "completed" ? "completed" : 
                        "upcoming"
                      }
                    >
                      {match.status === "live" && (
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse" />
                      )}
                      {match.status === "upcoming" ? "Próximo" : 
                       match.status === "live" ? "En Vivo" : "Finalizado"}
                    </Badge>
                    <span className="text-sm text-text-muted font-medium">{match.time}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-text-primary">{match.localTeam.name}</p>
                    </div>
                    <div className="px-4">
                      {match.status === "upcoming" ? (
                        <span className="text-xl text-text-muted">vs</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold font-mono">{match.scoreLocal}</span>
                          <span className="text-lg text-text-muted">-</span>
                          <span className="text-2xl font-bold font-mono">{match.scoreVisitor}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-right">
                      <p className="font-semibold text-text-primary">{match.visitorTeam.name}</p>
                    </div>
                  </div>

                  <p className="text-xs text-text-muted mt-2">Campo: {match.field}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
