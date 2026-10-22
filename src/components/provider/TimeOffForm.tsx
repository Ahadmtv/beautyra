"use client";

import { useActionState, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { useActionFeedback } from "@/components/ui/use-action-feedback";
import { t } from "@/config/messages.fa";
import { createTimeOffAction, type TimeOffActionState } from "@/lib/provider/time-off-actions";

const initialState: TimeOffActionState = {};
const kindOptions = [
  { value: "time_off", label: t("provider.timeOff.kind.time_off") },
  { value: "blocked", label: t("provider.timeOff.kind.blocked") },
  { value: "holiday", label: t("provider.timeOff.kind.holiday") },
];

export function TimeOffForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [kind, setKind] = useState("time_off");
  const [state, formAction, pending] = useActionState(createTimeOffAction, initialState);
  useActionFeedback(state, {
    onSuccess: () => {
      formRef.current?.reset();
      setKind("time_off");
      router.refresh();
    },
  });

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
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
      <Button type="submit" loading={pending} className="w-fit">
        {t("provider.timeOff.create")}
      </Button>
    </form>
  );
}
