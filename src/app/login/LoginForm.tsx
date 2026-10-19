"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { t } from "@/config/messages.fa";
import { loginAction, type LoginState } from "@/lib/auth/actions";

const initialState: LoginState = {};

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} noValidate className="flex flex-col gap-4">
      <input type="hidden" name="next" value={next} />
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
