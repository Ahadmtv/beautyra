import type { Metadata } from "next";
import Link from "next/link";
import { randomUUID } from "node:crypto";
import { notFound } from "next/navigation";

import { BookingCompletionActions } from "@/components/dashboard/BookingCompletionActions";
import { BookingPaymentForm } from "@/components/dashboard/BookingPaymentForm";
import { BookingStatusBadge } from "@/components/dashboard/BookingStatusBadge";
import { CancelBookingForm } from "@/components/dashboard/CancelBookingForm";
import { DEFAULT_PROVIDER_TIME_ZONE } from "@/config/booking";
import { t } from "@/config/messages.fa";
import { getBooking } from "@/lib/api/bookings";
import { ApiError } from "@/lib/api/problem";
import { parseServiceId } from "@/lib/api/service-id";
import { formatSlotTime, todayInTimeZone } from "@/lib/booking/dates";
import { redirectOnUnauthorized, requireRole } from "@/lib/auth/session";
import { numberFormatFa } from "@/lib/format/digits";
import { formatTomanFromRial } from "@/lib/format/money";
import { describeJalaliDate } from "@/lib/jalali/labels";

export const metadata: Metadata = {
  title: `${t("dashboard.booking.title")} | ${t("brand.name")}`,
  robots: { index: false, follow: false },
};

type BookingDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CustomerBookingDetailPage({ params }: BookingDetailPageProps) {
  await requireRole("client");
  const { id } = await params;
  const bookingId = parseServiceId(id);
  if (bookingId === null) notFound();

  const booking = await loadBooking(bookingId);
  const startTime = formatSlotTime(booking.starts_at, DEFAULT_PROVIDER_TIME_ZONE);
  const endTime = formatSlotTime(booking.ends_at, DEFAULT_PROVIDER_TIME_ZONE);

  return (
    <main className="mx-auto w-full max-w-page flex-1 px-4 py-6 md:py-8">
      <Link
        href="/dashboard/bookings"
        className="text-sm font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {t("dashboard.bookings.title")}
      </Link>
      <section className="mt-5 flex flex-col gap-6 rounded-md border border-border bg-white p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-bold text-text">{t("dashboard.booking.title")}</h1>
          <BookingStatusBadge status={booking.status} />
        </div>
        <p className="text-sm text-text-muted">
          {t("dashboard.booking.number")}: {numberFormatFa(booking.id)}
        </p>

        <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          <DetailField label={t("service.summary")} value={booking.service_name} />
          <DetailField label={t("service.price")} value={formatTomanFromRial(booking.price_irr)} />
          <DetailField
            label={t("dashboard.booking.start")}
            value={`${formatJalaliDateTime(booking.starts_at)}، ${startTime}`}
          />
          <DetailField
            label={t("dashboard.booking.end")}
            value={`${formatJalaliDateTime(booking.ends_at)}، ${endTime}`}
          />
          <DetailField
            label={t("dashboard.booking.duration")}
            value={t("service.durationValue", { minutes: numberFormatFa(booking.duration_minutes) })}
          />
          <DetailField
            label={t("dashboard.booking.buffer")}
            value={t("service.durationValue", { minutes: numberFormatFa(booking.buffer_minutes) })}
          />
        </dl>
        <p className="text-xs text-text-muted">{t("dashboard.booking.timeZoneNote")}</p>

        {booking.status === "pending_payment" && (
          <div className="flex flex-col items-start gap-3 rounded-md bg-surface p-4 text-sm text-text">
            <p>{t("dashboard.booking.pendingPaymentNote")}</p>
            <BookingPaymentForm bookingId={booking.id} idempotencyKey={randomUUID()} />
          </div>
        )}
        {booking.status === "confirmed" && <CancelBookingForm bookingId={booking.id} />}
        {booking.status === "completion_pending" && (
          <BookingCompletionActions bookingId={booking.id} />
        )}
        {booking.status === "disputed" && (
          <p role="status" className="rounded-md bg-surface p-3 text-sm text-text-muted">
            {t("dashboard.booking.disputedNote")}
          </p>
        )}
      </section>
    </main>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-md bg-surface p-3">
      <dt className="text-text-muted">{label}</dt>
      <dd className="font-medium text-text">{value}</dd>
    </div>
  );
}

function formatJalaliDateTime(value: string): string {
  const localDate = todayInTimeZone(DEFAULT_PROVIDER_TIME_ZONE, new Date(value));
  const date = describeJalaliDate(localDate);
  return `${date.weekday} ${date.day} ${date.month} ${date.year}`;
}

async function loadBooking(bookingId: number) {
  try {
    return await getBooking(bookingId);
  } catch (error) {
    redirectOnUnauthorized(error);
    if (error instanceof ApiError && (error.status === 403 || error.status === 404)) {
      notFound();
    }
    throw error;
  }
}
