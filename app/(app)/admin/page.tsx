"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Header } from "@/components/ui/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Avatar } from "@/components/ui/avatar";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  ArrowRight01Icon,
  Calendar01Icon,
  Delete02Icon,
  Edit02Icon,
  LoaderPinwheelIcon,
  Logout01Icon,
  Settings01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";

export default function AdminDashboard() {
  const activeTab: string = "dashboard";
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"liga" | "categoria" | "grupo" | "equipo" | "partido">("categoria");
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Convex queries - use generated API
  const ligas = useQuery(api.api.listLigas) || [];
  const categorias = useQuery(api.api.listCategorias, {}) || [];
  const grupos = useQuery(api.api.listGrupos, selectedCategoria ? { categoriaId: selectedCategoria as any } : {}) || [];
  const equipos = useQuery(api.api.listEquipos, selectedCategoria ? { categoriaId: selectedCategoria as any } : {}) || [];
  const partidos = useQuery(api.api.listPartidos, {}) || [];
  const usuarios = useQuery(api.api.listUsuarios) || [];
  const planilleros = useQuery(api.api.listPlanilleros) || [];

  // Convex mutations - use generated API
  const createLigaFn = useMutation(api.api.createLiga);
  const createCategoriaFn = useMutation(api.api.createCategoria);
  const createGrupoFn = useMutation(api.api.createGrupo);
  const createEquipoFn = useMutation(api.api.createEquipo);
  const createPartidoFn = useMutation(api.api.createPartido);

  // Form state for modals
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    ligaId: "",
    categoriaId: "",
    grupoId: "",
    equipoLocalId: "",
    equipoVisitanteId: "",
    planilleroId: "",
    fecha: "",
    ubicacion: "",
  });
  const equiposByCategoria = useQuery(
    api.api.listEquipos,
    formData.categoriaId ? { categoriaId: formData.categoriaId as any } : {}
  ) || [];

  const openModal = (type: "liga" | "categoria" | "grupo" | "equipo" | "partido") => {
    setModalType(type);
    setFormData({
      nombre: "",
      descripcion: "",
      ligaId: "",
      categoriaId: "",
      grupoId: "",
      equipoLocalId: "",
      equipoVisitanteId: "",
      planilleroId: "",
      fecha: "",
      ubicacion: "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (modalType === "liga") {
        await createLigaFn({
          nombre: formData.nombre,
          descripcion: formData.descripcion || undefined,
          temporada: undefined,
        });
      } else if (modalType === "categoria") {
        await createCategoriaFn({
          ligaId: (formData.ligaId || undefined) as any,
          nombre: formData.nombre,
          descripcion: formData.descripcion || undefined,
        });
      } else if (modalType === "grupo") {
        if (!formData.categoriaId) throw new Error("Categoría requerida");
        await createGrupoFn({
          nombre: formData.nombre,
          categoriaId: formData.categoriaId as any,
        });
      } else if (modalType === "equipo") {
        if (!formData.categoriaId) throw new Error("Categoría requerida");
        await createEquipoFn({
          nombre: formData.nombre,
          categoriaId: formData.categoriaId as any,
        });
      } else if (modalType === "partido") {
        if (!formData.categoriaId || !formData.equipoLocalId || !formData.equipoVisitanteId) {
          throw new Error("Todos los campos son requeridos");
        }
        await createPartidoFn({
          categoriaId: formData.categoriaId as any,
          equipoLocalId: formData.equipoLocalId as any,
          equipoVisitanteId: formData.equipoVisitanteId as any,
          planilleroId: (formData.planilleroId || undefined) as any,
          fecha: new Date(formData.fecha).getTime(),
          ubicacion: formData.ubicacion,
        });
      }

      setShowModal(false);
    } catch (error: any) {
      console.error("Error al guardar:", error);
      alert("Error al guardar: " + (error.message || "Revisa la consola"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      localStorage.removeItem("userRole");
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");
      window.location.href = "/login";
    }
  };

  const getEquipoById = (id: any) => equipos.find((e: any) => e._id === id);
  const getCategoriaById = (id: any) => categorias.find((c: any) => c._id === id);
  const getGrupoById = (id: any) => grupos.find((g: any) => g._id === id);

  const stats = {
    ligas: ligas.length,
    categorias: categorias.length,
    equipos: equipos.length,
    partidosProgramados: partidos.filter((p: any) => p.estado === "programado").length,
    planilleros: usuarios.filter((u: any) => u.rol === "planillero").length,
  };

  return (
    <div className="min-h-screen bg-bg-secondary">
      <Header
        title="Admin"
        subtitle="Panel de Administración"
        user={{ name: "Admin" }}
        onLogout={handleLogout}
      />

      <div className="p-4 space-y-4">
        {activeTab === "dashboard" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent-light flex items-center justify-center">
                    <HugeiconsIcon icon={Settings01Icon} className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-mono text-text-primary">{stats.categorias}</p>
                    <p className="text-xs text-text-muted">Categorías</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent-light flex items-center justify-center">
                    <HugeiconsIcon icon={UserGroupIcon} className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-mono text-text-primary">{stats.equipos}</p>
                    <p className="text-xs text-text-muted">Equipos</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <HugeiconsIcon icon={Calendar01Icon} className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-mono text-text-primary">{stats.partidosProgramados}</p>
                    <p className="text-xs text-text-muted">Partidos</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                    <HugeiconsIcon icon={UserGroupIcon} className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-mono text-text-primary">{stats.planilleros}</p>
                    <p className="text-xs text-text-muted">Planilleros</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
                Acciones Rápidas
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="secondary" className="h-auto py-4 flex flex-col items-center gap-2" onClick={() => openModal("liga")}>
                  <HugeiconsIcon icon={Add01Icon} className="w-5 h-5" />
                  <span className="text-xs">Nueva Liga</span>
                </Button>
                <Button variant="secondary" className="h-auto py-4 flex flex-col items-center gap-2" onClick={() => openModal("categoria")}>
                  <HugeiconsIcon icon={Add01Icon} className="w-5 h-5" />
                  <span className="text-xs">Nueva Categoría</span>
                </Button>
                <Button variant="secondary" className="h-auto py-4 flex flex-col items-center gap-2" onClick={() => openModal("grupo")}>
                  <HugeiconsIcon icon={Add01Icon} className="w-5 h-5" />
                  <span className="text-xs">Nuevo Grupo</span>
                </Button>
                <Button variant="secondary" className="h-auto py-4 flex flex-col items-center gap-2" onClick={() => openModal("equipo")}>
                  <HugeiconsIcon icon={Add01Icon} className="w-5 h-5" />
                  <span className="text-xs">Nuevo Equipo</span>
                </Button>
                <Button variant="secondary" className="h-auto py-4 flex flex-col items-center gap-2" onClick={() => openModal("partido")}>
                  <HugeiconsIcon icon={Add01Icon} className="w-5 h-5" />
                  <span className="text-xs">Nuevo Partido</span>
                </Button>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
                Partidos Recientes
              </h2>
              <div className="space-y-3">
                {partidos.slice(0, 3).map((partido: any) => {
                  const local = getEquipoById(partido.equipoLocalId);
                  const visitante = getEquipoById(partido.equipoVisitanteId);
                  return (
                    <Card key={partido._id} hover>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="upcoming">Programado</Badge>
                          <span className="text-xs text-text-muted">
                            {new Date(partido.fecha).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Avatar name={local?.nombre || ""} size="sm" className="text-white" style={{ backgroundColor: "#F59E0B" }} />
                              <span className="font-medium text-text-primary text-sm">{local?.nombre || "Equipo"}</span>
                            </div>
                          </div>
                          <div className="px-4">
                            <span className="text-lg text-text-muted">vs</span>
                          </div>
                          <div className="flex-1 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <span className="font-medium text-text-primary text-sm">{visitante?.nombre || "Equipo"}</span>
                              <Avatar name={visitante?.nombre || ""} size="sm" className="text-white" style={{ backgroundColor: "#2563EB" }} />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                {partidos.length === 0 && <p className="text-center text-text-muted py-4">No hay partidos registrados</p>}
              </div>
            </div>
          </>
        )}

        {activeTab === "categorias" && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-text-primary">Categorías</h2>
              <Button size="sm" onClick={() => openModal("categoria")}>
                <HugeiconsIcon icon={Add01Icon} className="w-4 h-4" />
                Nueva
              </Button>
            </div>

            <div className="space-y-3">
              {categorias.map((cat: any) => (
                <Card key={cat._id} hover>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-text-primary">{cat.nombre}</h3>
                      <p className="text-sm text-text-muted">{cat.descripcion || "Sin descripción"}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm"><HugeiconsIcon icon={Edit02Icon} className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" className="text-error"><HugeiconsIcon icon={Delete02Icon} className="w-4 h-4" /></Button>
                      <HugeiconsIcon icon={ArrowRight01Icon} className="w-5 h-5 text-text-muted" />
                    </div>
                  </CardContent>
                </Card>
              ))}
              {categorias.length === 0 && <p className="text-center text-text-muted py-4">No hay categorías. Crea una para comenzar.</p>}
            </div>

            {selectedCategoria && (
              <>
                <div className="flex items-center justify-between mt-6">
                  <h2 className="text-lg font-bold text-text-primary">
                    Grupos - {getCategoriaById(selectedCategoria)?.nombre}
                  </h2>
                  <Button size="sm" onClick={() => openModal("grupo")}>
                    <HugeiconsIcon icon={Add01Icon} className="w-4 h-4" />
                    Nuevo
                  </Button>
                </div>

                <div className="space-y-3">
                  {grupos.filter((g: any) => g.categoriaId === selectedCategoria).map((grupo: any) => (
                    <Card key={grupo._id} hover>
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-text-primary">{grupo.nombre}</h3>
                          <p className="text-sm text-text-muted">
                            {equipos.filter((e: any) => e.grupoId === grupo._id).length} equipos
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm"><HugeiconsIcon icon={Edit02Icon} className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="sm" className="text-error"><HugeiconsIcon icon={Delete02Icon} className="w-4 h-4" /></Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {activeTab === "partidos" && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-text-primary">Partidos</h2>
              <Button size="sm" onClick={() => openModal("partido")}>
                <HugeiconsIcon icon={Add01Icon} className="w-4 h-4" />
                Nuevo
              </Button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              <Badge variant={!selectedCategoria ? "completed" : "upcoming"} onClick={() => setSelectedCategoria(null)}>Todos</Badge>
              {categorias.map((cat: any) => (
                <Badge key={cat._id} variant={selectedCategoria === cat._id ? "completed" : "upcoming"} onClick={() => setSelectedCategoria(cat._id)}>
                  {cat.nombre}
                </Badge>
              ))}
            </div>

            <div className="space-y-3">
              {partidos.filter((p: any) => !selectedCategoria || p.categoriaId === selectedCategoria).map((partido: any) => {
                const local = getEquipoById(partido.equipoLocalId);
                const visitante = getEquipoById(partido.equipoVisitanteId);
                const categoria = getCategoriaById(partido.categoriaId);
                return (
                  <Card key={partido._id} hover>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex gap-2">
                          <Badge variant={partido.estado === "finalizado" ? "completed" : partido.estado === "en_curso" ? "live" : "upcoming"}>
                            {partido.estado === "programado" ? "Programado" : partido.estado === "en_curso" ? "En Curso" : partido.estado === "finalizado" ? "Finalizado" : "Cancelado"}
                          </Badge>
                          {categoria && <Badge variant="upcoming">{categoria.nombre}</Badge>}
                        </div>
                        <Button variant="ghost" size="sm"><HugeiconsIcon icon={Edit02Icon} className="w-4 h-4" /></Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex-1 text-center">
                          <Avatar name={local?.nombre || "?"} size="md" className="mx-auto mb-2 text-white" style={{ backgroundColor: "#F59E0B" }} />
                          <p className="font-semibold text-text-primary text-sm">{local?.nombre || "?"}</p>
                        </div>
                        <div className="px-4 text-center">
                          <div className="text-2xl font-bold font-mono text-text-muted">vs</div>
                          <p className="text-xs text-text-muted mt-1">{partido.ubicacion}</p>
                        </div>
                        <div className="flex-1 text-center">
                          <Avatar name={visitante?.nombre || "?"} size="md" className="mx-auto mb-2 text-white" style={{ backgroundColor: "#2563EB" }} />
                          <p className="font-semibold text-text-primary text-sm">{visitante?.nombre || "?"}</p>
                        </div>
                      </div>
                      {partido.planilleroId && (
                        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                          <span className="text-xs text-text-muted">Planillero asignado</span>
                          <Link href={`/scorer/match/${partido._id}`}>
                            <Button variant="secondary" size="sm">Gestionar</Button>
                          </Link>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
              {partidos.length === 0 && <p className="text-center text-text-muted py-4">No hay partidos. Crea uno para comenzar.</p>}
            </div>
          </>
        )}

        {activeTab === "equipos" && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-text-primary">Equipos</h2>
              <Button size="sm" onClick={() => openModal("equipo")}>
                <HugeiconsIcon icon={Add01Icon} className="w-4 h-4" />
                Nuevo
              </Button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              <Badge variant={!selectedCategoria ? "completed" : "upcoming"} onClick={() => setSelectedCategoria(null)}>Todos</Badge>
              {categorias.map((cat: any) => (
                <Badge key={cat._id} variant={selectedCategoria === cat._id ? "completed" : "upcoming"} onClick={() => setSelectedCategoria(cat._id)}>
                  {cat.nombre}
                </Badge>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {equipos.filter((e: any) => !selectedCategoria || e.categoriaId === selectedCategoria).map((equipo: any) => (
                <Card key={equipo._id} hover>
                  <CardContent className="p-4 flex flex-col items-center gap-2">
                    <Avatar name={equipo.nombre} size="lg" className="text-white" style={{ backgroundColor: "#F59E0B" }} />
                    <p className="font-semibold text-text-primary text-center">{equipo.nombre}</p>
                    <p className="text-xs text-text-muted">
                      {getCategoriaById(equipo.categoriaId)?.nombre || "Sin categoría"} • {getGrupoById(equipo.grupoId)?.nombre || "Sin grupo"}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <Button variant="ghost" size="sm"><HugeiconsIcon icon={Edit02Icon} className="w-3 h-3" /></Button>
                      <Button variant="ghost" size="sm" className="text-error"><HugeiconsIcon icon={Delete02Icon} className="w-3 h-3" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {equipos.length === 0 && <p className="col-span-2 text-center text-text-muted py-4">No hay equipos. Crea una categoría primero.</p>}
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold text-text-primary mb-4">
                {modalType === "liga" && "Nueva Liga"}
                {modalType === "categoria" && "Nueva Categoría"}
                {modalType === "grupo" && "Nuevo Grupo"}
                {modalType === "equipo" && "Nuevo Equipo"}
                {modalType === "partido" && "Nuevo Partido"}
              </h2>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {modalType === "liga" && (
                  <>
                    <Input label="Nombre" placeholder="Ej: Liga Apertura 2026" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} required />
                    <Input label="Descripción" placeholder="Opcional" value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} />
                  </>
                )}

                {modalType === "categoria" && (
                  <>
                    <Select label="Liga" placeholder="Selecciona liga" value={formData.ligaId} onChange={(e) => setFormData({ ...formData, ligaId: e.target.value })} options={ligas.map((l: any) => ({ value: l._id, label: l.nombre }))} />
                    <Input label="Nombre" placeholder="Ej: Sub-8" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} required />
                    <Input label="Descripción" placeholder="Ej: 8 años y menores" value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} />
                  </>
                )}

                {modalType === "grupo" && (
                  <>
                    <Select label="Categoría" placeholder="Selecciona categoría" value={formData.categoriaId} onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })} options={categorias.map((c: any) => ({ value: c._id, label: c.nombre }))} />
                    <Input label="Nombre" placeholder="Ej: Grupo A" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} required />
                  </>
                )}

                {modalType === "equipo" && (
                  <>
                    <Input label="Nombre del Equipo" placeholder="Ej: Los Tigres" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} required />
                    <Select label="Categoría" placeholder="Selecciona categoría" value={formData.categoriaId} onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })} options={categorias.map((c: any) => ({ value: c._id, label: c.nombre }))} />
                  </>
                )}

                {modalType === "partido" && (
                  <>
                    <Select label="Categoría" placeholder="Selecciona categoría" value={formData.categoriaId} onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value, equipoLocalId: "", equipoVisitanteId: "" })} options={categorias.map((c: any) => ({ value: c._id, label: c.nombre }))} />
                    <Select label="Equipo Local" placeholder="Selecciona equipo" value={formData.equipoLocalId} onChange={(e) => setFormData({ ...formData, equipoLocalId: e.target.value })} options={equiposByCategoria.map((eq: any) => ({ value: eq._id, label: eq.nombre }))} />
                    <Select label="Equipo Visitante" placeholder="Selecciona equipo" value={formData.equipoVisitanteId} onChange={(e) => setFormData({ ...formData, equipoVisitanteId: e.target.value })} options={equiposByCategoria.filter((eq: any) => eq._id !== formData.equipoLocalId).map((eq: any) => ({ value: eq._id, label: eq.nombre }))} />
                    <Select label="Planillero" placeholder="Selecciona planillero" value={formData.planilleroId} onChange={(e) => setFormData({ ...formData, planilleroId: e.target.value })} options={planilleros.map((p: any) => ({ value: p._id, label: p.nombre }))} />
                    <Input label="Fecha y Hora" type="datetime-local" value={formData.fecha} onChange={(e) => setFormData({ ...formData, fecha: e.target.value })} required />
                    <Input label="Ubicación" placeholder="Ej: Campo 1" value={formData.ubicacion} onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })} required />
                  </>
                )}

                <div className="flex gap-3 pt-2">
                  <Button variant="secondary" className="flex-1" onClick={() => setShowModal(false)} type="button" disabled={isSubmitting}>Cancelar</Button>
                  <Button type="submit" className="flex-1" disabled={isSubmitting}>
                    {isSubmitting ? <HugeiconsIcon icon={LoaderPinwheelIcon} className="w-4 h-4 animate-spin" /> : "Guardar"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="p-4 fixed bottom-0 left-0 right-0 bg-bg-secondary border-t border-border">
        <Button variant="secondary" className="w-full" onClick={handleLogout}>
          <HugeiconsIcon icon={Logout01Icon} className="w-4 h-4" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}
