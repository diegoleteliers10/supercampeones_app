"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Header } from "@/components/ui/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, FolderTree, Users } from "lucide-react";

export default function LeagueDetailPage() {
  const params = useParams<{ id: string }>();
  const ligaId = params?.id;

  const ligas = useQuery(api.api.listLigas) || [];
  const categorias = useQuery(api.api.listCategorias, ligaId ? { ligaId: ligaId as any } : {}) || [];
  const grupos = useQuery(api.api.listGrupos, {}) || [];
  const equipos = useQuery(api.api.listEquipos, {}) || [];

  const liga = ligas.find((l: any) => l._id === ligaId);

  return (
    <div className="min-h-screen bg-bg-secondary">
      <Header
        title={liga?.nombre || "Detalle de Liga"}
        subtitle="Categorías, grupos y equipos"
        showBackButton
      />

      <div className="p-4 space-y-4">
        {categorias.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center">
              <FolderTree className="w-10 h-10 mx-auto mb-2 text-text-muted" />
              <p className="text-sm text-text-muted">Esta liga aún no tiene categorías.</p>
              <Link href="/admin">
                <Button className="mt-3" size="sm">Crear categoría</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {categorias.map((categoria: any) => {
          const gruposCategoria = grupos.filter((g: any) => g.categoriaId === categoria._id);

          return (
            <Card key={categoria._id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-text-primary">{categoria.nombre}</h2>
                    <p className="text-sm text-text-muted">
                      {gruposCategoria.length} grupos
                    </p>
                  </div>
                  <Badge variant="upcoming">Categoría</Badge>
                </div>

                <div className="space-y-2">
                  {gruposCategoria.length === 0 && (
                    <p className="text-sm text-text-muted">Sin grupos en esta categoría.</p>
                  )}

                  {gruposCategoria.map((grupo: any) => {
                    const equiposGrupo = equipos.filter((e: any) => e.grupoId === grupo._id);
                    return (
                      <div key={grupo._id} className="border border-border rounded-xl p-3 bg-white">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-text-primary">{grupo.nombre}</p>
                          <span className="text-xs text-text-muted">{equiposGrupo.length} equipos</span>
                        </div>

                        <div className="space-y-1">
                          {equiposGrupo.length === 0 && (
                            <p className="text-xs text-text-muted">Sin equipos asignados.</p>
                          )}
                          {equiposGrupo.map((equipo: any) => (
                            <div key={equipo._id} className="flex items-center justify-between py-1">
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-text-muted" />
                                <span className="text-sm text-text-primary">{equipo.nombre}</span>
                              </div>
                              <ChevronRight className="w-4 h-4 text-text-muted" />
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
