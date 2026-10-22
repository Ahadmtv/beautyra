import { describe, expect, it } from "vitest";

import type { ProviderCardView } from "@/lib/api/adapters/provider-card";

import { buildListingHref, filterProviderCards, matchesFilters, parseListingFilters } from "./filters";

const card: ProviderCardView = {
  id: 1,
  providerName: "Sara Salon",
  serviceName: "Haircut",
  category: "skin-care",
  categoryLabel: "Skin care",
  priceIrr: 500_000,
  verified: true,
};

describe("parseListingFilters", () => {
  it("keeps only known category values", () => {
    const params = new URLSearchParams("category=skin-care&city=tehran&neighborhood=vanak");

    expect(parseListingFilters(params)).toEqual({
      category: "skin-care",
      q: undefined,
    });
  });

  it("ignores legacy location filters and former medical specialties", () => {
    expect(parseListingFilters(new URLSearchParams("city=tehran&neighborhood=vanak"))).toEqual({
      category: undefined,
      q: undefined,
    });
    expect(parseListingFilters(new URLSearchParams("category=dermatology")).category).toBeUndefined();
    expect(parseListingFilters(new URLSearchParams("specialty=dermatology")).category).toBeUndefined();
  });

  it("trims and bounds the search query", () => {
    const params = new URLSearchParams({ q: `  ${"a".repeat(120)}  ` });

    expect(parseListingFilters(params).q).toHaveLength(100);
  });

  it("treats a blank query as no query", () => {
    expect(parseListingFilters(new URLSearchParams("q=%20%20")).q).toBeUndefined();
  });
});

describe("matchesFilters", () => {
  it("matches the beauty category by its stable value", () => {
    expect(matchesFilters(card, { category: "skin-care" })).toBe(true);
    expect(matchesFilters(card, { category: "makeup" })).toBe(false);
  });

  it("matches the query against provider, service, and category names", () => {
    expect(matchesFilters(card, { q: "Sara" })).toBe(true);
    expect(matchesFilters(card, { q: "Haircut" })).toBe(true);
    expect(matchesFilters(card, { q: "Skin care" })).toBe(true);
    expect(matchesFilters(card, { q: "Unknown" })).toBe(false);
  });

  it("matches the service name when the provider name is unavailable", () => {
    expect(matchesFilters({ ...card, providerName: null }, { q: "Haircut" })).toBe(true);
    expect(matchesFilters({ ...card, providerName: null }, { q: "Sara" })).toBe(false);
  });

  it("accepts every card when no filter is set", () => {
    expect(matchesFilters(card, {})).toBe(true);
  });
});

describe("filterProviderCards", () => {
  it("keeps only cards that satisfy every filter", () => {
    const other: ProviderCardView = {
      ...card,
      id: 2,
      category: "nails",
      categoryLabel: "Nails",
    };

    expect(filterProviderCards([card, other], { category: "nails" })).toEqual([other]);
  });
});

describe("buildListingHref", () => {
  it("returns the root path when no parameters remain", () => {
    expect(buildListingHref(new URLSearchParams("cursor=50"), {})).toBe("/");
  });

  it("drops the cursor and legacy location parameters", () => {
    const current = new URLSearchParams("city=tehran&neighborhood=vanak&cursor=50");

    expect(buildListingHref(current, { category: "skin-care" })).toBe("/?category=skin-care");
  });

  it("removes a parameter when its value is null", () => {
    const current = new URLSearchParams("category=skin-care&q=Haircut");

    expect(buildListingHref(current, { category: null })).toBe("/?q=Haircut");
  });
});
