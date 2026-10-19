import { describe, expect, it } from "vitest";

import { createUnsignedJwt, decodeJwtPayload } from "./jwt";

describe("JWT helpers", () => {
  it("round-trips a payload", () => {
    const token = createUnsignedJwt({ sub: "u1", role: "admin", exp: 123 });
    expect(decodeJwtPayload(token)).toEqual({ sub: "u1", role: "admin", exp: 123 });
  });

  it("round-trips non-ASCII characters", () => {
    const token = createUnsignedJwt({ name: "علی" });
    expect(decodeJwtPayload(token)).toEqual({ name: "علی" });
  });

  it.each(["abc", "a.b.c", "a.b"])("returns null for malformed token %s", (token) => {
    expect(decodeJwtPayload(token)).toBeNull();
  });
});
