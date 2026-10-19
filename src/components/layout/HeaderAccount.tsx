import Link from "next/link";

import { Button, buttonClassName } from "@/components/ui/Button";
import { t, type MessageKey } from "@/config/messages.fa";
import type { Role } from "@/lib/auth/claims";
import { logoutAction } from "@/lib/auth/actions";
import { getSession } from "@/lib/auth/session";

const roleLabelKeys: Record<Role, MessageKey> = {
  client: "auth.role.client",
  provider: "auth.role.provider",
  admin: "auth.role.admin",
};

export function LoginLink() {
  return (
    <Link
      href="/login"
      className={buttonClassName({ variant: "outline", className: "h-9 px-3 md:h-10 md:px-4" })}
    >
      {t("header.login")}
    </Link>
  );
}

export async function HeaderAccount() {
  const session = await getSession();
  if (!session) {
    return <LoginLink />;
  }

  return (
    <details className="relative">
      <summary
        className={buttonClassName({
          variant: "outline",
          className: "h-9 cursor-pointer list-none px-3 md:h-10 md:px-4 [&::-webkit-details-marker]:hidden",
        })}
      >
        {t("auth.account.menu")}
      </summary>
      <div className="absolute end-0 top-full z-10 mt-2 flex w-48 flex-col gap-2 rounded-md border border-border bg-white p-3 text-text shadow-sm">
        <p className="text-sm text-text-muted">{t(roleLabelKeys[session.role])}</p>
        <form action={logoutAction}>
          <Button type="submit" variant="ghost" className="w-full justify-start">
            {t("auth.logout")}
          </Button>
        </form>
      </div>
    </details>
  );
}
