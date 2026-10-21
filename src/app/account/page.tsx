import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/Skeleton";
import { t } from "@/config/messages.fa";
import { getCurrentUser } from "@/lib/api/auth";
import type { User, WalletBalance } from "@/lib/api/types";
import { getWalletBalance } from "@/lib/api/wallet";
import { ROLES, type Role } from "@/lib/auth/claims";
import { redirectOnUnauthorized, requireRole } from "@/lib/auth/session";
import { formatTomanFromRial } from "@/lib/format/money";

export const metadata: Metadata = {
  title: `${t("auth.account.title")} | ${t("brand.name")}`,
  robots: { index: false, follow: false },
};

const roleLabelKeys: Record<Role, "auth.role.client" | "auth.role.provider" | "auth.role.admin"> = {
  client: "auth.role.client",
  provider: "auth.role.provider",
  admin: "auth.role.admin",
};

export default async function AccountPage() {
  const session = await requireRole(ROLES);
  const user = await loadUser();

  return (
    <main className="mx-auto w-full max-w-page flex-1 px-4 py-6 md:py-8">
      <h1 className="text-2xl font-bold text-text">{t("auth.account.title")}</h1>
      <div className="mt-6 flex max-w-xl flex-col gap-6">
        <section className="rounded-md border border-border bg-white p-4 md:p-6">
          <dl className="flex flex-col gap-4">
            <DetailField label={t("auth.account.email")} value={user.email} dir="ltr" />
            {user.phone && (
              <DetailField label={t("auth.account.phone")} value={user.phone} dir="ltr" />
            )}
            <DetailField
              label={t("auth.account.status")}
              value={user.is_active ? t("auth.account.active") : t("auth.account.inactive")}
            />
            <DetailField
              label={t("auth.account.roles")}
              value={user.roles
                .filter((role): role is Role => role in roleLabelKeys)
                .map((role) => t(roleLabelKeys[role]))
                .join("، ")}
            />
          </dl>
        </section>
        <Suspense fallback={<WalletBalanceSkeleton />}>
          <AccountWalletBalance role={session.role} />
        </Suspense>
      </div>
    </main>
  );
}

async function AccountWalletBalance({ role }: { role: Role }) {
  let balance: WalletBalance;
  try {
    balance = await getWalletBalance();
  } catch (error) {
    redirectOnUnauthorized(error);
    return (
      <section
        aria-labelledby="account-wallet-title"
        className="rounded-md border border-border bg-white p-4 md:p-6"
      >
        <WalletBalanceHeader />
        <p role="alert" className="mt-4 rounded-md bg-surface p-4 text-sm text-text">
          {t("auth.account.walletError")}
        </p>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="account-wallet-title"
      className="rounded-md border border-border bg-white p-4 md:p-6"
    >
      <WalletBalanceHeader />
      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <BalanceItem label={t("wallet.balance.available")} value={balance.available_irr} />
        <BalanceItem label={t("wallet.balance.held")} value={balance.held_irr} />
        {role === "provider" && (
          <>
            <BalanceItem
              label={t("wallet.balance.providerEarnings")}
              value={balance.provider_earnings_irr}
            />
            <BalanceItem
              label={t("wallet.balance.providerReserved")}
              value={balance.provider_payout_reserved_irr}
            />
          </>
        )}
      </dl>
    </section>
  );
}

function WalletBalanceHeader() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 id="account-wallet-title" className="text-lg font-bold text-text">
        {t("auth.account.wallet")}
      </h2>
      <Link
        href="/wallet"
        className="text-sm font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {t("auth.account.walletOpen")}
      </Link>
    </div>
  );
}

function WalletBalanceSkeleton() {
  return (
    <section
      aria-busy="true"
      aria-labelledby="account-wallet-title"
      className="rounded-md border border-border bg-white p-4 md:p-6"
    >
      <h2 id="account-wallet-title" className="text-lg font-bold text-text">
        {t("auth.account.wallet")}
      </h2>
      <p className="sr-only">{t("common.loading")}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
    </section>
  );
}

function BalanceItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-1 rounded-md bg-surface p-3">
      <dt className="text-sm text-text-muted">{label}</dt>
      <dd className="font-semibold text-text">{formatTomanFromRial(value)}</dd>
    </div>
  );
}

async function loadUser(): Promise<User> {
  try {
    return await getCurrentUser();
  } catch (error) {
    redirectOnUnauthorized(error);
    throw error;
  }
}

function DetailField({ label, value, dir }: { label: string; value: string; dir?: "ltr" | "rtl" }) {
  return (
    <div className="flex flex-col gap-1 rounded-md bg-surface p-3">
      <dt className="text-sm text-text-muted">{label}</dt>
      <dd className="font-medium text-text" dir={dir}>
        {value}
      </dd>
    </div>
  );
}
