import { describe, expect, it } from "vitest";

import { parseBookingSubmission } from "./submission";

function buildForm(overrides: Record<string, string> = {}): FormData {
  const values: Record<string, string> = {
    service_id: "12",
    starts_at: "2025-03-15T09:00:00+03:30",
    idempotency_key: "7f1c2a4e-9b3d-4e6a-8c1f-2d5b7a9e0f11",
    payment_idempotency_key: "a2e5b8c1-4d7f-4a0b-9c3e-6f1d8a2b5c7e",
    ...overrides,
  };
  const formData = new FormData();
  for (const [name, value] of Object.entries(values)) {
    formData.set(name, value);
  }
  return formData;
}

describe("parseBookingSubmission", () => {
  it("builds the create-booking input from the form fields", () => {
    expect(parseBookingSubmission(buildForm())).toEqual({
      input: {
        service_id: 12,
        starts_at: "2025-03-15T09:00:00+03:30",
        payment_method: "zarinpal",
      },
      idempotencyKey: "7f1c2a4e-9b3d-4e6a-8c1f-2d5b7a9e0f11",
      paymentIdempotencyKey: "a2e5b8c1-4d7f-4a0b-9c3e-6f1d8a2b5c7e",
    });
  });

  it("uses the selected wallet payment method", () => {
    expect(parseBookingSubmission(buildForm({ payment_method: "wallet" }))?.input.payment_method).toBe("wallet");
  });

  it("rejects an unsupported payment method", () => {
    expect(parseBookingSubmission(buildForm({ payment_method: "cash" }))).toBeNull();
  });

  it("reuses the same idempotency key when the same form is resubmitted", () => {
    const form = buildForm();

    const first = parseBookingSubmission(form);
    const retry = parseBookingSubmission(form);

    expect(retry?.idempotencyKey).toBe(first?.idempotencyKey);
  });

  it("rejects a non-positive service id", () => {
    expect(parseBookingSubmission(buildForm({ service_id: "0" }))).toBeNull();
    expect(parseBookingSubmission(buildForm({ service_id: "abc" }))).toBeNull();
  });

  it("rejects a start time that is not RFC 3339", () => {
    expect(parseBookingSubmission(buildForm({ starts_at: "2025-03-15 09:00" }))).toBeNull();
  });

  it("rejects a missing or oversized idempotency key", () => {
    expect(parseBookingSubmission(buildForm({ idempotency_key: "" }))).toBeNull();
    expect(parseBookingSubmission(buildForm({ idempotency_key: "k".repeat(129) }))).toBeNull();
  });
});
