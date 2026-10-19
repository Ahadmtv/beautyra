"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { t } from "@/config/messages.fa";
import { createBooking } from "@/lib/api/bookings";
import { ApiError, problemMessage } from "@/lib/api/problem";
import { getPublicServiceDetail } from "@/lib/api/services";
import { getWalletBalance } from "@/lib/api/wallet";
import { redirectOnUnauthorized } from "@/lib/auth/session";

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

  let bookingId: number;
  try {
    const booking = await createBooking(submission.input, submission.idempotencyKey);
    bookingId = booking.id;
  } catch (error) {
    redirectOnUnauthorized(error);
    if (error instanceof ApiError && error.status === 409) {
      return { message: await describeConflict(submission.input.service_id) };
    }
    if (error instanceof ApiError) {
      return { message: problemMessage(error) };
    }
    throw error;
  }

  revalidatePath("/bookings");
  revalidatePath("/wallet");
  redirect(`/bookings/${bookingId}/success`);
}

// The API error codes are not documented (docs/backend-gaps.md, item 8), so a 409 is attributed by comparing the current balance with the price.
async function describeConflict(serviceId: number): Promise<string> {
  const [wallet, { service }] = await Promise.all([
    getWalletBalance(),
    getPublicServiceDetail(serviceId),
  ]);
  return wallet.available_irr < service.price_irr
    ? t("booking.error.insufficientBalance")
    : t("booking.error.slotTaken");
}
