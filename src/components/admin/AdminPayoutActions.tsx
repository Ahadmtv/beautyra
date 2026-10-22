"use client";

import { useActionState, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Menu, MenuItem } from "@mui/material";
import { Input } from "@/components/ui/Input";
import { useActionFeedback } from "@/components/ui/use-action-feedback";

import { t } from "@/config/messages.fa";
import { adminPayoutAction, type AdminActionState } from "@/lib/admin/actions";
import type { AdminPayoutStatus } from "@/lib/api/admin";
import type { AdminPayout } from "@/lib/api/types";

const initialState: AdminActionState = {};

type PayoutAction = "approve" | "reject" | "processing" | "paid" | "fail";

const allowedActions: Record<AdminPayoutStatus, PayoutAction[]> = {
  requested: ["approve", "reject"],
  approved: ["processing"],
  processing: ["paid", "fail"],
  paid: [],
  rejected: [],
  failed: [],
};

const actionLabelKeys: Record<PayoutAction, Parameters<typeof t>[0]> = {
  approve: "admin.payouts.approve",
  reject: "admin.payouts.reject",
  processing: "admin.payouts.processing",
  paid: "admin.payouts.paid",
  fail: "admin.payouts.fail",
};

const destructiveActions = new Set<PayoutAction>(["reject", "fail"]);

export function AdminPayoutActions({ payout }: { payout: AdminPayout }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(adminPayoutAction, initialState);
  const formId = useId();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedAction, setSelectedAction] = useState<PayoutAction | null>(null);
  const [reference, setReference] = useState("");
  useActionFeedback(state, {
    onSuccess: () => {
      setSelectedAction(null);
      router.refresh();
    },
  });

  const actions = allowedActions[payout.status];
  const open = Boolean(anchorEl);

  return (
    <Box sx={{ display: "flex", gap: 0.75, flexDirection: "column", minWidth: 0 }}>
      {actions.length > 0 && (
        <>
          <Button
            type="button"
            variant="outlined"
            size="small"
            onClick={(event) => setAnchorEl(event.currentTarget)}
            aria-haspopup="menu"
            aria-expanded={open ? "true" : undefined}
            disabled={pending}
            sx={{ minHeight: 36, gap: 0.75, px: 1.25, borderColor: "#dce7e4", borderRadius: 2, color: "#0f665f", fontFamily: "inherit", fontSize: 12, fontWeight: 700, textTransform: "none", whiteSpace: "nowrap", "&:hover": { borderColor: "#0f766e", backgroundColor: "#e6f4f1" } }}
          >
            {t("admin.payouts.action")}
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="currentColor"><circle cx="5" cy="12" r="1.7" /><circle cx="12" cy="12" r="1.7" /><circle cx="19" cy="12" r="1.7" /></svg>
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            slotProps={{ paper: { dir: "rtl", sx: { minWidth: 200, mt: 0.75, border: "1px solid #dce7e4", borderRadius: 2, boxShadow: "0 12px 32px rgba(23, 43, 42, 0.14)" } }, list: { "aria-label": t("admin.payouts.action"), sx: { p: 0.75 } } }}
          >
            {actions.map((action) => (
              <MenuItem
                key={action}
                component="button"
                type="button"
                disabled={pending}
                sx={{ display: "flex", minHeight: 44, width: "100%", justifyContent: "flex-start", gap: 1, borderRadius: 1.5, px: 1.25, fontFamily: "inherit", fontSize: 13, color: destructiveActions.has(action) ? "#b42318" : "#172b2a", "&:hover": { backgroundColor: destructiveActions.has(action) ? "#fff1f0" : "#f4f8f7" } }}
                onClick={() => {
                  setAnchorEl(null);
                  setReference("");
                  setSelectedAction(action);
                }}
              >
                <span aria-hidden="true" className="inline-flex size-4 shrink-0">
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    {action === "approve" || action === "paid" ? <path d="M5 13l4 4L19 7" /> : action === "reject" || action === "fail" ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M5 12h14m-6-6 6 6-6 6" />}
                  </svg>
                </span>
                <span>{t(actionLabelKeys[action])}</span>
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
      <Dialog
        open={selectedAction !== null}
        onClose={() => setSelectedAction(null)}
        dir="rtl"
        aria-labelledby={`${formId}-title`}
      >
        <form action={formAction}>
          <DialogTitle id={`${formId}-title`} sx={{ fontFamily: "inherit", fontSize: 18, fontWeight: 700 }}>
            {selectedAction && t(actionLabelKeys[selectedAction])}
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <input type="hidden" name="payout_id" value={payout.id} />
            <input type="hidden" name="payout_action" value={selectedAction ?? ""} />
            {referenceRequired(selectedAction) && (
              <Box sx={{ mb: 2 }}>
                <Input
                  id={`${formId}-reference`}
                  name="external_transfer_reference"
                  type="text"
                  label={t("admin.payouts.reference")}
                  reserveHelperText={false}
                  value={reference}
                  onChange={(event) => setReference(event.target.value)}
                  disabled={pending}
                />
                <Box sx={{ mt: 0.5, fontFamily: "inherit", fontSize: 12, color: "#617472" }}>{t("admin.payouts.referenceHint")}</Box>
              </Box>
            )}
            <Input id={`${formId}-note`} name="note" type="text" label={t("admin.payouts.note")} reserveHelperText={false} disabled={pending} />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
            <Button type="button" onClick={() => setSelectedAction(null)} disabled={pending} sx={{ fontFamily: "inherit", fontWeight: 600, textTransform: "none" }}>
              {t("admin.users.cancel")}
            </Button>
            <Button type="submit" variant="contained" disabled={pending || (referenceRequired(selectedAction) && reference.trim() === "")} sx={{ fontFamily: "inherit", fontWeight: 700, textTransform: "none" }}>
              {t("admin.payouts.submit")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

function referenceRequired(action: PayoutAction | null): boolean {
  return action === "paid";
}
