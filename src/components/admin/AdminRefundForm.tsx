"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { t } from "@/config/messages.fa";
import { createAdminRefundAction, type AdminActionState } from "@/lib/admin/actions";

type AdminRefundFormProps = { initialIdempotencyKey: string };
const initialState: AdminActionState = {};

export function AdminRefundForm({ initialIdempotencyKey }: AdminRefundFormProps) {
  const [state, formAction, pending] = useActionState(createAdminRefundAction, initialState);
  const idempotencyKey = state.idempotencyKey ?? initialIdempotencyKey;

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      <Input
        id="booking_id"
        name="booking_id"
        label={t("admin.refunds.bookingId")}
        inputMode="numeric"
        min={1}
        required
      />
      <Input
        id="idempotency_key"
        name="idempotency_key"
        label={t("admin.refunds.idempotencyKey")}
        value={idempotencyKey}
        readOnly
        required
      />
      {state.message && (
        <p role={state.success ? "status" : "alert"} className="text-sm text-text">
          {state.message}
        </p>
      )}
      <Button type="submit" loading={pending} className="w-fit">
        {t("admin.refunds.submit")}
      </Button>
    </form>
  );
}
