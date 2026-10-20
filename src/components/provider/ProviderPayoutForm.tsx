"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { t } from "@/config/messages.fa";
import { requestPayoutAction, type ProviderPayoutState } from "@/lib/provider/payout-actions";

const initialState: ProviderPayoutState = {};

export function ProviderPayoutForm({ idempotencyKey }: { idempotencyKey: string }) {
  const [state, formAction, pending] = useActionState(requestPayoutAction, initialState);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      <input type="hidden" name="idempotency_key" value={idempotencyKey} />
      <Input
        id="payout_amount_irr"
        name="amount_irr"
        label={t("provider.payouts.amount")}
        hint={t("provider.payouts.amountHint")}
        inputMode="numeric"
        required
        error={state.message}
      />
      <Button type="submit" loading={pending} className="w-fit">
        {t("provider.payouts.submit")}
      </Button>
    </form>
  );
}
