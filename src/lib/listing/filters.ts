import { CITY_OPTIONS, NEIGHBORHOOD_OPTIONS } from "@/config/filter-options";
import { SPECIALTY_OPTIONS } from "@/config/messages.fa";
import type { DoctorCardView } from "@/lib/api/adapters/doctor-card";

type Option = { readonly value: string; readonly label: string };

export type ListingFilters = {
  specialty?: string;
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
    specialty: knownValue(SPECIALTY_OPTIONS, params.get("specialty")),
    city: knownValue(CITY_OPTIONS, params.get("city")),
    neighborhood: knownValue(NEIGHBORHOOD_OPTIONS, params.get("neighborhood")),
    q: params.get("q")?.trim().slice(0, MAX_QUERY_LENGTH) || undefined,
  };
}

export function matchesFilters(card: DoctorCardView, filters: ListingFilters): boolean {
  if (filters.specialty && !card.specialties.includes(labelFor(SPECIALTY_OPTIONS, filters.specialty))) {
    return false;
  }
  if (filters.city && card.city !== labelFor(CITY_OPTIONS, filters.city)) {
    return false;
  }
  if (filters.neighborhood && card.neighborhood !== labelFor(NEIGHBORHOOD_OPTIONS, filters.neighborhood)) {
    return false;
  }
  if (filters.q) {
    const haystack = [card.name, ...card.specialties].join(" ").toLocaleLowerCase("fa-IR");
    if (!haystack.includes(filters.q.toLocaleLowerCase("fa-IR"))) {
      return false;
    }
  }
  return true;
}

export function filterDoctorCards(
  cards: readonly DoctorCardView[],
  filters: ListingFilters,
): DoctorCardView[] {
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
