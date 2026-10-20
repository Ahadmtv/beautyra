import { describe, expect, it } from "vitest";

import type { PaymentCreateResponse } from "@/lib/api/types";

import { resolvePaymentStart } from "./start-result";

const response: PaymentCreateResponse = {
  payment: {
    id: 7,
    amount_irr: 10_000,
    purpose: "wallet_topup",
    status: "pending",
    created_at: "2026-10-20T10:00:00Z",
    updated_at: "2026-10-20T10:00:00Z",
  },
};

describe("resolvePaymentStart", () => {
  it("redirects to the gateway for a created payment with a URL", () => {
    expect(
      resolvePaymentStart(201, { ...response, redirect_url: "https://gateway.test/pay" }),
    ).toEqual({ kind: "redirect", url: "https://gateway.test/pay" });
  });

  it("reports a missing redirect URL instead of rendering a not-found page", () => {
    expect(resolvePaymentStart(201, response)).toEqual({
      kind: "redirectMissing",
      paymentId: 7,
    });
  });

  it("reports an uncertain gateway outcome", () => {
    expect(resolvePaymentStart(202, response)).toEqual({
      kind: "uncertain",
      paymentId: 7,
    });
  });

  it("shows the payment result for an already-terminal attempt", () => {
    expect(resolvePaymentStart(200, response)).toEqual({ kind: "result" });
  });

  it("returns an error for an undocumented status", () => {
    expect(resolvePaymentStart(500, response)).toEqual({ kind: "error" });
  });
});
