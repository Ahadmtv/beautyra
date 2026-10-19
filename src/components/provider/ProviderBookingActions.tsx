"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { t } from "@/config/messages.fa";
import { transitionProviderBookingAction } from "@/lib/provider/booking-actions";

const initialState = {};
type Transition = "start" | "complete";

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
        {available.includes("complete") && (
          <Button variant="outline" onClick={() => setTransition("complete")}>
            {t("provider.bookings.complete")}
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
            <p className="text-sm leading-7 text-text">
              {t(transition === "start" ? "provider.bookings.startConfirm" : "provider.bookings.completeConfirm")}
            </p>
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
      {t(transition === "start" ? "provider.bookings.start" : "provider.bookings.complete")}
    </Button>
  );
}
