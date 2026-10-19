import Link from "next/link";

import { DEFAULT_PROVIDER_TIME_ZONE } from "@/config/booking";
import { type MessageKey, t } from "@/config/messages.fa";
import { getProviderAvailability } from "@/lib/api/availability";
import { ApiError } from "@/lib/api/problem";
import type { AvailabilityResponse } from "@/lib/api/types";
import { addDaysToIsoDate, formatSlotTime, resolveSelectedDate, todayInTimeZone } from "@/lib/booking/dates";
import { describeJalaliDate } from "@/lib/jalali/labels";

import { DateStrip } from "./DateStrip";

const WEEK_LENGTH_DAYS = 7;

const slotLinkClassName =
  "flex h-10 items-center justify-center rounded-md border border-border bg-white text-sm font-medium text-text transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

type BookingScheduleProps = {
  serviceId: number;
  providerId: number;
  searchParams: Promise<{ date?: string | string[] }>;
};

type AvailabilityOutcome =
  | { kind: "ok"; response: AvailabilityResponse }
  | { kind: "error"; messageKey: Extract<MessageKey, "booking.error.notFound" | "booking.error.conflict"> };

export async function BookingSchedule({ serviceId, providerId, searchParams }: BookingScheduleProps) {
  const { date } = await searchParams;
  const requestedDate = Array.isArray(date) ? date[0] : date;
  const today = todayInTimeZone(DEFAULT_PROVIDER_TIME_ZONE);
  const selectedDate = resolveSelectedDate(requestedDate, today);

  const days = Array.from({ length: WEEK_LENGTH_DAYS }, (_, offset) =>
    addDaysToIsoDate(selectedDate, offset),
  );
  const previousWeekDate = addDaysToIsoDate(selectedDate, -WEEK_LENGTH_DAYS);
  const earliestPreviousDate = previousWeekDate < today ? today : previousWeekDate;
  const previousDate = selectedDate > today ? earliestPreviousDate : null;
  const nextDate = addDaysToIsoDate(selectedDate, WEEK_LENGTH_DAYS);
  const nextDayDate = addDaysToIsoDate(selectedDate, 1);
  const basePath = `/book/${serviceId}`;

  const outcome = await loadAvailability(providerId, serviceId, selectedDate);
  const selectedLabel = describeJalaliDate(selectedDate);

  return (
    <section
      aria-labelledby="booking-schedule-heading"
      className="flex flex-col gap-6 rounded-md border border-border bg-white p-4 md:p-6"
    >
      <h2 id="booking-schedule-heading" className="text-lg font-bold text-text">
        {t("booking.dateHeading")}
      </h2>

      <DateStrip
        basePath={basePath}
        days={days}
        selectedDate={selectedDate}
        today={today}
        previousDate={previousDate}
        nextDate={nextDate}
      />

      <div className="flex flex-col gap-3">
        <h3 className="font-bold text-text">
          {t("booking.timeHeading")}: {selectedLabel.weekday} {selectedLabel.day} {selectedLabel.month}{" "}
          {selectedLabel.year}
        </h3>

        {outcome.kind === "error" && (
          <p role="alert" className="rounded-md bg-surface p-4 text-sm text-text">
            {t(outcome.messageKey)}
          </p>
        )}

        {outcome.kind === "ok" && outcome.response.slots.length === 0 && (
          <div className="flex flex-col items-start gap-3">
            <p className="font-medium text-text">{t("booking.noSlots.title")}</p>
            <Link
              href={`${basePath}?date=${nextDayDate}`}
              className="inline-flex h-10 items-center rounded-md border border-border bg-white px-4 text-sm font-medium text-primary hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {t("booking.noSlots.nextDay")}
            </Link>
          </div>
        )}

        {outcome.kind === "ok" && outcome.response.slots.length > 0 && (
          <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
            {outcome.response.slots.map((slot) => {
              const time = formatSlotTime(slot.start_at, outcome.response.time_zone);
              return (
                <li key={slot.start_at}>
                  <Link
                    href={`/book/${serviceId}/confirm?date=${selectedDate}&start_at=${encodeURIComponent(slot.start_at)}`}
                    aria-label={t("booking.slotLabel", { time })}
                    className={slotLinkClassName}
                  >
                    {time}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="flex flex-col gap-1 text-xs text-text-muted">
        <p>{t("booking.note")}</p>
        <p>{t("booking.timeZoneNote")}</p>
      </div>
    </section>
  );
}

async function loadAvailability(
  providerId: number,
  serviceId: number,
  date: string,
): Promise<AvailabilityOutcome> {
  try {
    return { kind: "ok", response: await getProviderAvailability(providerId, serviceId, date) };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return { kind: "error", messageKey: "booking.error.notFound" };
    }
    if (error instanceof ApiError && error.status === 409) {
      return { kind: "error", messageKey: "booking.error.conflict" };
    }
    throw error;
  }
}
