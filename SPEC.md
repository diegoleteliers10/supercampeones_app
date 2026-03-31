# LigaKids - Plataforma de Gestión de Ligas de Fútbol Infantil

## 1. Concept & Vision

**LigaKids** es una plataforma moderna y elegante para gestionar ligas de fútbol infantil. Diseñada para ser intuitiva en móvil, permite a administradores crear y organizar torneos semanales, a planilleros registrar partidos en tiempo real, y a padres seguir el desempeño de sus hijos desde cualquier lugar.

La experiencia se siente como una app nativa: fluida, instantánea, y hermosa. El diseño es brutalist-minimalista con acentos de azul que guían la atención sin saturar.

---

## 2. Design Language

### Aesthetic Direction
**Neo-brutalist minimalism** — Formas limpias con bordes definidos, tipografía bold, y espacios generosos. Inspirado en apps deportivas profesionales como ESPN+ y The Athletic, pero más cálido y accesible para familias.

### Color Palette
```
--bg-primary:       #FFFFFF  (Fondo principal)
--bg-secondary:     #F8FAFC  (Superficies elevadas)
--bg-tertiary:      #F1F5F9  (Fondos de tarjetas)
--text-primary:     #0F172A  (Texto principal)
--text-secondary:   #64748B  (Texto secundario)
--text-muted:       #94A3B8  (Texto terciario)
--border:           #E2E8F0  (Bordes sutiles)
--border-strong:    #CBD5E1  (Bordes marcados)

--accent:           #2563EB  (Azul primario - acciones)
--accent-hover:     #1D4ED8  (Azul hover)
--accent-light:     #DBEAFE  (Azul claro - backgrounds)
--accent-subtle:    #EFF6FF  (Azul más claro)

--success:          #10B981  (Verde - victoria/positivo)
--warning:          #F59E0B  (Amarillo - precaución)
--error:            #EF4444  (Rojo - error/pérdida)

--fairplay:         #8B5CF6  (Morado - tarjetas fairplay)
```

### Typography
- **Headings**: `Inter` (700, 800) — Bold, moderno, excelente legibilidad
- **Body**: `Inter` (400, 500) — Limpio y profesional
- **Mono/Stats**: `JetBrains Mono` — Para números y estadísticas

### Spatial System
- Base unit: 4px
- Spacing scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64
- Card padding: 16px mobile, 20px desktop
- Section gaps: 24px mobile, 32px desktop
- Safe area padding: 16px horizontal

### Motion Philosophy
- **Transiciones**: 200ms ease-out para estados hover/focus
- **Page transitions**: 300ms ease-in-out con fade sutil
- **Micro-interactions**: 150ms para botones y elementos interactivos
- **Loading states**: Skeleton shimmer con gradiente sutil
- **Score updates**: Scale pop 1.0→1.1→1.0 con 300ms

---

## 3. Layout & Structure

### Page Architecture
- Header sticky (56px) con logo, título y avatar
- Content scrollable con padding 16px
- Bottom Navigation fixed (64px) para móvil

### Navigation Structure by Role
**Admin**: Dashboard → Partidos → Equipos → Liga → Config
**Scorer**: Mis Partidos → Historial
**Parent**: Inicio → Tabla → Partidos → Mi Equipo

---

## 4. Features

### Admin Panel
- Crear/editar ligas con categorías y grupos
- CRUD de equipos con jugadores
- Programar fechas y partidos
- Asignar scorers a partidos

### Scorer Panel
- Ver partidos asignados (próximos, en vivo, completados)
- Gestionar partido en vivo: marcador, goles, tarjetas fairplay
- Finalizar partido (bloquea edición)

### Parent View
- Tabla de posiciones por categoría/grupo
- Resultados de partidos
- Próximos partidos
- Info de su equipo

---

## 5. Technical Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Convex DB
- **Auth**: Convex Auth
- **PWA**: next-pwa, service worker
- **Icons**: Lucide React
- **Fonts**: Inter, JetBrains Mono

### Schema Principal
- leagues, teams, players, rounds, matches, goals, fairplay_cards, users
