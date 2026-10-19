"use client";

import { useActionState, useState } from "react";

import { Button } from "@/components/ui/Button";
import { t, WEEKDAY_NAMES_BY_UTC_DAY } from "@/config/messages.fa";
import type { WorkingInterval } from "@/lib/api/types";
import { saveWorkingHoursAction } from "@/lib/provider/working-hours-actions";
import { validateWorkingHours } from "@/lib/provider/working-hours";

const initialState = {};
const saturdayFirstWeek = [
  { weekday: 6, name: WEEKDAY_NAMES_BY_UTC_DAY[6] },
  { weekday: 7, name: WEEKDAY_NAMES_BY_UTC_DAY[0] },
  { weekday: 1, name: WEEKDAY_NAMES_BY_UTC_DAY[1] },
  { weekday: 2, name: WEEKDAY_NAMES_BY_UTC_DAY[2] },
  { weekday: 3, name: WEEKDAY_NAMES_BY_UTC_DAY[3] },
  { weekday: 4, name: WEEKDAY_NAMES_BY_UTC_DAY[4] },
  { weekday: 5, name: WEEKDAY_NAMES_BY_UTC_DAY[5] },
] as const;

export function WorkingHoursEditor({ initialIntervals }: { initialIntervals: WorkingInterval[] }) {
  const [intervals, setIntervals] = useState(initialIntervals);
  const [state, formAction, pending] = useActionState(saveWorkingHoursAction, initialState);
  const [clientError, setClientError] = useState(false);

  function updateInterval(index: number, field: "opens_at" | "closes_at", value: string) {
    setIntervals((current) => current.map((interval, itemIndex) =>
      itemIndex === index ? { ...interval, [field]: value } : interval,
    ));
    setClientError(false);
  }

  function addInterval(weekday: number) {
    setIntervals((current) => [...current, { weekday, opens_at: "09:00", closes_at: "17:00" }]);
    setClientError(false);
  }

  function removeInterval(index: number) {
    setIntervals((current) => current.filter((_, itemIndex) => itemIndex !== index));
    setClientError(false);
  }

  // TODO(backend): The API cannot represent 24:00, so the first interval ends at 23:59.
  function splitOvernight(index: number) {
    const interval = intervals[index];
    const nextWeekday = interval.weekday === 7 ? 1 : interval.weekday + 1;
    const splitIntervals: WorkingInterval[] = [
      { weekday: interval.weekday, opens_at: interval.opens_at, closes_at: "23:59" },
    ];
    if (interval.closes_at > "00:00") {
      splitIntervals.push({ weekday: nextWeekday, opens_at: "00:00", closes_at: interval.closes_at });
    }
    setIntervals((current) => [
      ...current.filter((_, itemIndex) => itemIndex !== index),
      ...splitIntervals,
    ]);
    setClientError(false);
  }

  return (
    <form
      action={formAction}
      className="flex flex-col gap-5"
      onSubmit={(event) => {
        if (!validateWorkingHours(intervals)) {
          event.preventDefault();
          setClientError(true);
          return;
        }
        setClientError(false);
      }}
    >
      <input type="hidden" name="intervals" value={JSON.stringify(intervals)} />
      <p className="text-sm text-text-muted">{t("provider.workingHours.splitHint")}</p>
      <div className="grid gap-4 lg:grid-cols-2">
        {saturdayFirstWeek.map(({ weekday, name }) => {
          const dayIntervals = intervals
            .map((interval, index) => ({ interval, index }))
            .filter(({ interval }) => interval.weekday === weekday);

          return (
            <section key={weekday} className="flex flex-col gap-3 rounded-md border border-border p-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-semibold text-text">{name}</h2>
                <Button type="button" variant="outline" onClick={() => addInterval(weekday)}>
                  {t("provider.workingHours.add")}
                </Button>
              </div>
              {dayIntervals.map(({ interval, index }) => (
                <div key={`${weekday}-${index}`} className="flex flex-col gap-3 rounded-md bg-surface p-3">
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex flex-col gap-1 text-sm text-text">
                      {t("provider.workingHours.open")}
                      <input
                        type="time"
                        value={interval.opens_at}
                        onChange={(event) => updateInterval(index, "opens_at", event.target.value)}
                        className="h-10 rounded-md border border-border bg-white px-3 text-text"
                        required
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-sm text-text">
                      {t("provider.workingHours.close")}
                      <input
                        type="time"
                        value={interval.closes_at}
                        onChange={(event) => updateInterval(index, "closes_at", event.target.value)}
                        className="h-10 rounded-md border border-border bg-white px-3 text-text"
                        required
                      />
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {interval.opens_at >= interval.closes_at && interval.opens_at < "23:59" && (
                      <Button type="button" variant="outline" onClick={() => splitOvernight(index)}>
                        {t("provider.workingHours.split")}
                      </Button>
                    )}
                    <Button type="button" variant="ghost" onClick={() => removeInterval(index)}>
                      {t("provider.workingHours.remove")}
                    </Button>
                  </div>
                </div>
              ))}
            </section>
          );
        })}
      </div>
      {(clientError || state.message) && (
        <p role="alert" className="text-sm text-danger">
          {state.message ?? t("provider.workingHours.invalid")}
        </p>
      )}
      <Button type="submit" loading={pending} className="w-fit">
        {t("provider.workingHours.save")}
      </Button>
    </form>
  );
}
