'use client';

import { useState } from "react";
import { IconButton, InputAdornment, Popover } from "@mui/material";

import { Input } from "@/components/ui/Input";
import { t, JALALI_MONTH_NAMES } from "@/config/messages.fa";
import { DEFAULT_PROVIDER_TIME_ZONE } from "@/config/booking";
import { todayInTimeZone } from "@/lib/booking/dates";
import { numberFormatFa } from "@/lib/format/digits";
import { gregorianToJalali, jalaliToGregorian } from "@/lib/jalali/convert";

type JalaliDate = { year: number; month: number; day: number };

type JalaliDatePickerProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  name?: string;
  time?: string;
  timeLabel?: string;
  onTimeChange?: (value: string) => void;
  required?: boolean;
};

type TimeOffDateTimePickerProps = {
  id: string;
  name: string;
  dateLabel: string;
  timeLabel: string;
};

const weekdayLabels = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

export function TimeOffDateTimePicker({ id, name, dateLabel, timeLabel }: TimeOffDateTimePickerProps) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  return (
    <JalaliDatePicker
      id={id}
      label={dateLabel}
      value={date}
      onChange={setDate}
      name={name}
      time={time}
      timeLabel={timeLabel}
      onTimeChange={setTime}
      required
    />
  );
}

export function JalaliDatePicker({ id, label, value, onChange, name, time, timeLabel, onTimeChange, required = true }: JalaliDatePickerProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [visibleMonth, setVisibleMonth] = useState(getTodayJalaliDate);
  const selectedDate = parseJalaliDate(value);
  const isOpen = Boolean(anchorEl);
  const dayCount = getDaysInJalaliMonth(visibleMonth.year, visibleMonth.month);
  const firstGregorianDay = jalaliToGregorian({ year: visibleMonth.year, month: visibleMonth.month, day: 1 });
  const startOffset = (new Date(Date.UTC(firstGregorianDay.year, firstGregorianDay.month - 1, firstGregorianDay.day)).getUTCDay() + 1) % 7;
  const calendarDays = [
    ...Array.from({ length: startOffset }, () => null),
    ...Array.from({ length: dayCount }, (_, index) => index + 1),
  ];
  const monthTitle = `${JALALI_MONTH_NAMES[visibleMonth.month - 1]} ${numberFormatFa(visibleMonth.year)}`;

  const openCalendar = (element: HTMLElement) => {
    if (selectedDate) setVisibleMonth(selectedDate);
    setAnchorEl(element);
  };

  const changeMonth = (delta: number) => {
    setVisibleMonth((current) => {
      const month = current.month + delta;
      if (month < 1) return { year: current.year - 1, month: 12, day: 1 };
      if (month > 12) return { year: current.year + 1, month: 1, day: 1 };
      return { ...current, month, day: 1 };
    });
  };

  return (
    <>
      <Input
        id={id}
        label={label}
        value={selectedDate ? `${formatJalaliDate(selectedDate)}${time ? `، ${time}` : ""}` : ""}
        hint={timeLabel ? t("provider.timeOff.dateTimeFormat") : t("provider.timeOff.dateFormat")}
        onClick={(event) => openCalendar(event.currentTarget)}
        readOnly
        required={required}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              type="button"
              aria-label={t("provider.timeOff.chooseDate")}
              aria-haspopup="dialog"
              aria-expanded={isOpen}
              onClick={(event) => openCalendar(event.currentTarget)}
              edge="end"
              size="small"
              sx={{ color: "#0f766e" }}
            >
              <CalendarIcon />
            </IconButton>
          </InputAdornment>
        }
      />
      {name && <input type="hidden" name={name} value={timeLabel ? (value && time ? `${value}T${time}` : "") : value} />}
      <Popover
        open={isOpen}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { dir: "rtl", sx: { mt: 0.75, width: "min(320px, calc(100vw - 32px))", border: "1px solid #dce7e4", borderRadius: 2, boxShadow: "0 12px 32px rgba(23, 43, 42, 0.14)" } } }}
      >
        <div role="dialog" aria-label={monthTitle} className="p-3">
          <div className="mb-3 flex items-center justify-between gap-2">
            <IconButton
              type="button"
              aria-label={t("provider.timeOff.previousMonth")}
              onClick={() => changeMonth(-1)}
              size="small"
              sx={{ color: "#0f766e", transform: "rotate(180deg)" }}
            >
              <ChevronIcon />
            </IconButton>
            <p className="text-sm font-semibold text-text" aria-live="polite">{monthTitle}</p>
            <IconButton
              type="button"
              aria-label={t("provider.timeOff.nextMonth")}
              onClick={() => changeMonth(1)}
              size="small"
              sx={{ color: "#0f766e" }}
            >
              <ChevronIcon />
            </IconButton>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {weekdayLabels.map((day, index) => (
              <span key={day} aria-label={["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"][index]} className="py-1 text-xs font-medium text-text-muted">
                {day}
              </span>
            ))}
            {calendarDays.map((day, index) => day === null ? (
              <span key={`empty-${index}`} aria-hidden="true" />
            ) : (
              <button
                key={day}
                type="button"
                aria-label={`${numberFormatFa(day)} ${JALALI_MONTH_NAMES[visibleMonth.month - 1]} ${numberFormatFa(visibleMonth.year)}`}
                aria-pressed={selectedDate?.year === visibleMonth.year && selectedDate.month === visibleMonth.month && selectedDate.day === day}
                onClick={() => {
                  onChange(formatIsoJalaliDate({ ...visibleMonth, day }));
                  if (!timeLabel) setAnchorEl(null);
                }}
                className={`grid size-9 place-items-center rounded-lg text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${selectedDate?.year === visibleMonth.year && selectedDate.month === visibleMonth.month && selectedDate.day === day ? "bg-primary font-bold text-white" : "text-text hover:bg-surface"}`}
              >
                {numberFormatFa(day)}
              </button>
            ))}
          </div>
          {timeLabel && onTimeChange && (
            <div className="mt-3 border-t border-border pt-3">
              <Input
                id={`${id}-time`}
                label={timeLabel}
                type="time"
                topLabel
                dir="ltr"
                step={60}
                value={time ?? ""}
                onChange={(event) => onTimeChange(event.target.value)}
                required
              />
              <button
                type="button"
                disabled={!selectedDate || !time}
                onClick={() => setAnchorEl(null)}
                className="mt-3 inline-flex min-h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {t("provider.timeOff.confirmDateTime")}
              </button>
            </div>
          )}
        </div>
      </Popover>
    </>
  );
}

function getTodayJalaliDate(): JalaliDate {
  const [year, month, day] = todayInTimeZone(DEFAULT_PROVIDER_TIME_ZONE).split("-").map(Number);
  return gregorianToJalali({ year, month, day });
}

function getDaysInJalaliMonth(year: number, month: number): number {
  if (month <= 6) return 31;
  if (month <= 11) return 30;
  const lastDay = gregorianToJalali(jalaliToGregorian({ year, month, day: 30 }));
  return lastDay.year === year && lastDay.month === month && lastDay.day === 30 ? 30 : 29;
}

function parseJalaliDate(value: string): JalaliDate | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return match ? { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) } : null;
}

function formatIsoJalaliDate(date: JalaliDate): string {
  return `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
}

function formatJalaliDate(date: JalaliDate): string {
  return `${numberFormatFa(date.day)} ${JALALI_MONTH_NAMES[date.month - 1]} ${numberFormatFa(date.year)}`;
}

function CalendarIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}
