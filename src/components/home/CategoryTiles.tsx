import Link from "next/link";

import { CategoryIcon } from "@/components/listing/CategoryNav";
import { SERVICE_CATEGORY_OPTIONS, t } from "@/config/messages.fa";

const TILE_OPTIONS = SERVICE_CATEGORY_OPTIONS.filter((option) => option.value !== "other");

export function CategoryTiles() {
  return (
    <section aria-labelledby="home-categories-title" className="mb-10">
      <div className="mb-4">
        <h2 id="home-categories-title" className="text-xl font-extrabold text-text sm:text-2xl">
          {t("home.categoriesTitle")}
        </h2>
        <p className="mt-1 text-sm text-text-muted">{t("home.categoriesHint")}</p>
      </div>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {TILE_OPTIONS.map((option) => (
          <li key={option.value}>
            <Link
              href={`/?category=${option.value}#providers`}
              className="group flex h-full flex-col items-center gap-3 rounded-2xl border border-[var(--brand-warm-200)] bg-white/90 px-3 py-5 text-center text-sm font-semibold text-text shadow-[0_8px_24px_rgba(65,48,44,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_14px_30px_rgba(15,118,110,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <CategoryIcon category={option.value} />
              <span className="leading-6">{option.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
