"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { t } from "@/config/messages.fa";
import { loginAction, type LoginState } from "@/lib/auth/actions";

const initialState: LoginState = {};

export function LoginForm({ next, mode }: { next: string; mode: "real" | "mock" }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} noValidate className="flex flex-col gap-4">
      <input type="hidden" name="next" value={next} />
      {mode === "real" ? (
        <>
          <Input
            id="email"
            name="email"
            label={t("auth.email.label")}
            type="email"
            autoComplete="email"
            dir="ltr"
            error={state.errors?.email}
          />
          <Input
            id="password"
            name="password"
            label={t("auth.password.label")}
            type="password"
            autoComplete="current-password"
            dir="ltr"
            error={state.errors?.password}
          />
        </>
      ) : (
        <>
          <Input
            id="phone"
            name="phone"
            label={t("auth.phone.label")}
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            dir="ltr"
            error={state.errors?.phone}
          />
          <Input
            id="code"
            name="code"
            label={t("auth.code.label")}
            inputMode="numeric"
            autoComplete="one-time-code"
            dir="ltr"
            error={state.errors?.code}
          />
        </>
      )}
      {state.errors?.form && (
        <p role="alert" className="text-sm text-danger">
          {state.errors.form}
        </p>
      )}
      <Button type="submit" loading={pending} className="w-full">
        {t("auth.login.submit")}
      </Button>
    </form>
  );
}
