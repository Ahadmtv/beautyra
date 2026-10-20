import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";

import { env } from "@/config/env";
import { t } from "@/config/messages.fa";
import { sanitizeNextPath } from "@/lib/auth/redirect";
import { getSession } from "@/lib/auth/session";

import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: t("auth.login.title"),
};

type LoginPageProps = {
  searchParams: Promise<{ next?: string; expired?: string; registered?: string }>;
};

export default function LoginPage(props: LoginPageProps) {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginPageContent {...props} />
    </Suspense>
  );
}

async function LoginPageContent({ searchParams }: LoginPageProps) {
  const { next, expired, registered } = await searchParams;
  const nextPath = sanitizeNextPath(next);

  if (await getSession()) {
    redirect(nextPath);
  }

  return (
    <main className="mx-auto w-full max-w-page px-4 py-10 md:py-16">
      <div className="mx-auto flex max-w-sm flex-col gap-6">
        <h1 className="text-2xl font-bold text-text">{t("auth.login.title")}</h1>

        {expired === "1" && (
          <p role="status" className="rounded-md bg-primary-soft p-3 text-sm text-text">
            {t("auth.sessionExpired")}
          </p>
        )}

        {registered === "1" && (
          <p role="status" className="rounded-md bg-primary-soft p-3 text-sm text-text">
            {t("auth.register.success")}
          </p>
        )}

        {env.AUTH_PROVIDER === "mock" && (
          <p className="rounded-md border border-border p-3 text-sm text-text-muted">
            {t("auth.mockHint")}
          </p>
        )}

        <LoginForm next={nextPath} mode={env.AUTH_PROVIDER} />

        {env.AUTH_PROVIDER === "real" && (
          <Link
            href={
              nextPath === "/" ? "/register" : `/register?next=${encodeURIComponent(nextPath)}`
            }
            className="text-center text-sm font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {t("auth.register.link")}
          </Link>
        )}
      </div>
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
