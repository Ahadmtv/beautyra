const jalaliDateFormatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian-nu-arabext", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "Asia/Tehran",
});

export function formatJalaliDate(value: Date | string): string {
  return jalaliDateFormatter.format(new Date(value));
}
