import type { ProviderMeta } from "../adapters/doctor-card";

// TODO(backend): every field here is mocked. The public contract has no provider name, specialties, location, photo, rating, or review count (see docs/backend-gaps.md).
const MOCK_PROVIDER_META: readonly ProviderMeta[] = [
  {
    name: "کلینیک زیبایی نیلوفر",
    specialties: ["کوتاهی مو", "رنگ مو"],
    city: "تهران",
    neighborhood: "ونک",
    avatarUrl: null,
    rating: 4.5,
    reviewCount: 300,
  },
  {
    name: "آرایشگاه سارا",
    specialties: ["اصلاح ابرو", "لیفت مژه"],
    city: "تهران",
    neighborhood: "ولنجک",
    avatarUrl: null,
    rating: 4,
    reviewCount: 120,
  },
  {
    name: "مرکز ناخن آوا",
    specialties: ["مانیکور", "پدیکور"],
    city: "کرج",
    neighborhood: "مهرشهر",
    avatarUrl: null,
    rating: 4.5,
    reviewCount: 58,
  },
];

export function getMockProviderMeta(providerId: number): ProviderMeta {
  return MOCK_PROVIDER_META[providerId % MOCK_PROVIDER_META.length];
}
