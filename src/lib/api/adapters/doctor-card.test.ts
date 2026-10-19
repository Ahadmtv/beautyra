import { describe, expect, it } from "vitest";

import type { Service } from "../types";
import { type ProviderMeta, toDoctorCardView } from "./doctor-card";

const service: Service = {
  id: 11,
  provider_id: 4,
  name: "کوتاهی مو",
  description: "",
  duration_minutes: 30,
  price_irr: 500_000,
  buffer_minutes: 5,
  is_active: true,
};

const meta: ProviderMeta = {
  name: "آرایشگاه سارا",
  specialties: ["اصلاح ابرو"],
  city: "تهران",
  neighborhood: "ولنجک",
  avatarUrl: null,
  rating: 4,
  reviewCount: 120,
};

describe("toDoctorCardView", () => {
  it("maps contract fields and marks public services as verified", () => {
    const card = toDoctorCardView(service, null);

    expect(card).toEqual({
      id: 11,
      name: "کوتاهی مو",
      specialties: [],
      city: null,
      neighborhood: null,
      avatarUrl: null,
      rating: null,
      reviewCount: null,
      verified: true,
    });
  });

  it("applies provider metadata when available", () => {
    const card = toDoctorCardView(service, meta);

    expect(card.name).toBe("آرایشگاه سارا");
    expect(card.specialties).toEqual(["اصلاح ابرو"]);
    expect(card.city).toBe("تهران");
    expect(card.neighborhood).toBe("ولنجک");
    expect(card.rating).toBe(4);
    expect(card.reviewCount).toBe(120);
  });
});
