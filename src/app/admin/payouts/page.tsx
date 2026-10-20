import type { Metadata } from "next";
import { Suspense } from "react";

import { AdminLoading } from "@/components/admin/AdminLoading";
import { AdminPayoutForm } from "@/components/admin/AdminPayoutForm";
import { t } from "@/config/messages.fa";
import { requireRole } from "@/lib/auth/session";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function AdminPayoutsPage() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <AdminPayoutsContent />
    </Suspense>
  );
}

async function AdminPayoutsContent() {
  await requireRole("admin");

  return (
    <main className="mx-auto w-full max-w-page flex-1 px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-text">{t("admin.payouts.title")}</h1>
      <AdminPayoutForm />
    </main>
  );
}
