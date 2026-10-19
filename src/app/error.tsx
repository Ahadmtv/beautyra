"use client";

import { t } from "@/config/messages.fa";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto w-full max-w-page flex-1 px-4 py-8">
      <EmptyState title={t("error.title")} description={t("home.loadError")}>
        <Button onClick={reset}>{t("common.retry")}</Button>
      </EmptyState>
    </main>
  );
}
