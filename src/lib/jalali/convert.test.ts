import { describe, expect, it } from "vitest";
import { gregorianToJalali, jalaliToGregorian } from "./convert";

describe("jalaliToGregorian", () => {
  it.each([
    [1404, 1, 1, 2025, 3, 21],
    [1403, 1, 1, 2024, 3, 20],
    [1400, 1, 1, 2021, 3, 21],
    [1403, 12, 30, 2025, 3, 20],
  ])("converts %i/%i/%i to %i-%i-%i", (jy, jm, jd, gy, gm, gd) => {
    expect(jalaliToGregorian({ year: jy, month: jm, day: jd })).toEqual({
      year: gy,
      month: gm,
      day: gd,
    });
  });
});

describe("gregorianToJalali", () => {
  it.each([
    [2025, 3, 21, 1404, 1, 1],
    [2024, 3, 20, 1403, 1, 1],
    [2021, 3, 21, 1400, 1, 1],
    [2025, 3, 20, 1403, 12, 30],
  ])("converts %i-%i-%i to %i/%i/%i", (gy, gm, gd, jy, jm, jd) => {
    expect(gregorianToJalali({ year: gy, month: gm, day: gd })).toEqual({
      year: jy,
      month: jm,
      day: jd,
    });
  });

  it("round-trips every day across a long range", () => {
    for (let jy = 1380; jy <= 1420; jy += 1) {
      for (let jm = 1; jm <= 12; jm += 1) {
        const maxDay = jm <= 6 ? 31 : jm <= 11 ? 30 : 29;
        for (let jd = 1; jd <= maxDay; jd += 1) {
          const jalali = { year: jy, month: jm, day: jd };
          const gregorian = jalaliToGregorian(jalali);
          expect(gregorianToJalali(gregorian)).toEqual(jalali);
        }
      }
    }
  });
});
