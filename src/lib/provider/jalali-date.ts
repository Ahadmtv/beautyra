import { toAsciiDigits } from "@/lib/format/digits";
import { gregorianToJalali, jalaliToGregorian } from "@/lib/jalali/convert";

const JALALI_DATE_PATTERN = /^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/;

export function jalaliDateTimeToGregorian(value: string): string | null {
  const match = /^(.*?)[Tt](.+)$/.exec(toAsciiDigits(value.trim()));
  if (!match) return null;
  const date = jalaliDateToGregorianIso(match[1]);
  return date ? `${date}T${match[2]}` : null;
}

export function jalaliDateToGregorianIso(value: string): string | null {
  const match = JALALI_DATE_PATTERN.exec(toAsciiDigits(value.trim()));
  if (!match) return null;

  const jalali = {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };

  try {
    const gregorian = jalaliToGregorian(jalali);
    const convertedBack = gregorianToJalali(gregorian);
    if (
      convertedBack.year !== jalali.year ||
      convertedBack.month !== jalali.month ||
      convertedBack.day !== jalali.day
    ) {
      return null;
    }
    return `${gregorian.year}-${String(gregorian.month).padStart(2, "0")}-${String(gregorian.day).padStart(2, "0")}`;
  } catch {
    return null;
  }
}
