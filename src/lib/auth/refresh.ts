import "server-only";

import { getAuthProvider } from "./provider";
import type { SessionTokens } from "./types";

const inFlight = new Map<string, Promise<SessionTokens | null>>();

// Refresh tokens rotate and replay revokes the whole token family. Concurrent
// requests that carry the same expired cookie must share one rotation attempt.
export function refreshSession(refreshToken: string): Promise<SessionTokens | null> {
  const existing = inFlight.get(refreshToken);
  if (existing) {
    return existing;
  }

  const pending = getAuthProvider()
    .refresh(refreshToken)
    .finally(() => {
      inFlight.delete(refreshToken);
    });
  inFlight.set(refreshToken, pending);
  return pending;
}
