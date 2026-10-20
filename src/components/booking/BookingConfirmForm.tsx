"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/Button";
import { t } from "@/config/messages.fa";
import { type BookingFormState, createBookingAction } from "@/lib/booking/actions";

type BookingConfirmFormProps = {
  serviceId: number;
  date: string;
  startAt: string;
  idempotencyKey: string;
  paymentIdempotencyKey: string;
};

const initialState: BookingFormState = {};

export function BookingConfirmForm({
  serviceId,
  date,
  startAt,
  idempotencyKey,
  paymentIdempotencyKey,
}: BookingConfirmFormProps) {
  const [state, formAction] = useActionState(createBookingAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="service_id" value={serviceId} />
      <input type="hidden" name="starts_at" value={startAt} />
      <input type="hidden" name="idempotency_key" value={idempotencyKey} />
      <input type="hidden" name="payment_idempotency_key" value={paymentIdempotencyKey} />

      {state.message && (
        <div role="alert" className="flex flex-col items-start gap-3 rounded-md bg-surface p-4 text-sm text-text">
          <p>{state.message}</p>
          <Link
            href={`/book/${serviceId}?date=${date}`}
            className="font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {t("booking.confirm.backToTime")}
          </Link>
        </div>
      )}

      <p className="text-xs text-text-muted">{t("booking.confirm.gatewayNote")}</p>
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending} disabled={pending} className="w-full md:w-auto">
      {t("booking.confirm.submit")}
    </Button>
  );
}
