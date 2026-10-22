import Link from "next/link";
import { Suspense } from "react";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";

import { t, type MessageKey } from "@/config/messages.fa";
import { HeaderAccount, LoginLink } from "./HeaderAccount";

const NAV_LINKS: { href: string; label: MessageKey }[] = [
  { href: "/#providers", label: "header.services" },
  { href: "/#how-it-works", label: "header.howItWorks" },
];

export function Header() {
  return (
    <AppBar component="header" position="sticky" elevation={0} sx={{ bgcolor: "#ffffff", color: "#253a37", borderBottom: "1px solid #e8efed", boxShadow: "0 6px 24px rgba(23,43,42,.05)" }}>
      <Toolbar disableGutters sx={{ width: "100%", maxWidth: 1200, minHeight: { xs: 64, md: 72 }, mx: "auto", px: { xs: 2, sm: 3 }, justifyContent: "space-between" }}>
        <Link href="/" className="flex items-center gap-3 text-inherit no-underline transition-opacity hover:opacity-85">
          <Box sx={{ display: "grid", width: 42, height: 42, placeItems: "center", borderRadius: 3, background: "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)", color: "#ffffff", boxShadow: "0 6px 16px rgba(15,118,110,.28)" }}>
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3c2.2 2.1 3.4 4.2 3.4 6.2 0 1.5-.8 2.6-2 3.2 1.8-.1 3.8-1.2 5.6-3.2.1 3.8-1.4 7-4.2 8.5-2.2 1.2-5 1.1-6.8-.3-2.6-2.1-2.8-5.7-.7-8.2.2 2.1 1 3.4 2.2 4-1.4-3.7-.7-7 2.5-10.2Z" />
            </svg>
          </Box>
          <Box>
            <Typography component="span" sx={{ display: "block", fontFamily: "inherit", fontSize: 20, lineHeight: 1.1, fontWeight: 850, letterSpacing: "-0.03em", color: "#172b2a" }}>
              {t("brand.name")}
            </Typography>
            <Typography component="span" sx={{ display: "block", mt: 0.35, fontFamily: "inherit", fontSize: 12, fontWeight: 500, color: "#617472" }}>
              {t("brand.suffix")}
            </Typography>
          </Box>
        </Link>
        <nav aria-label={t("header.nav")} className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex min-h-10 items-center rounded-full px-4 text-sm font-semibold text-text-muted transition-colors hover:bg-[var(--brand-teal-50)] hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none"
            >
              {t(link.label)}
            </Link>
          ))}
        </nav>
        <Suspense fallback={<LoginLink />}>
          <HeaderAccount />
        </Suspense>
      </Toolbar>
    </AppBar>
  );
}
