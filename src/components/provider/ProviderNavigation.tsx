"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { t } from "@/config/messages.fa";

const providerNavigation = [
  { href: "/provider/profile", label: "provider.nav.profile" },
  { href: "/provider/services", label: "provider.nav.services" },
  { href: "/provider/working-hours", label: "provider.nav.workingHours" },
  { href: "/provider/time-off", label: "provider.nav.timeOff" },
  { href: "/provider/bookings", label: "provider.nav.bookings" },
  { href: "/provider/payouts", label: "provider.nav.payouts" },
] as const;

export function ProviderNavigation() {
  const pathname = usePathname();

  return (
    <nav aria-label={t("provider.nav.label")} className="border-b border-border bg-white">
      <ul className="mx-auto flex w-full max-w-page gap-2 overflow-x-auto px-4 py-2">
        {providerNavigation.map((item) => {
          const active = pathname === item.href;
          return (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative inline-flex min-h-10 items-center rounded-md px-3 text-sm font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none ${active ? "bg-primary-soft text-primary after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary after:content-['']" : "text-text hover:bg-surface"}`}
              >
                {t(item.label)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
