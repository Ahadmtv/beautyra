import { t } from "@/config/messages.fa";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--brand-warm-200)] bg-[var(--brand-warm-100)]/75">
      <p className="mx-auto w-full max-w-page px-4 py-7 text-center text-sm text-text-muted">
        {t("footer.copyright")}
      </p>
    </footer>
  );
}
