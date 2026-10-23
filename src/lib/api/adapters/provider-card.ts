import { serviceCategoryLabel, type ServiceCategory } from "@/config/messages.fa";

import type { Service } from "../types";

export type ProviderCardView = {
  id: number;
  providerName: string | null;
  serviceName: string;
  category: ServiceCategory;
  categoryLabel: string;
  priceIrr: number;
  verified: boolean;
  avatarUrl: string | null;
};

export function normalizeProviderDisplayName(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function toProviderCardView(service: Service): ProviderCardView {
  return {
    id: service.id,
    providerName: normalizeProviderDisplayName(service.provider_display_name),
    serviceName: service.name,
    category: service.category,
    categoryLabel: serviceCategoryLabel(service.category),
    priceIrr: service.price_irr,
    // The public service list only returns services of active, verified providers.
    verified: true,
    avatarUrl: service.provider_profile_image_url?.trim() || null,
  };
}
