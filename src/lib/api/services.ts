import { cacheLife, cacheTag } from "next/cache";

import { env } from "@/config/env";

import { type DoctorCardView, type ProviderMeta, toDoctorCardView } from "./adapters/doctor-card";
import { apiFetch } from "./client";
import { getMockProviderMeta } from "./mock/provider-meta";
import { buildPageQuery, type CursorPage } from "./pagination";
import type { ServicePage } from "./types";

const PUBLIC_SERVICES_REVALIDATE_SECONDS = 300;

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

function resolveProviderMeta(providerId: number): ProviderMeta | null {
  return env.USE_MOCK_META ? getMockProviderMeta(providerId) : null;
}
