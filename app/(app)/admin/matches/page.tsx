"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Header } from "@/components/ui/header";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MatchCard } from "@/components/ui/match-card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Calendar01Icon,
  CancelCircleIcon,
  Edit02Icon,
} from "@hugeicons/core-free-icons";

export default function MatchesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);
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
  const allCategorias = useQuery(api.api.listCategorias, {}) || [];
  const categorias = allCategorias.filter(
    (c: any) => !form.ligaId || c.ligaId === form.ligaId,
  );
  const allEquipos = useQuery(api.api.listEquipos, {}) || [];
  const equipos = allEquipos.filter(
    (e: any) => !form.categoriaId || e.categoriaId === form.categoriaId,
  );
  const partidos = useQuery(api.api.listPartidos, {}) || [];
  const planilleros = useQuery(api.api.listPlanilleros) || [];
  const createPartido = useMutation(api.api.createPartido);
  const updatePartido = useMutation(api.api.updatePartido);

  const getEquipoById = (id: string) =>
    allEquipos.find((e: any) => e._id === id);
  const statusFromEstado = (estado: string) =>
    estado === "en_curso"
      ? "live"
      : estado === "finalizado"
        ? "completed"
        : "upcoming";
  const formatDateTimeLocal = (timestamp: number) => {
    const date = new Date(timestamp);
    const tzOffsetMs = date.getTimezoneOffset() * 60 * 1000;
    const localDate = new Date(date.getTime() - tzOffsetMs);
    return localDate.toISOString().slice(0, 16);
  };

  const resetForm = () => {
    setForm({
      ligaId: "",
      categoriaId: "",
      equipoLocalId: "",
      equipoVisitanteId: "",
      planilleroId: "",
      fecha: "",
      ubicacion: "",
    });
  };

  const openCreateForm = () => {
    setEditingMatchId(null);
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (match: any) => {
    const categoria = allCategorias.find((c: any) => c._id === match.categoriaId);
    setEditingMatchId(match._id);
    setForm({
      ligaId: categoria?.ligaId || "",
      categoriaId: match.categoriaId || "",
      equipoLocalId: match.equipoLocalId || "",
      equipoVisitanteId: match.equipoVisitanteId || "",
      planilleroId: match.planilleroId || "",
      fecha: formatDateTimeLocal(match.fecha),
      ubicacion: match.ubicacion || "",
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingMatchId(null);
    resetForm();
  };

  const handleSubmit = async () => {
    if (
      !form.categoriaId ||
      !form.equipoLocalId ||
      !form.equipoVisitanteId ||
      !form.fecha ||
      !form.ubicacion
    )
      return;

    if (editingMatchId) {
      await updatePartido({
        partidoId: editingMatchId as any,
        categoriaId: form.categoriaId as any,
        equipoLocalId: form.equipoLocalId as any,
        equipoVisitanteId: form.equipoVisitanteId as any,
        planilleroId: (form.planilleroId || undefined) as any,
        fecha: new Date(form.fecha).getTime(),
        ubicacion: form.ubicacion,
      });
    } else {
      await createPartido({
        categoriaId: form.categoriaId as any,
        equipoLocalId: form.equipoLocalId as any,
        equipoVisitanteId: form.equipoVisitanteId as any,
        planilleroId: (form.planilleroId || undefined) as any,
        fecha: new Date(form.fecha).getTime(),
        ubicacion: form.ubicacion,
      });
    }
    closeForm();
  };

  return (
    <div className="min-h-screen bg-white">
      <Header title="Partidos" subtitle="Programación de fechas" />

      <div className="p-4 space-y-4">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/[0.10] via-primary/[0.06] to-white shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary/80">
              Administración de fechas
            </p>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Control de Partidos
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Programa encuentros y asigna planilleros de forma rápida.
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/15 bg-white shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <HugeiconsIcon
                  icon={Calendar01Icon}
                  className="w-5 h-5 text-primary"
                />
              </div>
              <div>
                <p className="font-semibold text-slate-900">
                  Partidos Registrados
                </p>
                <p className="text-sm text-slate-600">
                  {partidos.length} en total
                </p>
              </div>
            </div>
            <Badge variant={partidos.length > 0 ? "completed" : "upcoming"} className="border-primary/20 bg-primary/10 text-primary">
              {partidos.length} partidos
            </Badge>
          </CardContent>
        </Card>

        <Button onClick={openCreateForm} size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
          <HugeiconsIcon icon={Add01Icon} className="w-5 h-5" />
          Nuevo Partido
        </Button>

        {/* Matches List */}
        <div className="space-y-3">
          {partidos.map((match: any) => (
            <MatchCard
              key={match._id}
              localTeam={{
                name: getEquipoById(match.equipoLocalId)?.nombre || "Local",
              }}
              visitorTeam={{
                name:
                  getEquipoById(match.equipoVisitanteId)?.nombre || "Visita",
              }}
              scoreLocal={match.golesLocal ?? 0}
              scoreVisitor={match.golesVisitante ?? 0}
              status={statusFromEstado(match.estado)}
              time={new Date(match.fecha).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
              field={match.ubicacion}
              onClick={() => {}}
              headerAction={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditForm(match);
                  }}
                  className="h-8 w-8 p-0 rounded-full border-primary/30 bg-white text-primary shadow-sm hover:bg-primary/10 hover:border-primary/50"
                  aria-label="Editar partido"
                >
                  <HugeiconsIcon icon={Edit02Icon} className="w-4 h-4" />
                </Button>
              }
            />
          ))}
        </div>

        {/* Empty State */}
        {partidos.length === 0 && !showForm && (
          <Card className="border-primary/15 bg-white shadow-sm">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <HugeiconsIcon
                  icon={Calendar01Icon}
                  className="w-8 h-8 text-primary"
                />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">
                Sin partidos
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                Esta fecha aún no tiene partidos programados
              </p>
              <Button onClick={openCreateForm} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <HugeiconsIcon icon={Add01Icon} className="w-4 h-4" />
                Agregar Partido
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create/Edit Match Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-primary/20 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-xl max-h-[90vh] overflow-y-auto border-primary/20 bg-white shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <h3 className="font-semibold text-slate-900">
                {editingMatchId ? "Editar Partido" : "Nuevo Partido"}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeForm}
                className="text-slate-500 hover:text-primary hover:bg-primary/10"
              >
                <HugeiconsIcon icon={CancelCircleIcon} className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                label="Liga"
                options={ligas.map((l: any) => ({
                  value: l._id,
                  label: l.nombre,
                }))}
                value={form.ligaId}
                onChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    ligaId: value,
                    categoriaId: "",
                    equipoLocalId: "",
                    equipoVisitanteId: "",
                  }))
                }
              />
              <Select
                label="Categoría"
                options={categorias.map((c: any) => ({
                  value: c._id,
                  label: c.nombre,
                }))}
                value={form.categoriaId}
                onChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    categoriaId: value as any,
                    equipoLocalId: "",
                    equipoVisitanteId: "",
                  }))
                }
              />
              <Select
                label="Equipo Local"
                options={equipos.map((e: any) => ({
                  value: e._id,
                  label: e.nombre,
                }))}
                value={form.equipoLocalId}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, equipoLocalId: value as any }))
                }
              />
              <Select
                label="Equipo Visitante"
                options={equipos
                  .filter((e: any) => e._id !== form.equipoLocalId)
                  .map((e: any) => ({ value: e._id, label: e.nombre }))}
                value={form.equipoVisitanteId}
                onChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    equipoVisitanteId: value as any,
                  }))
                }
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Fecha y hora"
                  type="datetime-local"
                  value={form.fecha}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, fecha: e.target.value }))
                  }
                />
                <Input
                  label="Campo"
                  placeholder="Campo 1"
                  value={form.ubicacion}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, ubicacion: e.target.value }))
                  }
                />
              </div>
              <Select
                label="Planillero"
                options={planilleros.map((p: any) => ({
                  value: p._id,
                  label: p.nombre,
                }))}
                value={form.planilleroId}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, planilleroId: value }))
                }
              />
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                onClick={closeForm}
                className="flex-1 border-primary/25 text-primary hover:bg-primary/10"
              >
                Cancelar
              </Button>
              <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleSubmit}>
                {editingMatchId ? "Guardar cambios" : "Crear Partido"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
