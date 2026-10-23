import "server-only";

import { cookies } from "next/headers";

import { env } from "@/config/env";

import { ApiError, parseProblem } from "./problem";

type ApiRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  query?: URLSearchParams;
  auth?: boolean;
  idempotencyKey?: string;
  timeoutMs?: number;
  cache?: RequestCache;
};

const DEFAULT_TIMEOUT_MS = 10_000;

// Caching is decided by the caller: under cacheComponents, fetch is uncached unless it runs inside a "use cache" scope.
export async function apiFetch<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  return (await apiFetchWithStatus<T>(path, options)).data;
}

export async function apiFetchWithStatus<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<{ data: T; status: number }> {
  const {
    method = "GET",
    body,
    query,
    auth = false,
    idempotencyKey,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    cache,
  } = options;

  const url = new URL(`${env.API_BASE_URL.replace(/\/$/, "")}${path}`);
  if (query) {
    url.search = query.toString();
  }

  const headers = new Headers({ Accept: "application/json" });
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  if (body !== undefined && !isFormData) {
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
    body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
    cache,
    signal: AbortSignal.timeout(timeoutMs),
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

  const data = response.status === 204 ? undefined : ((await response.json()) as T);
  return { data: data as T, status: response.status };
}
