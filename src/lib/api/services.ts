import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";

import {
  normalizeProviderDisplayName,
  type ProviderCardView,
  toProviderCardView,
} from "./adapters/provider-card";
import { apiFetch } from "./client";
import { ApiError } from "./problem";
import { buildPageQuery, type CursorPage } from "./pagination";
import { parseServiceId } from "./service-id";
import type { Service, ServicePage } from "./types";

const PUBLIC_SERVICES_REVALIDATE_SECONDS = 300;
const PUBLIC_SERVICE_DETAIL_REVALIDATE_SECONDS = 600;

export type ServiceDetail = {
  service: Service;
  providerName: string | null;
};

export async function getPublicServiceCards(
  cursor: number | undefined,
  limit: number,
  category?: string,
): Promise<CursorPage<ProviderCardView>> {
  "use cache";
  cacheLife({ revalidate: PUBLIC_SERVICES_REVALIDATE_SECONDS });
  cacheTag("services");

  const query = buildPageQuery(cursor, limit);
  if (category) {
    query.set("category", category);
  }
  const page = await apiFetch<ServicePage>("/api/v1/services", { query });

  return {
    items: page.items.map(toProviderCardView),
    nextCursor: page.next_cursor,
  };
}

export async function getPublicServiceDetail(id: number): Promise<ServiceDetail> {
  "use cache";
  cacheLife({ revalidate: PUBLIC_SERVICE_DETAIL_REVALIDATE_SECONDS });
  cacheTag("services", `service-${id}`);

  const service = await apiFetch<Service>(`/api/v1/services/${id}`);

  return { service, providerName: normalizeProviderDisplayName(service.provider_display_name) };
}

export async function loadPublicServiceDetailOrNotFound(rawId: string): Promise<ServiceDetail> {
  const id = parseServiceId(rawId);
  if (id === null) {
    notFound();
  }

  try {
    return await getPublicServiceDetail(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}
