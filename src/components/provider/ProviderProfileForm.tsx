"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { t } from "@/config/messages.fa";
import type { ProviderProfile } from "@/lib/api/types";
import { saveProfileAction, type ProfileActionState } from "@/lib/provider/profile-actions";

const initialProfileActionState: ProfileActionState = {};

type ProviderProfileFormProps = {
  profile: ProviderProfile | null;
  timeZoneOptions: ReadonlyArray<{ value: string; label: string }>;
  defaultTimeZone: string;
};

export function ProviderProfileForm({
  profile,
  timeZoneOptions,
  defaultTimeZone,
}: ProviderProfileFormProps) {
  const [state, formAction, pending] = useActionState(saveProfileAction, initialProfileActionState);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      <Input
        id="display_name"
        name="display_name"
        label={t("provider.profile.displayName")}
        defaultValue={profile?.display_name ?? ""}
        minLength={1}
        maxLength={160}
        required
      />
      <Textarea
        id="description"
        name="description"
        label={t("provider.profile.description")}
        defaultValue={profile?.description ?? ""}
      />
      <Select
        id="time_zone"
        name="time_zone"
        label={t("provider.profile.timeZone")}
        options={timeZoneOptions}
        defaultValue={defaultTimeZone}
        required
      />
      <label className="inline-flex w-fit items-center gap-2 text-sm text-text">
        <input
          name="is_active"
          type="checkbox"
          defaultChecked={profile?.is_active ?? false}
          className="size-4 accent-primary"
        />
        {t("provider.profile.active")}
      </label>
      {state.message && <p role="alert" className="text-sm text-danger">{state.message}</p>}
      <Button type="submit" loading={pending} className="w-fit">
        {t("provider.profile.save")}
      </Button>
    </form>
  );
}
