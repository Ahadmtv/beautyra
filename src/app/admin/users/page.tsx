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
import InputAdornment from "@mui/material/InputAdornment";

import { AdminUserRoleControls } from "@/components/admin/AdminUserRoleControls";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { t } from "@/config/messages.fa";
import { getAdminUsers, type AdminUserFilterRole } from "@/lib/api/admin";
import type { AdminUser } from "@/lib/api/types";
import { numberFormatFa } from "@/lib/format/digits";
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
    <Box component="main" dir="rtl" sx={{ width: "100%", maxWidth: 1200, flex: 1, mx: "auto", px: { xs: 2, sm: 3 }, py: { xs: 3, md: 4 } }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ justifyContent: "space-between", alignItems: { xs: "stretch", sm: "center" } }}>
        <Box>
          <Typography component="h1" sx={{ fontFamily: "inherit", fontSize: { xs: 22, md: 24 }, fontWeight: 800, lineHeight: 1.6, color: "#172b2a" }}>
            {t("admin.users.title")}
          </Typography>
          <Typography sx={{ mt: 0.5, fontFamily: "inherit", fontSize: 14, lineHeight: 1.7, color: "#617472" }}>
            {t("admin.users.subtitle")}
          </Typography>
        </Box>
        <Chip
          label={`${numberFormatFa(page.items.length)} ${t("admin.users.resultCount")}`}
          sx={{ alignSelf: { xs: "flex-start", sm: "center" }, fontFamily: "inherit", fontSize: 12, fontWeight: 700, color: "#0f665f", backgroundColor: "#e6f4f1", borderRadius: 2 }}
        />
      </Stack>

      <Paper
        component="form"
        method="get"
        action="/admin/users"
        elevation={0}
        sx={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", "@media (min-width:768px)": { gridTemplateColumns: "minmax(0, 1fr) 220px auto" }, gap: 1.5, alignItems: "center", mt: 3, p: { xs: 1.5, sm: 2 }, border: "1px solid #dce7e4", borderRadius: 3, backgroundColor: "#fff" }}
      >
        <Input
          id="admin-user-query"
          name="q"
          type="search"
          label={t("admin.users.searchLabel")}
          placeholder={t("admin.users.searchPlaceholder")}
          defaultValue={q}
          compact
          reserveHelperText={false}
          startAdornment={
            <InputAdornment position="start" sx={{ color: "#617472" }}>
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="10.8" cy="10.8" r="6.8" />
                <path d="m16 16 4.5 4.5" />
              </svg>
            </InputAdornment>
          }
        />
        <Select
          id="admin-user-role"
          name="role"
          label={t("admin.users.filterRole")}
          placeholder={t("admin.users.allRoles")}
          options={roleOptions}
          defaultValue={role ?? ""}
          compact
          reserveHelperText={false}
        />
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
          <Button type="submit" variant="primary" className="min-h-11">{t("admin.users.filterSubmit")}</Button>
          <Link href="/admin/users" className="inline-flex min-h-11 items-center justify-center rounded-lg px-3 text-sm font-semibold text-text-muted transition-colors duration-150 hover:bg-surface hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none">
            {t("admin.users.clearFilter")}
          </Link>
        </Stack>
      </Paper>

      {page.items.length === 0 ? (
        <EmptyUsersState />
      ) : (
        <>
          <TableContainer
            component={Paper}
            role="region"
            aria-label={t("admin.users.title")}
            tabIndex={0}
            elevation={0}
            sx={{ display: "none", "@media (min-width:768px)": { display: "block" }, mt: 3, maxHeight: "min(70vh, 680px)", overflow: "auto", border: "1px solid #dce7e4", borderRadius: 3, boxShadow: "0 3px 14px rgba(23, 43, 42, 0.05)", "&:focus-visible": { outline: "2px solid #0f766e", outlineOffset: 2 } }}
          >
            <Table stickyHeader aria-label={t("admin.users.title")} sx={{ minWidth: 940, tableLayout: "fixed", "& .MuiTableCell-root": { verticalAlign: "middle", borderColor: "#e8efed", height: 64 } }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ ...headCellSx, width: "22%" }}>{t("admin.users.email")}</TableCell>
                  <TableCell sx={{ ...headCellSx, width: "18%" }}>{t("admin.users.displayName")}</TableCell>
                  <TableCell sx={{ ...headCellSx, width: "15%" }}>{t("admin.users.phone")}</TableCell>
                  <TableCell sx={{ ...headCellSx, width: "17%" }}>{t("admin.users.roles")}</TableCell>
                  <TableCell sx={{ ...headCellSx, width: "11%" }}>{t("admin.users.status")}</TableCell>
                  <TableCell sx={{ ...headCellSx, width: "17%" }}>{t("admin.users.actions")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {page.items.map((user) => (
                  <TableRow key={user.id} hover sx={{ transition: "background-color 150ms", "&:hover": { backgroundColor: "#f7faf9" }, "@media (prefers-reduced-motion: reduce)": { transition: "none" } }}>
                    <TableCell sx={bodyCellSx}>
                      <Typography component="span" dir="ltr" title={user.email} sx={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "start", fontFamily: "inherit", fontSize: 13, color: "#172b2a" }}>
                        {user.email}
                      </Typography>
                    </TableCell>
                    <TableCell sx={bodyCellSx}>{user.display_name || <MissingValue />}</TableCell>
                    <TableCell sx={bodyCellSx}>
                      {user.phone ? <Typography component="span" dir="ltr" sx={{ fontFamily: "inherit", fontSize: 13, fontVariantNumeric: "tabular-nums" }}>{user.phone}</Typography> : <MissingValue />}
                    </TableCell>
                    <TableCell sx={bodyCellSx}><RoleBadges user={user} /></TableCell>
                    <TableCell sx={bodyCellSx}><StatusPill active={user.is_active} /></TableCell>
                    <TableCell sx={bodyCellSx}><AdminUserRoleControls user={user} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box component="ul" aria-label={t("admin.users.title")} sx={{ display: "grid", "@media (min-width:768px)": { display: "none" }, gridTemplateColumns: "minmax(0, 1fr)", gap: 1.5, listStyle: "none", p: 0, m: 0, mt: 2 }}>
            {page.items.map((user) => (
              <Paper component="li" key={user.id} elevation={0} sx={{ minWidth: 0, p: 2, border: "1px solid #dce7e4", borderRadius: 3, boxShadow: "0 2px 10px rgba(23, 43, 42, 0.04)" }}>
                <Stack spacing={1.75}>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={mobileLabelSx}>{t("admin.users.email")}</Typography>
                    <Typography dir="ltr" title={user.email} sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "start", fontFamily: "inherit", fontSize: 14, fontWeight: 700, color: "#172b2a" }}>{user.email}</Typography>
                  </Box>
                  <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 1.5 }}>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={mobileLabelSx}>{t("admin.users.displayName")}</Typography>
                      <Typography sx={mobileValueSx}>{user.display_name || "—"}</Typography>
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={mobileLabelSx}>{t("admin.users.phone")}</Typography>
                      {user.phone ? <Typography dir="ltr" sx={{ ...mobileValueSx, textAlign: "start", fontVariantNumeric: "tabular-nums" }}>{user.phone}</Typography> : <Typography sx={mobileValueSx}>—</Typography>}
                    </Box>
                  </Box>
                  <Box>
                    <Typography sx={mobileLabelSx}>{t("admin.users.roles")}</Typography>
                    <RoleBadges user={user} />
                  </Box>
                  <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", pt: 1.25, borderTop: "1px solid #e8efed" }}>
                    <StatusPill active={user.is_active} />
                    <AdminUserRoleControls user={user} />
                  </Stack>
                </Stack>
              </Paper>
            ))}
          </Box>

          <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1.5, mt: 2 }}>
            {(cursor !== undefined || q || role) ? (
              <Link href="/admin/users" className="inline-flex min-h-11 items-center rounded-lg border border-border px-4 text-sm font-medium text-primary transition-colors duration-150 hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none">
                {t("admin.users.firstPage")}
              </Link>
            ) : <span />}
            {page.next_cursor !== null && (
              <Link href={pageHref(page.next_cursor, q, role)} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium text-primary transition-colors duration-150 hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none">
                {t("admin.users.nextPage")}
                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 rotate-180" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
              </Link>
            )}
          </Stack>
        </>
      )}
    </Box>
  );
}

