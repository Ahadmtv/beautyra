import type { Metadata } from "next";
import Link from "next/link";
import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";

import { TopUpForm } from "@/components/wallet/TopUpForm";
import { t, type MessageKey } from "@/config/messages.fa";
import { ApiError } from "@/lib/api/problem";
import { getWalletBalance, getWalletTransactions } from "@/lib/api/wallet";
import type { WalletTransaction } from "@/lib/api/types";
import { ROLES } from "@/lib/auth/claims";
import { redirectOnUnauthorized, requireRole } from "@/lib/auth/session";
import { formatTomanFromRial } from "@/lib/format/money";
import { numberFormatFa } from "@/lib/format/digits";

export const metadata: Metadata = {
  title: `${t("wallet.title")} | ${t("brand.name")}`,
  robots: { index: false, follow: false },
};

const transactionLabels: Record<WalletTransaction["kind"], MessageKey> = {
  funding: "wallet.transactions.kind.funding",
  hold_place: "wallet.transactions.kind.hold_place",
  hold_release: "wallet.transactions.kind.hold_release",
  refund_release: "wallet.transactions.kind.refund_release",
  hold_settle: "wallet.transactions.kind.hold_settle",
  reversal: "wallet.transactions.kind.reversal",
};

const transactionDateFormatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian-nu-arabext", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Tehran",
});

type WalletPageProps = {
  searchParams: Promise<{ cursor?: string | string[] }>;
};

export default async function WalletPage({ searchParams }: WalletPageProps) {
  const session = await requireRole(ROLES);
  const { cursor: rawCursor } = await searchParams;
  const cursorValue = Array.isArray(rawCursor) ? rawCursor[0] : rawCursor;
  const cursor = cursorValue === undefined ? undefined : Number(cursorValue);

  if (cursor !== undefined && (!Number.isSafeInteger(cursor) || cursor < 1)) {
    redirect("/wallet");
  }

  let balance;
  let transactions;
  try {
    [balance, transactions] = await Promise.all([getWalletBalance(), getWalletTransactions(cursor)]);
  } catch (error) {
    redirectOnUnauthorized(error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }

  return (
    <main className="mx-auto w-full max-w-page flex-1 px-4 py-6 md:py-8">
      <h1 className="text-2xl font-bold text-text">{t("wallet.title")}</h1>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label={t("wallet.title")}>
        <BalanceCard label={t("wallet.balance.available")} value={balance.available_irr} />
        <BalanceCard label={t("wallet.balance.held")} value={balance.held_irr} />
        {session.role === "provider" && (
          <BalanceCard label={t("wallet.balance.providerEarnings")} value={balance.provider_earnings_irr} />
        )}
      </section>

      {session.role === "client" && (
        <section className="mt-6 rounded-md border border-border bg-white p-4 md:p-6">
          <h2 className="mb-4 text-lg font-bold text-text">{t("wallet.topup.title")}</h2>
          <TopUpForm idempotencyKey={randomUUID()} />
        </section>
      )}

      <section className="mt-8 rounded-md border border-border bg-white p-4 md:p-6">
        <h2 className="mb-4 text-lg font-bold text-text">{t("wallet.transactions.title")}</h2>
        {transactions.items.length === 0 ? (
          <p className="rounded-md bg-surface p-4 text-sm text-text-muted">{t("wallet.transactions.empty")}</p>
        ) : (
          <ol className="divide-y divide-border">
            {transactions.items.map((transaction) => (
              <li key={transaction.id} className="flex flex-col gap-2 py-4 first:pt-0 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-text">{t(transactionLabels[transaction.kind])}</span>
                  <span className="text-sm text-text-muted">
                    {transactionDateFormatter.format(new Date(transaction.created_at))}
                  </span>
                  <span className="text-xs text-text-muted">
                    {t("wallet.payment.reference")}: {numberFormatFa(transaction.id)}
                  </span>
                </div>
                <span className="font-semibold text-text">{formatTomanFromRial(transaction.amount_irr)}</span>
              </li>
            ))}
          </ol>
        )}
        {transactions.next_cursor !== null && (
          <Link
            href={`/wallet?cursor=${transactions.next_cursor}`}
            className="mt-4 inline-flex min-h-10 items-center rounded-md border border-border px-4 text-sm font-medium text-primary hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {t("wallet.transactions.next")}
          </Link>
        )}
      </section>
    </main>
  );
}

function BalanceCard({ label, value }: { label: string; value: number }) {
  return (
    <article className="flex flex-col gap-2 rounded-md border border-border bg-white p-5">
      <h2 className="text-sm text-text-muted">{label}</h2>
      <p className="text-xl font-bold text-text">{formatTomanFromRial(value)}</p>
    </article>
  );
}
