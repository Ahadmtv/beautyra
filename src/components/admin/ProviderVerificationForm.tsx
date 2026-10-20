"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { t } from "@/config/messages.fa";
import { updateProviderVerificationAction, type AdminActionState } from "@/lib/admin/actions";

const initialState: AdminActionState = {};
const statusOptions = [
  { value: "pending", label: t("admin.status.pending") },
  { value: "verified", label: t("admin.status.verified") },
  { value: "rejected", label: t("admin.status.rejected") },
] as const;

export function ProviderVerificationForm() {
  const [state, formAction, pending] = useActionState(updateProviderVerificationAction, initialState);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-5">
      <Input
        id="provider_id"
        name="provider_id"
        label={t("admin.providers.providerId")}
        inputMode="numeric"
        min={1}
        required
      />
      <Select
        id="verification_status"
        name="verification_status"
        label={t("admin.providers.status")}
        options={statusOptions}
        defaultValue="pending"
        required
      />
      {state.message && (
        <p role={state.success ? "status" : "alert"} className="text-sm text-text">
          {state.message}
        </p>
      )}
      <Button type="submit" loading={pending} className="w-fit">
        {t("admin.providers.submit")}
      </Button>
    </form>
  );
}
