"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

import { t } from "@/config/messages.fa";
import { apiFetchWithStatus } from "@/lib/api/client";
import { applyAdminPayoutAction, type AdminPayoutAction } from "@/lib/api/payouts";
import { ApiError, problemMessage } from "@/lib/api/problem";
import { requireRole, redirectOnUnauthorized } from "@/lib/auth/session";
import { toAsciiDigits } from "@/lib/format/digits";

export type AdminActionState = { message?: string; success?: boolean; idempotencyKey?: string };

const verificationSchema = z.object({
  providerId: z.number().int().safe().positive(),
  status: z.enum(["pending", "verified", "rejected"]),
});

const refundSchema = z.object({
  bookingId: z.number().int().safe().positive(),
  idempotencyKey: z.string().trim().min(1).max(128),
});

const disputeResolutionSchema = z.object({
  bookingId: z.number().int().safe().positive(),
  resolution: z.enum(["settle", "cancel"]),
  note: z.string().trim().max(1000),
});

const payoutActionSchema = z.object({
  payoutId: z.number().int().safe().positive(),
  action: z.enum(["approve", "reject", "processing", "paid", "fail"]),
  note: z.string().trim().max(1000),
  externalTransferReference: z.string().trim().max(128),
});

const actionAttempts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;

function isRateLimited(userId: string): boolean {
  const now = Date.now();
  const current = actionAttempts.get(userId);
  if (!current || current.resetAt <= now) {
    actionAttempts.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > RATE_LIMIT_MAX;
}

function readString(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function readPositiveInteger(formData: FormData, name: string): number {
  const value = toAsciiDigits(readString(formData, name));
  return /^[1-9]\d*$/.test(value) ? Number(value) : Number.NaN;
}

export async function updateProviderVerificationAction(
  _previous: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const session = await requireRole("admin");
  if (isRateLimited(session.userId)) return { message: t("admin.providers.error") };

  const parsed = verificationSchema.safeParse({
    providerId: readPositiveInteger(formData, "provider_id"),
    status: readString(formData, "verification_status"),
  });
  if (!parsed.success) return { message: t("admin.providers.error") };

  try {
    await apiFetchWithStatus(`/api/v1/admin/providers/${parsed.data.providerId}/verification`, {
      method: "PATCH",
      body: { verification_status: parsed.data.status },
      auth: true,
      cache: "no-store",
    });
  } catch (error) {
    redirectOnUnauthorized(error);
    if (error instanceof ApiError) return { message: problemMessage(error) };
    throw error;
  }

  revalidateTag("services", { expire: 0 });
  revalidatePath("/admin/providers");
  return { message: t("admin.providers.success"), success: true };
}

export async function createAdminRefundAction(
  _previous: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const session = await requireRole("admin");
  if (isRateLimited(session.userId)) return { message: t("admin.refunds.error") };

  const parsed = refundSchema.safeParse({
    bookingId: readPositiveInteger(formData, "booking_id"),
    idempotencyKey: readString(formData, "idempotency_key"),
  });
  if (!parsed.success) return { message: t("admin.refunds.error") };

  try {
    await apiFetchWithStatus(`/api/v1/admin/bookings/${parsed.data.bookingId}/refund`, {
      method: "POST",
      auth: true,
      idempotencyKey: parsed.data.idempotencyKey,
      cache: "no-store",
    });
  } catch (error) {
    redirectOnUnauthorized(error);
    if (error instanceof ApiError) return { message: problemMessage(error) };
    throw error;
  }

  revalidatePath("/admin/refunds");
  revalidatePath("/dashboard/bookings");
  revalidatePath("/wallet");
  return {
    message: t("admin.refunds.success"),
    success: true,
    idempotencyKey: randomUUID(),
  };
}

export async function resolveDisputeAction(
  _previous: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const session = await requireRole("admin");
  if (isRateLimited(session.userId)) return { message: t("admin.disputes.error") };

  const parsed = disputeResolutionSchema.safeParse({
    bookingId: readPositiveInteger(formData, "booking_id"),
    resolution: readString(formData, "resolution"),
    note: readString(formData, "note"),
  });
  if (!parsed.success) return { message: t("admin.disputes.error") };

  try {
    await apiFetchWithStatus(
      `/api/v1/admin/bookings/${parsed.data.bookingId}/dispute-resolution`,
      {
        method: "POST",
        body: { resolution: parsed.data.resolution, note: parsed.data.note },
        auth: true,
        cache: "no-store",
      },
    );
  } catch (error) {
    redirectOnUnauthorized(error);
    if (error instanceof ApiError) {
      if (error.status === 409) return { message: t("admin.disputes.conflict") };
      return { message: problemMessage(error) };
    }
    throw error;
  }

  revalidatePath("/admin/disputes");
  revalidatePath("/dashboard/bookings");
  revalidatePath("/provider/bookings");
  revalidatePath("/wallet");
  return { message: t("admin.disputes.success"), success: true };
}

export async function adminPayoutAction(
  _previous: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const session = await requireRole("admin");
  if (isRateLimited(session.userId)) return { message: t("admin.payouts.error") };

  const parsed = payoutActionSchema.safeParse({
    payoutId: readPositiveInteger(formData, "payout_id"),
    action: readString(formData, "payout_action"),
    note: readString(formData, "note"),
    externalTransferReference: readString(formData, "external_transfer_reference"),
  });
  if (!parsed.success) return { message: t("admin.payouts.error") };
  if (parsed.data.action === "paid" && !parsed.data.externalTransferReference) {
    return { message: t("admin.payouts.referenceRequired") };
  }

  const action: AdminPayoutAction = parsed.data.action;
  const body =
    action === "paid"
      ? {
          note: parsed.data.note || undefined,
          external_transfer_reference: parsed.data.externalTransferReference,
        }
      : { note: parsed.data.note || undefined };

  try {
    await applyAdminPayoutAction(parsed.data.payoutId, action, body);
  } catch (error) {
    redirectOnUnauthorized(error);
    if (error instanceof ApiError) {
      if (error.status === 409) return { message: t("admin.payouts.conflict") };
      if (error.status === 400) return { message: t("admin.payouts.error") };
      return { message: problemMessage(error) };
    }
    throw error;
  }

  revalidatePath("/admin/payouts");
  revalidatePath("/provider/payouts");
  revalidatePath("/wallet");
  return { message: t("admin.payouts.success"), success: true };
}
