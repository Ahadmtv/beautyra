import { describe, expect, it } from "vitest";

import type { Service } from "../types";
import { type ProviderMeta, toProviderCardView } from "./provider-card";

const service: Service = {
  id: 11,
  provider_id: 4,
  name: "کوتاهی مو",
  description: "",
  category: "haircut",
  duration_minutes: 30,
  price_irr: 500_000,
  buffer_minutes: 5,
  is_active: true,
};

const meta: ProviderMeta = {
  name: "آرایشگاه سارا",
  city: "تهران",
  neighborhood: "میرداماد",
  avatarUrl: null,
  rating: 4,
  reviewCount: 120,
};

describe("toProviderCardView", () => {
  it("maps contract fields and marks public services as verified", () => {
    const card = toProviderCardView(service, null);

    expect(card).toEqual({
      id: 11,
      name: "کوتاهی مو",
      serviceName: "کوتاهی مو",
      category: "haircut",
      categoryLabel: "کوتاهی مو",
      priceIrr: 500_000,
      city: null,
      neighborhood: null,
      avatarUrl: null,
      rating: null,
      reviewCount: null,
      verified: true,
    });
  });

  it("applies provider metadata when available", () => {
    const card = toProviderCardView(service, meta);

    expect(card.name).toBe("آرایشگاه سارا");
    expect(card.serviceName).toBe("کوتاهی مو");
    expect(card.category).toBe("haircut");
    expect(card.categoryLabel).toBe("کوتاهی مو");
    expect(card.city).toBe("تهران");
    expect(card.neighborhood).toBe("میرداماد");
    expect(card.rating).toBe(4);
    expect(card.reviewCount).toBe(120);
  });
});
