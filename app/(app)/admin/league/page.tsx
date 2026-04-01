"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Header } from "@/components/ui/header";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  ArrowRight01Icon,
  CrownIcon,
  Delete02Icon,
  Edit02Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";

export default function LeaguePage() {
  const [showForm, setShowForm] = useState(false);
  const [nombre, setNombre] = useState("");
  const ligas = useQuery(api.api.listLigas) || [];
  const categorias = useQuery(api.api.listCategorias, {}) || [];
  const createLiga = useMutation(api.api.createLiga);
  const countCategorias = (ligaId: string) =>
    categorias.filter((c: any) => c.ligaId === ligaId).length;
  const handleCreate = async () => {
    if (!nombre.trim()) return;
    await createLiga({ nombre: nombre.trim(), descripcion: undefined, temporada: undefined });
    setNombre("");
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header title="Liga" subtitle="Gestionar temporadas" />

      <div className="p-4 space-y-4">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/[0.10] via-primary/[0.06] to-white shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary/80">
              Organización general
            </p>
            <h2 className="text-xl font-bold text-slate-900 mt-1">Ligas y temporadas</h2>
            <p className="text-sm text-slate-600 mt-1">
              Administra ligas activas y su estructura de categorías.
            </p>
          </CardContent>
        </Card>

        {/* Add League Button */}
        <Button onClick={() => setShowForm(!showForm)} className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
          <HugeiconsIcon icon={Add01Icon} className="w-5 h-5" />
          Nueva Liga
        </Button>

        {/* New League Form */}
        {showForm && (
          <Card className="border-primary/20 bg-white shadow-sm">
            <CardHeader>
              <h3 className="font-semibold text-slate-900">Crear Nueva Liga</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input label="Nombre de la Liga/Categoría" placeholder="Sub-12" value={nombre} onChange={(e) => setNombre(e.target.value)} />
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

        {/* League List */}
        <div className="space-y-3">
          {ligas.map((league: any) => (
            <Link key={league._id} href={`/admin/league/${league._id}`} className="block">
              <Card hover className="border-primary/15 bg-white shadow-sm">
                <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <HugeiconsIcon icon={CrownIcon} className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{league.nombre}</h3>
                      <p className="text-sm text-slate-600">
                        {countCategorias(league._id)} categorías
                      </p>
                    </div>
                  </div>
                  <HugeiconsIcon icon={ArrowRight01Icon} className="w-5 h-5 text-slate-500" />
                </div>
                
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                  <Badge variant="completed" className="border-primary/20 bg-primary/10 text-primary">Activa</Badge>
                  <div className="ml-auto">
                    <Button variant="ghost" size="sm" className="text-slate-500 hover:text-primary hover:bg-primary/10">
                      <HugeiconsIcon icon={Edit02Icon} className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="text-error hover:text-error hover:bg-error/10">
                    <HugeiconsIcon icon={Delete02Icon} className="w-4 h-4" />
                  </Button>
                </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {ligas.length === 0 && (
          <Card className="border-primary/15 bg-white shadow-sm">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <HugeiconsIcon icon={CrownIcon} className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">No hay ligas</h3>
              <p className="text-sm text-slate-600 mb-4">
                Crea tu primera liga para comenzar a gestionar torneos
              </p>
              <Button onClick={() => setShowForm(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <HugeiconsIcon icon={Add01Icon} className="w-4 h-4" />
                Crear Liga
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
