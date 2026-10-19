import { describe, expect, it } from "vitest";

import { jalaliDateTimeToGregorian, jalaliDateToGregorianIso } from "./jalali-date";

describe("Jalali provider date inputs", () => {
  it("converts Persian-digit holidays to Gregorian dates", () => {
    expect(jalaliDateToGregorianIso("۱۴۰۴/۰۱/۰۱")).toBe("2025-03-21");
  });

  it("preserves the explicit time-zone offset in converted date-times", () => {
    expect(jalaliDateTimeToGregorian("۱۴۰۴-۰۱-۰۱T۰۹:۰۰:۰۰+۰۳:۳۰")).toBe("2025-03-21T09:00:00+03:30");
  });

  it("rejects invalid Jalali calendar days", () => {
    expect(jalaliDateToGregorianIso("۱۴۰۴/۱۳/۰۱")).toBeNull();
    expect(jalaliDateToGregorianIso("۱۴۰۴/۱۲/۳۰")).toBeNull();
  });
});
