"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useActionFeedback } from "@/components/ui/use-action-feedback";
import { t } from "@/config/messages.fa";
import { toAsciiDigits } from "@/lib/format/digits";
import { requestPayoutAction, type ProviderPayoutState } from "@/lib/provider/payout-actions";

const initialState: ProviderPayoutState = {};

export function ProviderPayoutForm({ idempotencyKey }: { idempotencyKey: string }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(requestPayoutAction, initialState);
  const [amount, setAmount] = useState("");
  const [clientError, setClientError] = useState<string | undefined>();
  useActionFeedback(state, {
    onSuccess: () => {
      setAmount("");
      setClientError(undefined);
      router.refresh();
    },
  });

  return (
    <form
      action={formAction}
      className="flex max-w-xl flex-col gap-4"
      onSubmit={(event) => {
        if (!isValidAmount(amount)) {
          event.preventDefault();
          setClientError(t("provider.payouts.invalid"));
          return;
        }
        setClientError(undefined);
      }}
    >
      <input type="hidden" name="idempotency_key" value={idempotencyKey} />
      <Input
        id="payout_amount_irr"
        name="amount_irr"
        label={t("provider.payouts.amount")}
        hint={t("provider.payouts.amountHint")}
        inputMode="numeric"
        required
        value={amount}
        onChange={(event) => {
          setAmount(event.target.value);
          setClientError(undefined);
        }}
        error={clientError}
      />
      <Button type="submit" loading={pending} className="w-fit">
        {t("provider.payouts.submit")}
      </Button>
    </form>
  );
}

function isValidAmount(value: string): boolean {
  const normalized = toAsciiDigits(value).replace(/[\s,٬]/g, "");
  if (!/^[1-9]\d*$/.test(normalized)) return false;
  return Number.isSafeInteger(Number(normalized));
}
