"use client";

import { Header } from "@/components/ui/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Calendar, Trophy, ArrowRight, Star } from "lucide-react";
import Link from "next/link";

// Demo data
const userTeam = {
  name: "Los Tigres",
  primaryColor: "#F59E0B",
  group: "1",
  category: "A",
};

const nextMatch = {
  id: "5",
  localTeam: { name: "Los Tigres", primaryColor: "#F59E0B" },
  visitorTeam: { name: "Real Niños", primaryColor: "#2563EB" },
  time: "10:00",
  field: "Campo 1",
  date: "2024-03-24",
  status: "upcoming" as const,
};

const lastResult = {
  id: "1",
  localTeam: { name: "Los Tigres", primaryColor: "#F59E0B" },
  visitorTeam: { name: "Barcelona Kids", primaryColor: "#DC2626" },
  scoreLocal: 2,
  scoreVisitor: 1,
  status: "completed" as const,
};

const leaguePosition = {
  position: 2,
  played: 5,
  won: 3,
  drawn: 1,
  lost: 1,
  points: 10,
};

export default function ParentHomePage() {
  return (
    <div className="min-h-screen bg-bg-secondary">
      <Header 
        title="Hola, Juan!" 
        subtitle="Bienvenido a LigaKids"
        user={{ name: "Juan Pérez" }}
      />

      <div className="p-4 space-y-6">
        {/* My Team Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Avatar 
                name={userTeam.name}
                size="lg"
                className="text-white"
                style={{ backgroundColor: userTeam.primaryColor }}
              />
              <div>
                <h2 className="font-bold text-text-primary">{userTeam.name}</h2>
                <p className="text-sm text-text-muted">
                  Grupo {userTeam.group} • Categoría {userTeam.category}
                </p>
              </div>
              <Badge variant="completed" className="ml-auto">
                #{leaguePosition.position}
              </Badge>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-border">
              <div className="text-center">
                <p className="text-xl font-bold font-mono text-text-primary">{leaguePosition.played}</p>
                <p className="text-xs text-text-muted">PJ</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold font-mono text-success">{leaguePosition.won}</p>
                <p className="text-xs text-text-muted">PG</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold font-mono text-warning">{leaguePosition.drawn}</p>
                <p className="text-xs text-text-muted">PE</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold font-mono text-error">{leaguePosition.lost}</p>
                <p className="text-xs text-text-muted">PP</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Match */}
        <div>
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
            Próximo Partido
          </h2>
          <Link href="/parent/schedule">
            <Card hover>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="upcoming">Domingo 24 Mar</Badge>
                  <span className="text-sm font-medium text-text-secondary">
                    {nextMatch.time}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1 text-center">
                    <Avatar 
                      name={nextMatch.localTeam.name}
                      size="md"
                      className="mx-auto mb-2 text-white"
                      style={{ backgroundColor: nextMatch.localTeam.primaryColor }}
                    />
                    <p className="font-semibold text-text-primary text-sm">
                      {nextMatch.localTeam.name}
                    </p>
                  </div>

                  <div className="px-6">
                    <span className="text-2xl text-text-muted font-light">vs</span>
                  </div>

                  <div className="flex-1 text-center">
                    <Avatar 
                      name={nextMatch.visitorTeam.name}
                      size="md"
                      className="mx-auto mb-2 text-white"
                      style={{ backgroundColor: nextMatch.visitorTeam.primaryColor }}
                    />
                    <p className="font-semibold text-text-primary text-sm">
                      {nextMatch.visitorTeam.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <span className="text-xs text-text-muted">{nextMatch.field}</span>
                  <ArrowRight className="w-4 h-4 text-accent" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Last Result */}
        <div>
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
            Último Resultado
          </h2>
          <Link href="/parent/results">
            <Card hover>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="completed">Finalizado</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Avatar 
                        name={lastResult.localTeam.name}
                        size="sm"
                        className="text-white"
                        style={{ backgroundColor: lastResult.localTeam.primaryColor }}
                      />
                      <span className="font-semibold text-text-primary text-sm">
                        {lastResult.localTeam.name}
                      </span>
                    </div>
                  </div>

                  <div className="px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold font-mono text-success">
                        {lastResult.scoreLocal}
                      </span>
                      <span className="text-lg text-text-muted">-</span>
                      <span className="text-2xl font-bold font-mono text-text-primary">
                        {lastResult.scoreVisitor}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="font-semibold text-text-primary text-sm">
                        {lastResult.visitorTeam.name}
                      </span>
                      <Avatar 
                        name={lastResult.visitorTeam.name}
                        size="sm"
                        className="text-white"
                        style={{ backgroundColor: lastResult.visitorTeam.primaryColor }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
            Acceso Rápido
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/parent/standings">
              <Card hover>
                <CardContent className="p-4 flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-semibold text-text-primary text-sm">Tabla</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/parent/results">
              <Card hover>
                <CardContent className="p-4 flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <p className="font-semibold text-text-primary text-sm">Resultados</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
