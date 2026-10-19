import type { WorkingInterval } from "@/lib/api/types";

const TIME_PATTERN = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

export function validateWorkingHours(intervals: WorkingInterval[]): boolean {
  const days = new Map<number, WorkingInterval[]>();

  for (const interval of intervals) {
    if (
      !Number.isInteger(interval.weekday) ||
      interval.weekday < 1 ||
      interval.weekday > 7 ||
      !TIME_PATTERN.test(interval.opens_at) ||
      !TIME_PATTERN.test(interval.closes_at) ||
      interval.opens_at >= interval.closes_at
    ) {
      return false;
    }

    const dayIntervals = days.get(interval.weekday) ?? [];
    dayIntervals.push(interval);
    days.set(interval.weekday, dayIntervals);
  }

  for (const dayIntervals of days.values()) {
    dayIntervals.sort((left, right) => left.opens_at.localeCompare(right.opens_at));
    for (let index = 1; index < dayIntervals.length; index += 1) {
      if (dayIntervals[index].opens_at < dayIntervals[index - 1].closes_at) return false;
    }
  }

  return true;
}
