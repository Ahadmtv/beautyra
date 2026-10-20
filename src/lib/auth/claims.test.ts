import { describe, expect, it } from "vitest";

import { sessionFromClaims } from "./claims";
import { isRoleAllowed } from "./guards";

const NOW = 1_700_000_000;

describe("sessionFromClaims", () => {
  it("maps backend claims to a session", () => {
    expect(
      sessionFromClaims(
        {
          sub: "42",
          user_id: 42,
          email: "provider@example.com",
          roles: ["client", "provider"],
          exp: NOW + 60,
        },
        NOW,
      ),
    ).toEqual({
      userId: "42",
      role: "provider",
      roles: ["client", "provider"],
      email: "provider@example.com",
      expiresAt: NOW + 60,
    });
  });

  it("falls back to sub when user_id is absent", () => {
    expect(sessionFromClaims({ sub: "u1", roles: ["client"], exp: NOW + 60 }, NOW)).toMatchObject({
      userId: "u1",
      role: "client",
    });
  });

  it("prefers admin as the primary role", () => {
    expect(
      sessionFromClaims({ user_id: 1, roles: ["client", "provider", "admin"], exp: NOW + 60 }, NOW)
        ?.role,
    ).toBe("admin");
  });

  it("rejects tokens that expire at or before now", () => {
    expect(sessionFromClaims({ sub: "u1", roles: ["client"], exp: NOW }, NOW)).toBeNull();
  });

  it("rejects unknown roles", () => {
    expect(sessionFromClaims({ sub: "u1", roles: ["superuser"], exp: NOW + 60 }, NOW)).toBeNull();
  });

  it("rejects an empty role list", () => {
    expect(sessionFromClaims({ sub: "u1", roles: [], exp: NOW + 60 }, NOW)).toBeNull();
  });

  it("rejects missing subject", () => {
    expect(sessionFromClaims({ roles: ["client"], exp: NOW + 60 }, NOW)).toBeNull();
  });

  it("rejects non-object payloads", () => {
    expect(sessionFromClaims(null, NOW)).toBeNull();
  });
});

describe("isRoleAllowed", () => {
  const clientSession = {
    userId: "u1",
    role: "client" as const,
    roles: ["client"] as const,
    expiresAt: NOW + 60,
  };

  it("denies when there is no session", () => {
    expect(isRoleAllowed(null, ["client"])).toBe(false);
  });

  it("denies a role outside the allowed list", () => {
    expect(isRoleAllowed(clientSession, ["provider", "admin"])).toBe(false);
  });

  it("allows a role inside the allowed list", () => {
    expect(isRoleAllowed(clientSession, ["client", "admin"])).toBe(true);
  });

  it("allows a secondary role", () => {
    const multiRole = { ...clientSession, role: "provider" as const, roles: ["client", "provider"] as const };
    expect(isRoleAllowed(multiRole, ["provider"])).toBe(true);
  });
});
