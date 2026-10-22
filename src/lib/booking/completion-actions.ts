"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { t } from "@/config/messages.fa";
import { confirmBookingCompletion, disputeBooking } from "@/lib/api/bookings";
import { ApiError, problemMessage } from "@/lib/api/problem";
import { parseServiceId } from "@/lib/api/service-id";
import { redirectOnUnauthorized, requireRole } from "@/lib/auth/session";

export type CompletionState = { message?: string; success?: boolean };

const disputeSchema = z.object({
  bookingId: z.number().int().safe().positive(),
  reason: z.string().trim().min(1).max(1000),
});

export async function confirmCompletionAction(
  _previous: CompletionState,
  formData: FormData,
): Promise<CompletionState> {
  await requireRole("client");
  const bookingId = readBookingId(formData);
  if (bookingId === null) return { message: t("dashboard.booking.completion.conflict") };

  try {
    await confirmBookingCompletion(bookingId);
  } catch (error) {
    redirectOnUnauthorized(error);
    if (error instanceof ApiError) {
      if (error.status === 409) return { message: t("dashboard.booking.completion.conflict") };
      return { message: problemMessage(error) };
    }
    throw error;
  }

  revalidateAfterChange();
  return { message: t("dashboard.booking.completion.success"), success: true };
}

export async function disputeBookingAction(
  _previous: CompletionState,
  formData: FormData,
): Promise<CompletionState> {
  await requireRole("client");
  const parsed = disputeSchema.safeParse({
    bookingId: readBookingId(formData),
    reason: readString(formData, "reason"),
  });
  if (!parsed.success) {
    return { message: t("dashboard.booking.completion.conflict") };
  }

  try {
    await disputeBooking(parsed.data.bookingId, parsed.data.reason);
  } catch (error) {
    redirectOnUnauthorized(error);
    if (error instanceof ApiError) {
      if (error.code === "dispute_window_closed") {
        return { message: t("dashboard.booking.dispute.windowClosed") };
      }
      if (error.status === 409) return { message: t("dashboard.booking.dispute.conflict") };
      if (error.code === "invalid_dispute_reason" || error.status === 400) {
        return { message: t("dashboard.booking.dispute.conflict") };
      }
      return { message: problemMessage(error) };
    }
    throw error;
  }

  revalidateAfterChange();
  return { message: t("dashboard.booking.dispute.success"), success: true };
}

function readString(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function readBookingId(formData: FormData): number | null {
  const value = formData.get("booking_id");
  return typeof value === "string" ? parseServiceId(value) : null;
}

function revalidateAfterChange(): void {
  revalidatePath("/dashboard/bookings");
  revalidatePath("/wallet");
}
