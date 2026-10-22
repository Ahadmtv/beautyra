"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useActionFeedback } from "@/components/ui/use-action-feedback";
import { t } from "@/config/messages.fa";
import { cancelBookingAction, type CancellationState } from "@/lib/booking/cancellation-actions";

const initialState: CancellationState = {};

export function CancelBookingForm({ bookingId }: { bookingId: number }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(cancelBookingAction, initialState);
  useActionFeedback(state, {
    onSuccess: () => {
      setOpen(false);
      router.refresh();
    },
  });

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        {t("dashboard.booking.cancel")}
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title={t("dashboard.booking.cancel.title")}>
        <form action={formAction} className="flex flex-col gap-4">
          <input type="hidden" name="booking_id" value={bookingId} />
          <p className="text-sm leading-7 text-text">{t("dashboard.booking.cancel.confirmation")}</p>
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t("dashboard.booking.cancel.close")}
            </Button>
            <CancelSubmitButton />
          </div>
        </form>
      </Modal>
    </>
  );
}

function CancelSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending}>
      {t("dashboard.booking.cancel.confirm")}
    </Button>
  );
}
