import { describe, expect, it } from "vitest";

import { validateWorkingHours } from "./working-hours";

describe("validateWorkingHours", () => {
  it("accepts separated intervals and adjacent boundaries", () => {
    expect(
      validateWorkingHours([
        { weekday: 6, opens_at: "09:00", closes_at: "12:00" },
        { weekday: 6, opens_at: "12:00", closes_at: "17:00" },
        { weekday: 7, opens_at: "10:00", closes_at: "18:00" },
      ]),
    ).toBe(true);
  });

  it("rejects overlapping intervals and crossing midnight", () => {
    expect(
      validateWorkingHours([
        { weekday: 1, opens_at: "09:00", closes_at: "12:00" },
        { weekday: 1, opens_at: "11:30", closes_at: "14:00" },
      ]),
    ).toBe(false);
    expect(validateWorkingHours([{ weekday: 1, opens_at: "22:00", closes_at: "02:00" }])).toBe(false);
  });

  it("rejects invalid ISO weekdays and times", () => {
    expect(validateWorkingHours([{ weekday: 0, opens_at: "09:00", closes_at: "10:00" }])).toBe(false);
    expect(validateWorkingHours([{ weekday: 1, opens_at: "9:00", closes_at: "10:00" }])).toBe(false);
  });
});
