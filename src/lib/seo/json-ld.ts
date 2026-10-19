export type ServiceJsonLdInput = {
  url: string;
  name: string;
  description: string;
  priceIrr: number;
  providerName: string | null;
};

export function buildServiceJsonLd(input: ServiceJsonLdInput): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    url: input.url,
    ...(input.providerName
      ? { provider: { "@type": "Physician", name: input.providerName } }
      : {}),
    offers: {
      "@type": "Offer",
      price: input.priceIrr,
      priceCurrency: "IRR",
    },
  };
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(
    /[<>&\u2028\u2029]/g,
    (char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`,
  );
}
