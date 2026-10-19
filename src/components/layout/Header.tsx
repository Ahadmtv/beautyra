import Link from "next/link";
import { t } from "@/config/messages.fa";

export function Header() {
  return (
    <header className="bg-brand text-white">
      <div className="mx-auto flex w-full max-w-[1000px] items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-baseline gap-2 rounded-sm">
          <span className="text-2xl font-extrabold">{t("brand.name")}</span>
          <span className="text-xs">{t("brand.suffix")}</span>
        </Link>
        <Link
          href="/login"
          className="rounded-md border border-white/70 px-4 py-1.5 text-sm font-medium hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {t("header.login")}
        </Link>
      </div>
    </header>
  );
}
