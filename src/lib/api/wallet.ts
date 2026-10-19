import { apiFetch } from "./client";
import type { WalletBalance, WalletTransactionPage } from "./types";

export function getWalletBalance(): Promise<WalletBalance> {
  return apiFetch<WalletBalance>("/api/v1/wallet", { auth: true, cache: "no-store" });
}

export function getWalletTransactions(cursor?: number): Promise<WalletTransactionPage> {
  const query = new URLSearchParams({ limit: "50" });
  if (cursor !== undefined) query.set("cursor", String(cursor));
  return apiFetch<WalletTransactionPage>("/api/v1/wallet/transactions", {
    auth: true,
    cache: "no-store",
    query,
  });
}
