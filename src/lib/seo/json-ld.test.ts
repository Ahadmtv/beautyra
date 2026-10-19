import { describe, expect, it } from "vitest";

import { buildServiceJsonLd, serializeJsonLd } from "./json-ld";

describe("buildServiceJsonLd", () => {
  it("includes the provider only when its name is known", () => {
    const base = {
      url: "https://example.com/services/1",
      name: "ویزیت",
      description: "",
      priceIrr: 500_000,
    };

    expect(buildServiceJsonLd({ ...base, providerName: "دکتر نمونه" })).toMatchObject({
      "@type": "Service",
      provider: { "@type": "Physician", name: "دکتر نمونه" },
      offers: { price: 500_000, priceCurrency: "IRR" },
    });
    expect(buildServiceJsonLd({ ...base, providerName: null })).not.toHaveProperty("provider");
  });
});

describe("serializeJsonLd", () => {
  it("escapes characters that could close the script tag", () => {
    const data = { name: "</script><script>alert(1)</script>" };
    const serialized = serializeJsonLd(data);

    expect(serialized).not.toContain("<");
    expect(serialized).not.toContain(">");
    expect(JSON.parse(serialized)).toEqual(data);
  });
});
