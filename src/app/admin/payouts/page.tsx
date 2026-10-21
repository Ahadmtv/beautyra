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

import { AdminPayoutActions } from "@/components/admin/AdminPayoutActions";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { t, type MessageKey } from "@/config/messages.fa";
import { getAdminPayouts, type AdminPayoutStatus } from "@/lib/api/admin";
import type { AdminPayout } from "@/lib/api/types";
import { redirectOnUnauthorized, requireRole } from "@/lib/auth/session";
import { numberFormatFa } from "@/lib/format/digits";
import { formatTomanFromRial } from "@/lib/format/money";

export const metadata: Metadata = {
  title: `${t("admin.payouts.title")} | ${t("brand.name")}`,
  robots: { index: false, follow: false },
};

const statusLabels: Record<AdminPayout["status"], MessageKey> = {
  requested: "admin.payouts.status.requested",
  approved: "admin.payouts.status.approved",
  processing: "admin.payouts.status.processing",
  paid: "admin.payouts.status.paid",
  rejected: "admin.payouts.status.rejected",
  failed: "admin.payouts.status.failed",
};

const statusChips: Record<AdminPayout["status"], { color: string; backgroundColor: string }> = {
  requested: { color: "#8a5b00", backgroundColor: "#fdf4e3" },
  approved: { color: "#17608a", backgroundColor: "#e7f2fa" },
  processing: { color: "#6741a5", backgroundColor: "#f0eafa" },
  paid: { color: "#157347", backgroundColor: "#e9f6ef" },
  rejected: { color: "#657371", backgroundColor: "#f1f3f3" },
  failed: { color: "#b42318", backgroundColor: "#fff1f0" },
};

const dateFormatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian-nu-arabext", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Tehran",
});

const statusValues = Object.keys(statusLabels) as AdminPayoutStatus[];

const statusOptions = statusValues.map((status) => ({ value: status, label: t(statusLabels[status]) }));

type AdminPayoutsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminPayoutsPage({ searchParams }: AdminPayoutsPageProps) {
  await requireRole("admin");
  const params = await searchParams;
  const rawCursor = firstValue(params.cursor);
  const cursor = rawCursor === undefined ? undefined : Number(rawCursor);
  const status = parseStatus(firstValue(params.status));

  let page;
  try {
    page = await getAdminPayouts({ cursor, status, limit: 50 });
  } catch (error) {
    redirectOnUnauthorized(error);
    throw error;
  }

  return (
    <Box component="main" dir="rtl" sx={{ width: "100%", maxWidth: 1200, flex: 1, mx: "auto", px: { xs: 2, sm: 3 }, py: { xs: 3, md: 4 } }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ justifyContent: "space-between", alignItems: { xs: "stretch", sm: "center" } }}>
        <Box>
          <Typography component="h1" sx={{ fontFamily: "inherit", fontSize: { xs: 22, md: 24 }, fontWeight: 800, lineHeight: 1.6, color: "#172b2a" }}>
            {t("admin.payouts.title")}
          </Typography>
          <Typography sx={{ mt: 0.5, fontFamily: "inherit", fontSize: 14, lineHeight: 1.7, color: "#617472" }}>
            {t("admin.payouts.subtitle")}
          </Typography>
        </Box>
        <Chip
          label={`${numberFormatFa(page.items.length)} ${t("admin.payouts.resultCount")}`}
          sx={{ alignSelf: { xs: "flex-start", sm: "center" }, fontFamily: "inherit", fontSize: 12, fontWeight: 700, color: "#0f665f", backgroundColor: "#e6f4f1", borderRadius: 2 }}
        />
      </Stack>

      <Paper
        component="form"
        method="get"
        action="/admin/payouts"
        elevation={0}
        sx={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", "@media (min-width:768px)": { gridTemplateColumns: "240px auto" }, gap: 1.5, alignItems: "center", mt: 3, p: { xs: 1.5, sm: 2 }, border: "1px solid #dce7e4", borderRadius: 3, backgroundColor: "#fff" }}
      >
        <Select
          id="admin-payout-status"
          name="status"
          label={t("admin.payouts.filterStatus")}
          placeholder={t("admin.payouts.allStatuses")}
          options={statusOptions}
          defaultValue={status ?? ""}
          compact
          reserveHelperText={false}
        />
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
          <Button type="submit" variant="primary" className="min-h-11">{t("admin.users.filterSubmit")}</Button>
          <Link href="/admin/payouts" className="inline-flex min-h-11 items-center justify-center rounded-lg px-3 text-sm font-semibold text-text-muted transition-colors duration-150 hover:bg-surface hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none">
            {t("admin.users.clearFilter")}
          </Link>
        </Stack>
      </Paper>

      {page.items.length === 0 ? (
        <EmptyPayoutsState />
      ) : (
        <>
          <TableContainer
            component={Paper}
            role="region"
            aria-label={t("admin.payouts.title")}
            tabIndex={0}
            elevation={0}
            sx={{ display: "none", "@media (min-width:768px)": { display: "block" }, mt: 3, maxHeight: "min(70vh, 680px)", overflow: "auto", border: "1px solid #dce7e4", borderRadius: 3, boxShadow: "0 3px 14px rgba(23, 43, 42, 0.05)", "&:focus-visible": { outline: "2px solid #0f766e", outlineOffset: 2 } }}
          >
            <Table stickyHeader aria-label={t("admin.payouts.title")} sx={{ minWidth: 860, tableLayout: "fixed", "& .MuiTableCell-root": { verticalAlign: "middle", borderColor: "#e8efed", height: 64 } }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ ...headCellSx, width: "22%" }}>{t("admin.payouts.provider")}</TableCell>
                  <TableCell sx={{ ...headCellSx, width: "16%" }}>{t("admin.payouts.amount")}</TableCell>
                  <TableCell sx={{ ...headCellSx, width: "18%" }}>{t("admin.payouts.date")}</TableCell>
                  <TableCell sx={{ ...headCellSx, width: "18%" }}>{t("admin.bookings.status")}</TableCell>
                  <TableCell sx={{ ...headCellSx, width: "26%" }}>{t("admin.payouts.action")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {page.items.map((payout) => (
                  <TableRow key={payout.id} hover sx={{ transition: "background-color 150ms", "&:hover": { backgroundColor: "#f7faf9" }, "@media (prefers-reduced-motion: reduce)": { transition: "none" } }}>
                    <TableCell sx={bodyCellSx}>
                      <PayoutProviderCell payout={payout} />
                    </TableCell>
                    <TableCell sx={{ ...bodyCellSx, whiteSpace: "nowrap" }}>{formatTomanFromRial(payout.amount_irr)}</TableCell>
                    <TableCell sx={{ ...bodyCellSx, whiteSpace: "nowrap" }}>{dateFormatter.format(new Date(payout.created_at))}</TableCell>
                    <TableCell sx={bodyCellSx}><PayoutStatusPill status={payout.status} /></TableCell>
                    <TableCell sx={bodyCellSx}><AdminPayoutActions payout={payout} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box component="ul" aria-label={t("admin.payouts.title")} sx={{ display: "grid", "@media (min-width:768px)": { display: "none" }, gridTemplateColumns: "minmax(0, 1fr)", gap: 1.5, listStyle: "none", p: 0, m: 0, mt: 2 }}>
            {page.items.map((payout) => (
              <Paper component="li" key={payout.id} elevation={0} sx={{ minWidth: 0, p: 2, border: "1px solid #dce7e4", borderRadius: 3, boxShadow: "0 2px 10px rgba(23, 43, 42, 0.04)" }}>
                <Stack spacing={1.5}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, minWidth: 0 }}>
                    <Typography sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "inherit", fontSize: 14, fontWeight: 700, color: "#172b2a" }}>{payout.provider_display_name}</Typography>
                    <PayoutStatusPill status={payout.status} />
                  </Box>
                  <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 1.5 }}>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={mobileLabelSx}>{t("admin.payouts.amount")}</Typography>
                      <Typography sx={mobileValueSx}>{formatTomanFromRial(payout.amount_irr)}</Typography>
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={mobileLabelSx}>{t("admin.payouts.date")}</Typography>
                      <Typography sx={mobileValueSx}>{dateFormatter.format(new Date(payout.created_at))}</Typography>
                    </Box>
                  </Box>
                  {payout.admin_note && (
                    <Typography sx={{ fontFamily: "inherit", fontSize: 12, color: "#617472", wordBreak: "break-word" }}>{payout.admin_note}</Typography>
                  )}
                  <Box sx={{ pt: 1.25, borderTop: "1px solid #e8efed" }}>
                    <AdminPayoutActions payout={payout} />
                  </Box>
                </Stack>
              </Paper>
            ))}
          </Box>

          <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1.5, mt: 2 }}>
            {(cursor !== undefined || status) ? (
              <Link href="/admin/payouts" className="inline-flex min-h-11 items-center rounded-lg border border-border px-4 text-sm font-medium text-primary transition-colors duration-150 hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none">
                {t("admin.payouts.firstPage")}
              </Link>
            ) : <span />}
            {page.next_cursor !== null && page.next_cursor !== undefined && (
              <Link href={pageHref(page.next_cursor, status)} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium text-primary transition-colors duration-150 hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none">
                {t("admin.payouts.nextPage")}
                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 rotate-180" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
              </Link>
            )}
          </Stack>
        </>
      )}
    </Box>
  );
}

