import type { Metadata } from "next";
import Link from "next/link";

import {
  Box,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { AdminUserRoleControls } from "@/components/admin/AdminUserRoleControls";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { t } from "@/config/messages.fa";
import { getAdminUsers, type AdminUserFilterRole } from "@/lib/api/admin";
import type { AdminUser } from "@/lib/api/types";
import { redirectOnUnauthorized, requireRole } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: `${t("admin.users.title")} | ${t("brand.name")}`,
  robots: { index: false, follow: false },
};

type AdminUsersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const roleOptions = [
  { value: "client", label: t("admin.users.role.client") },
  { value: "provider", label: t("admin.users.role.provider") },
  { value: "admin", label: t("admin.users.role.admin") },
] as const;

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  await requireRole("admin");
  const params = await searchParams;
  const rawCursor = firstValue(params.cursor);
  const cursor = rawCursor === undefined ? undefined : Number(rawCursor);
  const q = firstValue(params.q)?.trim().slice(0, 100) ?? "";
  const role = parseRole(firstValue(params.role));

  let page;
  try {
    page = await getAdminUsers({ cursor, q, role, limit: 50 });
  } catch (error) {
    redirectOnUnauthorized(error);
    throw error;
  }

  return (
    <Box component="main" sx={{ width: "100%", maxWidth: 1180, flex: 1, mx: "auto", px: { xs: 2, sm: 3 }, py: { xs: 3, md: 5 } }}>
      <Stack spacing={1}>
        <Typography component="h1" variant="h4" sx={{ fontFamily: "inherit", fontSize: { xs: 24, md: 30 }, fontWeight: 800, color: "#172b2a" }}>
          {t("admin.users.title")}
        </Typography>
        <Typography sx={{ fontFamily: "inherit", fontSize: 14, color: "#617472" }}>
          {t("admin.users.subtitle")}
        </Typography>
      </Stack>

      <Paper component="form" method="get" action="/admin/users" elevation={0} sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1fr) 220px auto" }, gap: 1.5, alignItems: "end", mt: 4, p: 2, border: "1px solid #dce7e4", borderRadius: 3 }}>
        <Input
          id="admin-user-query"
          name="q"
          type="search"
          label={t("admin.users.searchLabel")}
          placeholder={t("admin.users.searchPlaceholder")}
          defaultValue={q}
          reserveHelperText={false}
        />
        <Select
          id="admin-user-role"
          name="role"
          label={t("admin.users.filterRole")}
          placeholder={t("admin.users.allRoles")}
          options={roleOptions}
          defaultValue={role ?? ""}
        />
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button type="submit" variant="primary">{t("admin.users.filterSubmit")}</Button>
          {(q || role) && (
            <Link href="/admin/users" className="inline-flex min-h-10 items-center px-2 text-sm font-semibold text-primary">
              {t("admin.users.clearFilter")}
            </Link>
          )}
        </Box>
      </Paper>

      <TableContainer component={Paper} elevation={0} sx={{ mt: 3, border: "1px solid #dce7e4", borderRadius: 3, overflowX: "auto" }}>
        <Table sx={{ minWidth: 820 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f4f8f7" }}>
              <TableCell sx={headCellSx}>{t("admin.users.email")}</TableCell>
              <TableCell sx={headCellSx}>{t("admin.users.displayName")}</TableCell>
              <TableCell sx={headCellSx}>{t("admin.users.phone")}</TableCell>
              <TableCell sx={headCellSx}>{t("admin.users.roles")}</TableCell>
              <TableCell sx={headCellSx}>{t("admin.users.status")}</TableCell>
              <TableCell sx={headCellSx}>{t("admin.users.actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {page.items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ ...bodyCellSx, py: 6, textAlign: "center", color: "#617472" }}>
                  {t("admin.users.noUsers")}
                </TableCell>
              </TableRow>
            ) : (
              page.items.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell sx={bodyCellSx}>{user.email}</TableCell>
                  <TableCell sx={bodyCellSx}>{user.display_name || t("admin.users.notSet")}</TableCell>
                  <TableCell sx={bodyCellSx}>{user.phone ?? t("admin.users.notSet")}</TableCell>
                  <TableCell sx={bodyCellSx}><RoleChips user={user} /></TableCell>
                  <TableCell sx={bodyCellSx}>
                    <Chip
                      size="small"
                      label={user.is_active ? t("admin.users.active") : t("admin.users.inactive")}
                      color={user.is_active ? "success" : "default"}
                      variant="outlined"
                      sx={{ fontFamily: "inherit", fontSize: 12 }}
                    />
                  </TableCell>
                  <TableCell sx={bodyCellSx}><AdminUserRoleControls user={user} /></TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
        {(cursor !== undefined || q || role) && (
          <Link href="/admin/users" className="inline-flex min-h-10 items-center rounded-md border border-border px-4 text-sm font-medium text-primary hover:bg-surface">
            {t("admin.users.firstPage")}
          </Link>
        )}
        {page.next_cursor !== null && (
          <Link href={pageHref(page.next_cursor, q, role)} className="inline-flex min-h-10 items-center rounded-md border border-border px-4 text-sm font-medium text-primary hover:bg-surface">
            {t("admin.users.nextPage")}
          </Link>
        )}
      </Box>
    </Box>
  );
}

function RoleChips({ user }: { user: AdminUser }) {
  if (user.roles.length === 0) {
    return <Typography sx={{ fontFamily: "inherit", fontSize: 12, color: "#617472" }}>{t("admin.users.notSet")}</Typography>;
  }
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
      {user.roles.map((role) => (
        <Chip
          key={role}
          size="small"
          label={t(role === "client" ? "admin.users.role.client" : role === "provider" ? "admin.users.role.provider" : "admin.users.role.admin")}
          sx={{ fontFamily: "inherit", fontSize: 11, backgroundColor: "#e6f4f1", color: "#0f766e" }}
        />
      ))}
    </Box>
  );
}

function parseRole(value: string | undefined): AdminUserFilterRole | undefined {
  return value === "client" || value === "provider" || value === "admin" ? value : undefined;
}

function pageHref(cursor: number, q: string, role: AdminUserFilterRole | undefined): string {
  const query = new URLSearchParams({ cursor: String(cursor) });
  if (q) query.set("q", q);
  if (role) query.set("role", role);
  return `/admin/users?${query.toString()}`;
}

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

const headCellSx = { fontFamily: "inherit", fontSize: 12, fontWeight: 700, color: "#526764", whiteSpace: "nowrap" };
const bodyCellSx = { fontFamily: "inherit", fontSize: 13, color: "#172b2a", verticalAlign: "top" };
