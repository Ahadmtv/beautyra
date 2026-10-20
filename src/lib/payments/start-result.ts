import type { PaymentCreateResponse } from "@/lib/api/types";

export type PaymentStartOutcome =
  | { kind: "redirect"; url: string }
  | { kind: "result" }
  | { kind: "uncertain"; paymentId: number }
  | { kind: "redirectMissing"; paymentId: number }
  | { kind: "error" };

export function resolvePaymentStart(
  status: number,
  data: PaymentCreateResponse,
): PaymentStartOutcome {
  const paymentId = data.payment.id;

  if (status === 201) {
    return data.redirect_url
      ? { kind: "redirect", url: data.redirect_url }
      : { kind: "redirectMissing", paymentId };
  }

  if (status === 202) {
    return { kind: "uncertain", paymentId };
  }

  if (status === 200) {
    return { kind: "result" };
  }

  return { kind: "error" };
}
