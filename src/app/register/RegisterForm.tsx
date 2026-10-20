"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { t } from "@/config/messages.fa";
import { registerAction } from "@/lib/auth/actions";
import type { RegisterState } from "@/lib/auth/register";

const initialState: RegisterState = {};

export function RegisterForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(registerAction, initialState);

  return (
    <form action={formAction} noValidate className="flex flex-col gap-4">
      <input type="hidden" name="next" value={next} />
      <Input
        id="email"
        name="email"
        label={t("auth.email.label")}
        type="email"
        autoComplete="email"
        dir="ltr"
        required
        error={state.errors?.email}
      />
      <Input
        id="phone"
        name="phone"
        label={t("auth.phone.label")}
        hint={t("auth.register.phoneHint")}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        dir="ltr"
        error={state.errors?.phone}
      />
      <Input
        id="password"
        name="password"
        label={t("auth.password.label")}
        type="password"
        autoComplete="new-password"
        dir="ltr"
        minLength={8}
        required
        error={state.errors?.password}
      />
      {state.errors?.form && (
        <p role="alert" className="text-sm text-danger">
          {state.errors.form}
        </p>
      )}
      <Button type="submit" loading={pending} className="w-full">
        {t("auth.register.submit")}
      </Button>
    </form>
  );
}
