import { t } from "@/config/messages.fa";
import type { AdminProviderVerificationStatus } from "@/lib/api/admin";
import { problemMessage, type ApiError } from "@/lib/api/problem";

export type VerificationProvider = {
  verification_status: AdminProviderVerificationStatus;
  profile_completed: boolean;
};

export type VerificationEligibility = {
  approvalBlocked: boolean;
  unchanged: boolean;
  submitAllowed: boolean;
};

export function getVerificationEligibility(
  provider: VerificationProvider,
  status: AdminProviderVerificationStatus,
): VerificationEligibility {
  const approvalBlocked = status === "verified" && !provider.profile_completed;
  const unchanged = status === provider.verification_status;
  return { approvalBlocked, unchanged, submitAllowed: !approvalBlocked && !unchanged };
}

export function providerVerificationErrorMessage(error: ApiError): string {
  if (error.code === "profile_incomplete") return t("admin.providers.profileIncomplete");
  return problemMessage(error);
}
