import "server-only";

import { cookies } from "next/headers";

import { env } from "@/config/env";

import { ApiError, parseProblem } from "./problem";

type CacheOptions = { revalidate: number; tags: string[] };

type ApiRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  query?: URLSearchParams;
  auth?: boolean;
  idempotencyKey?: string;
  cache?: CacheOptions | "no-store";
  timeoutMs?: number;
};

const DEFAULT_TIMEOUT_MS = 10_000;

export async function apiFetch<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const {
    method = "GET",
    body,
    query,
    auth = false,
    idempotencyKey,
    cache = "no-store",
    timeoutMs = DEFAULT_TIMEOUT_MS,
  } = options;

  const url = new URL(`${env.API_BASE_URL.replace(/\/$/, "")}${path}`);
  if (query) {
    url.search = query.toString();
  }

  const headers = new Headers({ Accept: "application/json" });
  if (body !== undefined) {
    headers.set("Content-Type", "application/json");
  }
  if (idempotencyKey) {
    headers.set("Idempotency-Key", idempotencyKey);
  }
  if (auth) {
    const token = (await cookies()).get(env.SESSION_COOKIE_NAME)?.value;
    if (!token) {
      throw new ApiError({
        status: 401,
        code: "session_missing",
        title: "Session cookie is missing",
        requestId: "",
      });
    }
    headers.set("Authorization", `Bearer ${token}`);
  }

  const init: RequestInit = {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(timeoutMs),
    ...(cache === "no-store" ? { cache: "no-store" as const } : { next: cache }),
  };

  let response: Response;
  try {
    response = await fetch(url, init);
  } catch {
    throw new ApiError({
      status: 503,
      code: "upstream_unreachable",
      title: "Upstream API is unreachable",
      requestId: "",
    });
  }

  if (!response.ok) {
    throw await parseProblem(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
