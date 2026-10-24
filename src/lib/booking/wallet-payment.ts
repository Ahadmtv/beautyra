export function canAttemptWalletPayment(availableIrr: number | null, priceIrr: number): boolean {
  return availableIrr === null || availableIrr >= priceIrr;
}
