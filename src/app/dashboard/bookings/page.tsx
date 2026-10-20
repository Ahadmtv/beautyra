import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { BookingStatusBadge } from "@/components/dashboard/BookingStatusBadge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Select } from "@/components/ui/Select";
import { t } from "@/config/messages.fa";
import { getCustomerBookings } from "@/lib/api/bookings";
import type { Booking, BookingPage } from "@/lib/api/types";
import { redirectOnUnauthorized, requireRole } from "@/lib/auth/session";
import { formatTomanFromRial } from "@/lib/format/money";
import { describeJalaliDate } from "@/lib/jalali/labels";
import { todayInTimeZone, formatSlotTime } from "@/lib/booking/dates";
import { DEFAULT_PROVIDER_TIME_ZONE } from "@/config/booking";

export const metadata: Metadata = {
  title: `${t("dashboard.bookings.title")} | ${t("brand.name")}`,
  robots: { index: false, follow: false },
};

const statusOptions = [
  { value: "confirmed", label: t("dashboard.bookings.status.confirmed") },
  { value: "in_progress", label: t("dashboard.bookings.status.in_progress") },
  { value: "completion_pending", label: t("dashboard.bookings.status.completion_pending") },
  { value: "disputed", label: t("dashboard.bookings.status.disputed") },
  { value: "completed", label: t("dashboard.bookings.status.completed") },
  { value: "cancelled", label: t("dashboard.bookings.status.cancelled") },
  { value: "expired", label: t("dashboard.bookings.status.expired") },
] as const;

type BookingsPageProps = {
  searchParams: Promise<{ cursor?: string | string[]; status?: string | string[] }>;
};

export default async function CustomerBookingsPage({ searchParams }: BookingsPageProps) {
  await requireRole("client");
  const params = await searchParams;
  const rawCursor = firstValue(params.cursor);
  const cursor = rawCursor === undefined ? undefined : Number(rawCursor);
  const rawStatus = firstValue(params.status);
  const selectedStatus = isBookingStatus(rawStatus) ? rawStatus : "";

  if (cursor !== undefined && (!Number.isSafeInteger(cursor) || cursor < 1)) {
    redirect(`/dashboard/bookings${selectedStatus ? `?status=${selectedStatus}` : ""}`);
  }

  let page: BookingPage;
  try {
    page = await getCustomerBookings(cursor);
  } catch (error) {
    redirectOnUnauthorized(error);
    throw error;
  }

  // TODO(backend): GET /bookings has no status parameter, so this only filters the fetched cursor page.
  const bookings = selectedStatus
    ? page.items.filter((booking) => booking.status === selectedStatus)
    : page.items;

  return (
    <main className="mx-auto w-full max-w-page flex-1 px-4 py-6 md:py-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">{t("dashboard.bookings.title")}</h1>
          <p className="mt-2 text-xs text-text-muted">{t("dashboard.booking.timeZoneNote")}</p>
        </div>
        <form method="get" className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <Select
            id="booking-status"
            name="status"
            label={t("dashboard.bookings.filter.status")}
            placeholder={t("dashboard.bookings.filter.all")}
            options={statusOptions}
            defaultValue={selectedStatus}
          />
          <Button type="submit" variant="outline">
            {t("dashboard.bookings.filter.submit")}
          </Button>
        </form>
      </div>

      {selectedStatus && (
        <p className="mt-3 text-xs text-text-muted">{t("dashboard.bookings.filter.currentPageNote")}</p>
      )}

      <section className="mt-6" aria-label={t("dashboard.bookings.title")}>
        {bookings.length === 0 ? (
          <EmptyState title={t("dashboard.bookings.empty")} />
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {bookings.map((booking) => (
              <li key={booking.id}>
                <BookingCard booking={booking} />
              </li>
            ))}
          </ul>
        )}
        {page.next_cursor !== null && (
          <Link
            href={bookingListHref(page.next_cursor, selectedStatus)}
            className="mt-6 inline-flex min-h-10 items-center rounded-md border border-border px-4 text-sm font-medium text-primary hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {t("dashboard.bookings.nextPage")}
          </Link>
        )}
      </section>
    </main>
  );
}

function BookingCard({ booking }: { booking: Booking }) {
  const localDate = todayInTimeZone(DEFAULT_PROVIDER_TIME_ZONE, new Date(booking.starts_at));
  const jalaliDate = describeJalaliDate(localDate);
  const time = formatSlotTime(booking.starts_at, DEFAULT_PROVIDER_TIME_ZONE);

  return (
    <Link
      href={`/dashboard/bookings/${booking.id}`}
      className="flex h-full flex-col gap-4 rounded-md border border-border bg-white p-4 hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-semibold text-text">{booking.service_name}</h2>
        <BookingStatusBadge status={booking.status} />
      </div>
      <p className="text-sm text-text-muted">
        {jalaliDate.weekday} {jalaliDate.day} {jalaliDate.month} {jalaliDate.year}، {time}
      </p>
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-3 text-sm">
        <span className="text-text-muted">{formatTomanFromRial(booking.price_irr)}</span>
        <span className="font-medium text-primary">{t("dashboard.bookings.openDetails")}</span>
      </div>
    </Link>
  );
}

function bookingListHref(cursor: number, status: string): string {
  const query = new URLSearchParams({ cursor: String(cursor) });
  if (status) query.set("status", status);
  return `/dashboard/bookings?${query.toString()}`;
}

function isBookingStatus(value: string | undefined): value is Booking["status"] {
  return statusOptions.some((option) => option.value === value);
}

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
