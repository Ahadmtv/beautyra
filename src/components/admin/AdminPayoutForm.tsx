"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { t } from "@/config/messages.fa";
import { adminPayoutAction, type AdminActionState } from "@/lib/admin/actions";

const initialState: AdminActionState = {};

const actionOptions = [
  { value: "approve", label: t("admin.payouts.approve") },
  { value: "reject", label: t("admin.payouts.reject") },
  { value: "processing", label: t("admin.payouts.processing") },
  { value: "paid", label: t("admin.payouts.paid") },
  { value: "fail", label: t("admin.payouts.fail") },
];

export function AdminPayoutForm() {
  const [state, formAction, pending] = useActionState(adminPayoutAction, initialState);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      <p className="rounded-md bg-surface p-3 text-sm text-text-muted">{t("admin.payouts.listGap")}</p>
      <Input
        id="payout_id"
        name="payout_id"
        label={t("admin.payouts.payoutId")}
        inputMode="numeric"
        min={1}
        required
      />
      <Select
        id="payout_action"
        name="payout_action"
        label={t("admin.payouts.action")}
        options={actionOptions}
        required
      />
      <Input
        id="external_transfer_reference"
        name="external_transfer_reference"
        label={t("admin.payouts.reference")}
        hint={t("admin.payouts.referenceHint")}
        maxLength={128}
      />
      <Textarea
        id="payout_note"
        name="note"
        label={t("admin.payouts.note")}
        maxLength={1000}
      />
      {state.message && (
        <p role={state.success ? "status" : "alert"} className="text-sm text-text">
          {state.message}
        </p>
      )}
      <Button type="submit" loading={pending} className="w-fit">
        {t("admin.payouts.submit")}
      </Button>
    </form>
  );
}
