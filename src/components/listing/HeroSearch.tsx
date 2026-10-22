import type { ListingFilters } from "@/lib/listing/filters";
import { t } from "@/config/messages.fa";

export function HeroSearch({ filters }: { filters: ListingFilters }) {
  return (
    <section className="home-hero relative overflow-hidden border-b border-[var(--brand-teal-100)]">
      <div aria-hidden="true" className="home-hero-pattern pointer-events-none absolute inset-0 opacity-[0.22]" />
      <div className="relative mx-auto flex w-full max-w-page flex-col gap-4 px-4 py-6 sm:px-6 sm:py-7">
        <div className="max-w-3xl">
          <p className="mb-1 text-xs font-bold tracking-wide text-primary">{t("brand.name")} <span className="mx-1 text-[var(--brand-blush-deep)]">·</span> {t("brand.suffix")}</p>
          <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-extrabold leading-[1.55] tracking-tight text-text">{t("home.title")}</h1>
          <p className="mt-1 text-sm leading-7 text-text-muted sm:text-[15px]">{t("home.description")}</p>
        </div>
        <form method="get" action="/" role="search" aria-label={t("filter.label")} className="flex min-h-14 w-full max-w-3xl items-center gap-2 rounded-2xl border border-white/80 bg-white p-1.5 shadow-[0_10px_30px_rgba(15,72,67,0.12)] transition-shadow focus-within:ring-4 focus-within:ring-primary/15">
          <label htmlFor="home-query" className="sr-only">{t("filter.searchLabel")}</label>
          <svg aria-hidden="true" viewBox="0 0 24 24" className="ms-3 size-5 shrink-0 text-primary" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <input id="home-query" name="q" type="search" maxLength={100} defaultValue={filters.q ?? ""} placeholder={t("filter.searchPlaceholder")} className="min-w-0 flex-1 border-0 bg-transparent px-1 text-sm text-text outline-none placeholder:text-text-muted/80 focus-visible:outline-none" />
          {filters.category && <input type="hidden" name="category" value={filters.category} />}
          <button type="submit" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none">
            <span>{t("filter.search")}</span>
          </button>
        </form>
      </div>
    </section>
  );
}
