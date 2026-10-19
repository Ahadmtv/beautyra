import { NextResponse, type NextRequest } from "next/server";

import { clearSessionCookie } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  await clearSessionCookie();
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.search = "?expired=1";
  return NextResponse.redirect(loginUrl);
}
