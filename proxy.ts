// v2
import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, isValidSessionToken } from "./lib/session";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const valid = await isValidSessionToken(token);

  const isLoginPage = request.nextUrl.pathname === "/login";
  const isLoginApi = request.nextUrl.pathname === "/api/login";

  if (!valid && !isLoginPage && !isLoginApi) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (valid && isLoginPage) {
    const homeUrl = new URL("/", request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
