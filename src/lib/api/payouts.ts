import { apiFetch } from "./client";
import type { PayoutPage, PayoutRequest } from "./types";

function pageQuery(cursor?: number): URLSearchParams {
  const query = new URLSearchParams({ limit: "50" });
  if (cursor !== undefined) query.set("cursor", String(cursor));
  return query;
}

export function getProviderPayouts(cursor?: number): Promise<PayoutPage> {
  return apiFetch<PayoutPage>("/api/v1/provider/payouts", {
    auth: true,
    cache: "no-store",
    query: pageQuery(cursor),
  });
}

export function createProviderPayout(amountIRR: number, idempotencyKey: string): Promise<PayoutRequest> {
  return apiFetch<PayoutRequest>("/api/v1/provider/payouts", {
    method: "POST",
    body: { amount_irr: amountIRR },
    auth: true,
    idempotencyKey,
    cache: "no-store",
  });
}

export type AdminPayoutAction = "approve" | "reject" | "processing" | "paid" | "fail";

export function applyAdminPayoutAction(
  payoutId: number,
  action: AdminPayoutAction,
  body: { note?: string; external_transfer_reference?: string },
): Promise<PayoutRequest> {
  return apiFetch<PayoutRequest>(`/api/v1/admin/payouts/${payoutId}/${action}`, {
    method: "POST",
    body,
    auth: true,
    cache: "no-store",
  });
}
