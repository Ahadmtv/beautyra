import type { ProviderMeta } from "../adapters/provider-card";

// TODO(backend): every field here is mocked. The public contract has no provider name, location, photo, rating, or review count (see docs/backend-gaps.md).
const MOCK_PROVIDER_META: readonly ProviderMeta[] = [
  {
    name: "سالن زیبایی نیلوفر",
    city: "تهران",
    neighborhood: "ونک",
    avatarUrl: null,
    rating: 4.5,
    reviewCount: 300,
  },
  {
    name: "آرایشگاه سارا",
    city: "تهران",
    neighborhood: "میرداماد",
    avatarUrl: null,
    rating: 4,
    reviewCount: 120,
  },
  {
    name: "استودیو ناخن آوا",
    city: "تهران",
    neighborhood: "سعادت‌آباد",
    avatarUrl: null,
    rating: 4.5,
    reviewCount: 58,
  },
];

export function getMockProviderMeta(providerId: number): ProviderMeta {
  return MOCK_PROVIDER_META[providerId % MOCK_PROVIDER_META.length];
}
