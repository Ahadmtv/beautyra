import { NextResponse, type NextRequest } from "next/server";

import { refreshSession } from "@/lib/auth/refresh";
import { sanitizeNextPath } from "@/lib/auth/redirect";
import { clearSessionCookies, getRefreshToken, setSessionCookies } from "@/lib/auth/session";
import { RefreshInProgressError, type SessionTokens } from "@/lib/auth/types";

function expired(request: NextRequest, next: string) {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.search = "";
  loginUrl.searchParams.set("expired", "1");
  if (next !== "/") {
    loginUrl.searchParams.set("next", next);
  }
  return NextResponse.redirect(loginUrl);
}

export async function GET(request: NextRequest) {
  const next = sanitizeNextPath(request.nextUrl.searchParams.get("next"));
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    await clearSessionCookies();
    return expired(request, next);
  }

  let tokens: SessionTokens | null;
  try {
    tokens = await refreshSession(refreshToken);
  } catch (error) {
    if (error instanceof RefreshInProgressError) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return NextResponse.redirect(new URL(next, request.url));
    }
    throw error;
  }
  if (!tokens) {
    await clearSessionCookies();
    return expired(request, next);
  }

  await setSessionCookies(tokens);
  return NextResponse.redirect(new URL(next, request.url));
}
