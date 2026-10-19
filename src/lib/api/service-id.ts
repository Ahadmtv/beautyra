const SERVICE_ID_PATTERN = /^[1-9]\d*$/;

export function parseServiceId(raw: string): number | null {
  if (!SERVICE_ID_PATTERN.test(raw)) {
    return null;
  }
  const id = Number(raw);
  return Number.isSafeInteger(id) ? id : null;
}
