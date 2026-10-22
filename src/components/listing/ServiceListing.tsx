import Link from "next/link";
import { Box, Paper, Stack, Typography } from "@mui/material";

import { ListingRetry } from "@/components/listing/ListingRetry";
import { t, serviceCategoryLabel } from "@/config/messages.fa";
import { getPublicServiceCards } from "@/lib/api/services";
import { DEFAULT_PAGE_LIMIT, nextPageHref, parseCursor } from "@/lib/api/pagination";
import { filterProviderCards, parseListingFilters, buildListingHref } from "@/lib/listing/filters";
import { numberFormatFa } from "@/lib/format/digits";

import { ProviderCard } from "./ProviderCard";

export async function ServiceListing({ params }: { params: URLSearchParams }) {
  const filters = parseListingFilters(params);
  let page: Awaited<ReturnType<typeof getPublicServiceCards>>;

  try {
    page = await getPublicServiceCards(parseCursor(params), DEFAULT_PAGE_LIMIT, filters.category);
  } catch {
    return <ListingError />;
  }

  const cards = filterProviderCards(page.items, filters);
  const nextHref = nextPageHref("/", params, page.nextCursor);

  return (
    <Stack spacing={2.5}>
      <ResultsHeader params={params} filters={filters} count={cards.length} />
      {cards.length === 0 ? (
        <EmptyState />
      ) : (
        <Box component="ul" sx={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", "@media (min-width: 768px)": { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }, "@media (min-width: 1200px)": { gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }, alignItems: "stretch", gap: { xs: 1.5, md: 2.5 }, p: 0, m: 0, listStyle: "none" }}>
          {cards.map((card, index) => (
            <Box component="li" key={card.id} sx={{ minWidth: 0 }}>
              <ProviderCard card={card} delayMs={index < 8 ? index * 40 : undefined} />
            </Box>
          ))}
        </Box>
      )}
      {nextHref && <Link href={nextHref} className="mx-auto inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-white px-5 text-sm font-semibold text-primary shadow-sm transition-colors hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none">{t("common.loadMore")}</Link>}
    </Stack>
  );
}

function ResultsHeader({ params, filters, count }: { params: URLSearchParams; filters: ReturnType<typeof parseListingFilters>; count: number }) {
  const heading = filters.category ? serviceCategoryLabel(filters.category) : t("home.providers");
  const activeFilters = [
    filters.category ? { key: "category", label: serviceCategoryLabel(filters.category) } : null,
    filters.q ? { key: "q", label: filters.q } : null,
  ].filter((filter): filter is { key: string; label: string } => filter !== null);

  return (
    <Box>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="h-7 w-1.5 rounded-full bg-[linear-gradient(180deg,var(--brand-teal-500),var(--brand-blush-deep))]" />
          <h2 className="text-lg font-bold text-text sm:text-xl">{heading}</h2>
        </div>
        <span className="inline-flex min-h-8 items-center rounded-full bg-[var(--brand-teal-50)] px-3.5 text-xs font-semibold text-primary ring-1 ring-inset ring-[var(--brand-teal-100)]">
          {t("home.resultsCount", { count: numberFormatFa(count) })}
        </span>
      </div>
      {activeFilters.length > 0 && (
        <div role="group" className="mt-3 flex flex-wrap gap-2" aria-label={t("home.activeFilters")}>
          {activeFilters.map((filter) => (
            <Link key={filter.key} href={buildListingHref(params, { [filter.key]: null })} scroll={false} className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-[var(--brand-teal-100)] bg-[var(--brand-teal-50)] px-3 text-xs font-medium text-primary hover:bg-[var(--brand-teal-100)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
              <span className="max-w-48 truncate">{filter.label}</span>
              <span aria-hidden="true" className="text-base leading-none">×</span>
              <span className="sr-only">{t("home.removeFilter", { filter: filter.label })}</span>
            </Link>
          ))}
        </div>
      )}
    </Box>
  );
}

function EmptyState() {
  return (
    <Paper elevation={0} sx={{ display: "flex", minHeight: 300, flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1.25, p: 4, textAlign: "center", border: "1px solid #efe3dc", borderRadius: "18px", bgcolor: "rgba(255,255,255,.8)" }}>
      <svg aria-hidden="true" viewBox="0 0 120 100" className="mb-1 h-24 w-28 text-primary">
        <path d="M22 82c4-20 16-31 38-31s34 11 38 31" fill="#e5f2ee" />
        <circle cx="60" cy="36" r="21" fill="#f8e7e8" />
        <circle cx="60" cy="36" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="m68 44 9 9M34 22l5 5m47-5-5 5M60 8v7" fill="none" stroke="#c87867" strokeWidth="2" strokeLinecap="round" />
        <path d="M43 78c4-7 10-11 17-11s13 4 17 11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <Typography component="h3" sx={{ fontFamily: "inherit", fontSize: 18, fontWeight: 800, color: "#263b38" }}>{t("home.empty")}</Typography>
      <Typography sx={{ maxWidth: 340, fontFamily: "inherit", fontSize: 13, lineHeight: 1.9, color: "#5e706d" }}>{t("home.emptyHint")}</Typography>
      <Link href="/" className="mt-2 inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-bold text-white transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none">{t("home.clearFilters")}</Link>
    </Paper>
  );
}

function ListingError() {
  return (
    <Paper role="alert" elevation={0} sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 2, p: 2.5, border: "1px solid #f2c9c5", borderRadius: "16px", bgcolor: "#fff8f7" }}>
      <Typography sx={{ fontFamily: "inherit", fontSize: 14, lineHeight: 1.8, color: "#8e322a" }}>{t("home.loadError")}</Typography>
      <ListingRetry />
    </Paper>
  );
}
