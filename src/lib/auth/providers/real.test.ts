import { afterEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "@/lib/api/problem";

import { RefreshInProgressError } from "../types";

vi.mock("@/config/env", () => ({
  env: { API_BASE_URL: "http://api.test" },
}));

import { realAuthProvider } from "./real";

function problemResponse(status: number, code: string): Response {
  return new Response(
    JSON.stringify({
      type: "about:blank",
      title: "problem",
      status,
      code,
      request_id: "req-1",
    }),
    {
      status,
      headers: { "content-type": "application/problem+json" },
    },
  );
}

describe("realAuthProvider.refresh", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns null for invalid refresh credentials", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => problemResponse(401, "invalid_credentials")));

    await expect(realAuthProvider.refresh("stale-token")).resolves.toBeNull();
  });

  it("signals a concurrent rotation as retryable", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => problemResponse(409, "refresh_in_progress")));

    await expect(realAuthProvider.refresh("active-token")).rejects.toBeInstanceOf(
      RefreshInProgressError,
    );
  });

  it("propagates other refresh failures", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => problemResponse(429, "rate_limited")));

    await expect(realAuthProvider.refresh("active-token")).rejects.toBeInstanceOf(ApiError);
  });
});
