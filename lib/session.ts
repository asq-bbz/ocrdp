const COOKIE_NAME = "ocr_session";
const SESSION_HOURS = 12;

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "SESSION_SECRET não configurado. Defina essa variável de ambiente."
    );
  }
  return secret;
}

async function hmac(data: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return Buffer.from(sig).toString("base64url");
}

export async function createSessionToken(): Promise<string> {
  const exp = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  const payload = String(exp);
  const signature = await hmac(payload, getSecret());
  return `${payload}.${signature}`;
}

export async function isValidSessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const exp = Number(payload);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;

  const expected = await hmac(payload, getSecret());
  return expected === signature;
}

export { COOKIE_NAME, SESSION_HOURS };
