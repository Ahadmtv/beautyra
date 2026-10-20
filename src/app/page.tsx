import { Suspense, type ReactNode } from "react";

import type { Metadata } from "next";

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
      <main className="mx-auto w-full max-w-page flex-1 px-4 py-6 md:py-8">
        <h1 className="sr-only">{t("home.title")}</h1>
        <div className="flex flex-col gap-6 md:grid md:grid-cols-[14rem_1fr] md:gap-8">
          <aside className="flex flex-col gap-4">
            <MobileCategoryDrawer>{categoryNav}</MobileCategoryDrawer>
            <div className="hidden md:block">
              <h2 className="mb-3 text-base font-semibold text-text">{t("home.categories")}</h2>
              {categoryNav}
            </div>
          </aside>
          <section aria-label={t("home.title")} className="min-w-0">
            {listing}
          </section>
        </div>
      </main>
    </>
  );
}
