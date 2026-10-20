import { describe, expect, it } from "vitest";

import { sanitizeNextPath } from "./redirect";

describe("sanitizeNextPath", () => {
  it("keeps same-origin paths with query strings", () => {
    expect(sanitizeNextPath("/book?service=1")).toBe("/book?service=1");
  });

  it.each([
    ["absolute URL", "https://evil.example/phish"],
    ["protocol-relative URL", "//evil.example"],
    ["backslash-prefixed URL", "/\\evil.example"],
    ["javascript scheme", "javascript:alert(1)"],
    ["control characters", "/book\n//evil.example"],
    ["relative path without leading slash", "book"],
    ["login page", "/login?next=/book"],
    ["refresh endpoint", "/auth/refresh?next=/book"],
    ["empty value", ""],
    ["missing value", null],
  ])("falls back to root for %s", (_label, value) => {
    expect(sanitizeNextPath(value)).toBe("/");
  });
});
