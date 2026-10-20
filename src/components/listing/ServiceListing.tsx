import { Box, Paper, Stack, Typography } from "@mui/material";

import { LoadMoreLink } from "@/components/ui/LoadMoreLink";
import { t } from "@/config/messages.fa";
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
    <Stack spacing={2.5}>
      {cards.length === 0 ? (
        <Paper elevation={0} sx={{ display: "grid", minHeight: 220, placeItems: "center", p: 4, border: "1px dashed #cbd9d5", borderRadius: 3, bgcolor: "rgba(255,255,255,0.7)" }}>
          <Stack spacing={1} alignItems="center" textAlign="center">
            <Box sx={{ display: "grid", width: 48, height: 48, placeItems: "center", borderRadius: "50%", bgcolor: "#e6f4f1", color: "#0f766e" }}>
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4m-8-5h6" />
              </svg>
            </Box>
            <Typography component="h2" sx={{ fontFamily: "inherit", fontSize: 16, fontWeight: 700, color: "#172b2a" }}>{t("home.empty")}</Typography>
          </Stack>
        </Paper>
      ) : (
        <Box component="ul" sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))" }, gap: 2, p: 0, m: 0, listStyle: "none" }}>
          {cards.map((card) => (
            <Box component="li" key={card.id} sx={{ minWidth: 0 }}>
              <ProviderCard card={card} />
            </Box>
          ))}
        </Box>
      )}
      {nextHref && <LoadMoreLink href={nextHref} />}
    </Stack>
  );
}
