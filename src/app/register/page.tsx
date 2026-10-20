import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Box, Paper, Stack, Typography } from "@mui/material";

import { env } from "@/config/env";
import { t } from "@/config/messages.fa";
import { sanitizeNextPath } from "@/lib/auth/redirect";
import { getSession } from "@/lib/auth/session";

import { RegisterForm } from "./RegisterForm";

export const metadata: Metadata = {
  title: `${t("auth.register.title")} | ${t("brand.name")}`,
  robots: { index: false, follow: false },
};

type RegisterPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default function RegisterPage(props: RegisterPageProps) {
  return (
    <Suspense fallback={<RegisterPageFallback />}>
      <RegisterPageContent {...props} />
    </Suspense>
  );
}

async function RegisterPageContent({ searchParams }: RegisterPageProps) {
  const nextPath = sanitizeNextPath((await searchParams).next);

  if (env.AUTH_PROVIDER !== "real") {
    redirect("/login");
  }
  if (await getSession()) {
    redirect(nextPath);
  }

  const loginHref = nextPath === "/" ? "/login" : `/login?next=${encodeURIComponent(nextPath)}`;

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
                <path d="M12 5v14m-7-7h14" />
              </svg>
            </Box>
            <Typography component="h1" variant="h5" sx={{ mb: 0.75, fontFamily: "inherit", fontWeight: 800, color: "#172b2a" }}>
              {t("auth.register.title")}
            </Typography>
            <Typography sx={{ fontFamily: "inherit", fontSize: 14, lineHeight: 1.8, color: "#617472" }}>
              {t("auth.register.description")}
            </Typography>
          </Box>
          <RegisterForm next={nextPath} />
          <Link
            href={loginHref}
            className="text-center text-sm font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {t("auth.register.loginLink")}
          </Link>
        </Stack>
      </Paper>
    </main>
  );
}

function RegisterPageFallback() {
  return (
    <main className="mx-auto w-full max-w-page px-4 py-10 md:py-16">
      <div className="mx-auto max-w-sm">
        <p className="text-sm text-text-muted">{t("auth.register.title")}</p>
      </div>
    </main>
  );
}
