import { describe, expect, it } from "vitest";
import { formatTomanFromRial } from "./money";
import { numberFormatFa } from "./digits";

describe("formatTomanFromRial", () => {
  it("converts rials to tomans and uses Persian digits", () => {
    const result = formatTomanFromRial(10_000);

    expect(result).toBe(`${numberFormatFa(1_000)} تومان`);
    expect(result).not.toMatch(/[0-9]/);
  });
});
