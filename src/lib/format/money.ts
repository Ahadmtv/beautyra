const tomanFormatter = new Intl.NumberFormat("fa-IR-u-nu-arabext", {
  maximumFractionDigits: 1,
});

export function formatTomanFromRial(amountIrr: number): string {
  return `${tomanFormatter.format(amountIrr / 10)} تومان`;
}
