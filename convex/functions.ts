import { v } from "convex/values";
import { query, mutation } from "convex/server";

// Helper to get current user from context
async function getCurrentUser(ctx: any) {
  return await ctx.auth.getUserIdentity();
}

// Usuarios
export const listUsuarios = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("usuarios").collect();
  },
});

export const getUsuarioByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("usuarios")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

// Categorías
export const listCategorias = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("categorias").collect();
  },
});

export const createCategoria = mutation({
  args: { nombre: v.string(), descripcion: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || (user as any).role !== "admin") throw new Error("Unauthorized");
    const id = await ctx.db.insert("categorias", {
      nombre: args.nombre,
      descripcion: args.descripcion,
      createdAt: Date.now(),
    });
    return id;
  },
});

// Grupos
export const listGrupos = query({
  args: { categoriaId: v.optional(v.id("categorias")) },
  handler: async (ctx, args) => {
    if (args.categoriaId) {
      return await ctx.db
        .query("grupos")
        .withIndex("by_categoria", (q) => q.eq("categoriaId", args.categoriaId!))
        .collect();
    }
    return await ctx.db.query("grupos").collect();
  },
});

export const createGrupo = mutation({
  args: { nombre: v.string(), categoriaId: v.id("categorias") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || (user as any).role !== "admin") throw new Error("Unauthorized");
    const id = await ctx.db.insert("grupos", {
      nombre: args.nombre,
      categoriaId: args.categoriaId,
      createdAt: Date.now(),
    });
    return id;
  },
});

// Equipos
export const listEquipos = query({
  args: {
    categoriaId: v.optional(v.id("categorias")),
    grupoId: v.optional(v.id("grupos")),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("equipos");
    if (args.categoriaId) {
      q = q.withIndex("by_categoria", (q) =>
        q.eq("categoriaId", args.categoriaId!)
      );
    } else if (args.grupoId) {
      q = q.withIndex("by_grupo", (q) => q.eq("grupoId", args.grupoId!));
    }
    return await q.collect();
  },
});

export const createEquipo = mutation({
  args: {
    nombre: v.string(),
    categoriaId: v.id("categorias"),
    grupoId: v.id("grupos"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || (user as any).role !== "admin") throw new Error("Unauthorized");
    const id = await ctx.db.insert("equipos", {
      nombre: args.nombre,
      categoriaId: args.categoriaId,
      grupoId: args.grupoId,
      createdAt: Date.now(),
    });
    return id;
  },
});

// Partidos
export const listPartidos = query({
  args: {
    categoriaId: v.optional(v.id("categorias")),
    grupoId: v.optional(v.id("grupos")),
  },
  handler: async (ctx, args) => {
    if (args.categoriaId) {
      return await ctx.db
        .query("partidos")
        .withIndex("by_categoria", (q) => q.eq("categoriaId", args.categoriaId!))
        .collect();
    }
    if (args.grupoId) {
      return await ctx.db
        .query("partidos")
        .withIndex("by_grupo", (q) => q.eq("grupoId", args.grupoId!))
        .collect();
    }
    return await ctx.db.query("partidos").collect();
  },
});

export const getPartido = query({
  args: { partidoId: v.id("partidos") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.partidoId);
  },
});

export const createPartido = mutation({
  args: {
    equipoLocalId: v.id("equipos"),
    equipoVisitanteId: v.id("equipos"),
    categoriaId: v.id("categorias"),
    grupoId: v.id("grupos"),
    fecha: v.number(),
    ubicacion: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Unauthorized");
    const id = await ctx.db.insert("partidos", {
      ...args,
      estado: "programado",
      planilleroId: (user as any)._id,
      createdAt: Date.now(),
    });
    return id;
  },
});

export const updatePartidoEstado = mutation({
  args: {
    partidoId: v.id("partidos"),
    estado: v.union(
      v.literal("programado"),
      v.literal("en_curso"),
      v.literal("finalizado"),
      v.literal("cancelado")
    ),
    golesLocal: v.optional(v.number()),
    golesVisitante: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Unauthorized");
    await ctx.db.patch(args.partidoId, {
      estado: args.estado,
      golesLocal: args.golesLocal,
      golesVisitante: args.golesVisitante,
    });
  },
});

// Eventos Partido (Goles)
export const listEventosPartido = query({
  args: { partidoId: v.id("partidos") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("eventosPartido")
      .withIndex("by_partido", (q) => q.eq("partidoId", args.partidoId))
      .collect();
  },
});

export const addGol = mutation({
  args: {
    partidoId: v.id("partidos"),
    equipoId: v.id("equipos"),
    jugador: v.string(),
    minuto: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Unauthorized");
    const id = await ctx.db.insert("eventosPartido", {
      partidoId: args.partidoId,
      equipoId: args.equipoId,
      tipoEvento: "gol",
      jugador: args.jugador,
      minuto: args.minuto,
      timestamp: Date.now(),
    });
    return id;
  },
});

// Tabla de Posiciones
export const getTablaPosiciones = query({
  args: { grupoId: v.id("grupos") },
  handler: async (ctx, args) => {
    const tabla = await ctx.db
      .query("tablaPosiciones")
      .withIndex("by_grupo", (q) => q.eq("grupoId", args.grupoId))
      .collect();

    return tabla.sort((a, b) => {
      if (b.puntos !== a.puntos) return b.puntos - a.puntos;
      const diffA = a.golesFavor - a.golesContra;
      const diffB = b.golesFavor - b.golesContra;
      return diffB - diffA;
    });
  },
});

export const updateTablaPosiciones = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("tablaPosiciones")
      .withIndex("by_equipo", (q) =>
        q.eq("equipoId", args.equipoId).eq("grupoId", args.grupoId)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        jugados: args.jugados,
        ganados: args.ganados,
        empatados: args.empatados,
        perdidos: args.perdidos,
        golesFavor: args.golesFavor,
        golesContra: args.golesContra,
        puntos: args.puntos,
        fairPlayPoints: args.fairPlayPoints,
      });
    } else {
      await ctx.db.insert("tablaPosiciones", args);
    }
  },
});
