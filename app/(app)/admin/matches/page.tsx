"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Header } from "@/components/ui/header";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MatchCard } from "@/components/ui/match-card";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Calendar01Icon, CancelCircleIcon } from "@hugeicons/core-free-icons";

export default function MatchesPage() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    ligaId: "",
    categoriaId: "",
    equipoLocalId: "",
    equipoVisitanteId: "",
    planilleroId: "",
    fecha: "",
    ubicacion: "",
  });
  const ligas = useQuery(api.api.listLigas) || [];
  const categorias = useQuery(api.api.listCategorias, form.ligaId ? { ligaId: form.ligaId as any } : {}) || [];
  const equipos = useQuery(api.api.listEquipos, form.categoriaId ? { categoriaId: form.categoriaId as any } : {}) || [];
  const partidos = useQuery(api.api.listPartidos, {}) || [];
  const planilleros = useQuery(api.api.listPlanilleros) || [];
  const createPartido = useMutation(api.api.createPartido);

  const getEquipoById = (id: string) => equipos.find((e: any) => e._id === id);
  const statusFromEstado = (estado: string) => estado === "en_curso" ? "live" : estado === "finalizado" ? "completed" : "upcoming";
  const handleCreate = async () => {
    if (!form.categoriaId || !form.equipoLocalId || !form.equipoVisitanteId || !form.fecha || !form.ubicacion) return;
    await createPartido({
      categoriaId: form.categoriaId as any,
      equipoLocalId: form.equipoLocalId as any,
      equipoVisitanteId: form.equipoVisitanteId as any,
      planilleroId: (form.planilleroId || undefined) as any,
      fecha: new Date(form.fecha).getTime(),
      ubicacion: form.ubicacion,
    });
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-bg-secondary">
      <Header title="Partidos" subtitle="Programación de fechas" />

      <div className="p-4 space-y-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent-light flex items-center justify-center">
                <HugeiconsIcon icon={Calendar01Icon} className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="font-semibold text-text-primary">Partidos Registrados</p>
                <p className="text-sm text-text-muted">
                  {partidos.length} en total
                </p>
              </div>
            </div>
            <Badge variant={partidos.length > 0 ? "completed" : "upcoming"}>
              {partidos.length} partidos
            </Badge>
          </CardContent>
        </Card>

        <Button onClick={() => setShowForm(true)} size="lg">
          <HugeiconsIcon icon={Add01Icon} className="w-5 h-5" />
        </Button>

        {/* Add Match Form */}
        {showForm && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h3 className="font-semibold text-text-primary">Nuevo Partido</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                <HugeiconsIcon icon={CancelCircleIcon} className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select 
                label="Liga"
                options={ligas.map((l: any) => ({ value: l._id, label: l.nombre }))}
                value={form.ligaId}
                onChange={(e) => setForm((prev) => ({ ...prev, ligaId: e.target.value as any, categoriaId: "", equipoLocalId: "", equipoVisitanteId: "" }))}
              />
              <Select 
                label="Categoría"
                options={categorias.map((c: any) => ({ value: c._id, label: c.nombre }))}
                value={form.categoriaId}
                onChange={(e) => setForm((prev) => ({ ...prev, categoriaId: e.target.value as any, equipoLocalId: "", equipoVisitanteId: "" }))}
              />
              <Select 
                label="Equipo Local" 
                options={equipos.map((e: any) => ({ value: e._id, label: e.nombre }))}
                value={form.equipoLocalId}
                onChange={(e) => setForm((prev) => ({ ...prev, equipoLocalId: e.target.value as any }))}
              />
              <Select 
                label="Equipo Visitante" 
                options={equipos
                  .filter((e: any) => e._id !== form.equipoLocalId)
                  .map((e: any) => ({ value: e._id, label: e.nombre }))}
                value={form.equipoVisitanteId}
                onChange={(e) => setForm((prev) => ({ ...prev, equipoVisitanteId: e.target.value as any }))}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Fecha y hora" type="datetime-local" value={form.fecha} onChange={(e) => setForm((prev) => ({ ...prev, fecha: e.target.value }))} />
                <Input label="Campo" placeholder="Campo 1" value={form.ubicacion} onChange={(e) => setForm((prev) => ({ ...prev, ubicacion: e.target.value }))} />
              </div>
              <Select
                label="Planillero"
                options={planilleros.map((p: any) => ({ value: p._id, label: p.nombre }))}
                value={form.planilleroId}
                onChange={(e) => setForm((prev) => ({ ...prev, planilleroId: e.target.value }))}
              />
            </CardContent>
            <CardFooter>
              <Button variant="secondary" onClick={() => setShowForm(false)} className="flex-1">
                Cancelar
              </Button>
              <Button className="flex-1" onClick={handleCreate}>
                Crear Partido
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Matches List */}
        <div className="space-y-3">
          {partidos.map((match: any) => (
            <MatchCard
              key={match._id}
              localTeam={{ name: getEquipoById(match.equipoLocalId)?.nombre || "Local" }}
              visitorTeam={{ name: getEquipoById(match.equipoVisitanteId)?.nombre || "Visita" }}
              scoreLocal={match.golesLocal ?? 0}
              scoreVisitor={match.golesVisitante ?? 0}
              status={statusFromEstado(match.estado)}
              time={new Date(match.fecha).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              field={match.ubicacion}
              onClick={() => {}}
            />
          ))}
        </div>

        {/* Empty State */}
        {partidos.length === 0 && !showForm && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-bg-tertiary flex items-center justify-center">
                <HugeiconsIcon icon={Calendar01Icon} className="w-8 h-8 text-text-muted" />
              </div>
              <h3 className="font-semibold text-text-primary mb-1">Sin partidos</h3>
              <p className="text-sm text-text-muted mb-4">
                Esta fecha aún no tiene partidos programados
              </p>
              <Button onClick={() => setShowForm(true)}>
                <HugeiconsIcon icon={Add01Icon} className="w-4 h-4" />
                Agregar Partido
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
