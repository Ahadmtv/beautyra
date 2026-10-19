import { describe, expect, it } from "vitest";

import { sessionFromClaims } from "./claims";
import { isRoleAllowed } from "./guards";

const NOW = 1_700_000_000;

describe("sessionFromClaims", () => {
  it("maps valid claims to a session", () => {
    expect(sessionFromClaims({ sub: "u1", role: "provider", exp: NOW + 60 }, NOW)).toEqual({
      userId: "u1",
      role: "provider",
      expiresAt: NOW + 60,
    });
  });

  it("rejects tokens that expire at or before now", () => {
    expect(sessionFromClaims({ sub: "u1", role: "client", exp: NOW }, NOW)).toBeNull();
  });

  it("rejects unknown roles", () => {
    expect(sessionFromClaims({ sub: "u1", role: "superuser", exp: NOW + 60 }, NOW)).toBeNull();
  });

  it("rejects missing subject", () => {
    expect(sessionFromClaims({ role: "client", exp: NOW + 60 }, NOW)).toBeNull();
  });

  it("rejects non-object payloads", () => {
    expect(sessionFromClaims(null, NOW)).toBeNull();
  });
});

describe("isRoleAllowed", () => {
  const clientSession = { userId: "u1", role: "client" as const, expiresAt: NOW + 60 };

  it("denies when there is no session", () => {
    expect(isRoleAllowed(null, ["client"])).toBe(false);
  });

  it("denies a role outside the allowed list", () => {
    expect(isRoleAllowed(clientSession, ["provider", "admin"])).toBe(false);
  });

  it("allows a role inside the allowed list", () => {
    expect(isRoleAllowed(clientSession, ["client", "admin"])).toBe(true);
  });
});
