"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Box,
  Button,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import Link from "next/link";

import { useActionFeedback } from "@/components/ui/use-action-feedback";
import { t, type MessageKey } from "@/config/messages.fa";
import { logoutAction, type LogoutState } from "@/lib/auth/actions";
import type { Role } from "@/lib/auth/claims";

const roleLabelKeys: Record<Role, MessageKey> = {
  client: "auth.role.client",
  provider: "auth.role.provider",
  admin: "auth.role.admin",
};

const roleLinks: Record<Role, Array<{ href: string; label: MessageKey; icon: string }>> = {
  client: [{ href: "/dashboard/bookings", label: "dashboard.bookings.title", icon: "M8 3v3m8-3v3M4 9h16M5 5h14v15H5z" }],
  provider: [{ href: "/provider/profile", label: "provider.nav.profile", icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0" }],
  admin: [
    { href: "/admin/users", label: "admin.nav.users", icon: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0m2-9h4m-2-2v4" },
    { href: "/admin/providers", label: "admin.nav.providers", icon: "M12 3 4 7v5c0 5 3.5 8 8 9 4.5-1 8-4 8-9V7z" },
    { href: "/admin/bookings", label: "admin.nav.bookings", icon: "M8 3v3m8-3v3M4 9h16M5 5h14v15H5z" },
    { href: "/admin/payouts", label: "admin.nav.payouts", icon: "M3 6h18v13H3zM3 10h18m-4 5h1" },
  ],
};

function MenuGlyph({ path }: { path: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  );
}

export function AccountMenu({ role }: { role: Role }) {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [logoutState, logoutFormAction, logoutPending] = useActionState<LogoutState, FormData>(logoutAction, {});
  useActionFeedback(logoutState, {
    onSuccess: () => {
      setAnchorEl(null);
      router.replace("/");
      router.refresh();
    },
  });
  const open = Boolean(anchorEl);
  const roleLabel = t(roleLabelKeys[role]);

  return (
    <>
      <Button
        variant="outlined"
        onClick={(event) => setAnchorEl(event.currentTarget)}
        aria-haspopup="menu"
        aria-expanded={open ? "true" : undefined}
        aria-controls={open ? "account-menu" : undefined}
        sx={{
          minHeight: 42,
          gap: 1,
          borderColor: "rgba(15, 118, 110, 0.2)",
          borderRadius: "999px",
          px: 1.25,
          color: "#172b2a",
          fontFamily: "inherit",
          fontSize: 14,
          fontWeight: 600,
          textTransform: "none",
          "&:hover": { borderColor: "#0f766e", backgroundColor: "#e6f4f1" },
        }}
      >
        <Avatar sx={{ width: 28, height: 28, bgcolor: "#e6f4f1", color: "#0f766e", fontSize: 13, fontWeight: 700 }}>
          {roleLabel.slice(0, 1)}
        </Avatar>
        {t("auth.account.menu")}
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m7 10 5 5 5-5" />
        </svg>
      </Button>
      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            dir: "rtl",
            sx: {
              mt: 1.25,
              minWidth: 260,
              border: "1px solid #dce7e4",
              borderRadius: 3,
              boxShadow: "0 16px 48px rgba(23, 43, 42, 0.14)",
            },
          },
          list: { dir: "rtl", sx: { p: 1 } },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 1.5, py: 1.25 }}>
          <Avatar sx={{ width: 40, height: 40, bgcolor: "#e6f4f1", color: "#0f766e", fontWeight: 700 }}>
            {roleLabel.slice(0, 1)}
          </Avatar>
          <Box>
            <Typography sx={{ fontFamily: "inherit", fontSize: 14, fontWeight: 700, color: "#172b2a" }}>
              {t("auth.account.menu")}
            </Typography>
            <Typography sx={{ fontFamily: "inherit", fontSize: 12, color: "#617472" }}>{roleLabel}</Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 0.75, borderColor: "#e8efed" }} />
        <MenuItem component={Link} href="/account" onClick={() => setAnchorEl(null)} sx={menuItemSx}>
          <ListItemIcon sx={menuIconSx}><MenuGlyph path="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0" /></ListItemIcon>
          <ListItemText disableTypography>{t("auth.account.open")}</ListItemText>
        </MenuItem>
        {roleLinks[role].map((item) => (
          <MenuItem key={item.href} component={Link} href={item.href} onClick={() => setAnchorEl(null)} sx={menuItemSx}>
            <ListItemIcon sx={menuIconSx}><MenuGlyph path={item.icon} /></ListItemIcon>
            <ListItemText disableTypography>{t(item.label)}</ListItemText>
          </MenuItem>
        ))}
        <Divider sx={{ my: 0.75, borderColor: "#e8efed" }} />
        <form action={logoutFormAction}>
          <MenuItem component="button" type="submit" disabled={logoutPending} sx={{ ...menuItemSx, width: "100%", color: "#b42318" }}>
            <ListItemIcon sx={{ ...menuIconSx, color: "inherit" }}><MenuGlyph path="M10 17l5-5-5-5m5 5H3m10-9h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5" /></ListItemIcon>
            <ListItemText disableTypography>{t("auth.logout")}</ListItemText>
          </MenuItem>
        </form>
      </Menu>
    </>
  );
}

const menuItemSx = {
  minHeight: 44,
  gap: 1,
  borderRadius: 2,
  px: 1.5,
  fontFamily: "inherit",
  fontSize: 14,
  "&:hover": { backgroundColor: "#f4f8f7" },
};

const menuIconSx = { minWidth: 30, mr: 0, ml: 1, color: "#0f766e" };
