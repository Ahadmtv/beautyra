"use server";

import { z } from "zod";

import { t } from "@/config/messages.fa";
import { saveWorkingHours } from "@/lib/api/provider";
import { ApiError, problemMessage } from "@/lib/api/problem";
import { redirectOnUnauthorized, requireRole } from "@/lib/auth/session";
import { validateWorkingHours } from "@/lib/provider/working-hours";

const workingHoursSchema = z.object({
  weekday: z.number().int().min(1).max(7),
  opens_at: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/),
  closes_at: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/),
});

export type WorkingHoursActionState = {
  message?: string;
  success?: boolean;
};

export async function saveWorkingHoursAction(
  _previous: WorkingHoursActionState,
  formData: FormData,
): Promise<WorkingHoursActionState> {
  await requireRole("provider");

  const raw = formData.get("intervals");
  if (typeof raw !== "string") return { message: t("provider.workingHours.invalid") };

  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return { message: t("provider.workingHours.invalid") };
  }

  const parsed = z.array(workingHoursSchema).safeParse(value);
  if (!parsed.success || !validateWorkingHours(parsed.data)) {
    return { message: t("provider.workingHours.invalid") };
  }

  try {
    await saveWorkingHours(parsed.data);
  } catch (error) {
    redirectOnUnauthorized(error);
    if (error instanceof ApiError) return { message: problemMessage(error) };
    throw error;
  }

  return { message: t("provider.workingHours.saveSuccess"), success: true };
}
