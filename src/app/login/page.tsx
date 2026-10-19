import type { Metadata } from "next";
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
  searchParams: Promise<{ next?: string; expired?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next, expired } = await searchParams;
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
        {env.AUTH_PROVIDER === "mock" && (
          <p className="rounded-md border border-border p-3 text-sm text-text-muted">{t("auth.mockHint")}</p>
        )}
        <LoginForm next={nextPath} />
      </div>
    </main>
  );
}
