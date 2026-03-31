"use client";

import { useState } from "react";
import { Header } from "@/components/ui/header";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Plus, Edit2, Trash2, Users, X, Shirt } from "lucide-react";

// Demo data
const teams = [
  { id: "1", name: "Los Tigres", group: "1", category: "A", primaryColor: "#F59E0B", playerCount: 12 },
  { id: "2", name: "Real Niños", group: "1", category: "A", primaryColor: "#2563EB", playerCount: 10 },
  { id: "3", name: "Atlético Chiquito", group: "2", category: "A", primaryColor: "#10B981", playerCount: 11 },
  { id: "4", name: "Barcelona Kids", group: "2", category: "A", primaryColor: "#DC2626", playerCount: 9 },
];

const categories = [
  { value: "A", label: "Categoría A" },
  { value: "B", label: "Categoría B" },
  { value: "C", label: "Categoría C" },
];

const groups = [
  { value: "1", label: "Grupo 1" },
  { value: "2", label: "Grupo 2" },
  { value: "3", label: "Grupo 3" },
  { value: "4", label: "Grupo 4" },
];

export default function TeamsPage() {
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("A");

  const filteredTeams = teams.filter(t => t.category === selectedCategory);

  return (
    <div className="min-h-screen bg-bg-secondary">
      <Header title="Equipos" subtitle={`${filteredTeams.length} equipos`} />

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

        {/* Add Team Button */}
        <Button onClick={() => setShowForm(true)} className="w-full" size="lg">
          <Plus className="w-5 h-5" />
          Nuevo Equipo
        </Button>

        {/* New Team Form */}
        {showForm && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h3 className="font-semibold text-text-primary">Nuevo Equipo</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input label="Nombre del Equipo" placeholder="Los Tigres" />
              <div className="grid grid-cols-2 gap-3">
                <Select 
                  label="Categoría" 
                  options={categories} 
                  value="A"
                  onChange={() => {}} 
                />
                <Select 
                  label="Grupo" 
                  options={groups}
                  value="1"
                  onChange={() => {}} 
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Color Primario</label>
                  <input type="color" defaultValue="#F59E0B" className="w-full h-11 rounded-lg border border-border cursor-pointer" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Color Secundario</label>
                  <input type="color" defaultValue="#FFFFFF" className="w-full h-11 rounded-lg border border-border cursor-pointer" />
                </div>
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

        {/* Teams List */}
        <div className="space-y-3">
          {filteredTeams.map((team) => (
            <Card key={team.id} hover>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar 
                    name={team.name} 
                    size="lg"
                    className="text-white"
                    style={{ backgroundColor: team.primaryColor }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-text-primary truncate">{team.name}</h3>
                    <p className="text-sm text-text-muted">
                      Grupo {team.group} • {team.playerCount} jugadores
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-error hover:text-error hover:bg-error/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Players Preview */}
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Shirt className="w-4 h-4 text-text-muted" />
                    <span className="text-xs text-text-muted">
                      {team.playerCount} jugadores registrados
                    </span>
                    <Button variant="ghost" size="sm" className="ml-auto text-xs">
                      Ver roster
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredTeams.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-bg-tertiary flex items-center justify-center">
                <Users className="w-8 h-8 text-text-muted" />
              </div>
              <h3 className="font-semibold text-text-primary mb-1">No hay equipos</h3>
              <p className="text-sm text-text-muted mb-4">
                Crea el primer equipo para esta categoría
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4" />
                Crear Equipo
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
