import { describe, expect, it } from "vitest";

import {
  buildPageQuery,
  DEFAULT_PAGE_LIMIT,
  MAX_PAGE_LIMIT,
  nextPageHref,
  parseCursor,
  parseLimit,
  searchParamsFromRecord,
} from "./pagination";

describe("parseCursor", () => {
  it("accepts positive integers", () => {
    expect(parseCursor(new URLSearchParams("cursor=42"))).toBe(42);
  });

  it.each(["0", "-1", "1.5", "abc", ""])("rejects %j", (raw) => {
    expect(parseCursor(new URLSearchParams({ cursor: raw }))).toBeUndefined();
  });

  it("returns undefined when absent", () => {
    expect(parseCursor(new URLSearchParams())).toBeUndefined();
  });
});

describe("parseLimit", () => {
  it("uses the default when absent or invalid", () => {
    expect(parseLimit(new URLSearchParams())).toBe(DEFAULT_PAGE_LIMIT);
    expect(parseLimit(new URLSearchParams("limit=abc"))).toBe(DEFAULT_PAGE_LIMIT);
  });

  it("clamps to the allowed range", () => {
    expect(parseLimit(new URLSearchParams("limit=0"))).toBe(DEFAULT_PAGE_LIMIT);
    expect(parseLimit(new URLSearchParams("limit=500"))).toBe(MAX_PAGE_LIMIT);
  });
});

describe("buildPageQuery", () => {
  it("includes cursor only when provided", () => {
    expect(buildPageQuery(undefined, 20).toString()).toBe("limit=20");
    expect(buildPageQuery(7, 20).toString()).toBe("limit=20&cursor=7");
  });
});

describe("nextPageHref", () => {
  it("returns null when there is no next page", () => {
    expect(nextPageHref("/", new URLSearchParams(), null)).toBeNull();
  });

  it("keeps existing params and replaces the cursor", () => {
    const params = new URLSearchParams("city=tehran&cursor=3");

    expect(nextPageHref("/", params, 9)).toBe("/?city=tehran&cursor=9");
  });
});

describe("searchParamsFromRecord", () => {
  it("takes the first value of repeated keys and skips undefined", () => {
    const params = searchParamsFromRecord({ city: ["tehran", "karaj"], cursor: "5", q: undefined });

    expect(params.get("city")).toBe("tehran");
    expect(params.get("cursor")).toBe("5");
    expect(params.has("q")).toBe(false);
  });
});
