import { describe, expect, it } from "vitest";

import { canAttemptWalletPayment } from "./wallet-payment";

describe("canAttemptWalletPayment", () => {
  it("blocks a known insufficient balance", () => {
    expect(canAttemptWalletPayment(9_999, 10_000)).toBe(false);
  });

  it("allows submission when the balance is unknown", () => {
    expect(canAttemptWalletPayment(null, 10_000)).toBe(true);
  });

  it("allows submission when the balance covers the price", () => {
    expect(canAttemptWalletPayment(10_000, 10_000)).toBe(true);
  });
});
