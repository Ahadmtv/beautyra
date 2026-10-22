"use client";

import { useActionState, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";

import { Select } from "@/components/ui/Select";
import { useActionFeedback } from "@/components/ui/use-action-feedback";
import { t } from "@/config/messages.fa";
import { updateProviderVerificationAction, type AdminActionState } from "@/lib/admin/actions";
import { getVerificationEligibility } from "@/lib/admin/provider-verification";
import type { AdminProvider } from "@/lib/api/types";
import type { AdminProviderVerificationStatus } from "@/lib/api/admin";

const initialState: AdminActionState = {};

const statusOptions = [
  { value: "pending", label: t("admin.providers.status.pending") },
  { value: "verified", label: t("admin.providers.status.verified") },
  { value: "rejected", label: t("admin.providers.status.rejected") },
] as const;

export function AdminProviderVerificationControls({ provider }: { provider: AdminProvider }) {
  const router = useRouter();
  const formId = useId();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [status, setStatus] = useState<AdminProviderVerificationStatus>(provider.verification_status);
  const eligibility = getVerificationEligibility(provider, status);
  const [state, formAction, pending] = useActionState(updateProviderVerificationAction, initialState);
  useActionFeedback(state, {
    onSuccess: () => {
      setDialogOpen(false);
      router.refresh();
    },
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75, minWidth: 0 }}>
      <Button
        type="button"
        variant="outlined"
        size="small"
        onClick={() => {
          setStatus(provider.verification_status);
          setDialogOpen(true);
        }}
        aria-haspopup="dialog"
        disabled={pending}
        sx={{ minHeight: 36, px: 1.25, borderColor: "#dce7e4", borderRadius: 2, color: "#0f665f", fontFamily: "inherit", fontSize: 12, fontWeight: 700, textTransform: "none", whiteSpace: "nowrap", "&:hover": { borderColor: "#0f766e", backgroundColor: "#e6f4f1" } }}
      >
        {t("admin.providers.action")}
      </Button>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} dir="rtl" aria-labelledby={`${formId}-title`}>
        <form action={formAction}>
          <DialogTitle id={`${formId}-title`} sx={{ fontFamily: "inherit", fontSize: 18, fontWeight: 700 }}>
            {t("admin.providers.title")}
          </DialogTitle>
          <DialogContent sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
            <input type="hidden" name="provider_id" value={provider.provider_id} />
            <Select
              id={`${formId}-status`}
              name="verification_status"
              label={t("admin.providers.verification")}
              options={statusOptions}
              value={status}
              onChange={(event) => setStatus(event.target.value as AdminProviderVerificationStatus)}
            />
            {!provider.profile_completed && (
              <Alert severity="warning" sx={{ fontFamily: "inherit", fontSize: 12, "& .MuiAlert-message": { fontFamily: "inherit" } }}>
                {t("admin.providers.profileIncomplete")}
              </Alert>
            )}
            {eligibility.unchanged && (
              <Typography sx={{ fontFamily: "inherit", fontSize: 12, color: "#617472" }}>
                {t("admin.providers.unchanged")}
              </Typography>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
            <Button type="button" onClick={() => setDialogOpen(false)} disabled={pending} sx={{ fontFamily: "inherit", fontWeight: 600, textTransform: "none" }}>
              {t("admin.users.cancel")}
            </Button>
            <Button type="submit" variant="contained" disabled={pending || !eligibility.submitAllowed} sx={{ fontFamily: "inherit", fontWeight: 700, textTransform: "none" }}>
              {t("admin.providers.submit")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
