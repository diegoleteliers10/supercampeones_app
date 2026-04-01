"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Header } from "@/components/ui/header";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Avatar } from "@/components/ui/avatar";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  CancelCircleIcon,
  Delete02Icon,
  Edit02Icon,
  Shirt01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";

export default function TeamsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [form, setForm] = useState({ nombre: "", ligaId: "", categoriaId: "" });
  const [assignGrupoByTeam, setAssignGrupoByTeam] = useState<Record<string, string>>({});
  const ligas = useQuery(api.api.listLigas) || [];
  const categorias = useQuery(api.api.listCategorias, {}) || [];
  const grupos = useQuery(api.api.listGrupos, {}) || [];
  const equipos = useQuery(api.api.listEquipos, selectedCategory ? { categoriaId: selectedCategory as any } : {}) || [];
  const createEquipo = useMutation(api.api.createEquipo);
  const assignEquipoToGrupo = useMutation(api.api.assignEquipoToGrupo);
  const allGrupos = useQuery(api.api.listGrupos, {}) || [];
  const getGrupoById = (id: string) => allGrupos.find((g: any) => g._id === id);
  const handleCreate = async () => {
    if (!form.nombre || !form.categoriaId) return;
    await createEquipo({
      nombre: form.nombre,
      categoriaId: form.categoriaId as any,
    });
    setShowForm(false);
    setForm({ nombre: "", ligaId: "", categoriaId: "" });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header title="Equipos" subtitle={`${equipos.length} equipos`} />

      <div className="p-4 space-y-4">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/[0.10] via-primary/[0.06] to-white shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary/80">
              Gestión de planteles
            </p>
            <h2 className="text-xl font-bold text-slate-900 mt-1">Equipos</h2>
            <p className="text-sm text-slate-600 mt-1">
              Crea equipos y organízalos por categoría y grupo.
            </p>
          </CardContent>
        </Card>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 px-1">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              !selectedCategory
                ? "bg-primary text-primary-foreground"
                : "bg-white text-slate-700 border border-primary/20 hover:bg-primary/5"
            }`}
          >
            Todas
          </button>
          {categorias.map((cat: any) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat._id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat._id
                  ? "bg-primary text-primary-foreground"
                  : "bg-white text-slate-700 border border-primary/20 hover:bg-primary/5"
              }`}
            >
              {cat.nombre}
            </button>
          ))}
        </div>

        {/* Add Team Button */}
        <Button onClick={() => setShowForm(true)} className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
          <HugeiconsIcon icon={Add01Icon} className="w-5 h-5" />
          Nuevo Equipo
        </Button>

        {/* New Team Form */}
        {showForm && (
          <Card className="border-primary/20 bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <h3 className="font-semibold text-slate-900">Nuevo Equipo</h3>
              <Button variant="ghost" size="sm" className="text-slate-500 hover:text-primary hover:bg-primary/10" onClick={() => setShowForm(false)}>
                <HugeiconsIcon icon={CancelCircleIcon} className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input label="Nombre del Equipo" placeholder="Los Tigres" value={form.nombre} onChange={(e) => setForm((prev) => ({ ...prev, nombre: e.target.value }))} />
              <div className="grid grid-cols-2 gap-3">
                <Select 
                  label="Liga"
                  options={ligas.map((l: any) => ({ value: l._id, label: l.nombre }))}
                  value={form.ligaId}
                  onChange={(value) => setForm((prev) => ({ ...prev, ligaId: value, categoriaId: "" }))}
                />
                <Select 
                  label="Categoría" 
                  options={categorias.filter((c: any) => !form.ligaId || c.ligaId === form.ligaId).map((c: any) => ({ value: c._id, label: c.nombre }))}
                  value={form.categoriaId}
                  onChange={(value) => setForm((prev) => ({ ...prev, categoriaId: value }))} 
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1 border-primary/25 text-primary hover:bg-primary/10">
                Cancelar
              </Button>
              <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleCreate}>
                Crear
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Teams List */}
        <div className="space-y-3">
          {equipos.map((team: any) => (
            <Card key={team._id} hover className="border-primary/15 bg-white shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar 
                    name={team.nombre}
                    size="lg"
                    className="text-white"
                    style={{ backgroundColor: "#F59E0B" }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-text-primary truncate">{team.nombre}</h3>
                    {editingTeamId === team._id && (
                      <p className="text-sm text-text-muted">
                        Grupo {team.grupoId ? getGrupoById(team.grupoId)?.nombre || "-" : "Sin grupo"}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-500 hover:text-primary hover:bg-primary/10"
                      onClick={() =>
                        setEditingTeamId((prev) => (prev === team._id ? null : team._id))
                      }
                    >
                      <HugeiconsIcon icon={Edit02Icon} className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-error hover:text-error hover:bg-error/10">
                      <HugeiconsIcon icon={Delete02Icon} className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {editingTeamId === team._id && (
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-2">
                    <HugeiconsIcon icon={Shirt01Icon} className="w-4 h-4 text-slate-500" />
                    <span className="text-xs text-slate-500">
                      Plantilla conectada a Convex
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1">
                      <Select
                        options={grupos
                          .filter((g: any) => g.categoriaId === team.categoriaId)
                          .map((g: any) => ({ value: g._id, label: g.nombre }))}
                        placeholder="Asignar grupo"
                        value={assignGrupoByTeam[team._id] || ""}
                        onChange={(value) => setAssignGrupoByTeam((prev) => ({ ...prev, [team._id]: value }))}
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-primary/25 text-primary hover:bg-primary/10"
                      onClick={async () => {
                        const grupoId = assignGrupoByTeam[team._id];
                        if (!grupoId) return;
                        await assignEquipoToGrupo({ equipoId: team._id, grupoId: grupoId as any });
                      }}
                    >
                      Asignar
                    </Button>
                  </div>
                </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {equipos.length === 0 && (
          <Card className="border-primary/15 bg-white shadow-sm">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <HugeiconsIcon icon={UserGroupIcon} className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">No hay equipos</h3>
              <p className="text-sm text-slate-600 mb-4">
                Crea el primer equipo para esta categoría
              </p>
              <Button onClick={() => setShowForm(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <HugeiconsIcon icon={Add01Icon} className="w-4 h-4" />
                Crear Equipo
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
