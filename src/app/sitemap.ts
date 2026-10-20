import type { MetadataRoute } from "next";

import { env } from "@/config/env";
import { DEFAULT_PAGE_LIMIT } from "@/lib/api/pagination";
import { getPublicServiceCards } from "@/lib/api/services";

const MAX_SITEMAP_PAGES = 100;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = env.SITE_URL.replace(/\/$/, "");
  const entries: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, changeFrequency: "daily", priority: 1 },
  ];
  const seenCursors = new Set<number>();
  let cursor: number | undefined;

  try {
    for (let pageNumber = 0; pageNumber < MAX_SITEMAP_PAGES; pageNumber += 1) {
      const page = await getPublicServiceCards(cursor, DEFAULT_PAGE_LIMIT);
      for (const service of page.items) {
        entries.push({
          url: `${baseUrl}/services/${service.id}`,
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }

      if (page.nextCursor === null || seenCursors.has(page.nextCursor)) break;
      seenCursors.add(page.nextCursor);
      cursor = page.nextCursor;
    }
  } catch {
    return entries;
  }

  return entries;
}
