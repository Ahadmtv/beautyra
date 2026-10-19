export type CalendarDate = {
  year: number;
  month: number;
  day: number;
};

// Leap-year cycle boundaries of the Jalali calendar (the 33-year arithmetic model, valid for years 1178-3177 AP).
const JALALI_CYCLE_BREAKS = [
  -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178,
] as const;

// Integer division and modulo truncating toward zero, matching the reference arithmetic model.
function div(a: number, b: number): number {
  return Math.trunc(a / b);
}

function mod(a: number, b: number): number {
  return a - Math.trunc(a / b) * b;
}

function jalaliYearInfo(jalaliYear: number): { gregorianYear: number; march: number } {
  const firstBreak = JALALI_CYCLE_BREAKS[0];
  const lastBreak = JALALI_CYCLE_BREAKS[JALALI_CYCLE_BREAKS.length - 1];
  if (jalaliYear < firstBreak || jalaliYear >= lastBreak) {
    throw new RangeError(`Jalali year ${jalaliYear} is outside the supported range`);
  }

  const gregorianYear = jalaliYear + 621;
  let leapJ = -14;
  let cycleStart = firstBreak;
  let cycleLength = 0;

  for (let i = 1; i < JALALI_CYCLE_BREAKS.length; i += 1) {
    const cycleEnd = JALALI_CYCLE_BREAKS[i];
    cycleLength = cycleEnd - cycleStart;
    if (jalaliYear < cycleEnd) break;
    leapJ += div(cycleLength, 33) * 8 + div(mod(cycleLength, 33), 4);
    cycleStart = cycleEnd;
  }

  let yearsIntoCycle = jalaliYear - cycleStart;
  leapJ += div(yearsIntoCycle, 33) * 8 + div(mod(yearsIntoCycle, 33) + 3, 4);
  if (mod(cycleLength, 33) === 4 && cycleLength - yearsIntoCycle === 4) {
    leapJ += 1;
  }

  const leapG = div(gregorianYear, 4) - div((div(gregorianYear, 100) + 1) * 3, 4) - 150;
  const march = 20 + leapJ - leapG;

  return { gregorianYear, march };
}

function gregorianToJdn({ year, month, day }: CalendarDate): number {
  let jdn =
    div((year + div(month - 8, 6) + 100100) * 1461, 4) +
    div(153 * mod(month + 9, 12) + 2, 5) +
    day -
    34840408;
  jdn = jdn - div(div(year + 100 + div(month - 8, 6), 100) * 3, 4) + 752;
  return jdn;
}

function jdnToGregorian(jdn: number): CalendarDate {
  let j = 4 * jdn + 139361631;
  j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
  const i = div(mod(j, 1461), 4) * 5 + 308;
  const day = div(mod(i, 153), 5) + 1;
  const month = mod(div(i, 153), 12) + 1;
  const year = div(j, 1461) - 100100 + div(8 - month, 6);
  return { year, month, day };
}

export function jalaliToGregorian({ year, month, day }: CalendarDate): CalendarDate {
  const { gregorianYear, march } = jalaliYearInfo(year);
  const jdn =
    gregorianToJdn({ year: gregorianYear, month: 3, day: march }) +
    (month - 1) * 31 -
    div(month, 7) * (month - 7) +
    day -
    1;
  return jdnToGregorian(jdn);
}

export function gregorianToJalali(date: CalendarDate): CalendarDate {
  const jdn = gregorianToJdn(date);
  const { year: gregorianYear } = date;
  let jalaliYear = gregorianYear - 621;
  const { march } = jalaliYearInfo(jalaliYear);
  const nowruzJdn = gregorianToJdn({ year: gregorianYear, month: 3, day: march });
  let dayOfYear = jdn - nowruzJdn;

  if (dayOfYear >= 0) {
    if (dayOfYear <= 185) {
      return { year: jalaliYear, month: 1 + div(dayOfYear, 31), day: mod(dayOfYear, 31) + 1 };
    }
    dayOfYear -= 186;
  } else {
    jalaliYear -= 1;
    dayOfYear += 179;
    if (isJalaliLeapYear(jalaliYear)) {
      dayOfYear += 1;
    }
  }

  return { year: jalaliYear, month: 7 + div(dayOfYear, 30), day: mod(dayOfYear, 30) + 1 };
}

function isJalaliLeapYear(jalaliYear: number): boolean {
  const current = jalaliYearInfo(jalaliYear);
  const next = jalaliYearInfo(jalaliYear + 1);
  const daysInYear =
    gregorianToJdn({ year: next.gregorianYear, month: 3, day: next.march }) -
    gregorianToJdn({ year: current.gregorianYear, month: 3, day: current.march });
  return daysInYear === 366;
}
