import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DEFAULT_PROVIDER_TIME_ZONE } from "@/config/booking";
import { t } from "@/config/messages.fa";
import { getBooking } from "@/lib/api/bookings";
import { ApiError } from "@/lib/api/problem";
import { parseServiceId } from "@/lib/api/service-id";
import type { Booking } from "@/lib/api/types";
import { ROLES } from "@/lib/auth/claims";
import { redirectOnUnauthorized, requireRole } from "@/lib/auth/session";
import { formatSlotTime, todayInTimeZone } from "@/lib/booking/dates";
import { numberFormatFa } from "@/lib/format/digits";
import { formatTomanFromRial } from "@/lib/format/money";
import { describeJalaliDate } from "@/lib/jalali/labels";

type BookingSuccessPageProps = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: `${t("booking.success.title")} | ${t("brand.name")}`,
  robots: { index: false, follow: false },
};

export default async function BookingSuccessPage({ params }: BookingSuccessPageProps) {
  await requireRole(ROLES);

  const { id } = await params;
  const bookingId = parseServiceId(id);
  if (bookingId === null) {
    notFound();
  }

  const booking = await loadBookingOrNotFound(bookingId);
  const localDate = todayInTimeZone(DEFAULT_PROVIDER_TIME_ZONE, new Date(booking.starts_at));
  const jalaliDate = describeJalaliDate(localDate);
  const time = formatSlotTime(booking.starts_at, DEFAULT_PROVIDER_TIME_ZONE);

  return (
    <main className="mx-auto w-full max-w-page flex-1 px-4 py-6 md:py-8">
      <section className="flex flex-col gap-6 rounded-md border border-border bg-white p-4 md:p-6">
        <h1 className="text-xl font-bold text-text">{t("booking.success.title")}</h1>
        <p className="text-sm text-text-muted">
          {t("booking.success.number")}: {numberFormatFa(booking.id)}
        </p>

        <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <dt className="text-text-muted">{t("service.summary")}</dt>
            <dd className="font-medium text-text">{booking.service_name}</dd>
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
            <dt className="text-text-muted">{t("service.price")}</dt>
            <dd className="font-medium text-text">{formatTomanFromRial(booking.price_irr)}</dd>
          </div>
        </dl>

        <Link
          href="/"
          className="inline-flex h-10 w-fit items-center rounded-md border border-border bg-white px-4 text-sm font-medium text-primary hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {t("booking.success.home")}
        </Link>
      </section>
    </main>
  );
}

async function loadBookingOrNotFound(bookingId: number): Promise<Booking> {
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
