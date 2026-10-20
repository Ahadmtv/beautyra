import { sanitizeNextPath } from "@/lib/auth/redirect";

export const PAYMENT_RETURN_FALLBACK = "/wallet";

export function resolvePaymentReturnPath(value: unknown): string {
  return sanitizeNextPath(typeof value === "string" ? value : null, PAYMENT_RETURN_FALLBACK);
}

export function walletChargeHref(returnPath: string): string {
  const safeReturnPath = resolvePaymentReturnPath(returnPath);
  return `/wallet/charge?next=${encodeURIComponent(safeReturnPath)}`;
}
