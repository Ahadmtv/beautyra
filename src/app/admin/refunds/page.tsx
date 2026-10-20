import type { Metadata } from "next";
import { randomUUID } from "node:crypto";
import { Suspense } from "react";

import { AdminLoading } from "@/components/admin/AdminLoading";
import { AdminRefundForm } from "@/components/admin/AdminRefundForm";
import { t } from "@/config/messages.fa";
import { requireRole } from "@/lib/auth/session";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function AdminRefundsPage() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <AdminRefundsContent />
    </Suspense>
  );
}

async function AdminRefundsContent() {
  await requireRole("admin");

  return (
    <main className="mx-auto w-full max-w-page flex-1 px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-text">{t("admin.refunds.title")}</h1>
      <AdminRefundForm initialIdempotencyKey={randomUUID()} />
    </main>
  );
}
