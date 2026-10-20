"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { t, type MessageKey } from "@/config/messages.fa";
import {
  transitionProviderBookingAction,
  type ProviderBookingActionState,
} from "@/lib/provider/booking-actions";

const initialState: ProviderBookingActionState = {};
type Transition = "start" | "request_completion" | "cancel";

const actionLabels: Record<Transition, MessageKey> = {
  start: "provider.bookings.start",
  request_completion: "provider.bookings.complete",
  cancel: "provider.bookings.cancel",
};

const confirmationLabels: Record<Transition, MessageKey> = {
  start: "provider.bookings.startConfirm",
  request_completion: "provider.bookings.completeConfirm",
  cancel: "provider.bookings.cancelConfirm",
};

export function ProviderBookingActions({ bookingId, available }: { bookingId: number; available: Transition[] }) {
  const [state, formAction] = useActionState(transitionProviderBookingAction, initialState);
  const [transition, setTransition] = useState<Transition | null>(null);

  if (available.length === 0) return null;

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {available.includes("start") && (
          <Button variant="outline" onClick={() => setTransition("start")}>
            {t("provider.bookings.start")}
          </Button>
        )}
        {available.includes("request_completion") && (
          <Button variant="outline" onClick={() => setTransition("request_completion")}>
            {t("provider.bookings.complete")}
          </Button>
        )}
        {available.includes("cancel") && (
          <Button variant="outline" onClick={() => setTransition("cancel")}>
            {t("provider.bookings.cancel")}
          </Button>
        )}
      </div>
      <Modal
        open={transition !== null}
        onClose={() => setTransition(null)}
        title={t("provider.bookings.confirmTitle")}
      >
        {transition !== null && (
          <form action={formAction} className="flex flex-col gap-4">
            <input type="hidden" name="booking_id" value={bookingId} />
            <input type="hidden" name="transition" value={transition} />
            <p className="text-sm leading-7 text-text">{t(confirmationLabels[transition])}</p>
            {state.message && (
              <p role="alert" className="rounded-md bg-surface p-3 text-sm text-danger">
                {state.message}
              </p>
            )}
            <div className="flex flex-wrap justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setTransition(null)}>
                {t("provider.bookings.close")}
              </Button>
              <TransitionSubmitButton transition={transition} />
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}

function TransitionSubmitButton({ transition }: { transition: Transition }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending}>
      {t(actionLabels[transition])}
    </Button>
  );
}
