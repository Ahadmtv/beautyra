import { cookies } from "next/headers";

import { t } from "@/config/messages.fa";
import { createZarinpalPayment } from "@/lib/api/payments";
import { ApiError, problemMessage } from "@/lib/api/problem";
import { redirectOnUnauthorized } from "@/lib/auth/session";
import { PAYMENT_ID_COOKIE } from "./constants";
import { resolvePaymentStart, type PaymentStartOutcome } from "./start-result";

export type BookingPaymentStartResult =
  | { kind: "error"; message: string }
  | { kind: "started"; outcome: PaymentStartOutcome };

export async function startBookingPayment(
  bookingId: number,
  idempotencyKey: string,
): Promise<BookingPaymentStartResult> {
  let response;
  try {
    response = await createZarinpalPayment(
      { purpose: "booking", booking_id: bookingId },
      idempotencyKey,
    );
  } catch (error) {
    redirectOnUnauthorized(error);
    if (error instanceof ApiError) {
      return { kind: "error", message: problemMessage(error) };
    }
    throw error;
  }

  const cookieStore = await cookies();
  cookieStore.set(PAYMENT_ID_COOKIE, String(response.data.payment.id), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });

  const outcome = resolvePaymentStart(response.status, response.data);
  if (outcome.kind === "error") {
    return { kind: "error", message: t("api.error.generic") };
  }
  return { kind: "started", outcome };
}
