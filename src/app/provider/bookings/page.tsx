import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { BookingStatusBadge } from "@/components/dashboard/BookingStatusBadge";
import { ProviderBookingActions } from "@/components/provider/ProviderBookingActions";
import { EmptyState } from "@/components/ui/EmptyState";
import { DEFAULT_PROVIDER_TIME_ZONE } from "@/config/booking";
import { t } from "@/config/messages.fa";
import { getProviderBookings, getProviderProfile } from "@/lib/api/provider";
import type { BookingPage } from "@/lib/api/types";
import { ApiError } from "@/lib/api/problem";
import { redirectOnUnauthorized } from "@/lib/auth/session";
import { formatSlotTime, todayInTimeZone } from "@/lib/booking/dates";
import { numberFormatFa } from "@/lib/format/digits";
import { formatTomanFromRial } from "@/lib/format/money";
import { describeJalaliDate } from "@/lib/jalali/labels";

export const metadata: Metadata = {
  title: `${t("provider.bookings.title")} | ${t("brand.name")}`,
  robots: { index: false, follow: false },
};

type ProviderBookingsPageProps = {
  searchParams: Promise<{ cursor?: string | string[] }>;
};

export default async function ProviderBookingsPage({ searchParams }: ProviderBookingsPageProps) {
  const rawCursor = firstValue((await searchParams).cursor);
  const cursor = rawCursor === undefined ? undefined : Number(rawCursor);
  if (cursor !== undefined && (!Number.isSafeInteger(cursor) || cursor < 1)) redirect("/provider/bookings");

  const [page, timeZone] = await Promise.all([getBookingsPage(cursor), getProfileTimeZone()]);

  return (
    <main className="mx-auto w-full max-w-page flex-1 px-4 py-6 md:py-8">
      <h1 className="text-2xl font-bold text-text">{t("provider.bookings.title")}</h1>
      <section className="mt-6" aria-label={t("provider.bookings.title")}>
        {page.items.length === 0 ? (
          <EmptyState title={t("provider.bookings.empty")} />
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {page.items.map((booking) => {
              const localDate = todayInTimeZone(timeZone, new Date(booking.starts_at));
              const date = describeJalaliDate(localDate);
              const time = formatSlotTime(booking.starts_at, timeZone);
              const available: ("start" | "complete")[] = booking.status === "confirmed"
                ? ["start"]
                : booking.status === "in_progress"
                  ? ["complete"]
                  : [];

              return (
                <li key={booking.id} className="flex flex-col gap-4 rounded-md border border-border bg-white p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h2 className="font-semibold text-text">{booking.service_name}</h2>
                    <BookingStatusBadge status={booking.status} />
                  </div>
                  <p className="text-sm text-text-muted">
                    {date.weekday} {date.day} {date.month} {date.year}، {time}
                  </p>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
                    <span className="text-sm text-text-muted">{formatTomanFromRial(booking.price_irr)}</span>
                    <span className="text-xs text-text-muted">{t("booking.success.number")}: {numberFormatFa(booking.id)}</span>
                  </div>
                  <ProviderBookingActions bookingId={booking.id} available={available} />
                </li>
              );
            })}
          </ul>
        )}
        {page.next_cursor !== null && (
          <Link
            href={`/provider/bookings?cursor=${page.next_cursor}`}
            className="mt-5 inline-flex min-h-10 items-center rounded-md border border-border px-4 text-sm font-medium text-primary hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {t("provider.bookings.next")}
          </Link>
        )}
      </section>
    </main>
  );
}

async function getBookingsPage(cursor?: number): Promise<BookingPage> {
  try {
    return await getProviderBookings(cursor);
  } catch (error) {
    redirectOnUnauthorized(error);
    throw error;
  }
}

async function getProfileTimeZone(): Promise<string> {
  try {
    return (await getProviderProfile()).time_zone;
  } catch (error) {
    redirectOnUnauthorized(error);
    if (error instanceof ApiError && error.status === 404) return DEFAULT_PROVIDER_TIME_ZONE;
    throw error;
  }
}

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
