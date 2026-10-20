import Link from "next/link";

import { t } from "@/config/messages.fa";
import { buttonClassName } from "@/components/ui/Button";
import { numberFormatFa } from "@/lib/format/digits";

type BookingPanelProps = {
  serviceId: number;
  durationMinutes: number;
  priceLabel: string;
};

export function BookingPanel({ serviceId, durationMinutes, priceLabel }: BookingPanelProps) {
  return (
    <aside
      aria-label={t("service.summary")}
      className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-white p-4 shadow-[0_-8px_30px_rgba(23,43,42,0.08)] md:sticky md:top-24 md:inset-auto md:rounded-md md:border md:shadow-md"
    >
      <div className="mx-auto flex max-w-page items-center justify-between gap-4 md:flex-col md:items-stretch md:gap-5">
        <dl className="flex gap-6 md:flex-col md:gap-4">
          <div className="flex flex-col gap-1">
            <dt className="text-sm text-text-muted">{t("service.duration")}</dt>
            <dd className="font-semibold text-text">
              {t("service.durationValue", { minutes: numberFormatFa(durationMinutes) })}
            </dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-sm text-text-muted">{t("service.price")}</dt>
            <dd className="font-semibold text-text">{priceLabel}</dd>
          </div>
        </dl>
        <Link href={`/book/${serviceId}`} className={buttonClassName({ className: "shrink-0 md:w-full" })}>
          {t("service.bookCta")}
        </Link>
      </div>
    </aside>
  );
}
