import { describe, expect, it } from "vitest";

import { parseServiceId } from "./service-id";

describe("parseServiceId", () => {
  it("accepts positive integers", () => {
    expect(parseServiceId("1")).toBe(1);
    expect(parseServiceId("420")).toBe(420);
  });

  it.each(["0", "-1", "1.5", "abc", "", "12abc", "9007199254740993"])("rejects %s", (raw) => {
    expect(parseServiceId(raw)).toBeNull();
  });
});
