import type { Metadata } from "next";

import { ProviderVerificationForm } from "@/components/admin/ProviderVerificationForm";
import { t } from "@/config/messages.fa";
import { requireRole } from "@/lib/auth/session";

export const metadata: Metadata = { robots: { index: false, follow: false } };

// TODO(backend): replace manual provider ID entry when an admin provider-list endpoint exists.
export default async function AdminProvidersPage() {
  await requireRole("admin");

  return (
    <main className="mx-auto w-full max-w-page flex-1 px-4 py-8">
      <h1 className="mb-3 text-2xl font-bold text-text">{t("admin.providers.title")}</h1>
      <p className="mb-6 max-w-2xl text-sm leading-7 text-muted">
        {t("admin.providers.listGap")}
      </p>
      <ProviderVerificationForm />
    </main>
  );
}
