import { JALALI_MONTH_NAMES, WEEKDAY_NAMES_BY_UTC_DAY } from "../../config/messages.fa";
import { numberFormatFa } from "../format/digits";
import { weekdayIndexOfIsoDate } from "../booking/dates";
import { gregorianToJalali } from "./convert";

const faYearFormatter = new Intl.NumberFormat("fa-IR-u-nu-arabext", { useGrouping: false });

export type JalaliDateLabel = {
  weekday: string;
  day: string;
  month: string;
  year: string;
};

export function describeJalaliDate(isoDate: string): JalaliDateLabel {
  const [year, month, day] = isoDate.split("-").map(Number);
  const jalali = gregorianToJalali({ year, month, day });

  return {
    weekday: WEEKDAY_NAMES_BY_UTC_DAY[weekdayIndexOfIsoDate(isoDate)],
    day: numberFormatFa(jalali.day),
    month: JALALI_MONTH_NAMES[jalali.month - 1],
    year: faYearFormatter.format(jalali.year),
  };
}
