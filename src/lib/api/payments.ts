import { apiFetch, apiFetchWithStatus } from "./client";
import type { Payment, PaymentCreateInput, PaymentCreateResponse } from "./types";

export function createZarinpalPayment(
  input: PaymentCreateInput,
  idempotencyKey: string,
): Promise<{ data: PaymentCreateResponse; status: number }> {
  return apiFetchWithStatus<PaymentCreateResponse>("/api/v1/payments/zarinpal", {
    method: "POST",
    body: input,
    auth: true,
    idempotencyKey,
    cache: "no-store",
  });
}

export function processZarinpalCallback(authority: string, status?: string): Promise<void> {
  const query = new URLSearchParams({ authority });
  if (status !== undefined) query.set("status", status);
  return apiFetch<void>("/api/v1/payments/zarinpal/callback", {
    query,
    cache: "no-store",
  });
}

export function getPayment(paymentId: number): Promise<Payment> {
  return apiFetch<Payment>(`/api/v1/payments/${paymentId}`, {
    auth: true,
    cache: "no-store",
  });
}
