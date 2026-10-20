import { t } from "@/config/messages.fa";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadMoreLink } from "@/components/ui/LoadMoreLink";
import { getPublicServiceCards } from "@/lib/api/services";
import { DEFAULT_PAGE_LIMIT, nextPageHref, parseCursor } from "@/lib/api/pagination";
import { filterProviderCards, parseListingFilters } from "@/lib/listing/filters";

import { ProviderCard } from "./ProviderCard";

export async function ServiceListing({ params }: { params: URLSearchParams }) {
  const filters = parseListingFilters(params);
  const page = await getPublicServiceCards(parseCursor(params), DEFAULT_PAGE_LIMIT, filters.category);
  // The API filters by category. City, neighborhood, and free-text search still
  // apply to the fetched page until the remaining filters are supported.
  const cards = filterProviderCards(page.items, filters);
  const nextHref = nextPageHref("/", params, page.nextCursor);

  return (
    <div className="flex flex-col gap-6">
      {cards.length === 0 ? (
        <EmptyState title={t("home.empty")} />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {cards.map((card) => (
            <li key={card.id}>
              <ProviderCard card={card} />
            </li>
          ))}
        </ul>
      )}
      {nextHref && <LoadMoreLink href={nextHref} />}
    </div>
  );
}
