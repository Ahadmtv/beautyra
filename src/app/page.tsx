import { Suspense, type ReactNode } from "react";
import type { Metadata } from "next";

import { CategoryNav } from "@/components/listing/CategoryNav";
import { HeroSearch } from "@/components/listing/HeroSearch";
import { MobileCategoryDrawer } from "@/components/listing/MobileCategoryDrawer";
import { ServiceCardsSkeleton } from "@/components/listing/ServiceCardsSkeleton";
import { ServiceListing } from "@/components/listing/ServiceListing";
import { messages, SERVICE_CATEGORY_OPTIONS, t } from "@/config/messages.fa";
import { searchParamsFromRecord } from "@/lib/api/pagination";
import { parseListingFilters } from "@/lib/listing/filters";

export const metadata: Metadata = {
  title: t("seo.title"),
  description: t("seo.description"),
  alternates: { canonical: "/" },
  openGraph: {
    title: t("seo.title"),
    description: t("seo.description"),
    siteName: messages["brand.name"],
    locale: "fa_IR",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: t("seo.title") }],
  },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
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
  const selectedCategoryLabel = SERVICE_CATEGORY_OPTIONS.find((option) => option.value === filters.category)?.label;
  const hasActiveFilters = Boolean(filters.category || filters.q || filters.city || filters.neighborhood);

  return (
    <>
      <HeroSearch filters={filters} />
      <main className="mx-auto w-full max-w-page flex-1 px-4 pb-10 pt-6 sm:px-6">
        <div className="mb-5 flex flex-col gap-3 lg:hidden">
          <MobileCategoryDrawer selectedCategoryLabel={selectedCategoryLabel} hasActiveFilters={hasActiveFilters}>
            <CategoryNav params={params} />
          </MobileCategoryDrawer>
        </div>
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-7">
          <aside aria-label={t("home.categories")} className="hidden min-w-0 lg:block">
            <div className="sticky top-[88px] max-h-[calc(100dvh-112px)] overflow-y-auto rounded-2xl border border-[var(--brand-warm-200)] bg-white/90 p-4 shadow-[0_8px_24px_rgba(65,48,44,0.05)]">
              <h2 className="mb-3 text-sm font-bold text-text">{t("home.categories")}</h2>
              <CategoryNav params={params} />
            </div>
          </aside>
          <section aria-label={t("home.providers")} className="min-w-0">
            {listing}
          </section>
        </div>
      </main>
    </>
  );
}
