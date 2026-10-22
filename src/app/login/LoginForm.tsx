"use client";

import { useActionState, useMemo } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useActionFeedback } from "@/components/ui/use-action-feedback";
import { t } from "@/config/messages.fa";
import { loginAction, type LoginState } from "@/lib/auth/actions";

const initialState: LoginState = {};

export function LoginForm({ next, mode }: { next: string; mode: "real" | "mock" }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(loginAction, initialState);
  const feedbackState = useMemo(
    () => ({ message: state.message ?? state.errors?.form, success: state.success }),
    [state],
  );
  useActionFeedback(feedbackState, {
    onSuccess: () => {
      router.replace(state.redirectTo ?? "/");
      router.refresh();
    },
  });

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
          <PasswordInput
            id="password"
            name="password"
            label={t("auth.password.label")}
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
      <Button type="submit" loading={pending} className="w-full">
        {t("auth.login.submit")}
      </Button>
    </form>
  );
}
