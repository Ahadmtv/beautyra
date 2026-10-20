import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";

import { t } from "@/config/messages.fa";
import { env } from "@/config/env";
import { getPayment, processZarinpalCallback } from "@/lib/api/payments";
import { redirectOnUnauthorized, requireRole } from "@/lib/auth/session";
import { formatTomanFromRial } from "@/lib/format/money";
import { numberFormatFa } from "@/lib/format/digits";
import { PAYMENT_ID_COOKIE, PAYMENT_RETURN_COOKIE } from "@/lib/payments/constants";
import { PAYMENT_RETURN_FALLBACK, resolvePaymentReturnPath } from "@/lib/payments/navigation";

export const metadata: Metadata = {
  title: `${t("wallet.payment.title")} | ${t("brand.name")}`,
  robots: { index: false, follow: false },
};

const paymentStatusMessages = {
  created: "wallet.payment.created",
  pending: "wallet.payment.pending",
  succeeded: "wallet.payment.succeeded",
  failed: "wallet.payment.failed",
  verification_unknown: "wallet.payment.verificationUnknown",
} as const;

type PaymentResultProps = {
  searchParams: Promise<{ authority?: string | string[]; status?: string | string[] }>;
};

export default async function PaymentResultPage({ searchParams }: PaymentResultProps) {
  await requireRole("client");

  const cookieStore = await cookies();
  const rawId = cookieStore.get(PAYMENT_ID_COOKIE)?.value;
  const returnTo = resolvePaymentReturnPath(cookieStore.get(PAYMENT_RETURN_COOKIE)?.value);
  const backLabel =
    returnTo === PAYMENT_RETURN_FALLBACK ? t("wallet.payment.back") : t("common.back");

  const paymentId = rawId && /^\d+$/.test(rawId) ? Number(rawId) : NaN;
  if (!Number.isSafeInteger(paymentId) || paymentId < 1) {
    return (
      <PaymentResultMessage
        message={t("wallet.payment.missing")}
        returnTo={returnTo}
        backLabel={backLabel}
      />
    );
  }

  const params = await searchParams;
  const authority = firstValue(params.authority);
  const gatewayStatus = firstValue(params.status);
  if (
    env.PAYMENT_RETURN_FORWARD_TO_BACKEND &&
    authority !== undefined &&
    /^[AS][A-Za-z0-9]{35}$/.test(authority)
  ) {
    try {
      await processZarinpalCallback(
        authority,
        gatewayStatus !== undefined && gatewayStatus.length <= 32 ? gatewayStatus : undefined,
      );
    } catch {
      // The payment endpoint remains the sole source of the displayed result.
    }
  }

  let payment: Awaited<ReturnType<typeof getPayment>>;
  try {
    payment = await getPayment(paymentId);
  } catch (error) {
    redirectOnUnauthorized(error);
    return (
      <PaymentResultMessage
        message={t("wallet.payment.loadError")}
        returnTo={returnTo}
        backLabel={backLabel}
      />
    );
  }

  return (
    <main className="mx-auto w-full max-w-page flex-1 px-4 py-6 md:py-8">
      <section className="mx-auto flex max-w-xl flex-col gap-5 rounded-md border border-border bg-white p-5 md:p-7">
        <h1 className="text-2xl font-bold text-text">{t("wallet.payment.title")}</h1>
        <p role="status" className="rounded-md bg-surface p-4 text-text">
          {t(paymentStatusMessages[payment.status])}
        </p>
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <dt className="text-text-muted">{t("wallet.payment.amount")}</dt>
            <dd className="font-medium text-text">{formatTomanFromRial(payment.amount_irr)}</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-text-muted">{t("wallet.payment.reference")}</dt>
            <dd className="font-medium text-text">{numberFormatFa(payment.id)}</dd>
          </div>
        </dl>
        <Link
          href={returnTo}
          className="inline-flex min-h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {backLabel}
        </Link>
      </section>
    </main>
  );
}

function PaymentResultMessage({
  message,
  returnTo,
  backLabel,
}: {
  message: string;
  returnTo: string;
  backLabel: string;
}) {
  return (
    <main className="mx-auto w-full max-w-page flex-1 px-4 py-6 md:py-8">
      <section className="mx-auto flex max-w-xl flex-col gap-5 rounded-md border border-border bg-white p-5 md:p-7">
        <h1 className="text-2xl font-bold text-text">{t("wallet.payment.title")}</h1>
        <p role="status" className="rounded-md bg-surface p-4 text-text">
          {message}
        </p>
        <Link
          href={returnTo}
          className="inline-flex min-h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
