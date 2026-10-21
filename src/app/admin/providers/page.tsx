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

import { AdminProviderVerificationControls } from "@/components/admin/AdminProviderVerificationControls";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { t, type MessageKey } from "@/config/messages.fa";
import { getAdminProviders, type AdminProviderVerificationStatus } from "@/lib/api/admin";
import type { AdminProvider } from "@/lib/api/types";
import { redirectOnUnauthorized, requireRole } from "@/lib/auth/session";
import { numberFormatFa } from "@/lib/format/digits";

export const metadata: Metadata = {
  title: `${t("admin.providers.title")} | ${t("brand.name")}`,
  robots: { index: false, follow: false },
};

const statusLabels: Record<AdminProvider["verification_status"], MessageKey> = {
  pending: "admin.providers.status.pending",
  verified: "admin.providers.status.verified",
  rejected: "admin.providers.status.rejected",
};

const statusChips: Record<AdminProvider["verification_status"], { color: string; backgroundColor: string }> = {
  pending: { color: "#8a5b00", backgroundColor: "#fdf4e3" },
  verified: { color: "#157347", backgroundColor: "#e9f6ef" },
  rejected: { color: "#b42318", backgroundColor: "#fff1f0" },
};

type AdminProvidersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminProvidersPage({ searchParams }: AdminProvidersPageProps) {
  await requireRole("admin");
  const params = await searchParams;
  const rawCursor = firstValue(params.cursor);
  const cursor = rawCursor === undefined ? undefined : Number(rawCursor);
  const q = firstValue(params.q)?.trim().slice(0, 100) ?? "";
  const verificationStatus = parseStatus(firstValue(params.verification_status));

  let page;
  try {
    page = await getAdminProviders({ cursor, q, verificationStatus, limit: 50 });
  } catch (error) {
    redirectOnUnauthorized(error);
    throw error;
  }

  return (
    <Box component="main" dir="rtl" sx={{ width: "100%", maxWidth: 1200, flex: 1, mx: "auto", px: { xs: 2, sm: 3 }, py: { xs: 3, md: 4 } }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ justifyContent: "space-between", alignItems: { xs: "stretch", sm: "center" } }}>
        <Box>
          <Typography component="h1" sx={{ fontFamily: "inherit", fontSize: { xs: 22, md: 24 }, fontWeight: 800, lineHeight: 1.6, color: "#172b2a" }}>
            {t("admin.providers.title")}
          </Typography>
          <Typography sx={{ mt: 0.5, fontFamily: "inherit", fontSize: 14, lineHeight: 1.7, color: "#617472" }}>
            {t("admin.providers.subtitle")}
          </Typography>
        </Box>
        <Chip
          label={`${numberFormatFa(page.items.length)} ${t("admin.providers.resultCount")}`}
          sx={{ alignSelf: { xs: "flex-start", sm: "center" }, fontFamily: "inherit", fontSize: 12, fontWeight: 700, color: "#0f665f", backgroundColor: "#e6f4f1", borderRadius: 2 }}
        />
      </Stack>

      <Paper
        component="form"
        method="get"
        action="/admin/providers"
        elevation={0}
        sx={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", "@media (min-width:768px)": { gridTemplateColumns: "minmax(0, 1fr) 240px auto" }, gap: 1.5, alignItems: "center", mt: 3, p: { xs: 1.5, sm: 2 }, border: "1px solid #dce7e4", borderRadius: 3, backgroundColor: "#fff" }}
      >
        <Input
          id="admin-provider-query"
          name="q"
          type="search"
          label={t("admin.providers.searchLabel")}
          placeholder={t("admin.providers.searchPlaceholder")}
          defaultValue={q}
          compact
          reserveHelperText={false}
        />
        <Select
          id="admin-provider-status"
          name="verification_status"
          label={t("admin.providers.filterStatus")}
          placeholder={t("admin.providers.allStatuses")}
          options={statusOptions}
          defaultValue={verificationStatus ?? ""}
          compact
          reserveHelperText={false}
        />
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
          <Button type="submit" variant="primary" className="min-h-11">{t("admin.users.filterSubmit")}</Button>
          <Link href="/admin/providers" className="inline-flex min-h-11 items-center justify-center rounded-lg px-3 text-sm font-semibold text-text-muted transition-colors duration-150 hover:bg-surface hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none">
            {t("admin.users.clearFilter")}
          </Link>
        </Stack>
      </Paper>

      {page.items.length === 0 ? (
        <EmptyProvidersState />
      ) : (
        <>
          <TableContainer
            component={Paper}
            role="region"
            aria-label={t("admin.providers.title")}
            tabIndex={0}
            elevation={0}
            sx={{ display: "none", "@media (min-width:768px)": { display: "block" }, mt: 3, maxHeight: "min(70vh, 680px)", overflow: "auto", border: "1px solid #dce7e4", borderRadius: 3, boxShadow: "0 3px 14px rgba(23, 43, 42, 0.05)", "&:focus-visible": { outline: "2px solid #0f766e", outlineOffset: 2 } }}
          >
            <Table stickyHeader aria-label={t("admin.providers.title")} sx={{ minWidth: 880, tableLayout: "fixed", "& .MuiTableCell-root": { verticalAlign: "middle", borderColor: "#e8efed", height: 64 } }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ ...headCellSx, width: "22%" }}>{t("admin.providers.displayName")}</TableCell>
                  <TableCell sx={{ ...headCellSx, width: "22%" }}>{t("admin.providers.ownerEmail")}</TableCell>
                  <TableCell sx={{ ...headCellSx, width: "16%" }}>{t("admin.providers.ownerPhone")}</TableCell>
                  <TableCell sx={{ ...headCellSx, width: "16%" }}>{t("admin.providers.verification")}</TableCell>
                  <TableCell sx={{ ...headCellSx, width: "24%" }}>{t("admin.providers.action")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {page.items.map((provider) => (
                  <TableRow key={provider.provider_id} hover sx={{ transition: "background-color 150ms", "&:hover": { backgroundColor: "#f7faf9" }, "@media (prefers-reduced-motion: reduce)": { transition: "none" } }}>
                    <TableCell sx={bodyCellSx}>{provider.display_name}</TableCell>
                    <TableCell sx={bodyCellSx}>
                      <Typography component="span" dir="ltr" title={provider.owner_email} sx={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "start", fontFamily: "inherit", fontSize: 13, color: "#172b2a" }}>
                        {provider.owner_email}
                      </Typography>
                    </TableCell>
                    <TableCell sx={bodyCellSx}>
                      {provider.owner_phone ? <Typography component="span" dir="ltr" sx={{ fontFamily: "inherit", fontSize: 13, fontVariantNumeric: "tabular-nums" }}>{provider.owner_phone}</Typography> : <MissingValue />}
                    </TableCell>
                    <TableCell sx={bodyCellSx}><VerificationPill status={provider.verification_status} /></TableCell>
                    <TableCell sx={bodyCellSx}><AdminProviderVerificationControls provider={provider} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box component="ul" aria-label={t("admin.providers.title")} sx={{ display: "grid", "@media (min-width:768px)": { display: "none" }, gridTemplateColumns: "minmax(0, 1fr)", gap: 1.5, listStyle: "none", p: 0, m: 0, mt: 2 }}>
            {page.items.map((provider) => (
              <Paper component="li" key={provider.provider_id} elevation={0} sx={{ minWidth: 0, p: 2, border: "1px solid #dce7e4", borderRadius: 3, boxShadow: "0 2px 10px rgba(23, 43, 42, 0.04)" }}>
                <Stack spacing={1.75}>
                  <StatusAndName provider={provider} />
                  <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 1.5 }}>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={mobileLabelSx}>{t("admin.providers.ownerEmail")}</Typography>
                      <Typography dir="ltr" title={provider.owner_email} sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "start", fontFamily: "inherit", fontSize: 13, color: "#172b2a" }}>{provider.owner_email}</Typography>
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={mobileLabelSx}>{t("admin.providers.ownerPhone")}</Typography>
                      {provider.owner_phone ? <Typography dir="ltr" sx={{ ...mobileValueSx, textAlign: "start", fontVariantNumeric: "tabular-nums" }}>{provider.owner_phone}</Typography> : <Typography sx={mobileValueSx}>—</Typography>}
                    </Box>
                  </Box>
                  <Box sx={{ pt: 1.25, borderTop: "1px solid #e8efed" }}>
                    <AdminProviderVerificationControls provider={provider} />
                  </Box>
                </Stack>
              </Paper>
            ))}
          </Box>

          <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1.5, mt: 2 }}>
            {(cursor !== undefined || q || verificationStatus) ? (
              <Link href="/admin/providers" className="inline-flex min-h-11 items-center rounded-lg border border-border px-4 text-sm font-medium text-primary transition-colors duration-150 hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none">
                {t("admin.providers.firstPage")}
              </Link>
            ) : <span />}
            {page.next_cursor !== null && page.next_cursor !== undefined && (
              <Link href={pageHref(page.next_cursor, q, verificationStatus)} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium text-primary transition-colors duration-150 hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none">
                {t("admin.providers.nextPage")}
                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 rotate-180" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
              </Link>
            )}
          </Stack>
        </>
      )}
    </Box>
  );
}

