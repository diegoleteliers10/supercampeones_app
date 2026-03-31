"use client";

import { useState } from "react";
import { Header } from "@/components/ui/header";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, Trophy, ChevronRight } from "lucide-react";
import Link from "next/link";

// Demo data
const leagues = [
  { id: "1", name: "Liga Infantil A", category: "A", season: "2024-1", teamCount: 8 },
  { id: "2", name: "Liga Infantil B", category: "B", season: "2024-1", teamCount: 8 },
];

export default function LeaguePage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-bg-secondary">
      <Header title="Liga" subtitle="Gestionar temporadas" />

      <div className="p-4 space-y-4">
        {/* Add League Button */}
        <Button onClick={() => setShowForm(!showForm)} className="w-full" size="lg">
          <Plus className="w-5 h-5" />
          Nueva Liga
        </Button>

        {/* New League Form */}
        {showForm && (
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-text-primary">Crear Nueva Liga</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input label="Nombre de la Liga" placeholder="Liga Infantil A" />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Categoría" placeholder="A" />
                <Input label="Temporada" placeholder="2024-1" />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" onClick={() => setShowForm(false)} className="flex-1">
                Cancelar
              </Button>
              <Button className="flex-1">
                Crear
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* League List */}
        <div className="space-y-3">
          {leagues.map((league) => (
            <Card key={league.id} hover>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary">{league.name}</h3>
                      <p className="text-sm text-text-muted">
                        Categoría {league.category} • {league.teamCount} equipos
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-text-muted" />
                </div>
                
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                  <Badge variant="completed">{league.season}</Badge>
                  <Link href={`/admin/league/${league.id}`} className="ml-auto">
                    <Button variant="ghost" size="sm">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="text-error hover:text-error hover:bg-error/10">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {leagues.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-bg-tertiary flex items-center justify-center">
                <Trophy className="w-8 h-8 text-text-muted" />
              </div>
              <h3 className="font-semibold text-text-primary mb-1">No hay ligas</h3>
              <p className="text-sm text-text-muted mb-4">
                Crea tu primera liga para comenzar a gestionar torneos
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4" />
                Crear Liga
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
