import type { Metadata } from "next";
import Link from "next/link";
import { randomUUID } from "node:crypto";
import { notFound, redirect } from "next/navigation";

import { BookingConfirmForm } from "@/components/booking/BookingConfirmForm";
import { t } from "@/config/messages.fa";
import { getProviderAvailability } from "@/lib/api/availability";
import { ApiError } from "@/lib/api/problem";
import { loadPublicServiceDetailOrNotFound } from "@/lib/api/services";
import { getWalletBalance } from "@/lib/api/wallet";
import type { AvailabilityResponse } from "@/lib/api/types";
import { ROLES } from "@/lib/auth/claims";
import { requireRole } from "@/lib/auth/session";
import { formatSlotTime, isIsoDate } from "@/lib/booking/dates";
import { numberFormatFa } from "@/lib/format/digits";
import { formatTomanFromRial } from "@/lib/format/money";
import { describeJalaliDate } from "@/lib/jalali/labels";

type ConfirmPageProps = {
  params: Promise<{ serviceId: string }>;
  searchParams: Promise<{ date?: string | string[]; start_at?: string | string[] }>;
};

export const metadata: Metadata = {
  title: `${t("booking.confirm.title")} | ${t("brand.name")}`,
  robots: { index: false, follow: false },
};

export default async function BookingConfirmPage({ params, searchParams }: ConfirmPageProps) {
  await requireRole(ROLES);

  const { serviceId } = await params;
  const { service, providerName } = await loadPublicServiceDetailOrNotFound(serviceId);
  const { date: rawDate, start_at: rawStartAt } = await searchParams;
  const date = firstValue(rawDate);
  const startAt = firstValue(rawStartAt);
  const scheduleHref = `/book/${service.id}`;

  if (date === undefined || !isIsoDate(date) || startAt === undefined || Number.isNaN(Date.parse(startAt))) {
    redirect(scheduleHref);
  }

  const availability = await loadAvailabilityOrNotFound(service.provider_id, service.id, date);
  const slot = availability.slots.find((item) => item.start_at === startAt);
  const walletAvailableIrr = await loadWalletAvailableOrNull();

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
          <li>
            <Link href={scheduleHref} className="hover:text-primary">
              {t("booking.title")}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-text">
            {t("booking.confirm.title")}
          </li>
        </ol>
      </nav>

      <section className="mt-6 flex flex-col gap-6 rounded-md border border-border bg-white p-4 md:p-6">
        <h1 className="text-xl font-bold text-text">{t("booking.confirm.title")}</h1>

        {slot === undefined ? (
          <div role="alert" className="flex flex-col items-start gap-3 rounded-md bg-surface p-4 text-sm text-text">
            <p>{t("booking.confirm.slotGone")}</p>
            <Link
              href={`${scheduleHref}?date=${availability.date}`}
              className="font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {t("booking.confirm.backToTime")}
            </Link>
          </div>
        ) : (
          <ConfirmationDetails
            serviceId={service.id}
            serviceName={service.name}
            providerName={providerName}
            durationMinutes={service.duration_minutes}
            priceIrr={service.price_irr}
            walletAvailableIrr={walletAvailableIrr}
            availability={availability}
            startAt={slot.start_at}
          />
        )}
      </section>
    </main>
  );
}

type ConfirmationDetailsProps = {
  serviceId: number;
  serviceName: string;
  providerName: string | null;
  durationMinutes: number;
  priceIrr: number;
  walletAvailableIrr: number | null;
  availability: AvailabilityResponse;
  startAt: string;
};

function ConfirmationDetails({
  serviceId,
  serviceName,
  providerName,
  durationMinutes,
  priceIrr,
  walletAvailableIrr,
  availability,
  startAt,
}: ConfirmationDetailsProps) {
  const jalaliDate = describeJalaliDate(availability.date);
  const time = formatSlotTime(startAt, availability.time_zone);
  const priceLabel = priceIrr === 0 ? t("service.free") : formatTomanFromRial(priceIrr);

  return (
    <>
      <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <dt className="text-text-muted">{t("service.summary")}</dt>
          <dd className="font-medium text-text">
            {serviceName}
            {providerName && <span className="block text-text-muted">{providerName}</span>}
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-text-muted">{t("booking.confirm.dateLabel")}</dt>
          <dd className="font-medium text-text">
            {jalaliDate.weekday} {jalaliDate.day} {jalaliDate.month} {jalaliDate.year}
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-text-muted">{t("booking.confirm.timeLabel")}</dt>
          <dd className="font-medium text-text">{time}</dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-text-muted">{t("service.duration")}</dt>
          <dd className="font-medium text-text">
            {t("service.durationValue", { minutes: numberFormatFa(durationMinutes) })}
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-text-muted">{t("service.price")}</dt>
          <dd className="font-medium text-text">{priceLabel}</dd>
        </div>
      </dl>

      <BookingConfirmForm
        serviceId={serviceId}
        date={availability.date}
        startAt={startAt}
        priceIrr={priceIrr}
        walletAvailableIrr={walletAvailableIrr}
        idempotencyKey={randomUUID()}
        paymentIdempotencyKey={randomUUID()}
      />
    </>
  );
}

async function loadWalletAvailableOrNull(): Promise<number | null> {
  try {
    return (await getWalletBalance()).available_irr;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      redirect("/auth/expired");
    }
    if (error instanceof ApiError && (error.status === 403 || error.status === 404)) {
      return null;
    }
    throw error;
  }
}

async function loadAvailabilityOrNotFound(
  providerId: number,
  serviceId: number,
  date: string,
): Promise<AvailabilityResponse> {
  try {
    return await getProviderAvailability(providerId, serviceId, date);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
