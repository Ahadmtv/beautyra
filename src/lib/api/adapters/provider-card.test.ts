import { describe, expect, it } from "vitest";

import type { Service } from "../types";
import { normalizeProviderDisplayName, toProviderCardView } from "./provider-card";

const service: Service = {
  id: 11,
  provider_id: 4,
  name: "Haircut",
  description: "",
  category: "haircut",
  duration_minutes: 30,
  price_irr: 500_000,
  buffer_minutes: 5,
  is_active: true,
  provider_display_name: "Sara Salon",
};

describe("toProviderCardView", () => {
  it("uses the provider display name from the service contract", () => {
    const card = toProviderCardView(service);

    expect(card.providerName).toBe("Sara Salon");
    expect(card.serviceName).toBe("Haircut");
    expect(card.category).toBe("haircut");
    expect(card.categoryLabel).toBe("کوتاهی مو");
    expect(card.priceIrr).toBe(500_000);
    expect(card.verified).toBe(true);
  });

  it("trims the provider display name without changing the service name", () => {
    const card = toProviderCardView({ ...service, provider_display_name: "  Sara Salon  " });

    expect(card.providerName).toBe("Sara Salon");
    expect(card.serviceName).toBe("Haircut");
  });

  it("does not invent a provider name when the contract value is missing or blank", () => {
    const values: Array<string | undefined> = [undefined, "", "   "];
    for (const providerDisplayName of values) {
      const card = toProviderCardView({
        ...service,
        provider_display_name: providerDisplayName as string,
      });

      expect(card.providerName).toBeNull();
      expect(card.serviceName).toBe("Haircut");
    }
  });

  it("keeps each service's provider name independent", () => {
    const first = toProviderCardView(service);
    const second = toProviderCardView({
      ...service,
      id: 12,
      provider_id: 5,
      name: "Nail care",
      provider_display_name: "Nail Studio",
    });

    expect(first.providerName).toBe("Sara Salon");
    expect(second.providerName).toBe("Nail Studio");
    expect(first.providerName).not.toBe(second.providerName);
  });

  it("does not expose unsupported provider fields", () => {
    const card = toProviderCardView(service);

    expect(card).not.toHaveProperty("city");
    expect(card).not.toHaveProperty("neighborhood");
    expect(card).not.toHaveProperty("avatarUrl");
    expect(card).not.toHaveProperty("rating");
    expect(card).not.toHaveProperty("reviewCount");
  });
});

describe("normalizeProviderDisplayName", () => {
  it("returns null for missing and blank values", () => {
    expect(normalizeProviderDisplayName(undefined)).toBeNull();
    expect(normalizeProviderDisplayName(null)).toBeNull();
    expect(normalizeProviderDisplayName("   ")).toBeNull();
  });
});
