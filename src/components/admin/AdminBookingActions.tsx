"use client";

import { useActionState, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { Input } from "@/components/ui/Input";
import { useActionFeedback } from "@/components/ui/use-action-feedback";

import { t } from "@/config/messages.fa";
import { createAdminRefundAction, resolveDisputeAction, type AdminActionState } from "@/lib/admin/actions";
import type { AdminBooking } from "@/lib/api/types";

const initialState: AdminActionState = {};

export function AdminBookingActions({ booking }: { booking: AdminBooking }) {
  if (!booking.refundable && !booking.has_open_dispute) return null;
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75, minWidth: 0 }}>
      {booking.refundable && <RefundDialog bookingId={booking.id} />}
      {booking.has_open_dispute && <DisputeDialog bookingId={booking.id} />}
    </Box>
  );
}

function RefundDialog({ bookingId }: { bookingId: number }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(createAdminRefundAction, initialState);
  const formId = useId();
  const [open, setOpen] = useState(false);
  const [idempotencyKey, setIdempotencyKey] = useState<string | null>(null);
  useActionFeedback(state, {
    onSuccess: () => {
      setOpen(false);
      router.refresh();
    },
  });

  function openDialog() {
    setIdempotencyKey(state.idempotencyKey ?? crypto.randomUUID());
    setOpen(true);
  }

  return (
    <>
      <Button
        type="button"
        variant="outlined"
        size="small"
        color="error"
        onClick={openDialog}
        aria-haspopup="dialog"
        disabled={pending}
        sx={{ minHeight: 36, px: 1.25, borderRadius: 2, fontFamily: "inherit", fontSize: 12, fontWeight: 700, textTransform: "none", whiteSpace: "nowrap" }}
      >
        {t("admin.bookings.refund")}
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} dir="rtl" aria-labelledby={`${formId}-title`} aria-describedby={`${formId}-description`}>
        <form action={formAction}>
          <DialogTitle id={`${formId}-title`} sx={{ fontFamily: "inherit", fontSize: 18, fontWeight: 700 }}>
            {t("admin.bookings.refundTitle")}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id={`${formId}-description`} sx={{ fontFamily: "inherit", fontSize: 14, color: "#526764", mb: 2 }}>
              {t("admin.bookings.refundHint")}
            </DialogContentText>
            <input type="hidden" name="booking_id" value={bookingId} />
            <input type="hidden" name="idempotency_key" value={idempotencyKey ?? ""} />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
            <Button type="button" onClick={() => setOpen(false)} disabled={pending} sx={{ fontFamily: "inherit", fontWeight: 600, textTransform: "none" }}>
              {t("admin.users.cancel")}
            </Button>
            <Button type="submit" variant="contained" color="error" disabled={pending || !idempotencyKey} sx={{ fontFamily: "inherit", fontWeight: 700, textTransform: "none" }}>
              {t("admin.bookings.refund")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

function DisputeDialog({ bookingId }: { bookingId: number }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(resolveDisputeAction, initialState);
  const formId = useId();
  const [open, setOpen] = useState(false);
  const [resolution, setResolution] = useState<"settle" | "cancel">("settle");
  useActionFeedback(state, {
    onSuccess: () => {
      setOpen(false);
      router.refresh();
    },
  });

  return (
    <>
      <Button
        type="button"
        variant="outlined"
        size="small"
        color="warning"
        onClick={() => {
          setResolution("settle");
          setOpen(true);
        }}
        aria-haspopup="dialog"
        disabled={pending}
        sx={{ minHeight: 36, px: 1.25, borderRadius: 2, fontFamily: "inherit", fontSize: 12, fontWeight: 700, textTransform: "none", whiteSpace: "nowrap" }}
      >
        {t("admin.bookings.resolve")}
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} dir="rtl" aria-labelledby={`${formId}-title`} aria-describedby={`${formId}-description`}>
        <form action={formAction}>
          <DialogTitle id={`${formId}-title`} sx={{ fontFamily: "inherit", fontSize: 18, fontWeight: 700 }}>
            {t("admin.disputes.title")}
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <DialogContentText id={`${formId}-description`} sx={{ fontFamily: "inherit", fontSize: 14, color: "#526764", mb: 2 }}>
              {t("admin.disputes.radioHint")}
            </DialogContentText>
            <input type="hidden" name="booking_id" value={bookingId} />
            <input type="hidden" name="resolution" value={resolution} />
            <RadioGroup aria-label={t("admin.disputes.resolution")} value={resolution} onChange={(event) => setResolution(event.target.value as "settle" | "cancel")} sx={{ gap: 0.5, mb: 2 }}>
              <FormControlLabel value="settle" control={<Radio disabled={pending} />} label={t("admin.disputes.settle")} sx={{ fontFamily: "inherit", "& .MuiTypography-root": { fontFamily: "inherit", fontSize: 14 } }} />
              <FormControlLabel value="cancel" control={<Radio disabled={pending} />} label={t("admin.disputes.cancel")} sx={{ "& .MuiTypography-root": { fontFamily: "inherit", fontSize: 14 } }} />
            </RadioGroup>
            <Input id={`${formId}-note`} name="note" type="text" label={t("admin.disputes.note")} reserveHelperText={false} disabled={pending} />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
            <Button type="button" onClick={() => setOpen(false)} disabled={pending} sx={{ fontFamily: "inherit", fontWeight: 600, textTransform: "none" }}>
              {t("admin.users.cancel")}
            </Button>
            <Button type="submit" variant="contained" disabled={pending} sx={{ fontFamily: "inherit", fontWeight: 700, textTransform: "none" }}>
              {t("admin.disputes.submit")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
