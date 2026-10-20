"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { t } from "@/config/messages.fa";
import { createZarinpalPayment } from "@/lib/api/payments";
import { ApiError, problemMessage } from "@/lib/api/problem";
import { requireRole, redirectOnUnauthorized } from "@/lib/auth/session";
import { toAsciiDigits } from "@/lib/format/digits";
import { PAYMENT_ID_COOKIE } from "./constants";

const paymentInputSchema = z.coerce.number().int().safe().min(10_000);

export type TopUpState =
  | { kind: "idle" }
  | { kind: "error"; message: string }
  | { kind: "uncertain"; paymentId: number }
  | { kind: "redirectMissing"; paymentId: number };

export async function createTopUpAction(
  _previous: TopUpState,
  formData: FormData,
): Promise<TopUpState> {
  await requireRole("client");

  const rawAmount = formData.get("amount_irr");
  const parsed = paymentInputSchema.safeParse(
    typeof rawAmount === "string" ? toAsciiDigits(rawAmount).trim() : "",
  );
  const idempotencyKey = formData.get("idempotency_key");

  if (!parsed.success || typeof idempotencyKey !== "string" || idempotencyKey.length === 0) {
    return { kind: "error", message: t("wallet.topup.invalidAmount") };
  }

  let response;
  try {
    response = await createZarinpalPayment({ amount_irr: parsed.data }, idempotencyKey);
  } catch (error) {
    redirectOnUnauthorized(error);
    if (error instanceof ApiError) {
      return { kind: "error", message: problemMessage(error) };
    }
    throw error;
  }

  const { payment } = response.data;
  const cookieStore = await cookies();
  cookieStore.set(PAYMENT_ID_COOKIE, String(payment.id), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/wallet/payment",
    maxAge: 600,
  });

  if (response.status === 201) {
    if (!response.data.redirect_url) {
      return { kind: "redirectMissing", paymentId: payment.id };
    }
    redirect(response.data.redirect_url);
  }

  if (response.status === 202) {
    return { kind: "uncertain", paymentId: payment.id };
  }

  if (response.status === 200) {
    redirect("/wallet/payment/result");
  }

  return { kind: "error", message: t("api.error.generic") };
}
