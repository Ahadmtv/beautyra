"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Menu, MenuItem, Button as MuiButton } from "@mui/material";

import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { t } from "@/config/messages.fa";
import type { Service } from "@/lib/api/types";
import {
  mutateProviderServiceAction,
  type ProviderServiceActionState,
} from "@/lib/provider/service-actions";

const initialState: ProviderServiceActionState = {};

export function ProviderServiceActions({ service }: { service: Service }) {
  const [toggleState, toggleAction, togglePending] = useActionState(mutateProviderServiceAction, initialState);
  const [deactivateState, deactivateAction, deactivatePending] = useActionState(mutateProviderServiceAction, initialState);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const toggleFormRef = useRef<HTMLFormElement>(null);
  const toggleFormId = useId();
  const { showToast } = useToast();
  const message = toggleState.message ?? deactivateState.message;

  useEffect(() => {
    if (message) showToast(message, "error");
  }, [message, showToast]);

  return (
    <div className="flex flex-col items-start gap-2">
      <form ref={toggleFormRef} id={toggleFormId} action={toggleAction} className="hidden">
        <input type="hidden" name="service_id" value={service.id} />
        <input type="hidden" name="intent" value="toggle" />
        <input type="hidden" name="is_active" value={String(service.is_active)} />
      </form>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={t("provider.services.actionsMenu")}
        aria-haspopup="menu"
        aria-expanded={Boolean(anchorEl) ? "true" : undefined}
        disabled={togglePending || deactivatePending}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        className="text-text-muted hover:text-primary"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="currentColor"><circle cx="5" cy="12" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="19" cy="12" r="1.8" /></svg>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { dir: "rtl", sx: { minWidth: 220, border: "1px solid #dce7e4", borderRadius: 2, boxShadow: "0 12px 32px rgba(23, 43, 42, 0.14)" } }, list: { "aria-label": t("provider.services.actionsMenu"), sx: { p: 0.75 } } }}
      >
        <MenuItem
          component="button"
          type="button"
          disabled={togglePending}
          onClick={() => {
            setAnchorEl(null);
            toggleFormRef.current?.requestSubmit();
          }}
          sx={{ minHeight: 44, gap: 1, borderRadius: 1.5, px: 1.25, fontFamily: "inherit", fontSize: 13 }}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18M5 10l7-7 7 7" /></svg>
          {t("provider.services.toggle")}
        </MenuItem>
        {service.is_active && (
          <>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem
              component="button"
              type="button"
              disabled={deactivatePending}
              onClick={() => {
                setAnchorEl(null);
                setConfirmOpen(true);
              }}
              sx={{ minHeight: 44, gap: 1, borderRadius: 1.5, px: 1.25, color: "#b42318", fontFamily: "inherit", fontSize: 13, "&:hover": { backgroundColor: "#fff1f0" } }}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16m-10 4v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" /></svg>
              {t("provider.services.deactivate")}
            </MenuItem>
          </>
        )}
      </Menu>
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} dir="rtl" aria-labelledby={`${toggleFormId}-deactivate-title`} aria-describedby={`${toggleFormId}-deactivate-description`}>
        <form action={deactivateAction}>
          <input type="hidden" name="service_id" value={service.id} />
          <input type="hidden" name="intent" value="deactivate" />
          <DialogTitle id={`${toggleFormId}-deactivate-title`} sx={{ fontFamily: "inherit", fontSize: 18, fontWeight: 700 }}>{t("provider.services.confirmDeactivateTitle")}</DialogTitle>
          <DialogContent>
            <DialogContentText id={`${toggleFormId}-deactivate-description`} sx={{ fontFamily: "inherit", fontSize: 14, lineHeight: 1.8, color: "#526764" }}>
              {t("provider.services.deactivateNote")}
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
            <Button type="button" variant="ghost" onClick={() => setConfirmOpen(false)}>{t("provider.services.cancel")}</Button>
            <MuiButton type="submit" variant="contained" color="error" disabled={deactivatePending} sx={{ minHeight: 42, gap: 1, fontFamily: "inherit", fontWeight: 700, textTransform: "none" }}>
              {deactivatePending && <CircularProgress size={16} color="inherit" aria-hidden="true" />}
              {deactivatePending ? t("button.loading") : t("provider.services.deactivate")}
            </MuiButton>
          </DialogActions>
        </form>
      </Dialog>
      {message && <p role="alert" className="max-w-xs text-sm text-danger">{message}</p>}
    </div>
  );
}
