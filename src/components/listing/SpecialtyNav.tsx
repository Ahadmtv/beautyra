import Link from "next/link";

import { SPECIALTY_OPTIONS, t } from "@/config/messages.fa";
import { buildListingHref, parseListingFilters } from "@/lib/listing/filters";

export function SpecialtyNav({ params }: { params: URLSearchParams }) {
  const activeSpecialty = parseListingFilters(params).specialty;

  return (
    <nav aria-label={t("home.specialties")}>
      <ul className="flex list-disc flex-col gap-2.5 ps-5 text-sm text-text">
        {SPECIALTY_OPTIONS.map((option) => {
          const isActive = option.value === activeSpecialty;
          return (
            <li key={option.value}>
              <Link
                href={buildListingHref(params, { specialty: isActive ? null : option.value })}
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
