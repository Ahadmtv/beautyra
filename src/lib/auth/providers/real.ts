import { z } from "zod";

import { env } from "@/config/env";
import { ApiError, parseProblem } from "@/lib/api/problem";

import { sessionFromClaims } from "../claims";
import { decodeJwtPayload, nowSeconds } from "../jwt";
import {
  InvalidCredentialsError,
  RefreshInProgressError,
  type AuthProvider,
  type SessionTokens,
} from "../types";

const tokenPairSchema = z.object({
  access_token: z.string().min(1),
  refresh_token: z.string().min(1),
  expires_in: z.number().int().positive(),
});

const REQUEST_TIMEOUT_MS = 10_000;

async function postAuth(path: string, body: unknown): Promise<Response> {
  try {
    return await fetch(`${env.API_BASE_URL.replace(/\/$/, "")}${path}`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch {
    throw new ApiError({
      status: 503,
      code: "upstream_unreachable",
      title: "Authentication service is unreachable",
      requestId: "",
    });
  }
}

async function readTokens(response: Response): Promise<SessionTokens> {
  const parsed = tokenPairSchema.safeParse(await response.json().catch(() => null));
  if (!parsed.success) {
    throw new ApiError({
      status: 502,
      code: "invalid_auth_response",
      title: "Authentication service returned an invalid response",
      requestId: response.headers.get("x-request-id") ?? "",
    });
  }

  const session = sessionFromClaims(decodeJwtPayload(parsed.data.access_token), nowSeconds());
  if (!session) {
    throw new ApiError({
      status: 401,
      code: "invalid_token",
      title: "Authentication service returned an invalid access token",
      requestId: response.headers.get("x-request-id") ?? "",
    });
  }

  return {
    token: parsed.data.access_token,
    refreshToken: parsed.data.refresh_token,
    expiresAt: session.expiresAt,
  };
}

export const realAuthProvider: AuthProvider = {
  async login(input) {
    if (!("email" in input)) {
      throw new InvalidCredentialsError();
    }

    const response = await postAuth("/api/v1/auth/login", {
      email: input.email,
      password: input.password,
    });
    if (response.status === 401) {
      throw new InvalidCredentialsError();
    }
    if (!response.ok) {
      throw await parseProblem(response);
    }
    return readTokens(response);
  },

  async refresh(refreshToken) {
    const response = await postAuth("/api/v1/auth/refresh", {
      refresh_token: refreshToken,
    });
    if (response.status === 401) {
      return null;
    }
    if (!response.ok) {
      const problem = await parseProblem(response);
      if (problem.status === 409 && problem.code === "refresh_in_progress") {
        throw new RefreshInProgressError();
      }
      throw problem;
    }
    return readTokens(response);
  },

  async getSession(token) {
    return sessionFromClaims(decodeJwtPayload(token), nowSeconds());
  },

  async logout(refreshToken) {
    if (!refreshToken) {
      return;
    }
    try {
      await postAuth("/api/v1/auth/logout", { refresh_token: refreshToken });
    } catch {
      // Local session cleanup must not depend on the backend being reachable.
    }
  },
};
