import Link from "next/link";

import { buttonClassName } from "@/components/ui/Button";
import { t } from "@/config/messages.fa";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-page flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <h1 className="text-xl font-bold text-text">{t("notFound.title")}</h1>
      <p className="text-text-muted">{t("notFound.body")}</p>
      <Link href="/" className={buttonClassName({ variant: "outline" })}>
        {t("notFound.home")}
      </Link>
    </main>
  );
}
