import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, SESSION_HOURS, createSessionToken } from "@/lib/session";

export async function POST(request: NextRequest) {
  const { usuario, senha } = await request.json();

  const expectedUser = process.env.APP_USER;
  const expectedPassword = process.env.APP_PASSWORD;

  if (!expectedUser || !expectedPassword) {
    return NextResponse.json(
      { error: "Aplicativo não configurado. Defina APP_USER e APP_PASSWORD." },
      { status: 500 }
    );
  }

  if (usuario !== expectedUser || senha !== expectedPassword) {
    return NextResponse.json(
      { error: "Usuário ou senha incorretos." },
      { status: 401 }
    );
  }

  const token = await createSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_HOURS * 60 * 60,
  });
  return response;
}
