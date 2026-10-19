import { z } from "zod";

import type { BookingCreateInput } from "@/lib/api/types";

const submissionSchema = z.object({
  service_id: z.coerce.number().int().positive(),
  starts_at: z.iso.datetime({ offset: true }),
  idempotency_key: z.string().min(1).max(128),
});

export type BookingSubmission = {
  input: BookingCreateInput;
  idempotencyKey: string;
};

export function parseBookingSubmission(formData: FormData): BookingSubmission | null {
  const parsed = submissionSchema.safeParse({
    service_id: readField(formData, "service_id"),
    starts_at: readField(formData, "starts_at"),
    idempotency_key: readField(formData, "idempotency_key"),
  });
  if (!parsed.success) {
    return null;
  }
  return {
    input: { service_id: parsed.data.service_id, starts_at: parsed.data.starts_at },
    idempotencyKey: parsed.data.idempotency_key,
  };
}

function readField(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}
