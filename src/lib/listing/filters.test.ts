import { describe, expect, it } from "vitest";

import type { DoctorCardView } from "@/lib/api/adapters/doctor-card";

import { buildListingHref, filterDoctorCards, matchesFilters, parseListingFilters } from "./filters";

const card: DoctorCardView = {
  id: 1,
  name: "دکتر سارا محمدی",
  specialties: ["پوست و مو"],
  city: "تهران",
  neighborhood: "میرداماد",
  avatarUrl: null,
  rating: 4,
  reviewCount: 120,
  verified: true,
};

describe("parseListingFilters", () => {
  it("keeps only known option values", () => {
    const params = new URLSearchParams("specialty=dermatology&city=unknown&neighborhood=vanak");

    expect(parseListingFilters(params)).toEqual({
      specialty: "dermatology",
      city: undefined,
      neighborhood: "vanak",
      q: undefined,
    });
  });

  it("trims and bounds the search query", () => {
    const params = new URLSearchParams({ q: `  ${"الف".repeat(80)}  ` });

    expect(parseListingFilters(params).q).toHaveLength(100);
  });

  it("treats a blank query as no query", () => {
    expect(parseListingFilters(new URLSearchParams("q=%20%20")).q).toBeUndefined();
  });
});

describe("matchesFilters", () => {
  it("matches the specialty by its Persian label", () => {
    expect(matchesFilters(card, { specialty: "dermatology" })).toBe(true);
    expect(matchesFilters(card, { specialty: "cardiology" })).toBe(false);
  });

  it("matches city and neighborhood by their Persian labels", () => {
    expect(matchesFilters(card, { city: "tehran", neighborhood: "mirdamad" })).toBe(true);
    expect(matchesFilters(card, { city: "karaj" })).toBe(false);
    expect(matchesFilters(card, { neighborhood: "vanak" })).toBe(false);
  });

  it("matches the query against the name and specialties", () => {
    expect(matchesFilters(card, { q: "سارا" })).toBe(true);
    expect(matchesFilters(card, { q: "پوست" })).toBe(true);
    expect(matchesFilters(card, { q: "ارتوپدی" })).toBe(false);
  });

  it("accepts every card when no filter is set", () => {
    expect(matchesFilters(card, {})).toBe(true);
  });
});

describe("filterDoctorCards", () => {
  it("keeps only cards that satisfy every filter", () => {
    const other: DoctorCardView = { ...card, id: 2, specialties: ["ارتوپدی"] };

    expect(filterDoctorCards([card, other], { specialty: "orthopedics" })).toEqual([other]);
  });
});

describe("buildListingHref", () => {
  it("returns the root path when no parameters remain", () => {
    expect(buildListingHref(new URLSearchParams("cursor=50"), {})).toBe("/");
  });

  it("drops the cursor and applies changes", () => {
    const current = new URLSearchParams("city=tehran&cursor=50");

    expect(buildListingHref(current, { specialty: "dermatology" })).toBe(
      "/?city=tehran&specialty=dermatology",
    );
  });

  it("removes a parameter when its value is null", () => {
    const current = new URLSearchParams("specialty=dermatology&city=tehran");

    expect(buildListingHref(current, { specialty: null })).toBe("/?city=tehran");
  });
});
