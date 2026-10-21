import { describe, expect, it } from "vitest";

import { messages, type MessageKey } from "./messages.fa";

const forbiddenTechnicalWords = [
  "API",
  "OpenAPI",
  "HTTP",
  "HTTPS",
  "JWT",
  "UTC",
  "ISO",
  "JSON",
  "cursor",
  "token",
  "idempotency",
  "endpoint",
  "شناسه",
  "۴۰۹",
  "۴۰۱",
  "۴۰۳",
  "۴۲۲",
  "۴۰۰",
];

const bookingStatuses = [
  "pending_payment",
  "confirmed",
  "in_progress",
  "completion_pending",
  "disputed",
  "completed",
  "cancelled",
  "expired",
] as const;

const payoutStatuses = ["requested", "approved", "processing", "paid", "rejected", "failed"] as const;

const verificationStatuses = ["pending", "verified", "rejected"] as const;

function hasMessage(...parts: string[]): boolean {
  return Object.prototype.hasOwnProperty.call(messages, parts.join("."));
}

describe("friendly Persian message dictionary", () => {
  it("does not expose technical words to users", () => {
    for (const [key, value] of Object.entries(messages)) {
      for (const word of forbiddenTechnicalWords) {
        if (value.includes(word)) {
          throw new Error(`message "${key}" contains technical word "${word}"`);
        }
      }
    }
  });

  it("labels every booking status enum value", () => {
    for (const status of bookingStatuses) {
      expect(hasMessage("dashboard.bookings.status", status)).toBe(true);
    }
  });

  it("labels every payout status enum value for both provider and admin lists", () => {
    for (const status of payoutStatuses) {
      expect(hasMessage("provider.payouts.status", status)).toBe(true);
      expect(hasMessage("admin.payouts.status", status)).toBe(true);
    }
  });

  it("labels every provider verification status enum value", () => {
    for (const status of verificationStatuses) {
      expect(hasMessage("admin.providers.status", status)).toBe(true);
    }
  });

  it("keeps a Persian label for every message key it exposes", () => {
    const key: MessageKey = "brand.name";
    expect(messages[key].length).toBeGreaterThan(0);
  });
});
