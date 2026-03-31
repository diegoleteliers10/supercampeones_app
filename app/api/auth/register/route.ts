import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import { createSessionToken } from "@/lib/auth-session";

const SESSION_COOKIE = "lk_session";

export async function POST(req: Request) {
  try {
    const { email, password, nombre, rol } = (await req.json()) as {
      email?: string;
      password?: string;
      nombre?: string;
      rol?: "admin" | "scorer";
    };

    if (!email || !password || !nombre || !rol) {
      return NextResponse.json(
        { ok: false, message: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    if (rol !== "admin" && rol !== "scorer") {
      return NextResponse.json(
        { ok: false, message: "Rol inválido" },
        { status: 400 }
      );
    }

    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
      return NextResponse.json(
        { ok: false, message: "Falta NEXT_PUBLIC_CONVEX_URL" },
        { status: 500 }
      );
    }

    const client = new ConvexHttpClient(convexUrl);
    const user = await client.mutation(api.api.registerUsuario, {
      email,
      nombre,
      password,
      rol: rol === "scorer" ? "planillero" : "admin",
    });

    const token = createSessionToken({
      userId: user._id,
      email: user.email,
      nombre: user.nombre,
      rol: user.rol,
    });

    const res = NextResponse.json({
      ok: true,
      user: {
        email: user.email,
        nombre: user.nombre,
        rol: user.rol,
      },
      redirectTo: user.rol === "admin" ? "/admin" : "/scorer",
    });

    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 12,
    });

    return res;
  } catch (error) {
    if (error instanceof Error && error.message === "Missing AUTH_SESSION_SECRET") {
      return NextResponse.json(
        { ok: false, message: "Falta configurar AUTH_SESSION_SECRET en .env.local" },
        { status: 500 }
      );
    }
    const message =
      error instanceof Error && error.message
        ? error.message
        : "No se pudo registrar el usuario";

    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}
