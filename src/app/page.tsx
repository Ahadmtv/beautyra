import { Suspense, type ReactNode } from "react";

import type { Metadata } from "next";
import { Box, Paper, Stack, Typography } from "@mui/material";

import { FilterBar } from "@/components/layout/FilterBar";
import { CategoryNav } from "@/components/listing/CategoryNav";
import { MobileCategoryDrawer } from "@/components/listing/MobileCategoryDrawer";
import { ServiceCardsSkeleton } from "@/components/listing/ServiceCardsSkeleton";
import { ServiceListing } from "@/components/listing/ServiceListing";
import { t } from "@/config/messages.fa";
import { searchParamsFromRecord } from "@/lib/api/pagination";
import { parseListingFilters } from "@/lib/listing/filters";

export const metadata: Metadata = {
  title: t("seo.title"),
  description: t("seo.description"),
  alternates: { canonical: "/" },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

type HomePageProps = {
  searchParams: SearchParams;
};

export default function HomePage({ searchParams }: HomePageProps) {
  return (
    <Suspense fallback={<HomeLayout params={new URLSearchParams()} listing={<ServiceCardsSkeleton />} />}>
      <HomeContent searchParams={searchParams} />
    </Suspense>
  );
}

async function HomeContent({ searchParams }: { searchParams: SearchParams }) {
  const params = searchParamsFromRecord(await searchParams);

  return (
    <HomeLayout
      params={params}
      listing={
        <Suspense fallback={<ServiceCardsSkeleton />}>
          <ServiceListing params={params} />
        </Suspense>
      }
    />
  );
}

function HomeLayout({ params, listing }: { params: URLSearchParams; listing: ReactNode }) {
  const filters = parseListingFilters(params);
  const categoryNav = <CategoryNav params={params} />;

  return (
    <>
      <FilterBar filters={filters} />
      <Box component="main" sx={{ width: "100%", maxWidth: 1080, flex: 1, mx: "auto", px: { xs: 2, sm: 3 }, py: { xs: 3, md: 5 } }}>
        <Stack spacing={3}>
          <Box>
            <Typography component="h1" variant="h4" sx={{ fontFamily: "inherit", fontSize: { xs: 24, md: 30 }, fontWeight: 800, letterSpacing: "-0.03em", color: "#172b2a" }}>
              {t("home.title")}
            </Typography>
            <Typography sx={{ mt: 0.75, fontFamily: "inherit", fontSize: 14, color: "#617472" }}>
              {t("home.description")}
            </Typography>
          </Box>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "240px minmax(0, 1fr)" }, alignItems: "start", gap: { xs: 2, md: 3 } }}>
            <Box component="aside" sx={{ minWidth: 0, position: { md: "sticky" }, top: { md: 24 } }}>
              <MobileCategoryDrawer>{categoryNav}</MobileCategoryDrawer>
              <Paper elevation={0} sx={{ display: { xs: "none", md: "block" }, p: 2, border: "1px solid #dce7e4", borderRadius: 3, backgroundColor: "#fff" }}>
                <Typography component="h2" sx={{ mb: 1.5, fontFamily: "inherit", fontSize: 15, fontWeight: 750, color: "#172b2a" }}>
                  {t("home.categories")}
                </Typography>
                {categoryNav}
              </Paper>
            </Box>
            <Box component="section" aria-label={t("home.title")} sx={{ minWidth: 0 }}>
              {listing}
            </Box>
          </Box>
        </Stack>
      </Box>
    </>
  );
}
