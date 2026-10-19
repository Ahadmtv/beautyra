import { describe, expect, it } from "vitest";
import { describeJalaliDate } from "./labels";

describe("describeJalaliDate", () => {
  it("returns Persian weekday, day, month, and year for a Gregorian ISO date", () => {
    expect(describeJalaliDate("2025-03-21")).toEqual({
      weekday: "جمعه",
      day: "۱",
      month: "فروردین",
      year: "۱۴۰۴",
    });
  });
});
