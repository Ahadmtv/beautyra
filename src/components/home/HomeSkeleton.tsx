import { ServiceCardsSkeleton } from "@/components/listing/ServiceCardsSkeleton";
import { Skeleton } from "@/components/ui/Skeleton";
import { SERVICE_CATEGORY_OPTIONS } from "@/config/messages.fa";

const CATEGORY_ROWS = SERVICE_CATEGORY_OPTIONS.filter((option) => option.value !== "other");
const QUICK_CATEGORY_COUNT = 5;
const TRUST_CARD_COUNT = 4;

// Mirrors the home page layout (hero, trust strip, category sidebar and
// provider card grid) so the route-level loading state matches the real page.
export function HomeSkeleton() {
  return (
    <div aria-busy="true">
      <section aria-hidden="true" className="relative">
        <div className="home-hero-media" />
        <div className="relative mx-auto flex w-full max-w-page items-center px-4 pb-16 pt-40 sm:px-6 md:pb-20 lg:py-20">
          <div className="flex min-w-0 max-w-xl flex-col gap-5 xl:max-w-2xl">
            <Skeleton className="h-6 w-44 rounded-full" />
            <Skeleton className="h-9 w-4/5 rounded-2xl sm:h-12" />
            <Skeleton className="h-4 w-3/5 rounded-full" />
            <div className="flex min-h-14 w-full max-w-2xl items-center gap-2 rounded-2xl border border-white/80 bg-white p-1.5 shadow-[0_10px_30px_rgba(15,72,67,0.12)]">
              <Skeleton className="ms-3 size-5 shrink-0 rounded-full" />
              <Skeleton className="h-4 min-w-0 flex-1 rounded-full" />
              <Skeleton className="h-11 w-20 shrink-0 rounded-xl" />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Skeleton className="h-4 w-16 rounded-full" />
              {Array.from({ length: QUICK_CATEGORY_COUNT }, (_, index) => (
                <Skeleton key={index} className="h-8 w-16 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        aria-hidden="true"
        className="relative z-10 mx-auto -mt-10 w-full max-w-page px-4 sm:px-6 md:-mt-12"
      >
        <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-[var(--brand-warm-200)] bg-[var(--brand-warm-200)] shadow-[0_24px_60px_rgba(15,72,67,0.14)] sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: TRUST_CARD_COUNT }, (_, index) => (
            <li key={index} className="flex items-start gap-4 bg-white p-5 sm:p-6">
              <Skeleton className="size-12 shrink-0 rounded-2xl" />
              <div className="min-w-0 flex-1 pt-0.5">
                <Skeleton className="h-4 w-3/4 rounded-full" />
                <Skeleton className="mt-2.5 h-3 w-full rounded-full" />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <main className="mx-auto w-full max-w-page flex-1 px-4 pb-12 pt-10 sm:px-6">
        <div className="mb-5 flex flex-col gap-3 lg:hidden">
          <Skeleton className="h-10 w-full max-w-xs rounded-xl" />
        </div>
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-7">
          <aside aria-hidden="true" className="hidden min-w-0 lg:block">
            <div className="sticky top-[88px] max-h-[calc(100dvh-112px)] overflow-y-auto rounded-2xl border border-[var(--brand-warm-200)] bg-white/90 p-4 shadow-[0_8px_24px_rgba(65,48,44,0.05)]">
              <Skeleton className="mb-3 h-4 w-28 rounded-full" />
              <ul className="flex flex-col gap-1">
                <li className="flex items-center gap-2 rounded-xl bg-white/75 px-3 py-2">
                  <Skeleton className="size-7 shrink-0 rounded-full" />
                  <Skeleton className="h-4 w-24 rounded-full" />
                </li>
                {CATEGORY_ROWS.map((option) => (
                  <li
                    key={option.value}
                    className="flex items-center gap-2 rounded-xl bg-white/75 px-3 py-2"
                  >
                    <Skeleton className="size-7 shrink-0 rounded-full" />
                    <Skeleton className="h-4 w-24 rounded-full" />
                  </li>
                ))}
              </ul>
            </div>
          </aside>
          <section className="min-w-0">
            <ServiceCardsSkeleton />
          </section>
        </div>
      </main>
    </div>
  );
}
