import type { Metadata } from "next";

import { t } from "@/config/messages.fa";
import { getCurrentUser } from "@/lib/api/auth";
import type { User } from "@/lib/api/types";
import { ROLES, type Role } from "@/lib/auth/claims";
import { redirectOnUnauthorized, requireRole } from "@/lib/auth/session";

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
  await requireRole(ROLES);
  const user = await loadUser();

  return (
    <main className="mx-auto w-full max-w-page flex-1 px-4 py-6 md:py-8">
      <h1 className="text-2xl font-bold text-text">{t("auth.account.title")}</h1>
      <section className="mt-6 flex max-w-xl flex-col gap-4 rounded-md border border-border bg-white p-4 md:p-6">
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
      </section>
    </main>
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
