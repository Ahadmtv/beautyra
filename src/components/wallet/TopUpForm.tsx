"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { t } from "@/config/messages.fa";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toAsciiDigits } from "@/lib/format/digits";
import { createTopUpAction, initialTopUpState } from "@/lib/payments/actions";

export function TopUpForm({ idempotencyKey }: { idempotencyKey: string }) {
  const [state, formAction] = useActionState(createTopUpAction, initialTopUpState);
  const [amount, setAmount] = useState("");
  const [clientError, setClientError] = useState<string | undefined>();

  if (state.kind === "uncertain" || state.kind === "redirectMissing") {
    return (
      <div role="alert" className="flex flex-col gap-3 rounded-md bg-surface p-4 text-sm text-text">
        <p>{state.kind === "uncertain" ? t("wallet.topup.uncertain") : t("wallet.topup.redirectMissing")}</p>
        {state.kind === "uncertain" && <p>{t("wallet.topup.retryNote")}</p>}
        <Link className="font-medium text-primary hover:underline" href="/wallet/payment/result">
          {t("wallet.payment.title")}
        </Link>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        const value = toAsciiDigits(amount).trim();
        if (!/^\d+$/.test(value) || !Number.isSafeInteger(Number(value)) || Number(value) < 10_000) {
          event.preventDefault();
          setClientError(t("wallet.topup.invalidAmount"));
          return;
        }
        setClientError(undefined);
      }}
    >
      <input type="hidden" name="idempotency_key" value={idempotencyKey} />
      <Input
        id="amount_irr"
        name="amount_irr"
        type="text"
        inputMode="numeric"
        autoComplete="off"
        label={t("wallet.topup.amount")}
        hint={t("wallet.topup.minimum")}
        error={clientError ?? (state.kind === "error" ? state.message : undefined)}
        value={amount}
        onChange={(event) => {
          setAmount(event.target.value);
          setClientError(undefined);
        }}
        required
      />
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending}>
      {t("wallet.topup.submit")}
    </Button>
  );
}
