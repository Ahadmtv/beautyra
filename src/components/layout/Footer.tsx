import { t } from "@/config/messages.fa";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200">
      <p className="mx-auto w-full max-w-[1000px] px-4 py-6 text-center text-sm text-zinc-500">
        {t("footer.copyright")}
      </p>
    </footer>
  );
}
