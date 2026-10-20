"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { t } from "@/config/messages.fa";
import { createProviderPayout } from "@/lib/api/payouts";
import { ApiError, problemMessage } from "@/lib/api/problem";
import { redirectOnUnauthorized, requireRole } from "@/lib/auth/session";
import { toAsciiDigits } from "@/lib/format/digits";

export type ProviderPayoutState = { message?: string };

const payoutSchema = z.object({
  amountIRR: z.number().int().safe().positive(),
  idempotencyKey: z.string().trim().min(1).max(128),
});

function readAmount(formData: FormData): number {
  const raw = formData.get("amount_irr");
  if (typeof raw !== "string") return Number.NaN;
  const value = toAsciiDigits(raw).replace(/[\s,٬،]/g, "");
  return /^[1-9]\d*$/.test(value) ? Number(value) : Number.NaN;
}

export async function requestPayoutAction(
  _previous: ProviderPayoutState,
  formData: FormData,
): Promise<ProviderPayoutState> {
  await requireRole("provider");

  const rawKey = formData.get("idempotency_key");
  const parsed = payoutSchema.safeParse({
    amountIRR: readAmount(formData),
    idempotencyKey: typeof rawKey === "string" ? rawKey.trim() : "",
  });
  if (!parsed.success) {
    return { message: t("provider.payouts.invalid") };
  }

  try {
    await createProviderPayout(parsed.data.amountIRR, parsed.data.idempotencyKey);
  } catch (error) {
    redirectOnUnauthorized(error);
    if (error instanceof ApiError) {
      if (error.code === "insufficient_provider_funds" || error.status === 409) {
        const message =
          error.code === "insufficient_provider_funds"
            ? t("provider.payouts.insufficient")
            : t("provider.payouts.conflict");
        return { message };
      }
      if (error.status === 400) return { message: t("provider.payouts.invalid") };
      return { message: problemMessage(error) };
    }
    throw error;
  }

  revalidatePath("/provider/payouts");
  revalidatePath("/wallet");
  redirect("/provider/payouts");
}