function StatusAndName({ provider }: { provider: AdminProvider }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, minWidth: 0 }}>
      <Typography sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "inherit", fontSize: 14, fontWeight: 700, color: "#172b2a" }}>{provider.display_name}</Typography>
      <VerificationPill status={provider.verification_status} />
    </Box>
  );
}

function VerificationPill({ status }: { status: AdminProvider["verification_status"] }) {
  const tone = statusChips[status];
  return (
    <Box component="span" sx={{ display: "inline-flex", alignItems: "center", px: 1, py: 0.5, borderRadius: 99, color: tone.color, backgroundColor: tone.backgroundColor, fontFamily: "inherit", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
      <Box component="span" aria-hidden="true" sx={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: status === "verified" ? "#17804d" : status === "pending" ? "#e5a000" : "#d92d20" }} />
      {t(statusLabels[status])}
    </Box>
  );
}

function EmptyProvidersState() {
  return (
    <Paper elevation={0} sx={{ mt: 3, p: { xs: 4, sm: 7 }, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 1.5, border: "1px solid #dce7e4", borderRadius: 3, backgroundColor: "#fff" }}>
      <Box aria-hidden="true" sx={{ width: 56, height: 56, display: "grid", placeItems: "center", borderRadius: "50%", backgroundColor: "#f4f8f7", color: "#617472" }}>
        <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="3.4" /><path d="M5 19a7 7 0 0 1 14 0" /><path d="M3 3l18 18" strokeDasharray="2 2.5" /></svg>
      </Box>
      <Typography component="h2" sx={{ fontFamily: "inherit", fontSize: 18, fontWeight: 700, color: "#172b2a" }}>{t("admin.providers.emptyTitle")}</Typography>
      <Typography sx={{ fontFamily: "inherit", fontSize: 14, color: "#617472" }}>{t("admin.providers.emptyText")}</Typography>
      <Link href="/admin/providers" className="mt-1 inline-flex min-h-11 items-center rounded-lg px-4 text-sm font-semibold text-primary transition-colors duration-150 hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none">
        {t("admin.users.clearFilters")}
      </Link>
    </Paper>
  );
}

function MissingValue() {
  return <Typography component="span" sx={{ fontFamily: "inherit", color: "#7a8b89" }}>—</Typography>;
}

const statusOptions = [
  { value: "pending", label: t("admin.providers.status.pending") },
  { value: "verified", label: t("admin.providers.status.verified") },
  { value: "rejected", label: t("admin.providers.status.rejected") },
] as const;

function parseStatus(value: string | undefined): AdminProviderVerificationStatus | undefined {
  return value === "pending" || value === "verified" || value === "rejected" ? value : undefined;
}

function pageHref(cursor: number, q: string, status: AdminProviderVerificationStatus | undefined): string {
  const query = new URLSearchParams({ cursor: String(cursor) });
  if (q) query.set("q", q);
  if (status) query.set("verification_status", status);
  return `/admin/providers?${query.toString()}`;
}

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

const headCellSx = { position: "sticky", top: 0, zIndex: 1, backgroundColor: "#f3f6f5", fontFamily: "inherit", fontSize: 12, fontWeight: 700, color: "#526764", whiteSpace: "nowrap", textAlign: "start" as const };
const bodyCellSx = { fontFamily: "inherit", fontSize: 13, color: "#172b2a", textAlign: "start" as const };
const mobileLabelSx = { mb: 0.5, fontFamily: "inherit", fontSize: 11, fontWeight: 600, color: "#617472" };
const mobileValueSx = { overflow: "hidden", textOverflow: "ellipsis", fontFamily: "inherit", fontSize: 13, color: "#172b2a" };
