import { NextResponse, type NextRequest } from "next/server";

import { SESSION_REFRESH_COOKIE_NAME, env } from "@/config/env";
import { sessionFromClaims } from "@/lib/auth/claims";
import { decodeJwtPayload, nowSeconds } from "@/lib/auth/jwt";

function nextPath(request: NextRequest): string {
  return `${request.nextUrl.pathname}${request.nextUrl.search}`;
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get(env.SESSION_COOKIE_NAME)?.value;
  const refreshToken = request.cookies.get(SESSION_REFRESH_COOKIE_NAME)?.value;
  const session = token ? sessionFromClaims(decodeJwtPayload(token), nowSeconds()) : null;
  if (session) {
    return NextResponse.next();
  }

  if (refreshToken) {
    const refreshUrl = request.nextUrl.clone();
    refreshUrl.pathname = "/auth/refresh";
    refreshUrl.search = "";
    refreshUrl.searchParams.set("next", nextPath(request));

    const response = NextResponse.redirect(refreshUrl);
    if (token) {
      response.cookies.delete(env.SESSION_COOKIE_NAME);
    }
    return response;
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.search = "";
  loginUrl.searchParams.set("next", nextPath(request));

  const response = NextResponse.redirect(loginUrl);
  if (token) {
    response.cookies.delete(env.SESSION_COOKIE_NAME);
  }
  return response;
}

export const config = {
  matcher: [
    "/account",
    "/dashboard/:path*",
    "/provider/:path*",
    "/admin/:path*",
    "/book/:path*",
    "/wallet/:path*",
  ],
};
