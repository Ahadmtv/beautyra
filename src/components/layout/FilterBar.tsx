import Link from "next/link";

import { Box, Paper, Stack } from "@mui/material";

import { t } from "@/config/messages.fa";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { ListingFilters } from "@/lib/listing/filters";

type FilterBarProps = {
  filters: ListingFilters;
};

export function FilterBar({ filters }: FilterBarProps) {
  const hasActiveFilters = Boolean(filters.city || filters.neighborhood || filters.q);

  return (
    <Box component="section" aria-label={t("filter.label")} sx={{ borderBottom: "1px solid #e3ece9", bgcolor: "rgba(255,255,255,0.8)" }}>
      <Paper
        component="form"
        method="get"
        action="/"
        role="search"
        elevation={0}
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1fr) auto" },
          alignItems: "end",
          gap: 1.5,
          width: "100%",
          maxWidth: 1080,
          mx: "auto",
          px: { xs: 2, sm: 3 },
          py: { xs: 2, md: 2.5 },
          bgcolor: "transparent",
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Input
            name="q"
            id="filter-query"
            type="search"
            label={t("filter.searchLabel")}
            placeholder={t("filter.searchPlaceholder")}
            defaultValue={filters.q ?? ""}
            reserveHelperText={false}
            className="w-full"
          />
          {filters.category && <input type="hidden" name="category" value={filters.category} />}
          {filters.city && <input type="hidden" name="city" value={filters.city} />}
          {filters.neighborhood && <input type="hidden" name="neighborhood" value={filters.neighborhood} />}
        </Box>
        <Stack direction="row" sx={{ alignItems: "center", gap: 1.5, minWidth: 0 }}>
          <Button type="submit" variant="primary" className="w-full md:w-auto">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            {t("filter.search")}
          </Button>
          {hasActiveFilters && (
            <Link href="/" scroll={false} className="shrink-0 text-sm font-semibold text-primary underline-offset-4 hover:underline">
              {t("filter.clear")}
            </Link>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}
