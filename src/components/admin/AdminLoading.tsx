import { t } from "@/config/messages.fa";

export function AdminLoading() {
  return (
    <main className="mx-auto w-full max-w-page flex-1 px-4 py-8">
      <p role="status" aria-live="polite" className="text-sm text-text-muted">
        {t("common.loading")}
      </p>
    </main>
  );
}
