"use client";

import { useActionState } from "react";
import { Alert, Box, Button } from "@mui/material";

import { t } from "@/config/messages.fa";
import { updateAdminUserRoleAction, type AdminActionState } from "@/lib/admin/actions";
import type { AdminUser } from "@/lib/api/types";

const initialState: AdminActionState = {};

export function AdminUserRoleControls({ user }: { user: AdminUser }) {
  const [state, formAction, pending] = useActionState(updateAdminUserRoleAction, initialState);
  const isProvider = user.roles.includes("provider");
  const isAdmin = user.roles.includes("admin");

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, minWidth: 190 }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        <RoleForm
          userId={user.id}
          role="provider"
          granted={!isProvider}
          disabled={pending || !user.is_active}
          formAction={formAction}
        />
        <RoleForm
          userId={user.id}
          role="admin"
          granted={!isAdmin}
          disabled={pending || !user.is_active}
          formAction={formAction}
        />
      </Box>
      {state.message && (
        <Alert severity={state.success ? "success" : "error"} sx={{ fontFamily: "inherit", fontSize: 12, py: 0.25 }}>
          {state.message}
        </Alert>
      )}
    </Box>
  );
}

function RoleForm({
  userId,
  role,
  granted,
  disabled,
  formAction,
}: {
  userId: number;
  role: "provider" | "admin";
  granted: boolean;
  disabled: boolean;
  formAction: (formData: FormData) => void;
}) {
  const roleLabel = t(role === "provider" ? "admin.users.role.provider" : "admin.users.role.admin");
  const actionLabel = granted
    ? t(role === "provider" ? "admin.users.grantProvider" : "admin.users.grantAdmin")
    : t(role === "provider" ? "admin.users.revokeProvider" : "admin.users.revokeAdmin");
  const confirmation = t(granted ? "admin.users.confirmGrant" : "admin.users.confirmRevoke", { role: roleLabel });

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!window.confirm(confirmation)) event.preventDefault();
      }}
    >
      <input type="hidden" name="user_id" value={userId} />
      <input type="hidden" name="role" value={role} />
      <input type="hidden" name="granted" value={granted ? "true" : "false"} />
      <Button
        type="submit"
        size="small"
        variant={granted ? "outlined" : "text"}
        color={granted ? "primary" : "error"}
        disabled={disabled}
        sx={{ fontFamily: "inherit", fontSize: 12, textTransform: "none", whiteSpace: "nowrap" }}
      >
        {actionLabel}
      </Button>
    </form>
  );
}
