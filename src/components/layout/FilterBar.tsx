"use client";

import { useState } from "react";
import { t } from "@/config/messages.fa";
import { CITY_OPTIONS, NEIGHBORHOOD_OPTIONS } from "@/config/filter-options";
import { Button, buttonClassName } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

const SEARCH_PANEL_ID = "filter-search-panel";

export function FilterBar() {
  const [city, setCity] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const renderSelects = (idSuffix: string) => (
    <>
      <Select
        id={`filter-city-${idSuffix}`}
        label={t("filter.city")}
        options={CITY_OPTIONS}
        placeholder={t("filter.cityPlaceholder")}
        value={city}
        onChange={(event) => setCity(event.target.value)}
        className="w-full"
      />
      <Select
        id={`filter-neighborhood-${idSuffix}`}
        label={t("filter.neighborhood")}
        options={NEIGHBORHOOD_OPTIONS}
        placeholder={t("filter.neighborhoodPlaceholder")}
        value={neighborhood}
        onChange={(event) => setNeighborhood(event.target.value)}
        className="w-full"
      />
    </>
  );

  return (
    <section aria-label={t("filter.label")} className="border-b border-border bg-white">
      <div className="mx-auto w-full max-w-page px-4 py-4">
        <div className="flex items-end gap-3">
          <div className="hidden flex-1 items-end gap-3 md:flex">{renderSelects("desktop")}</div>
          <div className="flex flex-1 md:hidden">
            <Button variant="outline" onClick={() => setDrawerOpen(true)} aria-haspopup="dialog">
              {t("filter.open")}
            </Button>
          </div>
          <Button
            variant="outline"
            size="icon"
            aria-label={t("filter.search")}
            aria-expanded={searchOpen}
            aria-controls={SEARCH_PANEL_ID}
            onClick={() => setSearchOpen((open) => !open)}
            className="shrink-0"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
          </Button>
        </div>

        {searchOpen && (
          <div id={SEARCH_PANEL_ID} role="search" className="mt-3">
            <Input
              id="filter-search-input"
              type="search"
              label={t("filter.searchLabel")}
              placeholder={t("filter.searchPlaceholder")}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              autoFocus
            />
          </div>
        )}
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={t("filter.open")}
        footer={
          <Button className="w-full" onClick={() => setDrawerOpen(false)}>
            {t("filter.apply")}
          </Button>
        }
      >
        <div className="flex flex-col gap-4">{renderSelects("drawer")}</div>
      </Drawer>
    </section>
  );
}
