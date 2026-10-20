import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";

import { env } from "@/config/env";
import { ApiError } from "@/lib/api/problem";

import type { Role, Session } from "./claims";
import { isRoleAllowed } from "./guards";
import { getAuthProvider } from "./provider";

export async function getSessionToken(): Promise<string | undefined> {
  return (await cookies()).get(env.SESSION_COOKIE_NAME)?.value;
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

export async function setSessionCookie(token: string, expiresAt: number): Promise<void> {
  (await cookies()).set(env.SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    expires: new Date(expiresAt * 1000),
  });
}

export async function clearSessionCookie(): Promise<void> {
  (await cookies()).delete(env.SESSION_COOKIE_NAME);
}

export function redirectOnUnauthorized(error: unknown): void {
  if (error instanceof ApiError && error.status === 401) {
    redirect("/auth/expired");
  }
}
