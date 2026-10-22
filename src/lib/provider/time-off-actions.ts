"use server";

import { z } from "zod";

import { t } from "@/config/messages.fa";
import { createProviderTimeOff } from "@/lib/api/provider";
import type { TimeOffInput } from "@/lib/api/types";
import { ApiError, problemMessage } from "@/lib/api/problem";
import { redirectOnUnauthorized, requireRole } from "@/lib/auth/session";
import { jalaliDateTimeToGregorian, jalaliDateToGregorianIso } from "@/lib/provider/jalali-date";

const dateTimeSchema = z.iso.datetime({ offset: true });
const timeRangeSchema = z.object({
  kind: z.enum(["time_off", "blocked"]),
  starts_at: dateTimeSchema,
  ends_at: dateTimeSchema,
  reason: z.string().max(500),
});

export type TimeOffActionState = {
  message?: string;
  success?: boolean;
};

export async function createTimeOffAction(
  _previous: TimeOffActionState,
  formData: FormData,
): Promise<TimeOffActionState> {
  await requireRole("provider");

  const kind = readString(formData, "kind");
  let input: TimeOffInput;

  if (kind === "holiday") {
    const holidayDate = jalaliDateToGregorianIso(readString(formData, "holiday_date"));
    if (!holidayDate) return { message: t("provider.timeOff.invalid") };
    input = { kind: "holiday", holiday_date: holidayDate };
  } else {
    const startsNaive = jalaliDateTimeToGregorian(readString(formData, "starts_at"));
    const endsNaive = jalaliDateTimeToGregorian(readString(formData, "ends_at"));
    if (!startsNaive || !endsNaive) return { message: t("provider.timeOff.invalid") };
    const startsAt = withTehranOffset(startsNaive);
    const endsAt = withTehranOffset(endsNaive);
    const parsed = timeRangeSchema.safeParse({
      kind,
      starts_at: startsAt,
      ends_at: endsAt,
      reason: readString(formData, "reason"),
    });
    if (!parsed.success || Date.parse(parsed.data.starts_at) >= Date.parse(parsed.data.ends_at)) {
      return { message: t("provider.timeOff.invalid") };
    }
    input = {
      ...parsed.data,
      starts_at: new Date(parsed.data.starts_at).toISOString(),
      ends_at: new Date(parsed.data.ends_at).toISOString(),
    };
  }

  try {
    await createProviderTimeOff(input);
  } catch (error) {
    redirectOnUnauthorized(error);
    if (error instanceof ApiError && error.status === 409) {
      return { message: t("provider.timeOff.conflict") };
    }
    if (error instanceof ApiError) return { message: problemMessage(error) };
    throw error;
  }

  return { message: t("provider.timeOff.createSuccess"), success: true };
}

function readString(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

// ساعت بدون اختلاف منطقه زمانی، زمان رسمی تهران (وبسایت بدون تغییر ساعتی در طول سال) فرض می‌شود.
function withTehranOffset(value: string): string {
  if (/(z|[+-]\d{2}:\d{2})$/i.test(value)) {
    return value;
  }
  const withSeconds = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value) ? `${value}:00` : value;
  return `${withSeconds}+03:30`;
}
