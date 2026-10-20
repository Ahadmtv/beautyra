import Link from "next/link";

import { CITY_OPTIONS, NEIGHBORHOOD_OPTIONS } from "@/config/filter-options";
import { t } from "@/config/messages.fa";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { ListingFilters } from "@/lib/listing/filters";

type FilterBarProps = {
  filters: ListingFilters;
};

export function FilterBar({ filters }: FilterBarProps) {
  const hasActiveFilters = Boolean(filters.city || filters.neighborhood || filters.q);

  return (
    <section aria-label={t("filter.label")} className="border-b border-border bg-white shadow-sm">
      <form
        method="get"
        action="/"
        role="search"
        className="mx-auto flex w-full max-w-page flex-col gap-3 px-4 py-4 md:flex-row md:items-end"
      >
        <div className="md:w-44">
          <Select
            name="city"
            id="filter-city"
            label={t("filter.city")}
            options={CITY_OPTIONS}
            placeholder={t("filter.cityPlaceholder")}
            defaultValue={filters.city ?? ""}
            className="w-full"
          />
        </div>
        <div className="md:w-44">
          <Select
            name="neighborhood"
            id="filter-neighborhood"
            label={t("filter.neighborhood")}
            options={NEIGHBORHOOD_OPTIONS}
            placeholder={t("filter.neighborhoodPlaceholder")}
            defaultValue={filters.neighborhood ?? ""}
            className="w-full"
          />
        </div>
        <div className="md:flex-1">
          <Input
            name="q"
            id="filter-query"
            type="search"
            label={t("filter.searchLabel")}
            placeholder={t("filter.searchPlaceholder")}
            defaultValue={filters.q ?? ""}
            className="w-full"
          />
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="submit"
            variant="outline"
            size="icon"
            aria-label={t("filter.search")}
            className="w-full md:w-10 md:shrink-0"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
          </Button>
          {hasActiveFilters && (
            <Link href="/" scroll={false} className="shrink-0 text-sm font-medium text-primary underline-offset-4 hover:underline">
              {t("filter.clear")}
            </Link>
          )}
        </div>
      </form>
    </section>
  );
}
