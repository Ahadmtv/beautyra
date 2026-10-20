"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { t } from "@/config/messages.fa";
import {
  cancelProviderBooking,
  requestProviderCompletion,
  startProviderBooking,
} from "@/lib/api/provider";
import { ApiError, problemMessage } from "@/lib/api/problem";
import { parseServiceId } from "@/lib/api/service-id";
import { redirectOnUnauthorized, requireRole } from "@/lib/auth/session";

const transitionSchema = z.enum(["start", "request_completion", "cancel"]);

export type ProviderBookingActionState = {
  message?: string;
};

export async function transitionProviderBookingAction(
  _previous: ProviderBookingActionState,
  formData: FormData,
): Promise<ProviderBookingActionState> {
  await requireRole("provider");

  const rawId = formData.get("booking_id");
  const bookingId = typeof rawId === "string" ? parseServiceId(rawId) : null;
  const transition = transitionSchema.safeParse(formData.get("transition"));
  if (bookingId === null || !transition.success) {
    return { message: t("api.field.invalid") };
  }

  try {
    if (transition.data === "start") {
      await startProviderBooking(bookingId);
    } else if (transition.data === "request_completion") {
      await requestProviderCompletion(bookingId);
    } else {
      await cancelProviderBooking(bookingId);
    }
  } catch (error) {
    redirectOnUnauthorized(error);
    if (error instanceof ApiError && error.status === 409) {
      return { message: t("provider.bookings.conflict") };
    }
    if (error instanceof ApiError) return { message: problemMessage(error) };
    throw error;
  }

  revalidatePath("/provider/bookings");
  if (transition.data !== "start") revalidatePath("/wallet");
  redirect("/provider/bookings");
}
