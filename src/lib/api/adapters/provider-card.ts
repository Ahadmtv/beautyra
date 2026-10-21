import { serviceCategoryLabel, type ServiceCategory } from "@/config/messages.fa";

import type { Service } from "../types";

export type ProviderMeta = {
  name: string;
  city: string;
  neighborhood: string;
  avatarUrl: string | null;
  rating: number;
  reviewCount: number;
};

export type ProviderCardView = {
  id: number;
  name: string;
  serviceName: string;
  category: ServiceCategory;
  categoryLabel: string;
  priceIrr: number;
  city: string | null;
  neighborhood: string | null;
  avatarUrl: string | null;
  rating: number | null;
  reviewCount: number | null;
  verified: boolean;
  nextSlot?: string;
};

export function toProviderCardView(service: Service, meta: ProviderMeta | null): ProviderCardView {
  return {
    id: service.id,
    name: meta?.name ?? service.name,
    serviceName: service.name,
    category: service.category,
    categoryLabel: serviceCategoryLabel(service.category),
    priceIrr: service.price_irr,
    city: meta?.city ?? null,
    neighborhood: meta?.neighborhood ?? null,
    avatarUrl: meta?.avatarUrl ?? null,
    rating: meta?.rating ?? null,
    reviewCount: meta?.reviewCount ?? null,
    // The public service list only returns services of active, verified providers.
    verified: true,
  };
}
