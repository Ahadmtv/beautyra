import type { Metadata } from "next";
import Link from "next/link";
import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";

import { ProviderPayoutForm } from "@/components/provider/ProviderPayoutForm";
import { EmptyState } from "@/components/ui/EmptyState";
import { t, type MessageKey } from "@/config/messages.fa";
import { getProviderPayouts } from "@/lib/api/payouts";
import type { PayoutRequest } from "@/lib/api/types";
import { getWalletBalance } from "@/lib/api/wallet";
import { ApiError } from "@/lib/api/problem";
import { redirectOnUnauthorized, requireRole } from "@/lib/auth/session";
import { formatTomanFromRial } from "@/lib/format/money";
import { numberFormatFa } from "@/lib/format/digits";

export const metadata: Metadata = {
  title: `${t("provider.payouts.title")} | ${t("brand.name")}`,
  robots: { index: false, follow: false },
};

const payoutStatusLabels: Record<PayoutRequest["status"], MessageKey> = {
  requested: "provider.payouts.status.requested",
  approved: "provider.payouts.status.approved",
  processing: "provider.payouts.status.processing",
  paid: "provider.payouts.status.paid",
  rejected: "provider.payouts.status.rejected",
  failed: "provider.payouts.status.failed",
};

const payoutStatusClasses: Record<PayoutRequest["status"], string> = {
  requested: "border-blue-200 bg-blue-50 text-blue-800",
  approved: "border-cyan-200 bg-cyan-50 text-cyan-800",
  processing: "border-amber-200 bg-amber-50 text-amber-800",
  paid: "border-green-200 bg-green-50 text-green-800",
  rejected: "border-rose-200 bg-rose-50 text-rose-800",
  failed: "border-gray-200 bg-gray-100 text-gray-700",
};

const dateFormatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian-nu-arabext", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Tehran",
});

type PayoutPageProps = {
  searchParams: Promise<{ cursor?: string | string[] }>;
};

export default async function ProviderPayoutsPage({ searchParams }: PayoutPageProps) {
  await requireRole("provider");
  const rawCursor = firstValue((await searchParams).cursor);
  const cursor = rawCursor === undefined ? undefined : Number(rawCursor);
  if (cursor !== undefined && (!Number.isSafeInteger(cursor) || cursor < 1)) {
    redirect("/provider/payouts");
  }

  let payouts;
  let balance;
  try {
    [payouts, balance] = await Promise.all([getProviderPayouts(cursor), getWalletBalance()]);
  } catch (error) {
    redirectOnUnauthorized(error);
    if (error instanceof ApiError) throw error;
    throw error;
  }

  return (
    <main className="mx-auto w-full max-w-page flex-1 px-4 py-6 md:py-8">
      <h1 className="text-2xl font-bold text-text">{t("provider.payouts.title")}</h1>

      <section className="mt-6 grid gap-4 sm:grid-cols-3" aria-label={t("provider.payouts.title")}>
        <BalanceCard label={t("wallet.balance.providerEarnings")} value={balance.provider_earnings_irr} />
        <BalanceCard
          label={t("wallet.balance.providerReserved")}
          value={balance.provider_payout_reserved_irr}
        />
        <BalanceCard label={t("wallet.balance.available")} value={balance.available_irr} />
      </section>

      <section className="mt-6 rounded-md border border-border bg-white p-4 md:p-6">
        <h2 className="mb-4 text-lg font-bold text-text">{t("provider.payouts.submit")}</h2>
        <ProviderPayoutForm idempotencyKey={randomUUID()} />
      </section>

      <section className="mt-8" aria-label={t("provider.payouts.history")}>
        <h2 className="mb-4 text-lg font-bold text-text">{t("provider.payouts.history")}</h2>
        {payouts.items.length === 0 ? (
          <EmptyState title={t("provider.payouts.empty")} />
        ) : (
          <ul className="grid gap-3">
            {payouts.items.map((payout) => (
              <li
                key={payout.id}
                className="flex flex-col gap-3 rounded-md border border-border bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-text">{formatTomanFromRial(payout.amount_irr)}</span>
                  <span className="text-xs text-text-muted">
                    {t("provider.payouts.id")}: {numberFormatFa(payout.id)} —{" "}
                    {dateFormatter.format(new Date(payout.created_at))}
                  </span>
                  {payout.admin_note && (
                    <span className="text-xs text-text-muted">{payout.admin_note}</span>
                  )}
                </div>
                <span
                  className={`inline-flex w-fit whitespace-nowrap rounded-sm border px-2 py-1 text-xs font-medium ${payoutStatusClasses[payout.status]}`}
                >
                  {t(payoutStatusLabels[payout.status])}
                </span>
              </li>
            ))}
          </ul>
        )}
        {payouts.next_cursor !== null && payouts.next_cursor !== undefined && (
          <Link
            href={`/provider/payouts?cursor=${payouts.next_cursor}`}
            className="mt-4 inline-flex min-h-10 items-center rounded-md border border-border px-4 text-sm font-medium text-primary hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {t("provider.payouts.next")}
          </Link>
        )}
      </section>
    </main>
  );
}

function BalanceCard({ label, value }: { label: string; value: number }) {
  return (
    <article className="flex flex-col gap-2 rounded-md border border-border bg-white p-4">
      <h3 className="text-sm text-text-muted">{label}</h3>
      <p className="text-lg font-bold text-text">{formatTomanFromRial(value)}</p>
    </article>
  );
}

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
