import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";

import { SESSION_REFRESH_COOKIE_NAME, env } from "@/config/env";
import { ApiError } from "@/lib/api/problem";

import type { Role, Session } from "./claims";
import { isRoleAllowed } from "./guards";
import { getAuthProvider } from "./provider";
import type { SessionTokens } from "./types";

const REFRESH_COOKIE_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

export async function getSessionToken(): Promise<string | undefined> {
  return (await cookies()).get(env.SESSION_COOKIE_NAME)?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
  return (await cookies()).get(SESSION_REFRESH_COOKIE_NAME)?.value;
}

export async function getSession(): Promise<Session | null> {
  await connection();
  const token = await getSessionToken();
  if (!token) {
    return null;
  }
  return getAuthProvider().getSession(token);
}

export async function requireRole(allowed: Role | readonly Role[]): Promise<Session> {
  const roles: readonly Role[] = typeof allowed === "string" ? [allowed] : allowed;
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  if (!isRoleAllowed(session, roles)) {
    redirect("/");
  }
  return session;
}

export async function setSessionCookies(tokens: SessionTokens): Promise<void> {
  const store = await cookies();
  store.set(env.SESSION_COOKIE_NAME, tokens.token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    expires: new Date(tokens.expiresAt * 1000),
  });

  if (tokens.refreshToken) {
    store.set(SESSION_REFRESH_COOKIE_NAME, tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: REFRESH_COOKIE_MAX_AGE_SECONDS,
    });
  } else {
    store.delete(SESSION_REFRESH_COOKIE_NAME);
  }
}

export async function clearSessionCookies(): Promise<void> {
  const store = await cookies();
  store.delete(env.SESSION_COOKIE_NAME);
  store.delete(SESSION_REFRESH_COOKIE_NAME);
}

export function redirectOnUnauthorized(error: unknown): void {
  if (error instanceof ApiError && error.status === 401) {
    redirect("/auth/expired");
  }
}
