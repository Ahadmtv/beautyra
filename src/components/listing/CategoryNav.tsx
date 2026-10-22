import Link from "next/link";

import { SERVICE_CATEGORY_OPTIONS, t } from "@/config/messages.fa";
import { buildListingHref, parseListingFilters } from "@/lib/listing/filters";

const NAV_OPTIONS = SERVICE_CATEGORY_OPTIONS.filter((option) => option.value !== "other");

export function CategoryNav({ params }: { params: URLSearchParams }) {
  const filters = parseListingFilters(params);
  const activeCategory = filters.category;
  const allHref = buildListingHref(params, { category: null });

  return (
    <nav aria-label={t("home.categories")}>
      <ul className="flex flex-col gap-1">
        <li className="shrink-0">
          <Link
            href={allHref}
            scroll={false}
            aria-current={!activeCategory ? "page" : undefined}
            className={categoryLinkClass(!activeCategory)}
          >
            <CategoryIcon category="all" />
            <span>{t("home.allCategories")}</span>
          </Link>
        </li>
        {NAV_OPTIONS.map((option) => {
          const selected = option.value === activeCategory;
          return (
            <li key={option.value} className="shrink-0">
              <Link
                href={buildListingHref(params, { category: selected ? null : option.value })}
                scroll={false}
                aria-current={selected ? "page" : undefined}
                className={categoryLinkClass(selected)}
              >
                <CategoryIcon category={option.value} />
                <span>{option.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      {(filters.category || filters.q) && (
        <Link href="/" scroll={false} className="mt-3 inline-flex min-h-9 items-center gap-1 text-xs font-semibold text-primary underline-offset-4 hover:underline focus-visible:rounded-sm">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 7h16M7 12h10m-7 5h4" /></svg>
          {t("home.clearFilters")}
        </Link>
      )}
    </nav>
  );
}

function categoryLinkClass(selected: boolean) {
  return [
    "relative inline-flex min-h-10 w-full items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none",
    selected ? "border border-primary/20 bg-primary-soft font-bold text-primary before:absolute before:inset-y-2 before:start-0 before:w-1 before:rounded-full before:bg-primary" : "border border-transparent bg-white/75 font-medium text-text-muted hover:bg-surface hover:text-primary",
  ].join(" ");
}

function CategoryIcon({ category }: { category: string }) {
  const paths: Record<string, string> = {
    all: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
    haircut: "M6 5 18 19M18 5 6 19M5 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm14 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
    "hair-color": "M12 3v18m-4-3 4 3 4-3M5 7c1.5-2 4-3 7-3s5.5 1 7 3",
    "hair-care": "M12 3c3 3 4 5 4 8a4 4 0 0 1-8 0c0-3 1-5 4-8Zm-7 16c2 1 4 2 7 2s5-1 7-2",
    makeup: "M5 4h14l-2 16H7L5 4Zm2 4h10m-8 4h6",
    "eyebrow-lash": "M3 10c2-3 6-3 9 0-3 3-7 3-9 0Zm9 0c3-3 7-3 9 0-2 3-6 3-9 0Zm-8 7 2-2m3 2 1-2m4 2 1-2",
    nails: "M8 3h8v11a4 4 0 0 1-8 0V3Zm4 15v3m-4 0h8",
    "skin-care": "M12 3c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11Zm-2 12a2 2 0 0 0 2 2",
    waxing: "M6 4c4 0 8 3 12 0M6 9c4 0 8 3 12 0M6 14c4 0 8 3 12 0m-9 5h6",
    massage: "M12 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-4 8 4-2 4 2m-7 2-2 5m9-5 2 5m-8-7 2 8m4-8-2 8",
    spa: "M12 21c-5-3-7-7-7-11 5 0 8 3 7 11Zm0 0c0-7 3-11 8-11 0 4-3 8-8 11Zm0-9V4",
    bridal: "M12 3 14 8l5 1-4 4 1 6-4-3-4 3 1-6-4-4 5-1 2-5Z",
    barbering: "M6 4v16m12-16v16M6 8h12M6 16h12M9 4v4m6-4v4m-6 8v4m6-4v4",
  };
  return (
    <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-full bg-[var(--brand-teal-50)] text-primary">
      <svg viewBox="0 0 24 24" className="size-[17px]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d={paths[category] ?? "M12 3v18M3 12h18"} />
      </svg>
    </span>
  );
}
