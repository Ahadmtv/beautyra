import type { Metadata } from "next";
import Link from "next/link";
import { randomUUID } from "node:crypto";

import { TopUpForm } from "@/components/wallet/TopUpForm";
import { t } from "@/config/messages.fa";
import { requireRole } from "@/lib/auth/session";
import { PAYMENT_RETURN_FALLBACK, resolvePaymentReturnPath } from "@/lib/payments/navigation";

export const metadata: Metadata = {
  title: `${t("wallet.topup.title")} | ${t("brand.name")}`,
  robots: { index: false, follow: false },
};

type WalletChargePageProps = {
  searchParams: Promise<{ next?: string | string[] }>;
};

export default async function WalletChargePage({ searchParams }: WalletChargePageProps) {
  await requireRole("client");

  const returnTo = resolvePaymentReturnPath(firstValue((await searchParams).next));
  const backLabel =
    returnTo === PAYMENT_RETURN_FALLBACK ? t("wallet.payment.back") : t("common.back");

  return (
    <main className="mx-auto w-full max-w-page flex-1 px-4 py-6 md:py-8">
      <section className="mx-auto flex max-w-xl flex-col gap-5 rounded-md border border-border bg-white p-4 md:p-6">
        <h1 className="text-2xl font-bold text-text">{t("wallet.topup.title")}</h1>
        <TopUpForm idempotencyKey={randomUUID()} returnTo={returnTo} />
        <Link
          href={returnTo}
          className="w-fit text-sm font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {backLabel}
        </Link>
      </section>
    </main>
  );
}

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
