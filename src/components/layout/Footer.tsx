import { t } from "@/config/messages.fa";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-white/70">
      <p className="mx-auto w-full max-w-page px-4 py-6 text-center text-sm text-text-muted">
        {t("footer.copyright")}
      </p>
    </footer>
  );
}
