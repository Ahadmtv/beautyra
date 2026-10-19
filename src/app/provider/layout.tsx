import type { ReactNode } from "react";
import Link from "next/link";

import { t } from "@/config/messages.fa";
import { requireRole } from "@/lib/auth/session";

const providerNavigation = [
  { href: "/provider/profile", label: "provider.nav.profile" },
  { href: "/provider/services", label: "provider.nav.services" },
  { href: "/provider/working-hours", label: "provider.nav.workingHours" },
  { href: "/provider/time-off", label: "provider.nav.timeOff" },
  { href: "/provider/bookings", label: "provider.nav.bookings" },
] as const;

export default async function ProviderLayout({ children }: { children: ReactNode }) {
  await requireRole("provider");

  return (
    <>
      <nav aria-label={t("provider.nav.label")} className="border-b border-border bg-white">
        <ul className="mx-auto flex w-full max-w-page gap-2 overflow-x-auto px-4 py-2">
          {providerNavigation.map((item) => (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                className="inline-flex min-h-10 items-center rounded-md px-3 text-sm font-medium text-text hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {t(item.label)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {children}
    </>
  );
}
