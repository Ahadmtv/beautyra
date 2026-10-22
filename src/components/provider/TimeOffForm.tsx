"use client";

import { useActionState, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { useActionFeedback } from "@/components/ui/use-action-feedback";
import { t } from "@/config/messages.fa";
import { createTimeOffAction, type TimeOffActionState } from "@/lib/provider/time-off-actions";
import { JalaliDatePicker, TimeOffDateTimePicker } from "@/components/provider/TimeOffDateTimePicker";

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
  const [holidayDate, setHolidayDate] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const [state, formAction, pending] = useActionState(createTimeOffAction, initialState);
  useActionFeedback(state, {
    onSuccess: () => {
      formRef.current?.reset();
      setKind("time_off");
      setHolidayDate("");
      setResetKey((key) => key + 1);
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
        <JalaliDatePicker
          key={`holiday-${resetKey}`}
          id="holiday-date"
          name="holiday_date"
          value={holidayDate}
          onChange={setHolidayDate}
          label={t("provider.timeOff.holidayDate")}
        />
      ) : (
        <>
          <TimeOffDateTimePicker
            key={`start-${resetKey}`}
            id="time-off-start"
            name="starts_at"
            dateLabel={t("provider.timeOff.start")}
            timeLabel={t("provider.timeOff.startTime")}
          />
          <TimeOffDateTimePicker
            key={`end-${resetKey}`}
            id="time-off-end"
            name="ends_at"
            dateLabel={t("provider.timeOff.end")}
            timeLabel={t("provider.timeOff.endTime")}
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
