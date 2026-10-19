import Link from "next/link";
import { Suspense } from "react";
import { t } from "@/config/messages.fa";
import { HeaderAccount, LoginLink } from "./HeaderAccount";

export function Header() {
  return (
    <header className="bg-primary text-white">
      <div className="mx-auto flex h-14 w-full max-w-page items-center justify-between px-4 md:h-16">
        <Link href="/" className="flex items-baseline gap-2 rounded-sm">
          <span className="text-xl font-extrabold md:text-2xl">{t("brand.name")}</span>
          <span className="text-xs">{t("brand.suffix")}</span>
        </Link>
        <Suspense fallback={<LoginLink />}>
          <HeaderAccount />
        </Suspense>
      </div>
    </header>
  );
}
