import { numberFormatFa } from "../format/digits";

const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const MS_PER_DAY = 86_400_000;

export function isIsoDate(value: string): boolean {
  const match = ISO_DATE_PATTERN.exec(value);
  if (!match) return false;
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  );
}

export function addDaysToIsoDate(isoDate: string, days: number): string {
  const [year, month, day] = parseIsoDateParts(isoDate);
  return new Date(Date.UTC(year, month - 1, day) + days * MS_PER_DAY).toISOString().slice(0, 10);
}

export function weekdayIndexOfIsoDate(isoDate: string): number {
  const [year, month, day] = parseIsoDateParts(isoDate);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

export function todayInTimeZone(timeZone: string, now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const read = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";
  return `${read("year")}-${read("month")}-${read("day")}`;
}

// Returns the requested date when it is a valid calendar day on or after today, otherwise today.
export function resolveSelectedDate(requested: string | undefined, today: string): string {
  if (requested !== undefined && isIsoDate(requested) && requested >= today) {
    return requested;
  }
  return today;
}

export function formatSlotTime(isoDateTime: string, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(isoDateTime));
  const read = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";
  return `${padTwoFa(read("hour"))}:${padTwoFa(read("minute"))}`;
}

function padTwoFa(asciiDigits: string): string {
  return numberFormatFa(Number(asciiDigits)).padStart(2, "۰");
}

function parseIsoDateParts(isoDate: string): [number, number, number] {
  const match = ISO_DATE_PATTERN.exec(isoDate);
  if (!match) {
    throw new RangeError(`Invalid ISO date: ${isoDate}`);
  }
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}
