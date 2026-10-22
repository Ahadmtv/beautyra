"use client";

import { useActionState, useMemo } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useActionFeedback } from "@/components/ui/use-action-feedback";
import { t } from "@/config/messages.fa";
import { registerAction } from "@/lib/auth/actions";
import type { RegisterState } from "@/lib/auth/register";

const initialState: RegisterState = {};

export function RegisterForm({ next }: { next: string }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(registerAction, initialState);
  const feedbackState = useMemo(
    () => ({ message: state.message ?? state.errors?.form, success: state.success }),
    [state],
  );
  useActionFeedback(feedbackState, {
    onSuccess: () => router.replace(state.redirectTo ?? "/login"),
  });

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
      <PasswordInput
        id="password"
        name="password"
        label={t("auth.password.label")}
        autoComplete="new-password"
        dir="ltr"
        minLength={8}
        required
        error={state.errors?.password}
      />
      <Button type="submit" loading={pending} className="w-full">
        {t("auth.register.submit")}
      </Button>
    </form>
  );
}
