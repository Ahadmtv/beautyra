import { apiFetch } from "./client";
import type { WalletBalance } from "./types";

export function getWalletBalance(): Promise<WalletBalance> {
  return apiFetch<WalletBalance>("/api/v1/wallet", { auth: true });
}
