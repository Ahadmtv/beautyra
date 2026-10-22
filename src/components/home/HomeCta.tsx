import Link from "next/link";

import { t } from "@/config/messages.fa";

export function HomeCta() {
  return (
    <section className="mx-auto w-full max-w-page px-4 pb-12 sm:px-6 sm:pb-16">
      <div className="relative flex flex-col gap-6 overflow-hidden rounded-[28px] bg-[linear-gradient(120deg,#115e59,#0f766e_55%,#124c49)] px-6 py-10 text-white shadow-[0_18px_44px_rgba(15,76,73,0.22)] sm:flex-row sm:items-center sm:justify-between sm:px-12">
        <span aria-hidden="true" className="pointer-events-none absolute -start-10 -top-12 size-44 rounded-full bg-white/10" />
        <span aria-hidden="true" className="pointer-events-none absolute -bottom-16 end-24 size-56 rounded-full bg-[var(--brand-blush)]/15" />
        <div className="relative max-w-xl">
          <h2 className="text-xl font-extrabold leading-8 sm:text-2xl">{t("home.cta.title")}</h2>
          <p className="mt-2 text-sm leading-7 text-white/80">{t("home.cta.text")}</p>
        </div>
        <Link
          href="/register"
          className="relative inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-white px-6 text-sm font-bold text-primary shadow-sm transition-colors hover:bg-[var(--brand-teal-50)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"
        >
          {t("home.cta.button")}
        </Link>
      </div>
    </section>
  );
}
