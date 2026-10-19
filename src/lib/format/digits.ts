const faNumberFormatter = new Intl.NumberFormat("fa-IR-u-nu-arabext");

export function numberFormatFa(value: number): string {
  return faNumberFormatter.format(value);
}

export function toAsciiDigits(value: string): string {
  return value.replace(/[\u06F0-\u06F9\u0660-\u0669]/g, (digit) => {
    const code = digit.charCodeAt(0);
    const base = code >= 0x06f0 && code <= 0x06f9 ? 0x06f0 : 0x0660;
    return String(code - base);
  });
}
