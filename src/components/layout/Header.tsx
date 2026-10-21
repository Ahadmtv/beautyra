import Link from "next/link";
import { Suspense } from "react";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";

import { t } from "@/config/messages.fa";
import { HeaderAccount, LoginLink } from "./HeaderAccount";

export function Header() {
  return (
    <AppBar component="header" position="sticky" elevation={0} sx={{ bgcolor: "rgba(255,255,255,0.92)", color: "#253a37", borderBottom: "1px solid #eee2db", backdropFilter: "blur(14px)", boxShadow: "0 3px 14px rgba(65,48,44,.035)" }}>
      <Toolbar disableGutters sx={{ width: "100%", maxWidth: 1200, minHeight: { xs: 60, md: 68 }, mx: "auto", px: { xs: 2, sm: 3 }, justifyContent: "space-between" }}>
        <Link href="/" className="flex items-center gap-2 text-inherit no-underline transition-opacity hover:opacity-80">
          <Box sx={{ display: "grid", width: 38, height: 38, placeItems: "center", borderRadius: 2.5, bgcolor: "#eff8f6", color: "#0f766e" }}>
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3c2.2 2.1 3.4 4.2 3.4 6.2 0 1.5-.8 2.6-2 3.2 1.8-.1 3.8-1.2 5.6-3.2.1 3.8-1.4 7-4.2 8.5-2.2 1.2-5 1.1-6.8-.3-2.6-2.1-2.8-5.7-.7-8.2.2 2.1 1 3.4 2.2 4-1.4-3.7-.7-7 2.5-10.2Z" />
            </svg>
          </Box>
          <Box>
            <Typography component="span" sx={{ display: "block", fontFamily: "inherit", fontSize: 20, lineHeight: 1.1, fontWeight: 850, letterSpacing: "-0.03em", color: "#0f766e" }}>
              {t("brand.name")}
            </Typography>
            <Typography component="span" sx={{ display: "block", mt: 0.25, fontFamily: "inherit", fontSize: 11, color: "#617472" }}>
              {t("brand.suffix")}
            </Typography>
          </Box>
        </Link>
        <Suspense fallback={<LoginLink />}>
          <HeaderAccount />
        </Suspense>
      </Toolbar>
    </AppBar>
  );
}
