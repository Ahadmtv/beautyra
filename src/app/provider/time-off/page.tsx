import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { TimeOffForm } from "@/components/provider/TimeOffForm";
import { EmptyState } from "@/components/ui/EmptyState";
import { t, type MessageKey } from "@/config/messages.fa";
import { DEFAULT_PROVIDER_TIME_ZONE } from "@/config/booking";
import { getProviderProfile, getProviderTimeOff } from "@/lib/api/provider";
import type { TimeOff, TimeOffPage } from "@/lib/api/types";
import { ApiError } from "@/lib/api/problem";
import { redirectOnUnauthorized } from "@/lib/auth/session";
import { formatSlotTime, todayInTimeZone } from "@/lib/booking/dates";
import { describeJalaliDate } from "@/lib/jalali/labels";

export const metadata: Metadata = {
  title: `${t("provider.timeOff.title")} | ${t("brand.name")}`,
  robots: { index: false, follow: false },
};

const kindLabels: Record<TimeOff["kind"], MessageKey> = {
  time_off: "provider.timeOff.kind.time_off",
  blocked: "provider.timeOff.kind.blocked",
  holiday: "provider.timeOff.kind.holiday",
};

type ProviderTimeOffPageProps = {
  searchParams: Promise<{ cursor?: string | string[] }>;
};

export default async function ProviderTimeOffPage({ searchParams }: ProviderTimeOffPageProps) {
  const rawCursor = firstValue((await searchParams).cursor);
  const cursor = rawCursor === undefined ? undefined : Number(rawCursor);
  if (cursor !== undefined && (!Number.isSafeInteger(cursor) || cursor < 1)) redirect("/provider/time-off");

  const [page, timeZone] = await Promise.all([getTimeOffPage(cursor), getProfileTimeZone()]);

  return (
    <main className="mx-auto w-full max-w-page flex-1 px-4 py-6 md:py-8">
      <h1 className="text-2xl font-bold text-text">{t("provider.timeOff.title")}</h1>
      <details className="group mt-5 rounded-md border border-border bg-white p-4">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-medium text-primary">
          {t("provider.timeOff.create")}
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 shrink-0 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m7 10 5 5 5-5" />
          </svg>
        </summary>
        <div className="mt-5 max-w-2xl">
          <p className="mb-4 text-sm text-text-muted">{t("provider.timeOff.timeZoneNote")}</p>
          <TimeOffForm />
        </div>
      </details>

      <section className="mt-6 flex flex-col gap-3" aria-label={t("provider.timeOff.title")}>
        {page.items.length === 0 ? (
          <EmptyState title={t("provider.timeOff.empty")} />
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {page.items.map((item) => (
              <li key={item.id} className="rounded-md border border-border bg-white p-4">
                <p className="font-semibold text-text">{t(kindLabels[item.kind])}</p>
                {item.kind === "holiday" ? (
                  <p className="mt-2 text-sm text-text-muted">
                    {item.holiday_date ? formatJalaliDate(item.holiday_date) : t("provider.timeOff.dateUnavailable")}
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-text-muted">
                    {formatJalaliDateTime(item.starts_at, timeZone)} — {formatJalaliDateTime(item.ends_at, timeZone)}
                  </p>
                )}
                {item.reason && <p className="mt-2 text-sm text-text">{item.reason}</p>}
              </li>
            ))}
          </ul>
        )}
        {page.next_cursor !== null && (
          <Link
            href={`/provider/time-off?cursor=${page.next_cursor}`}
            className="mt-3 inline-flex min-h-10 w-fit items-center rounded-md border border-border px-4 text-sm font-medium text-primary hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {t("provider.timeOff.next")}
          </Link>
        )}
      </section>
    </main>
  );
}

function formatJalaliDate(isoDate: string): string {
  const date = describeJalaliDate(isoDate);
  return `${date.weekday} ${date.day} ${date.month} ${date.year}`;
}

function formatJalaliDateTime(value: string, timeZone: string): string {
  const localDate = todayInTimeZone(timeZone, new Date(value));
  return `${formatJalaliDate(localDate)}، ${formatSlotTime(value, timeZone)}`;
}

async function getTimeOffPage(cursor?: number): Promise<TimeOffPage> {
  try {
    return await getProviderTimeOff(cursor);
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
