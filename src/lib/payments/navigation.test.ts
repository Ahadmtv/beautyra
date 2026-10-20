import { describe, expect, it } from "vitest";

import {
  PAYMENT_RETURN_FALLBACK,
  resolvePaymentReturnPath,
  walletChargeHref,
} from "./navigation";

describe("resolvePaymentReturnPath", () => {
  it("defaults to the wallet when no return path is present", () => {
    expect(resolvePaymentReturnPath(undefined)).toBe(PAYMENT_RETURN_FALLBACK);
    expect(resolvePaymentReturnPath(null)).toBe(PAYMENT_RETURN_FALLBACK);
  });

  it("keeps an internal booking return path with its query", () => {
    const path = "/book/2/confirm?date=2026-10-22&start_at=2026-10-22T05%3A30%3A00Z";
    expect(resolvePaymentReturnPath(path)).toBe(path);
  });

  it("rejects external, protocol-relative, and auth paths", () => {
    expect(resolvePaymentReturnPath("https://example.test/steal")).toBe(
      PAYMENT_RETURN_FALLBACK,
    );
    expect(resolvePaymentReturnPath("//example.test/steal")).toBe(PAYMENT_RETURN_FALLBACK);
    expect(resolvePaymentReturnPath("/login")).toBe(PAYMENT_RETURN_FALLBACK);
    expect(resolvePaymentReturnPath("/auth/refresh")).toBe(PAYMENT_RETURN_FALLBACK);
  });
});

describe("walletChargeHref", () => {
  it("builds the charge route with an encoded booking return path", () => {
    expect(walletChargeHref("/book/2/confirm?date=2026-10-22")).toBe(
      "/wallet/charge?next=%2Fbook%2F2%2Fconfirm%3Fdate%3D2026-10-22",
    );
  });

  it("does not forward an unsafe return target", () => {
    expect(walletChargeHref("https://example.test/steal")).toBe(
      "/wallet/charge?next=%2Fwallet",
    );
  });
});