function EmptyUsersState() {
  return (
    <Paper elevation={0} sx={{ mt: 3, p: { xs: 4, sm: 7 }, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 1.5, border: "1px solid #dce7e4", borderRadius: 3, backgroundColor: "#fff" }}>
      <Box aria-hidden="true" sx={{ width: 56, height: 56, display: "grid", placeItems: "center", borderRadius: "50%", backgroundColor: "#f4f8f7", color: "#617472" }}>
        <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5M8 10.8h5.6" /></svg>
      </Box>
      <Typography component="h2" sx={{ fontFamily: "inherit", fontSize: 18, fontWeight: 700, color: "#172b2a" }}>{t("admin.users.emptyTitle")}</Typography>
      <Typography sx={{ fontFamily: "inherit", fontSize: 14, color: "#617472" }}>{t("admin.users.noUsers")}</Typography>
      <Link href="/admin/users" className="mt-1 inline-flex min-h-11 items-center rounded-lg px-4 text-sm font-semibold text-primary transition-colors duration-150 hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none">
        {t("admin.users.clearFilters")}
      </Link>
    </Paper>
  );
}

function MissingValue() {
  return <Typography component="span" sx={{ fontFamily: "inherit", color: "#7a8b89" }}>—</Typography>;
}

function RoleBadges({ user }: { user: AdminUser }) {
  if (user.roles.length === 0) return <MissingValue />;

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
      {user.roles.map((role) => {
        const tone = role === "client"
          ? { color: "#52615f", backgroundColor: "#eef2f1" }
          : role === "provider"
            ? { color: "#17608a", backgroundColor: "#e7f2fa" }
            : { color: "#6741a5", backgroundColor: "#f0eafa" };
        const label = role === "client" ? t("admin.users.role.client") : role === "provider" ? t("admin.users.role.provider") : t("admin.users.role.admin");
        return <Chip key={role} size="small" label={label} sx={{ ...tone, fontFamily: "inherit", fontSize: 11, fontWeight: 600, borderRadius: 1.5 }} />;
      })}
    </Box>
  );
}

function StatusPill({ active }: { active: boolean }) {
  return (
    <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, px: 1, py: 0.5, borderRadius: 99, color: active ? "#157347" : "#657371", backgroundColor: active ? "#e9f6ef" : "#f1f3f3", fontFamily: "inherit", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
      <Box component="span" aria-hidden="true" sx={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: active ? "#17804d" : "#8a9694" }} />
      {active ? t("admin.users.active") : t("admin.users.inactive")}
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

const headCellSx = { position: "sticky", top: 0, zIndex: 1, backgroundColor: "#f3f6f5", fontFamily: "inherit", fontSize: 12, fontWeight: 700, color: "#526764", whiteSpace: "nowrap", textAlign: "start" as const };
const bodyCellSx = { fontFamily: "inherit", fontSize: 13, color: "#172b2a", textAlign: "start" as const };
const mobileLabelSx = { mb: 0.5, fontFamily: "inherit", fontSize: 11, fontWeight: 600, color: "#617472" };
const mobileValueSx = { overflow: "hidden", textOverflow: "ellipsis", fontFamily: "inherit", fontSize: 13, color: "#172b2a" };
