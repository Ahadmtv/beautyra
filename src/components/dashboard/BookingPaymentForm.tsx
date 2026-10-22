"use client";

import { useActionState, useMemo } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/Button";
import { useActionFeedback } from "@/components/ui/use-action-feedback";
import { t } from "@/config/messages.fa";
import { type BookingPaymentState, retryBookingPaymentAction } from "@/lib/payments/actions";

const initialState: BookingPaymentState = { kind: "idle" };

export function BookingPaymentForm({
  bookingId,
  idempotencyKey,
}: {
  bookingId: number;
  idempotencyKey: string;
}) {
  const [state, formAction] = useActionState(retryBookingPaymentAction, initialState);
  const feedbackState = useMemo(
    () => ({ message: state.kind === "error" ? state.message : undefined }),
    [state],
  );
  useActionFeedback(feedbackState);

  return (
    <form action={formAction} className="flex flex-col items-start gap-3">
      <input type="hidden" name="booking_id" value={bookingId} />
      <input type="hidden" name="idempotency_key" value={idempotencyKey} />
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending} disabled={pending}>
      {t("dashboard.booking.pay")}
    </Button>
  );
}
