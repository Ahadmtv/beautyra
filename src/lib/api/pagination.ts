export const DEFAULT_PAGE_LIMIT = 50;
export const MAX_PAGE_LIMIT = 100;

export type CursorPage<T> = {
  items: readonly T[];
  nextCursor: number | null;
};

type SearchParamsRecord = Record<string, string | string[] | undefined>;

export function searchParamsFromRecord(record: SearchParamsRecord): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(record)) {
    const first = Array.isArray(value) ? value[0] : value;
    if (first !== undefined) {
      params.set(key, first);
    }
  }
  return params;
}

export function parseCursor(params: URLSearchParams): number | undefined {
  const raw = params.get("cursor");
  if (raw === null || !/^[1-9]\d*$/.test(raw)) {
    return undefined;
  }
  const cursor = Number(raw);
  return Number.isSafeInteger(cursor) ? cursor : undefined;
}

export function parseLimit(params: URLSearchParams): number {
  const raw = params.get("limit");
  if (raw === null || !/^\d+$/.test(raw)) {
    return DEFAULT_PAGE_LIMIT;
  }
  const limit = Number(raw);
  if (!Number.isSafeInteger(limit) || limit < 1) return DEFAULT_PAGE_LIMIT;
  return Math.min(limit, MAX_PAGE_LIMIT);
}

export function buildPageQuery(cursor: number | undefined, limit: number): URLSearchParams {
  const query = new URLSearchParams({ limit: String(limit) });
  if (cursor !== undefined) {
    query.set("cursor", String(cursor));
  }
  return query;
}

export function nextPageHref(
  pathname: string,
  params: URLSearchParams,
  nextCursor: number | null,
): string | null {
  if (nextCursor === null) {
    return null;
  }
  const next = new URLSearchParams(params);
  next.set("cursor", String(nextCursor));
  return `${pathname}?${next.toString()}`;
}
