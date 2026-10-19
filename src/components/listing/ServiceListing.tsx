import { t } from "@/config/messages.fa";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadMoreLink } from "@/components/ui/LoadMoreLink";
import { getPublicServiceCards } from "@/lib/api/services";
import { DEFAULT_PAGE_LIMIT, nextPageHref, parseCursor } from "@/lib/api/pagination";
import { filterDoctorCards, parseListingFilters } from "@/lib/listing/filters";

import { DoctorCard } from "./DoctorCard";

export async function ServiceListing({ params }: { params: URLSearchParams }) {
  const page = await getPublicServiceCards(parseCursor(params), DEFAULT_PAGE_LIMIT);
  // TODO(backend): filter on the server once the services endpoint accepts filters (docs/backend-gaps.md, item 4).
  const cards = filterDoctorCards(page.items, parseListingFilters(params));
  const nextHref = nextPageHref("/", params, page.nextCursor);

  return (
    <div className="flex flex-col gap-6">
      {cards.length === 0 ? (
        <EmptyState title={t("home.empty")} />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {cards.map((card) => (
            <li key={card.id}>
              <DoctorCard card={card} />
            </li>
          ))}
        </ul>
      )}
      {nextHref && <LoadMoreLink href={nextHref} />}
    </div>
  );
}
