import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { BookingSchedule } from "@/components/booking/BookingSchedule";
import { BookingScheduleSkeleton } from "@/components/booking/BookingScheduleSkeleton";
import { t } from "@/config/messages.fa";
import { loadPublicServiceDetailOrNotFound } from "@/lib/api/services";
import { ROLES } from "@/lib/auth/claims";
import { requireRole } from "@/lib/auth/session";
import { numberFormatFa } from "@/lib/format/digits";
import { formatTomanFromRial } from "@/lib/format/money";

type BookingPageProps = {
  params: Promise<{ serviceId: string }>;
  searchParams: Promise<{ date?: string | string[] }>;
};

export const metadata: Metadata = {
  title: `${t("booking.title")} | ${t("brand.name")}`,
  robots: { index: false, follow: false },
};

export default async function BookingPage({ params, searchParams }: BookingPageProps) {
  await requireRole(ROLES);

  const { serviceId } = await params;
  const { service, provider } = await loadPublicServiceDetailOrNotFound(serviceId);
  const priceLabel = service.price_irr === 0 ? t("service.free") : formatTomanFromRial(service.price_irr);

  return (
    <main className="mx-auto w-full max-w-page flex-1 px-4 py-6 md:py-8">
      <nav aria-label={t("breadcrumb.label")}>
        <ol className="flex flex-wrap items-center gap-2 text-sm text-text-muted">
          <li>
            <Link href="/" className="hover:text-primary">
              {t("breadcrumb.home")}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/services/${service.id}`} className="hover:text-primary">
              {service.name}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-text">
            {t("booking.title")}
          </li>
        </ol>
      </nav>

      <header className="mt-6 flex flex-col gap-3 rounded-md border border-border bg-white p-4 md:p-6">
        <h1 className="text-xl font-bold text-text">{t("booking.title")}</h1>
        <p className="font-medium text-text">{service.name}</p>
        {provider && <p className="text-sm text-text-muted">{provider.name}</p>}
        <dl className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <div className="flex gap-2">
            <dt className="text-text-muted">{t("service.duration")}</dt>
            <dd className="text-text">
              {t("service.durationValue", { minutes: numberFormatFa(service.duration_minutes) })}
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-text-muted">{t("service.price")}</dt>
            <dd className="text-text">{priceLabel}</dd>
          </div>
        </dl>
      </header>

      <div className="mt-6">
        <Suspense fallback={<BookingScheduleSkeleton />}>
          <BookingSchedule
            serviceId={service.id}
            providerId={service.provider_id}
            searchParams={searchParams}
          />
        </Suspense>
      </div>
    </main>
  );
}
