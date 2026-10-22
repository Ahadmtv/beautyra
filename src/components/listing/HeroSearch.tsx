import Link from "next/link";

import type { ListingFilters } from "@/lib/listing/filters";
import { serviceCategoryLabel, t } from "@/config/messages.fa";

const QUICK_CATEGORY_VALUES = ["haircut", "nails", "makeup", "massage", "skin-care"];

export function HeroSearch({ filters }: { filters: ListingFilters }) {
  return (
    <section className="relative">
      <div aria-hidden="true" className="home-hero-media" />
      <div className="relative mx-auto flex w-full max-w-page items-center px-4 pb-16 pt-40 sm:px-6 md:pb-20 lg:py-20">
        <div className="flex min-w-0 max-w-xl flex-col gap-5 xl:max-w-2xl">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-primary ring-1 ring-inset ring-[var(--brand-teal-200)]">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-[var(--brand-blush-deep)]" />
            {t("brand.name")} <span className="text-[var(--brand-blush-deep)]">·</span> {t("brand.suffix")}
          </span>
          <h1 className="text-[clamp(1.85rem,4.2vw,3rem)] font-extrabold leading-[1.5] tracking-tight text-text">{t("home.heroTitle")}</h1>
          <p className="max-w-xl text-sm leading-7 text-text-muted sm:text-base">{t("home.description")}</p>
          <form method="get" action="/" role="search" aria-label={t("filter.label")} className="flex min-h-14 w-full max-w-2xl items-center gap-2 rounded-2xl border border-white/80 bg-white p-1.5 shadow-[0_10px_30px_rgba(15,72,67,0.12)] transition-shadow focus-within:ring-4 focus-within:ring-primary/15">
            <label htmlFor="home-query" className="sr-only">{t("filter.searchLabel")}</label>
            <svg aria-hidden="true" viewBox="0 0 24 24" className="ms-3 size-5 shrink-0 text-primary" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            <input id="home-query" name="q" type="search" maxLength={100} defaultValue={filters.q ?? ""} placeholder={t("filter.searchPlaceholder")} className="min-w-0 flex-1 border-0 bg-transparent px-1 text-sm text-text outline-none placeholder:text-text-muted/80 focus-visible:outline-none" />
            {filters.category && <input type="hidden" name="category" value={filters.category} />}
            <button type="submit" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none">
              <span>{t("filter.search")}</span>
            </button>
          </form>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-text-muted">{t("home.quickSearch")}</span>
            {QUICK_CATEGORY_VALUES.map((value) => (
              <Link
                key={value}
                href={`/?category=${value}#providers`}
                className="inline-flex min-h-8 items-center rounded-full border border-[var(--brand-warm-200)] bg-white/85 px-3 text-xs font-semibold text-text-muted transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {serviceCategoryLabel(value)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
