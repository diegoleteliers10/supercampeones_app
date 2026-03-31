import { createHmac, timingSafeEqual } from "crypto";

type SessionPayload = {
  userId: string;
  email: string;
  nombre: string;
  rol: "admin" | "planillero";
  exp: number;
};

function getSecret() {
  const secret = process.env.AUTH_SESSION_SECRET;
  if (!secret) {
    throw new Error("Missing AUTH_SESSION_SECRET");
  }
  return secret;
}

function base64UrlEncode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(data: string, secret: string) {
  return createHmac("sha256", secret).update(data).digest("base64url");
}

export function createSessionToken(
  payload: Omit<SessionPayload, "exp">,
  maxAgeSeconds = 60 * 60 * 12
) {
  const exp = Date.now() + maxAgeSeconds * 1000;
  const fullPayload: SessionPayload = { ...payload, exp };
  const encoded = base64UrlEncode(JSON.stringify(fullPayload));
  const signature = sign(encoded, getSecret());
  return `${encoded}.${signature}`;
}

export function verifySessionToken(token: string | undefined | null): SessionPayload | null {
  if (!token) return null;
  const [encoded, providedSignature] = token.split(".");
  if (!encoded || !providedSignature) return null;

  const expectedSignature = sign(encoded, getSecret());
  const a = Buffer.from(providedSignature);
  const b = Buffer.from(expectedSignature);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const parsed = JSON.parse(base64UrlDecode(encoded)) as SessionPayload;
    if (!parsed.exp || parsed.exp < Date.now()) return null;
    if (parsed.rol !== "admin" && parsed.rol !== "planillero") return null;
    return parsed;
  } catch {
    return null;
  }
}
