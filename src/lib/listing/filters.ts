import { CITY_OPTIONS, NEIGHBORHOOD_OPTIONS } from "@/config/filter-options";
import { SERVICE_CATEGORY_OPTIONS } from "@/config/messages.fa";
import type { ProviderCardView } from "@/lib/api/adapters/provider-card";

type Option = { readonly value: string; readonly label: string };

export type ListingFilters = {
  category?: string;
  city?: string;
  neighborhood?: string;
  q?: string;
};

const MAX_QUERY_LENGTH = 100;

function knownValue(options: readonly Option[], raw: string | null): string | undefined {
  return options.find((option) => option.value === raw)?.value;
}

function labelFor(options: readonly Option[], value: string): string {
  return options.find((option) => option.value === value)?.label ?? value;
}

export function parseListingFilters(params: URLSearchParams): ListingFilters {
  return {
    category: knownValue(SERVICE_CATEGORY_OPTIONS, params.get("category")),
    city: knownValue(CITY_OPTIONS, params.get("city")),
    neighborhood: knownValue(NEIGHBORHOOD_OPTIONS, params.get("neighborhood")),
    q: params.get("q")?.trim().slice(0, MAX_QUERY_LENGTH) || undefined,
  };
}

export function matchesFilters(card: ProviderCardView, filters: ListingFilters): boolean {
  if (filters.category && card.category !== filters.category) {
    return false;
  }
  if (filters.city && card.city !== labelFor(CITY_OPTIONS, filters.city)) {
    return false;
  }
  if (filters.neighborhood && card.neighborhood !== labelFor(NEIGHBORHOOD_OPTIONS, filters.neighborhood)) {
    return false;
  }
  if (filters.q) {
    const haystack = [card.name, card.categoryLabel].join(" ").toLocaleLowerCase("fa-IR");
    if (!haystack.includes(filters.q.toLocaleLowerCase("fa-IR"))) {
      return false;
    }
  }
  return true;
}

export function filterProviderCards(
  cards: readonly ProviderCardView[],
  filters: ListingFilters,
): ProviderCardView[] {
  return cards.filter((card) => matchesFilters(card, filters));
}

// Cursors belong to a result set, so any filter change restarts from the first page.
export function buildListingHref(
  current: URLSearchParams,
  changes: Readonly<Record<string, string | null>>,
): string {
  const next = new URLSearchParams(current);
  next.delete("cursor");
  for (const [key, value] of Object.entries(changes)) {
    if (value === null) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
  }
  const query = next.toString();
  return query ? `/?${query}` : "/";
}
