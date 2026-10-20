import type { Metadata } from "next";
import { Suspense } from "react";

import { AdminDisputeForm } from "@/components/admin/AdminDisputeForm";
import { AdminLoading } from "@/components/admin/AdminLoading";
import { t } from "@/config/messages.fa";
import { requireRole } from "@/lib/auth/session";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function AdminDisputesPage() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <AdminDisputesContent />
    </Suspense>
  );
}

async function AdminDisputesContent() {
  await requireRole("admin");

  return (
    <main className="mx-auto w-full max-w-page flex-1 px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-text">{t("admin.disputes.title")}</h1>
      <AdminDisputeForm />
    </main>
  );
}
