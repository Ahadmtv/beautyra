import { describe, expect, it } from "vitest";

import { messages } from "@/config/messages.fa";

import { appendToast, resolveActionFeedback, toastDurationMs } from "./toast-model";

describe("resolveActionFeedback", () => {
  it("returns a success notification when an action reports success", () => {
    expect(
      resolveActionFeedback({
        message: messages["provider.workingHours.saveSuccess"],
        success: true,
      }),
    ).toEqual({
      message: messages["provider.workingHours.saveSuccess"],
      tone: "success",
    });
  });

  it("returns an error notification for failed actions", () => {
    expect(
      resolveActionFeedback({ message: messages["provider.workingHours.invalid"] }),
    ).toEqual({
      message: messages["provider.workingHours.invalid"],
      tone: "error",
    });
  });

  it("returns nothing when there is no message or success flag only", () => {
    expect(resolveActionFeedback({})).toBeNull();
    expect(resolveActionFeedback({ success: true })).toBeNull();
  });
});

describe("appendToast", () => {
  it("ignores a duplicate message with the same tone while it is visible", () => {
    const visible = [{ id: 1, message: "saved", tone: "success" as const }];
    expect(appendToast(visible, { id: 2, message: "saved", tone: "success" })).toBe(visible);
  });

  it("keeps messages with different tones", () => {
    const visible = [{ id: 1, message: "saved", tone: "success" as const }];
    expect(appendToast(visible, { id: 2, message: "saved", tone: "error" })).toHaveLength(2);
  });

  it("allows the same message after the previous notification is dismissed", () => {
    expect(appendToast([], { id: 3, message: "saved", tone: "success" })).toEqual([
      { id: 3, message: "saved", tone: "success" },
    ]);
  });
});

describe("toastDurationMs", () => {
  it("keeps errors visible longer than successes", () => {
    expect(toastDurationMs("error")).toBeGreaterThan(toastDurationMs("success"));
  });
});
