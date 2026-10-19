import type { Service } from "../types";

export type ProviderMeta = {
  name: string;
  specialties: string[];
  city: string;
  neighborhood: string;
  avatarUrl: string | null;
  rating: number;
  reviewCount: number;
};

export type DoctorCardView = {
  id: number;
  name: string;
  specialties: string[];
  city: string | null;
  neighborhood: string | null;
  avatarUrl: string | null;
  rating: number | null;
  reviewCount: number | null;
  verified: boolean;
  nextSlot?: string;
};

export function toDoctorCardView(service: Service, meta: ProviderMeta | null): DoctorCardView {
  return {
    id: service.id,
    name: meta?.name ?? service.name,
    specialties: meta?.specialties ?? [],
    city: meta?.city ?? null,
    neighborhood: meta?.neighborhood ?? null,
    avatarUrl: meta?.avatarUrl ?? null,
    rating: meta?.rating ?? null,
    reviewCount: meta?.reviewCount ?? null,
    // The public service list only returns services of active, verified providers.
    verified: true,
  };
}
