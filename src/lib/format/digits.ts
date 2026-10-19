const faNumberFormatter = new Intl.NumberFormat("fa-IR-u-nu-arabext");

export function numberFormatFa(value: number): string {
  return faNumberFormatter.format(value);
}
