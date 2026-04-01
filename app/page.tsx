"use client";

import { useState, Suspense } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar01Icon,
  CrownIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

// Mobile bottom tab navigation component
function MobileTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
}) {
  const tabs = [
    {
      id: "partidos",
      label: "Partidos",
      icon: <HugeiconsIcon icon={Calendar01Icon} className="w-5 h-5" />,
    },
    {
      id: "tabla",
      label: "Tabla",
      icon: <HugeiconsIcon icon={CrownIcon} className="w-5 h-5" />,
    },
    {
      id: "equipos",
      label: "Equipos",
      icon: <HugeiconsIcon icon={UserGroupIcon} className="w-5 h-5" />,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center gap-1 px-4 py-2 min-w-[80px] rounded-lg transition-all relative ${
              activeTab === tab.id
                ? "text-primary"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            {tab.icon}
            <span
              className={`text-xs font-medium ${activeTab === tab.id ? "font-semibold" : ""}`}
            >
              {tab.label}
            </span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 w-8 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// Inner component that uses useSearchParams - wrapped in Suspense
function ParentHomePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab =
    tabParam === "tabla" || tabParam === "equipos" ? tabParam : "partidos";

  const setActiveTab = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "partidos") {
      params.delete("tab");
    } else {
      params.set("tab", tab);
    }
    const query = params.toString();
    router.replace(query ? `/?${query}` : "/", { scroll: false });
  };
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Convex queries - use generated API
  const categorias = useQuery(api.api.listCategorias, {}) || [];
  const partidos = useQuery(api.api.listPartidos, {}) || [];
  const equipos = useQuery(api.api.listEquipos, {}) || [];

  const getEquipoById = (id: any) => equipos.find((e: any) => e._id === id);
  const getCategoriaById = (id: any) =>
    categorias.find((c: any) => c._id === id);

  // Tabla por categoría: mismo filtro que Partidos / Equipos
  const equiposParaTabla = selectedCategory
    ? equipos.filter((e: any) => e.categoriaId === selectedCategory)
    : equipos;

  const tabla = equiposParaTabla.map((e: any, index: number) => ({
    ...e,
    _id: e._id || index,
    posicion: index + 1,
    jugados: 0,
    ganados: 0,
    empatados: 0,
    perdidos: 0,
    puntos: 0,
    golesFavor: 0,
    golesContra: 0,
    fairPlayPoints: 0,
  }));

  return (
    <div className="min-h-screen bg-bg-secondary pb-20">
      <div className="px-4 pt-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary/90">
              Bienvenidos
            </p>
            <h2 className="text-xl font-bold text-text-primary leading-tight">
              Hola, familias
            </h2>
            <p className="text-sm text-text-muted mt-1">
              Sigue partidos, tabla y equipos en tiempo real.
            </p>
          </div>
        </div>

        <Card className="bg-gradient-to-r from-accent/[0.08] to-white border-accent/20">
          <CardContent className="p-3.5">
            <p className="text-sm font-medium text-text-primary">
              Revisa el calendario de tus hijos y no te pierdas ningún
              resultado.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Content based on active tab */}
      <div className="p-4">
        {/* PARTIDOS TAB */}
        {activeTab === "partidos" && (
          <div className="space-y-4">
            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto px-1 py-1 pb-2">
              <Badge
                variant={!selectedCategory ? "completed" : "upcoming"}
                selected={!selectedCategory}
                onClick={() => setSelectedCategory(null)}
              >
                Todos
              </Badge>
              {categorias.map((cat: any) => (
                <Badge
                  key={cat._id}
                  variant={
                    selectedCategory === cat._id ? "completed" : "upcoming"
                  }
                  selected={selectedCategory === cat._id}
                  onClick={() => setSelectedCategory(cat._id)}
                >
                  {cat.nombre}
                </Badge>
              ))}
            </div>

            {/* Matches */}
            <div>
              <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
                Próximos Partidos
              </h2>
              <div className="space-y-3">
                {partidos
                  .filter(
                    (p: any) =>
                      !selectedCategory || p.categoriaId === selectedCategory,
                  )
                  .map((partido: any) => {
                    const local = getEquipoById(partido.equipoLocalId);
                    const visitante = getEquipoById(partido.equipoVisitanteId);
                    const categoria = getCategoriaById(partido.categoriaId);
                    return (
                      <Card key={partido._id} hover>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="upcoming">
                              {categoria?.nombre || "Sin categoría"}
                            </Badge>
                            <span className="text-xs text-text-muted">
                              {new Date(partido.fecha).toLocaleDateString()} •{" "}
                              {new Date(partido.fecha).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex-1 text-center">
                              <Avatar
                                name={local?.nombre || "?"}
                                size="default"
                                className="mx-auto mb-2 text-white"
                                style={{ backgroundColor: "#888" }}
                              />
                              <p className="font-semibold text-text-primary text-sm">
                                {local?.nombre || "?"}
                              </p>
                            </div>

                            <div className="px-4">
                              <span className="text-2xl text-text-muted font-light">
                                vs
                              </span>
                            </div>

                            <div className="flex-1 text-center">
                              <Avatar
                                name={visitante?.nombre || "?"}
                                size="default"
                                className="mx-auto mb-2 text-white"
                                style={{ backgroundColor: "#888" }}
                              />
                              <p className="font-semibold text-text-primary text-sm">
                                {visitante?.nombre || "?"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-center mt-2 pt-2 border-t border-border">
                            <span className="text-xs text-text-muted">
                              {partido.ubicacion}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                {partidos.length === 0 && (
                  <p className="text-center text-text-muted py-4">
                    No hay partidos programados
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TABLA TAB */}
        {activeTab === "tabla" && (
          <div className="space-y-4">
            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto px-1 py-1 pb-2">
              <Badge
                variant={!selectedCategory ? "completed" : "upcoming"}
                selected={!selectedCategory}
                onClick={() => setSelectedCategory(null)}
              >
                Todos
              </Badge>
              {categorias.map((cat: any) => (
                <Badge
                  key={cat._id}
                  variant={
                    selectedCategory === cat._id ? "completed" : "upcoming"
                  }
                  selected={selectedCategory === cat._id}
                  onClick={() => setSelectedCategory(cat._id)}
                >
                  {cat.nombre}
                </Badge>
              ))}
            </div>

            {/* Standings Table */}
            <div>
              <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
                Tabla de Posiciones
              </h2>
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-bg-tertiary">
                        <tr>
                          <th className="text-left p-3 font-semibold text-text-muted">
                            #
                          </th>
                          <th className="text-left p-3 font-semibold text-text-muted">
                            Equipo
                          </th>
                          <th className="text-center p-3 font-semibold text-text-muted">
                            PJ
                          </th>
                          <th className="text-center p-3 font-semibold text-text-muted">
                            G
                          </th>
                          <th className="text-center p-3 font-semibold text-text-muted">
                            E
                          </th>
                          <th className="text-center p-3 font-semibold text-text-muted">
                            P
                          </th>
                          <th className="text-center p-3 font-semibold text-text-muted">
                            DG
                          </th>
                          <th className="text-center p-3 font-semibold text-text-muted">
                            TE
                          </th>
                          <th className="text-center p-3 font-semibold text-text-muted">
                            Pts
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {tabla.map((team: any) => (
                          <tr
                            key={team._id}
                            className="border-t border-border hover:bg-bg-tertiary/50"
                          >
                            <td className="p-3 font-mono font-bold text-text-primary">
                              {team.posicion}
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: "#F59E0B" }}
                                />
                                <span className="font-medium text-text-primary">
                                  {team.nombre}
                                </span>
                              </div>
                            </td>
                            <td className="p-3 text-center font-mono text-text-secondary">
                              {team.jugados}
                            </td>
                            <td className="p-3 text-center font-mono text-success">
                              {team.ganados}
                            </td>
                            <td className="p-3 text-center font-mono text-warning">
                              {team.empatados}
                            </td>
                            <td className="p-3 text-center font-mono text-error">
                              {team.perdidos}
                            </td>
                            <td className="p-3 text-center font-mono text-text-secondary">
                              {(team.golesFavor ?? 0) - (team.golesContra ?? 0)}
                            </td>
                            <td className="p-3 text-center font-mono text-text-secondary">
                              {team.fairPlayPoints ?? 0}
                            </td>
                            <td className="p-3 text-center font-mono font-bold text-accent">
                              {team.puntos}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {tabla.length === 0 && (
                    <p className="text-center text-text-muted py-4">
                      No hay datos de posiciones
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* EQUIPOS TAB */}
        {activeTab === "equipos" && (
          <div className="space-y-4">
            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto px-1 py-1 pb-2">
              <Badge
                variant={!selectedCategory ? "completed" : "upcoming"}
                selected={!selectedCategory}
                onClick={() => setSelectedCategory(null)}
              >
                Todos
              </Badge>
              {categorias.map((cat: any) => (
                <Badge
                  key={cat._id}
                  variant={
                    selectedCategory === cat._id ? "completed" : "upcoming"
                  }
                  selected={selectedCategory === cat._id}
                  onClick={() => setSelectedCategory(cat._id)}
                >
                  {cat.nombre}
                </Badge>
              ))}
            </div>

            {/* Teams Grid */}
            <div>
              <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
                Equipos
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {equipos
                  .filter(
                    (e: any) =>
                      !selectedCategory || e.categoriaId === selectedCategory,
                  )
                  .map((equipo: any) => (
                    <Card key={equipo._id} hover>
                      <CardContent className="p-4 flex flex-col items-center gap-2">
                        <Avatar
                          name={equipo.nombre}
                          size="lg"
                          className="text-white"
                          style={{ backgroundColor: "#F59E0B" }}
                        />
                        <p className="font-semibold text-text-primary text-center">
                          {equipo.nombre}
                        </p>
                        <Badge variant="upcoming" className="text-xs">
                          {getCategoriaById(equipo.categoriaId)?.nombre ||
                            "Sin categoría"}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                {equipos.length === 0 && (
                  <p className="col-span-2 text-center text-text-muted py-4">
                    No hay equipos registrados
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Tab Navigation */}
      <MobileTabs activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

// Loading fallback for Suspense
function LoadingContent() {
  return (
    <div className="min-h-screen bg-bg-secondary pb-20 flex items-center justify-center">
      <p className="text-text-muted">Cargando...</p>
    </div>
  );
}

// Main page component with Suspense boundary
export default function ParentHomePage() {
  return (
    <Suspense fallback={<LoadingContent />}>
      <ParentHomePageContent />
    </Suspense>
  );
}
