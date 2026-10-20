import Link from "next/link";

import { SERVICE_CATEGORY_OPTIONS, t } from "@/config/messages.fa";
import { buildListingHref, parseListingFilters } from "@/lib/listing/filters";

const NAV_OPTIONS = SERVICE_CATEGORY_OPTIONS.filter((option) => option.value !== "other");

export function CategoryNav({ params }: { params: URLSearchParams }) {
  const activeCategory = parseListingFilters(params).category;

  return (
    <nav aria-label={t("home.categories")}>
      <ul className="flex list-disc flex-col gap-2.5 ps-5 text-sm text-text">
        {NAV_OPTIONS.map((option) => {
          const isActive = option.value === activeCategory;
          return (
            <li key={option.value}>
              <Link
                href={buildListingHref(params, { category: isActive ? null : option.value })}
                aria-current={isActive ? "true" : undefined}
                scroll={false}
                className={[
                  "rounded-sm hover:text-primary",
                  isActive ? "font-bold text-primary" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {option.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
