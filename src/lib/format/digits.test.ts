import { describe, expect, it } from "vitest";

import { toAsciiDigits } from "./digits";

describe("toAsciiDigits", () => {
  it("converts Persian digits", () => {
    expect(toAsciiDigits("۰۹۱۲۳")).toBe("09123");
  });

  it("converts Arabic-Indic digits", () => {
    expect(toAsciiDigits("٠٩١٢")).toBe("0912");
  });

  it("leaves ASCII digits unchanged", () => {
    expect(toAsciiDigits("123456")).toBe("123456");
  });
});
