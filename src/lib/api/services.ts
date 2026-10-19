import { cacheLife, cacheTag } from "next/cache";

import { env } from "@/config/env";

import { type DoctorCardView, type ProviderMeta, toDoctorCardView } from "./adapters/doctor-card";
import { apiFetch } from "./client";
import { getMockProviderMeta } from "./mock/provider-meta";
import { buildPageQuery, type CursorPage } from "./pagination";
import type { Service, ServicePage } from "./types";

const PUBLIC_SERVICES_REVALIDATE_SECONDS = 300;
const PUBLIC_SERVICE_DETAIL_REVALIDATE_SECONDS = 600;

export type ServiceDetail = {
  service: Service;
  provider: ProviderMeta | null;
};

export async function getPublicServiceCards(
  cursor: number | undefined,
  limit: number,
): Promise<CursorPage<DoctorCardView>> {
  "use cache";
  cacheLife({ revalidate: PUBLIC_SERVICES_REVALIDATE_SECONDS });
  cacheTag("services");

  const page = await apiFetch<ServicePage>("/api/v1/services", {
    query: buildPageQuery(cursor, limit),
  });

  return {
    items: page.items.map((service) =>
      toDoctorCardView(service, resolveProviderMeta(service.provider_id)),
    ),
    nextCursor: page.next_cursor,
  };
}

export async function getPublicServiceDetail(id: number): Promise<ServiceDetail> {
  "use cache";
  cacheLife({ revalidate: PUBLIC_SERVICE_DETAIL_REVALIDATE_SECONDS });
  cacheTag(`service-${id}`);

  const service = await apiFetch<Service>(`/api/v1/services/${id}`);

  return { service, provider: resolveProviderMeta(service.provider_id) };
}

function resolveProviderMeta(providerId: number): ProviderMeta | null {
  return env.USE_MOCK_META ? getMockProviderMeta(providerId) : null;
}
