import { describe, expect, it } from "vitest";
import { formatJalaliDate } from "./format";

describe("formatJalaliDate", () => {
  it("renders Nowruz 1404 with Persian digits", () => {
    const result = formatJalaliDate("2025-03-21T00:00:00Z");

    expect(result).toContain("۱۴۰۴");
    expect(result).not.toMatch(/[0-9]/);
  });
});