function PayoutProviderCell({ payout }: { payout: AdminPayout }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "inherit", fontSize: 13, fontWeight: 600, color: "#172b2a" }}>{payout.provider_display_name}</Typography>
      <Typography sx={{ fontFamily: "inherit", fontSize: 11, color: "#7a8b89" }}>
        {t("admin.payouts.tracking")}: {numberFormatFa(payout.id)}
      </Typography>
    </Box>
  );
}

function PayoutStatusPill({ status }: { status: AdminPayout["status"] }) {
  const tone = statusChips[status];
  return (
    <Box component="span" sx={{ display: "inline-flex", alignItems: "center", px: 1, py: 0.5, borderRadius: 99, color: tone.color, backgroundColor: tone.backgroundColor, fontFamily: "inherit", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
      <Box component="span" aria-hidden="true" sx={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: status === "paid" ? "#17804d" : status === "failed" ? "#d92d20" : status === "rejected" ? "#8a9694" : "#3f7ea6" }} />
      {t(statusLabels[status])}
    </Box>
  );
}

function EmptyPayoutsState() {
  return (
    <Paper elevation={0} sx={{ mt: 3, p: { xs: 4, sm: 7 }, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 1.5, border: "1px solid #dce7e4", borderRadius: 3, backgroundColor: "#fff" }}>
      <Box aria-hidden="true" sx={{ width: 56, height: 56, display: "grid", placeItems: "center", borderRadius: "50%", backgroundColor: "#f4f8f7", color: "#617472" }}>
        <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18v13H3zM3 10h18m-4 5h1" /><path d="M3 3l18 16" strokeDasharray="2 2.5" /></svg>
      </Box>
      <Typography component="h2" sx={{ fontFamily: "inherit", fontSize: 18, fontWeight: 700, color: "#172b2a" }}>{t("admin.payouts.emptyTitle")}</Typography>
      <Typography sx={{ fontFamily: "inherit", fontSize: 14, color: "#617472" }}>{t("admin.payouts.emptyText")}</Typography>
      <Link href="/admin/payouts" className="mt-1 inline-flex min-h-11 items-center rounded-lg px-4 text-sm font-semibold text-primary transition-colors duration-150 hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none">
        {t("admin.users.clearFilters")}
      </Link>
    </Paper>
  );
}

function parseStatus(value: string | undefined): AdminPayoutStatus | undefined {
  return statusValues.includes(value as AdminPayoutStatus) ? (value as AdminPayoutStatus) : undefined;
}

function pageHref(cursor: number, status: AdminPayoutStatus | undefined): string {
  const query = new URLSearchParams({ cursor: String(cursor) });
  if (status) query.set("status", status);
  return `/admin/payouts?${query.toString()}`;
}

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

const headCellSx = { position: "sticky", top: 0, zIndex: 1, backgroundColor: "#f3f6f5", fontFamily: "inherit", fontSize: 12, fontWeight: 700, color: "#526764", whiteSpace: "nowrap", textAlign: "start" as const };
const bodyCellSx = { fontFamily: "inherit", fontSize: 13, color: "#172b2a", textAlign: "start" as const };
const mobileLabelSx = { mb: 0.5, fontFamily: "inherit", fontSize: 11, fontWeight: 600, color: "#617472" };
const mobileValueSx = { overflow: "hidden", textOverflow: "ellipsis", fontFamily: "inherit", fontSize: 13, color: "#172b2a" };
