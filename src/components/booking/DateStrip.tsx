import Link from "next/link";

import { t } from "@/config/messages.fa";
import { describeJalaliDate } from "@/lib/jalali/labels";

type DateStripProps = {
  basePath: string;
  days: readonly string[];
  selectedDate: string;
  today: string;
  previousDate: string | null;
  nextDate: string;
};

const linkClassName =
  "inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-primary hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export function DateStrip({ basePath, days, selectedDate, today, previousDate, nextDate }: DateStripProps) {
  return (
    <nav aria-label={t("booking.dateStripLabel")} className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        {previousDate ? (
          <Link href={`${basePath}?date=${previousDate}`} className={linkClassName}>
            {t("booking.prevWeek")}
          </Link>
        ) : (
          <span />
        )}
        <Link href={`${basePath}?date=${nextDate}`} className={linkClassName}>
          {t("booking.nextWeek")}
        </Link>
      </div>
      <ol className="grid grid-cols-7 gap-1">
        {days.map((isoDate) => {
          const label = describeJalaliDate(isoDate);
          const isSelected = isoDate === selectedDate;
          return (
            <li key={isoDate}>
              <Link
                href={`${basePath}?date=${isoDate}`}
                aria-current={isSelected ? "date" : undefined}
                aria-label={`${label.weekday} ${label.day} ${label.month} ${label.year}`}
                className={[
                  "flex flex-col items-center gap-0.5 rounded-md border px-1 py-2 text-center transition-colors",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                  isSelected
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-white text-text hover:border-primary",
                ].join(" ")}
              >
                <span className="text-xs">{label.weekday}</span>
                <span className="text-lg font-bold">{label.day}</span>
                <span className="text-xs">{label.month}</span>
                {isoDate === today && <span className="text-[10px] font-medium">{t("booking.today")}</span>}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
