"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { t } from "@/config/messages.fa";
import { cancelBooking } from "@/lib/api/bookings";
import { ApiError, problemMessage } from "@/lib/api/problem";
import { requireRole, redirectOnUnauthorized } from "@/lib/auth/session";
import { parseServiceId } from "@/lib/api/service-id";

export type CancellationState = {
  message?: string;
};

export async function cancelBookingAction(
  _previous: CancellationState,
  formData: FormData,
): Promise<CancellationState> {
  await requireRole("client");

  const rawId = formData.get("booking_id");
  const bookingId = typeof rawId === "string" ? parseServiceId(rawId) : null;
  if (bookingId === null) {
    return { message: t("dashboard.booking.cancel.invalid") };
  }

  try {
    await cancelBooking(bookingId);
  } catch (error) {
    redirectOnUnauthorized(error);
    if (error instanceof ApiError && error.status === 409) {
      return { message: t("dashboard.booking.cancel.conflict") };
    }
    if (error instanceof ApiError) {
      return { message: problemMessage(error) };
    }
    throw error;
  }

  revalidatePath("/dashboard/bookings");
  revalidatePath(`/dashboard/bookings/${bookingId}`);
  revalidatePath("/wallet");
  redirect(`/dashboard/bookings/${bookingId}`);
}
