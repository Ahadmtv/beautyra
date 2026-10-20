import type { Metadata } from "next";
import Link from "next/link";

import { t } from "@/config/messages.fa";

export const metadata: Metadata = {
  title: `${t("forbidden.title")} | ${t("brand.name")}`,
  robots: { index: false, follow: false },
};

export default function ForbiddenPage() {
  return (
    <main className="mx-auto flex w-full max-w-page flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-text">{t("forbidden.title")}</h1>
      <p className="max-w-md text-sm leading-7 text-text-muted">{t("forbidden.body")}</p>
      <Link
        href="/"
        className="inline-flex min-h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {t("forbidden.home")}
      </Link>
    </main>
  );
}
