"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { t } from "@/config/messages.fa";
import { createBooking, getBooking } from "@/lib/api/bookings";
import { ApiError, problemMessage } from "@/lib/api/problem";
import type { Booking } from "@/lib/api/types";
import { redirectOnUnauthorized } from "@/lib/auth/session";
import { startBookingPayment } from "@/lib/payments/booking";

import { parseBookingSubmission } from "./submission";

export type BookingFormState = {
  message?: string;
};

export async function createBookingAction(
  _previous: BookingFormState,
  formData: FormData,
): Promise<BookingFormState> {
  const submission = parseBookingSubmission(formData);
  if (!submission) {
    return { message: t("booking.confirm.invalid") };
  }

  let booking: Booking;
  try {
    booking = await createBooking(submission.input, submission.idempotencyKey);
  } catch (error) {
    redirectOnUnauthorized(error);
    if (error instanceof ApiError && error.status === 409) {
      return { message: t("booking.error.slotTaken") };
    }
    if (error instanceof ApiError) {
      return { message: problemMessage(error) };
    }
    throw error;
  }

  revalidatePath("/dashboard/bookings");
  booking = await getBooking(booking.id);
  if (booking.status === "confirmed") {
    redirect(`/bookings/${booking.id}/success`);
  }
  if (booking.status !== "pending_payment") {
    return { message: t("booking.error.slotTaken") };
  }

  const payment = await startBookingPayment(booking.id, submission.paymentIdempotencyKey);
  if (payment.kind === "error") {
    return { message: payment.message };
  }
  if (payment.outcome.kind === "redirect") {
    redirect(payment.outcome.url);
  }
  if (payment.outcome.kind === "error") {
    return { message: t("api.error.generic") };
  }
  redirect("/wallet/payment/result");
}
