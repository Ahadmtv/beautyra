"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Textarea";
import { useActionFeedback } from "@/components/ui/use-action-feedback";
import { t } from "@/config/messages.fa";
import {
  confirmCompletionAction,
  disputeBookingAction,
  type CompletionState,
} from "@/lib/booking/completion-actions";

const initialState: CompletionState = {};

export function BookingCompletionActions({ bookingId }: { bookingId: number }) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [confirmState, confirmAction] = useActionState(confirmCompletionAction, initialState);
  const [disputeState, disputeAction] = useActionState(disputeBookingAction, initialState);
  useActionFeedback(confirmState, {
    onSuccess: () => {
      setConfirmOpen(false);
      router.refresh();
    },
  });
  useActionFeedback(disputeState, {
    onSuccess: () => {
      setDisputeOpen(false);
      router.refresh();
    },
  });

  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => setConfirmOpen(true)}>{t("dashboard.booking.completion.submit")}</Button>
      <Button variant="outline" onClick={() => setDisputeOpen(true)}>
        {t("dashboard.booking.dispute.label")}
      </Button>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={t("dashboard.booking.completion.title")}
      >
        <form action={confirmAction} className="flex flex-col gap-4">
          <input type="hidden" name="booking_id" value={bookingId} />
          <p className="text-sm leading-7 text-text">{t("dashboard.booking.completion.confirmation")}</p>
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              {t("dashboard.booking.completion.close")}
            </Button>
            <ConfirmSubmitButton />
          </div>
        </form>
      </Modal>

      <Modal
        open={disputeOpen}
        onClose={() => setDisputeOpen(false)}
        title={t("dashboard.booking.dispute.title")}
      >
        <form action={disputeAction} className="flex flex-col gap-4">
          <input type="hidden" name="booking_id" value={bookingId} />
          <p className="text-sm leading-7 text-text">{t("dashboard.booking.dispute.text")}</p>
          <Textarea
            id="dispute_reason"
            name="reason"
            label={t("dashboard.booking.dispute.reason")}
            hint={t("dashboard.booking.dispute.reasonHint")}
            maxLength={1000}
            required
          />
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="outline" onClick={() => setDisputeOpen(false)}>
              {t("dashboard.booking.dispute.close")}
            </Button>
            <DisputeSubmitButton />
          </div>
        </form>
      </Modal>
    </div>
  );
}

function ConfirmSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending}>
      {t("dashboard.booking.completion.submit")}
    </Button>
  );
}

function DisputeSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="outline" loading={pending}>
      {t("dashboard.booking.dispute.submit")}
    </Button>
  );
}
