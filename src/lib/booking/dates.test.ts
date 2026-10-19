import { describe, expect, it } from "vitest";
import {
  addDaysToIsoDate,
  formatSlotTime,
  isIsoDate,
  resolveSelectedDate,
  todayInTimeZone,
  weekdayIndexOfIsoDate,
} from "./dates";

describe("isIsoDate", () => {
  it("accepts real calendar dates", () => {
    expect(isIsoDate("2025-03-15")).toBe(true);
    expect(isIsoDate("2024-02-29")).toBe(true);
  });

  it("rejects malformed and impossible dates", () => {
    expect(isIsoDate("2025-02-29")).toBe(false);
    expect(isIsoDate("2025-3-15")).toBe(false);
    expect(isIsoDate("۲۰۲۵-۰۳-۱۵")).toBe(false);
    expect(isIsoDate("")).toBe(false);
  });
});

describe("addDaysToIsoDate", () => {
  it("crosses month and year boundaries", () => {
    expect(addDaysToIsoDate("2025-02-27", 2)).toBe("2025-03-01");
    expect(addDaysToIsoDate("2025-12-31", 1)).toBe("2026-01-01");
  });

  it("moves backwards", () => {
    expect(addDaysToIsoDate("2025-03-01", -1)).toBe("2025-02-28");
  });
});

describe("weekdayIndexOfIsoDate", () => {
  it("returns the day of week with Sunday as 0", () => {
    expect(weekdayIndexOfIsoDate("2025-03-16")).toBe(0);
    expect(weekdayIndexOfIsoDate("2025-03-15")).toBe(6);
  });
});

describe("todayInTimeZone", () => {
  it("uses the provider's calendar date, not the UTC date", () => {
    const now = new Date("2025-03-20T22:00:00Z");

    expect(todayInTimeZone("Asia/Tehran", now)).toBe("2025-03-21");
    expect(todayInTimeZone("UTC", now)).toBe("2025-03-20");
  });
});

describe("resolveSelectedDate", () => {
  const today = "2025-03-21";

  it("keeps a valid date that is not in the past", () => {
    expect(resolveSelectedDate("2025-03-25", today)).toBe("2025-03-25");
    expect(resolveSelectedDate(today, today)).toBe(today);
  });

  it("falls back to today for missing, invalid, or past dates", () => {
    expect(resolveSelectedDate(undefined, today)).toBe(today);
    expect(resolveSelectedDate("not-a-date", today)).toBe(today);
    expect(resolveSelectedDate("2025-03-01", today)).toBe(today);
  });
});

describe("formatSlotTime", () => {
  it("formats the instant in the given zone with Persian digits", () => {
    expect(formatSlotTime("2025-03-15T06:00:00Z", "Asia/Tehran")).toBe("۰۹:۳۰");
  });

  it("pads single-digit hours and minutes", () => {
    expect(formatSlotTime("2025-03-15T04:05:00Z", "UTC")).toBe("۰۴:۰۵");
  });
});
