import type { ProviderMeta } from "../adapters/doctor-card";

// TODO(backend): every field here is mocked. The public contract has no provider name, specialties, location, photo, rating, or review count (see docs/backend-gaps.md).
const MOCK_PROVIDER_META: readonly ProviderMeta[] = [
  {
    name: "دکتر نیلوفر احمدی",
    specialties: ["زنان و زایمان", "غدد، رشد و متابولیسم"],
    city: "تهران",
    neighborhood: "ونک",
    avatarUrl: null,
    rating: 4.5,
    reviewCount: 300,
  },
  {
    name: "دکتر سارا محمدی",
    specialties: ["پوست و مو"],
    city: "تهران",
    neighborhood: "میرداماد",
    avatarUrl: null,
    rating: 4,
    reviewCount: 120,
  },
  {
    name: "دکتر آوا رضایی",
    specialties: ["ارتوپدی", "روماتولوژی"],
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
