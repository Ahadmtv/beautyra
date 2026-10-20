"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { t } from "@/config/messages.fa";
import { resolveDisputeAction, type AdminActionState } from "@/lib/admin/actions";

const initialState: AdminActionState = {};

const resolutionOptions = [
  { value: "settle", label: t("admin.disputes.settle") },
  { value: "cancel", label: t("admin.disputes.cancel") },
];

export function AdminDisputeForm() {
  const [state, formAction, pending] = useActionState(resolveDisputeAction, initialState);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      <p className="rounded-md bg-surface p-3 text-sm text-text-muted">{t("admin.disputes.listGap")}</p>
      <Input
        id="booking_id"
        name="booking_id"
        label={t("admin.disputes.bookingId")}
        inputMode="numeric"
        min={1}
        required
      />
      <Select
        id="resolution"
        name="resolution"
        label={t("admin.disputes.resolution")}
        options={resolutionOptions}
        required
      />
      <Textarea
        id="resolution_note"
        name="note"
        label={t("admin.disputes.note")}
        maxLength={1000}
      />
      {state.message && (
        <p role={state.success ? "status" : "alert"} className="text-sm text-text">
          {state.message}
        </p>
      )}
      <Button type="submit" loading={pending} className="w-fit">
        {t("admin.disputes.submit")}
      </Button>
    </form>
  );
}
