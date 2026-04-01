"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Header } from "@/components/ui/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  FolderTreeIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";

export default function LeagueDetailPage() {
  const params = useParams<{ id: string }>();
  const ligaId = params?.id;

  const ligas = useQuery(api.api.listLigas) || [];
  const categorias = useQuery(api.api.listCategorias, ligaId ? { ligaId: ligaId as any } : {}) || [];
  const grupos = useQuery(api.api.listGrupos, {}) || [];
  const equipos = useQuery(api.api.listEquipos, {}) || [];

  const liga = ligas.find((l: any) => l._id === ligaId);

  return (
    <div className="min-h-screen bg-white">
      <Header
        title={liga?.nombre || "Detalle de Liga"}
        subtitle="Categorías, grupos y equipos"
        showBackButton
      />

      <div className="p-4 space-y-4">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/[0.10] via-primary/[0.06] to-white shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary/80">
              Estructura de liga
            </p>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              {liga?.nombre || "Detalle de Liga"}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Revisa categorías, grupos y equipos organizados.
            </p>
          </CardContent>
        </Card>

        {categorias.length === 0 && (
          <Card className="border-primary/15 bg-white shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                <HugeiconsIcon icon={FolderTreeIcon} className="w-7 h-7 text-primary" />
              </div>
              <p className="text-sm text-slate-600">Esta liga aún no tiene categorías.</p>
              <Link href="/admin">
                <Button className="mt-3 bg-primary text-primary-foreground hover:bg-primary/90" size="sm">Crear categoría</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {categorias.map((categoria: any) => {
          const gruposCategoria = grupos.filter((g: any) => g.categoriaId === categoria._id);

          return (
            <Card key={categoria._id} className="border-primary/15 bg-white shadow-sm">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-slate-900">{categoria.nombre}</h2>
                    <p className="text-sm text-slate-600">
                      {gruposCategoria.length} grupos
                    </p>
                  </div>
                  <Badge variant="upcoming" className="border-primary/20 bg-primary/10 text-primary">Categoría</Badge>
                </div>

                <div className="space-y-2">
                  {gruposCategoria.length === 0 && (
                    <p className="text-sm text-slate-500">Sin grupos en esta categoría.</p>
                  )}

                  {gruposCategoria.map((grupo: any) => {
                    const equiposGrupo = equipos.filter((e: any) => e.grupoId === grupo._id);
                    return (
                      <div key={grupo._id} className="border border-primary/15 rounded-xl p-3 bg-primary/[0.02]">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-slate-900">{grupo.nombre}</p>
                          <span className="text-xs text-slate-500">{equiposGrupo.length} equipos</span>
                        </div>

                        <div className="space-y-1">
                          {equiposGrupo.length === 0 && (
                            <p className="text-xs text-slate-500">Sin equipos asignados.</p>
                          )}
                          {equiposGrupo.map((equipo: any) => (
                            <div key={equipo._id} className="flex items-center justify-between py-1">
                              <div className="flex items-center gap-2">
                                <HugeiconsIcon icon={UserGroupIcon} className="w-4 h-4 text-primary/80" />
                                <span className="text-sm text-slate-800">{equipo.nombre}</span>
                              </div>
                              <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4 text-slate-400" />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
