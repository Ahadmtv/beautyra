const timeZoneNames = Intl.supportedValuesOf("timeZone");

export const IANA_TIME_ZONES = [...new Set(["Asia/Tehran", "UTC", ...timeZoneNames])].sort();

export function isIanaTimeZone(value: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}
