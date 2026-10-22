import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Alert, Box, Paper, Stack, Typography } from "@mui/material";

import { env } from "@/config/env";
import { t } from "@/config/messages.fa";
import { sanitizeNextPath } from "@/lib/auth/redirect";
import { getSession } from "@/lib/auth/session";

import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: t("auth.login.title"),
};

type LoginPageProps = {
  searchParams: Promise<{ next?: string; expired?: string }>;
};

export default function LoginPage(props: LoginPageProps) {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginPageContent {...props} />
    </Suspense>
  );
}

async function LoginPageContent({ searchParams }: LoginPageProps) {
  const { next, expired } = await searchParams;
  const nextPath = sanitizeNextPath(next);

  if (await getSession()) {
    redirect(nextPath);
  }

  return (
    <main className="mx-auto w-full max-w-page px-4 py-10 md:py-16">
      <Paper
        elevation={0}
        sx={{
          mx: "auto",
          maxWidth: 440,
          p: { xs: 3, sm: 4 },
          border: "1px solid #e3ece9",
          borderRadius: 4,
          backgroundColor: "#fff",
          boxShadow: "0 20px 60px rgba(23, 43, 42, 0.08)",
        }}
      >
        <Stack spacing={3}>
          <Box>
            <Box sx={{ mb: 1.5, display: "grid", width: 44, height: 44, placeItems: "center", borderRadius: 3, bgcolor: "#e6f4f1", color: "#0f766e" }}>
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1m0-12.8-2.1 2.1m-8.6 8.6-2.1 2.1" />
              </svg>
            </Box>
            <Typography component="h1" variant="h5" sx={{ mb: 0.75, fontFamily: "inherit", fontWeight: 800, color: "#172b2a" }}>
              {t("auth.login.title")}
            </Typography>
            <Typography sx={{ fontFamily: "inherit", fontSize: 14, lineHeight: 1.8, color: "#617472" }}>
              {t("auth.login.description")}
            </Typography>
          </Box>

          {expired === "1" && <Alert severity="info" role="status" sx={{ borderRadius: 2, fontFamily: "inherit", "& .MuiAlert-message": { fontFamily: "inherit" } }}>{t("auth.sessionExpired")}</Alert>}
          {env.AUTH_PROVIDER === "mock" && <Alert severity="info" sx={{ borderRadius: 2, fontFamily: "inherit", "& .MuiAlert-message": { fontFamily: "inherit" } }}>{t("auth.mockHint")}</Alert>}

          <LoginForm next={nextPath} mode={env.AUTH_PROVIDER} />

          {env.AUTH_PROVIDER === "real" && (
            <Link
              href={nextPath === "/" ? "/register" : `/register?next=${encodeURIComponent(nextPath)}`}
              className="text-center text-sm font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {t("auth.register.link")}
            </Link>
          )}
        </Stack>
      </Paper>
    </main>
  );
}

function LoginPageFallback() {
  return (
    <main className="mx-auto w-full max-w-page px-4 py-10 md:py-16">
      <div className="mx-auto max-w-sm">
        <p className="text-sm text-text-muted">{t("auth.login.title")}</p>
      </div>
    </main>
  );
}
