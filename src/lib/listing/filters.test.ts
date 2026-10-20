import { describe, expect, it } from "vitest";

import type { ProviderCardView } from "@/lib/api/adapters/provider-card";

import { buildListingHref, filterProviderCards, matchesFilters, parseListingFilters } from "./filters";

const card: ProviderCardView = {
  id: 1,
  name: "سالن زیبایی سارا",
  category: "skin-care",
  categoryLabel: "مراقبت پوست",
  city: "تهران",
  neighborhood: "میرداماد",
  avatarUrl: null,
  rating: 4,
  reviewCount: 120,
  verified: true,
};

describe("parseListingFilters", () => {
  it("keeps only known option values", () => {
    const params = new URLSearchParams("category=skin-care&city=unknown&neighborhood=vanak");

    expect(parseListingFilters(params)).toEqual({
      category: "skin-care",
      city: undefined,
      neighborhood: "vanak",
      q: undefined,
    });
  });

  it("rejects former medical specialty values", () => {
    expect(parseListingFilters(new URLSearchParams("category=dermatology")).category).toBeUndefined();
    expect(parseListingFilters(new URLSearchParams("specialty=dermatology")).category).toBeUndefined();
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
  it("matches the beauty category by its stable value", () => {
    expect(matchesFilters(card, { category: "skin-care" })).toBe(true);
    expect(matchesFilters(card, { category: "makeup" })).toBe(false);
  });

  it("matches city and neighborhood by their Persian labels", () => {
    expect(matchesFilters(card, { city: "tehran", neighborhood: "mirdamad" })).toBe(true);
    expect(matchesFilters(card, { city: "karaj" })).toBe(false);
    expect(matchesFilters(card, { neighborhood: "vanak" })).toBe(false);
  });

  it("matches the query against the name and category label", () => {
    expect(matchesFilters(card, { q: "سارا" })).toBe(true);
    expect(matchesFilters(card, { q: "مراقبت" })).toBe(true);
    expect(matchesFilters(card, { q: "ارتوپدی" })).toBe(false);
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
      categoryLabel: "ناخن",
    };

    expect(filterProviderCards([card, other], { category: "nails" })).toEqual([other]);
  });
});

describe("buildListingHref", () => {
  it("returns the root path when no parameters remain", () => {
    expect(buildListingHref(new URLSearchParams("cursor=50"), {})).toBe("/");
  });

  it("drops the cursor and applies changes", () => {
    const current = new URLSearchParams("city=tehran&cursor=50");

    expect(buildListingHref(current, { category: "skin-care" })).toBe(
      "/?city=tehran&category=skin-care",
    );
  });

  it("removes a parameter when its value is null", () => {
    const current = new URLSearchParams("category=skin-care&city=tehran");

    expect(buildListingHref(current, { category: null })).toBe("/?city=tehran");
  });
});
