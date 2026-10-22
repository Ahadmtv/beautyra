import { describe, expect, it } from "vitest";

import { t } from "@/config/messages.fa";
import { ApiError } from "@/lib/api/problem";
import { getVerificationEligibility, providerVerificationErrorMessage } from "./provider-verification";

function provider(status: "pending" | "verified" | "rejected", profileCompleted: boolean) {
  return { verification_status: status, profile_completed: profileCompleted };
}

describe("provider verification eligibility", () => {
  it("blocks approval when the provider profile is incomplete", () => {
    const result = getVerificationEligibility(provider("pending", false), "verified");
    expect(result.approvalBlocked).toBe(true);
    expect(result.submitAllowed).toBe(false);
  });

  it("allows non-approval changes for an incomplete profile", () => {
    const result = getVerificationEligibility(provider("pending", false), "rejected");
    expect(result.approvalBlocked).toBe(false);
    expect(result.submitAllowed).toBe(true);
  });

  it("allows approval once the profile is complete", () => {
    const result = getVerificationEligibility(provider("pending", true), "verified");
    expect(result.approvalBlocked).toBe(false);
    expect(result.submitAllowed).toBe(true);
  });

  it("does not submit an unchanged status", () => {
    const result = getVerificationEligibility(provider("pending", true), "pending");
    expect(result.unchanged).toBe(true);
    expect(result.submitAllowed).toBe(false);
  });

  it("allows changing an already verified provider", () => {
    const result = getVerificationEligibility(provider("verified", true), "rejected");
    expect(result.unchanged).toBe(false);
    expect(result.submitAllowed).toBe(true);
  });
});

describe("provider verification error messages", () => {
  it("explains an incomplete profile instead of a generic conflict", () => {
    const error = new ApiError({
      status: 409,
      code: "profile_incomplete",
      title: "ارائه‌دهنده هنوز نمایه خود را تکمیل نکرده است",
      requestId: "request",
    });
    expect(providerVerificationErrorMessage(error)).toBe(t("admin.providers.profileIncomplete"));
  });

  it("keeps the generic conflict message for other 409 errors", () => {
    const error = new ApiError({
      status: 409,
      code: "conflict",
      title: "conflict",
      requestId: "request",
    });
    expect(providerVerificationErrorMessage(error)).toBe(t("api.error.conflict"));
  });
});
