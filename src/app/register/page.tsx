import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";

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
      <div className="mx-auto flex max-w-sm flex-col gap-6">
        <h1 className="text-2xl font-bold text-text">{t("auth.register.title")}</h1>
        <RegisterForm next={nextPath} />
        <Link
          href={loginHref}
          className="text-center text-sm font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {t("auth.register.loginLink")}
        </Link>
      </div>
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
