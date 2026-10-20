import { NextResponse, type NextRequest } from "next/server";

import { sanitizeNextPath } from "@/lib/auth/redirect";
import { clearSessionCookies } from "@/lib/auth/session";

function requestedPath(request: NextRequest): string | null {
  const explicit = request.nextUrl.searchParams.get("next");
  if (explicit) {
    return explicit;
  }
  const referer = request.headers.get("referer");
  if (!referer) {
    return null;
  }
  try {
    const url = new URL(referer);
    if (url.origin !== request.nextUrl.origin) {
      return null;
    }
    return `${url.pathname}${url.search}`;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const next = sanitizeNextPath(requestedPath(request));
  await clearSessionCookies();

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.search = "";
  loginUrl.searchParams.set("expired", "1");
  if (next !== "/") {
    loginUrl.searchParams.set("next", next);
  }
  return NextResponse.redirect(loginUrl);
}
