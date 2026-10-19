"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { t } from "@/config/messages.fa";
import { createTimeOffAction } from "@/lib/provider/time-off-actions";

const initialState = {};
const kindOptions = [
  { value: "time_off", label: t("provider.timeOff.kind.time_off") },
  { value: "blocked", label: t("provider.timeOff.kind.blocked") },
  { value: "holiday", label: t("provider.timeOff.kind.holiday") },
];

export function TimeOffForm() {
  const [kind, setKind] = useState("time_off");
  const [state, formAction, pending] = useActionState(createTimeOffAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Select
        id="time-off-kind"
        name="kind"
        label={t("provider.timeOff.kind")}
        options={kindOptions}
        value={kind}
        onChange={(event) => setKind(event.target.value)}
      />
      {kind === "holiday" ? (
        <Input
          id="holiday-date"
          name="holiday_date"
          label={t("provider.timeOff.holidayDate")}
          hint={t("provider.timeOff.dateFormat")}
          placeholder={t("provider.timeOff.dateFormat")}
          dir="ltr"
          required
        />
      ) : (
        <>
          <Input
            id="time-off-start"
            name="starts_at"
            label={t("provider.timeOff.start")}
            hint={t("provider.timeOff.dateTimeFormat")}
            placeholder={t("provider.timeOff.dateTimeFormat")}
            dir="ltr"
            required
          />
          <Input
            id="time-off-end"
            name="ends_at"
            label={t("provider.timeOff.end")}
            hint={t("provider.timeOff.dateTimeFormat")}
            placeholder={t("provider.timeOff.dateTimeFormat")}
            dir="ltr"
            required
          />
          <Textarea id="time-off-reason" name="reason" label={t("provider.timeOff.reason")} maxLength={500} />
        </>
      )}
      {state.message && <p role="alert" className="text-sm text-danger">{state.message}</p>}
      <Button type="submit" loading={pending} className="w-fit">
        {t("provider.timeOff.create")}
      </Button>
    </form>
  );
}
