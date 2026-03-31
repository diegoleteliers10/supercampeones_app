import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  usuarios: defineTable({
    email: v.string(),
    nombre: v.string(),
    rol: v.union(v.literal("admin"), v.literal("planillero")),
    password: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_email", ["email"]),

  categorias: defineTable({
    nombre: v.string(),
    descripcion: v.optional(v.string()),
    createdAt: v.number(),
  }),

  grupos: defineTable({
    nombre: v.string(),
    categoriaId: v.id("categorias"),
    createdAt: v.number(),
  })
    .index("by_categoria", ["categoriaId"]),

  equipos: defineTable({
    nombre: v.string(),
    categoriaId: v.id("categorias"),
    grupoId: v.id("grupos"),
    createdAt: v.number(),
  })
    .index("by_categoria", ["categoriaId"])
    .index("by_grupo", ["grupoId"]),

  partidos: defineTable({
    equipoLocalId: v.id("equipos"),
    equipoVisitanteId: v.id("equipos"),
    categoriaId: v.id("categorias"),
    grupoId: v.id("grupos"),
    fecha: v.number(),
    ubicacion: v.string(),
    estado: v.union(
      v.literal("programado"),
      v.literal("en_curso"),
      v.literal("finalizado"),
      v.literal("cancelado")
    ),
    golesLocal: v.optional(v.number()),
    golesVisitante: v.optional(v.number()),
    equipoFairPlay: v.optional(v.id("equipos")),
    planilleroId: v.optional(v.id("usuarios")),
    createdAt: v.number(),
  })
    .index("by_categoria", ["categoriaId"])
    .index("by_grupo", ["grupoId"])
    .index("by_planillero", ["planilleroId"])
    .index("by_fecha", ["fecha"]),

  eventosPartido: defineTable({
    partidoId: v.id("partidos"),
    equipoId: v.id("equipos"),
    tipoEvento: v.union(v.literal("gol")),
    jugador: v.string(),
    minuto: v.optional(v.number()),
    timestamp: v.number(),
  })
    .index("by_partido", ["partidoId"]),

  tablaPosiciones: defineTable({
    grupoId: v.id("grupos"),
    equipoId: v.id("equipos"),
    jugados: v.number(),
    ganados: v.number(),
    empatados: v.number(),
    perdidos: v.number(),
    golesFavor: v.number(),
    golesContra: v.number(),
    puntos: v.number(),
    fairPlayPoints: v.number(),
  })
    .index("by_grupo", ["grupoId"])
    .index("by_equipo", ["equipoId"]),
});
