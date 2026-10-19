import { NextResponse, type NextRequest } from "next/server";

import { env } from "@/config/env";
import { sessionFromClaims } from "@/lib/auth/claims";
import { decodeJwtPayload, nowSeconds } from "@/lib/auth/jwt";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(env.SESSION_COOKIE_NAME)?.value;
  const session = token ? sessionFromClaims(decodeJwtPayload(token), nowSeconds()) : null;
  if (session) {
    return NextResponse.next();
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.search = "";
  loginUrl.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);

  const response = NextResponse.redirect(loginUrl);
  if (token) {
    response.cookies.delete(env.SESSION_COOKIE_NAME);
  }
  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/provider/:path*", "/admin/:path*", "/book/:path*", "/wallet/:path*"],
};
