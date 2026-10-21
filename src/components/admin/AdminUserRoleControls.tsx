"use client";

import { useActionState, useId, useState } from "react";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Menu, MenuItem } from "@mui/material";

import { t } from "@/config/messages.fa";
import { updateAdminUserRoleAction, type AdminActionState } from "@/lib/admin/actions";
import type { AdminUser } from "@/lib/api/types";

const initialState: AdminActionState = {};
type ManagedRole = "provider" | "admin";
type RoleChange = { role: ManagedRole; granted: boolean };

export function AdminUserRoleControls({ user }: { user: AdminUser }) {
  const [state, formAction, pending] = useActionState(updateAdminUserRoleAction, initialState);
  const formPrefix = useId();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [confirmation, setConfirmation] = useState<RoleChange | null>(null);
  const isProvider = user.roles.includes("provider");
  const isAdmin = user.roles.includes("admin");
  const open = Boolean(anchorEl);
  const roleChanges = [
    { role: "provider" as const, granted: !isProvider },
    { role: "admin" as const, granted: !isAdmin },
  ];
  const grants = roleChanges.filter((change) => change.granted);
  const revocations = roleChanges.filter((change) => !change.granted);
  const confirmationRole = confirmation && t(confirmation.role === "provider" ? "admin.users.role.provider" : "admin.users.role.admin");

  function confirmRoleChange() {
    if (!confirmation) return;
    const form = document.getElementById(`${formPrefix}-${confirmation.role}`);
    if (form instanceof HTMLFormElement) form.requestSubmit();
    setConfirmation(null);
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 0.75, minWidth: 0 }}>
      {roleChanges.map(({ role, granted }) => (
        <RoleActionForm key={`form-${role}`} userId={user.id} role={role} granted={granted} formId={`${formPrefix}-${role}`} formAction={formAction} />
      ))}
      <Button
        type="button"
        variant="outlined"
        size="small"
        onClick={(event) => setAnchorEl(event.currentTarget)}
        aria-haspopup="menu"
        aria-expanded={open ? "true" : undefined}
        aria-label={t("admin.users.manageRoles")}
        disabled={pending || !user.is_active}
        sx={{ minHeight: 36, gap: 0.75, px: 1.25, borderColor: "#dce7e4", borderRadius: 2, color: "#0f665f", fontFamily: "inherit", fontSize: 12, fontWeight: 700, textTransform: "none", whiteSpace: "nowrap", "&:hover": { borderColor: "#0f766e", backgroundColor: "#e6f4f1" } }}
      >
        <span>{t("admin.users.manageRoles")}</span>
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="currentColor"><circle cx="5" cy="12" r="1.7" /><circle cx="12" cy="12" r="1.7" /><circle cx="19" cy="12" r="1.7" /></svg>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { dir: "rtl", sx: { minWidth: 220, mt: 0.75, border: "1px solid #dce7e4", borderRadius: 2, boxShadow: "0 12px 32px rgba(23, 43, 42, 0.14)" } }, list: { "aria-label": t("admin.users.manageRoles"), sx: { p: 0.75 } } }}
      >
        {grants.map(({ role }) => (
          <RoleMenuItem key={`grant-${role}`} role={role} granted onSelect={() => { setAnchorEl(null); setConfirmation({ role, granted: true }); }} />
        ))}
        {grants.length > 0 && revocations.length > 0 && <Divider sx={{ my: 0.5 }} />}
        {revocations.map(({ role }) => (
          <RoleMenuItem key={`revoke-${role}`} role={role} granted={false} onSelect={() => { setAnchorEl(null); setConfirmation({ role, granted: false }); }} />
        ))}
      </Menu>
      <Dialog open={confirmation !== null} onClose={() => setConfirmation(null)} dir="rtl" aria-labelledby={`${formPrefix}-confirm-title`} aria-describedby={`${formPrefix}-confirm-description`}>
        <DialogTitle id={`${formPrefix}-confirm-title`} sx={{ fontFamily: "inherit", fontSize: 18, fontWeight: 700 }}>{t("admin.users.confirmTitle")}</DialogTitle>
        <DialogContent>
          <DialogContentText id={`${formPrefix}-confirm-description`} sx={{ fontFamily: "inherit", fontSize: 14, color: "#526764" }}>
            {confirmation && confirmationRole && t(confirmation.granted ? "admin.users.confirmGrant" : "admin.users.confirmRevoke", { role: confirmationRole })}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setConfirmation(null)} sx={{ fontFamily: "inherit", fontWeight: 600, textTransform: "none" }}>{t("admin.users.cancel")}</Button>
          <Button onClick={confirmRoleChange} variant="contained" color={confirmation?.granted ? "primary" : "error"} disabled={pending} sx={{ fontFamily: "inherit", fontWeight: 700, textTransform: "none" }}>
            {t("admin.users.confirmAction")}
          </Button>
        </DialogActions>
      </Dialog>
      {state.message && (
        <Alert severity={state.success ? "success" : "error"} sx={{ maxWidth: 240, fontFamily: "inherit", fontSize: 12, py: 0.25 }}>
          {state.message}
        </Alert>
      )}
    </Box>
  );
}

function RoleActionForm({ userId, role, granted, formId, formAction }: {
  userId: number;
  role: ManagedRole;
  granted: boolean;
  formId: string;
  formAction: (formData: FormData) => void;
}) {
  return (
    <form id={formId} hidden action={formAction}>
      <input type="hidden" name="user_id" value={userId} />
      <input type="hidden" name="role" value={role} />
      <input type="hidden" name="granted" value={granted ? "true" : "false"} />
    </form>
  );
}

function RoleMenuItem({ role, granted, onSelect }: {
  role: ManagedRole;
  granted: boolean;
  onSelect: () => void;
}) {
  const actionLabel = granted
    ? t(role === "provider" ? "admin.users.grantProvider" : "admin.users.grantAdmin")
    : t(role === "provider" ? "admin.users.revokeProvider" : "admin.users.revokeAdmin");

  return (
    <MenuItem
      component="button"
      type="button"
      onClick={onSelect}
      sx={{ display: "flex", minHeight: 44, width: "100%", justifyContent: "flex-start", gap: 1, borderRadius: 1.5, px: 1.25, fontFamily: "inherit", fontSize: 13, color: granted ? "#172b2a" : "#b42318", "&:hover": { backgroundColor: granted ? "#f4f8f7" : "#fff1f0" }, "&:focus-visible": { outline: "2px solid #0f766e", outlineOffset: -2 } }}
    >
      <span aria-hidden="true" className="inline-flex size-4 shrink-0 items-center justify-center">
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {granted ? <path d="M12 5v14m-7-7h14" /> : <path d="M5 12h14" />}
        </svg>
      </span>
      <span>{actionLabel}</span>
    </MenuItem>
  );
}
