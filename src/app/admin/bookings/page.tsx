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

import { AdminBookingActions } from "@/components/admin/AdminBookingActions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { t, type MessageKey } from "@/config/messages.fa";
import { getAdminBookings, type AdminBookingStatus } from "@/lib/api/admin";
import type { AdminBooking } from "@/lib/api/types";
import { redirectOnUnauthorized, requireRole } from "@/lib/auth/session";
import { numberFormatFa } from "@/lib/format/digits";
import { formatTomanFromRial } from "@/lib/format/money";

export const metadata: Metadata = {
  title: `${t("admin.bookings.title")} | ${t("brand.name")}`,
  robots: { index: false, follow: false },
};

const statusLabels: Record<AdminBooking["status"], MessageKey> = {
  pending_payment: "dashboard.bookings.status.pending_payment",
  confirmed: "dashboard.bookings.status.confirmed",
  in_progress: "dashboard.bookings.status.in_progress",
  completion_pending: "dashboard.bookings.status.completion_pending",
  disputed: "dashboard.bookings.status.disputed",
  completed: "dashboard.bookings.status.completed",
  cancelled: "dashboard.bookings.status.cancelled",
  expired: "dashboard.bookings.status.expired",
};

const statusChips: Record<AdminBooking["status"], { color: string; backgroundColor: string }> = {
  pending_payment: { color: "#8a5b00", backgroundColor: "#fdf4e3" },
  confirmed: { color: "#17608a", backgroundColor: "#e7f2fa" },
  in_progress: { color: "#17608a", backgroundColor: "#e7f2fa" },
  completion_pending: { color: "#6741a5", backgroundColor: "#f0eafa" },
  disputed: { color: "#8a3b00", backgroundColor: "#ffeee6" },
  completed: { color: "#157347", backgroundColor: "#e9f6ef" },
  cancelled: { color: "#657371", backgroundColor: "#f1f3f3" },
  expired: { color: "#657371", backgroundColor: "#f1f3f3" },
};

const dateFormatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian-nu-arabext", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Tehran",
});

const statusValues = Object.keys(statusLabels) as AdminBookingStatus[];

const statusOptions = statusValues.map((status) => ({ value: status, label: t(statusLabels[status]) }));

type AdminBookingsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminBookingsPage({ searchParams }: AdminBookingsPageProps) {
  await requireRole("admin");
  const params = await searchParams;
  const rawCursor = firstValue(params.cursor);
  const cursor = rawCursor === undefined ? undefined : Number(rawCursor);
  const q = firstValue(params.q)?.trim().slice(0, 100) ?? "";
  const status = parseStatus(firstValue(params.status));
  const refundable = firstValue(params.refundable) === "true";

  let page;
  try {
    page = await getAdminBookings({ cursor, q, status, refundable, limit: 50 });
  } catch (error) {
    redirectOnUnauthorized(error);
    throw error;
  }

  return (
    <Box component="main" dir="rtl" sx={{ width: "100%", maxWidth: 1200, flex: 1, mx: "auto", px: { xs: 2, sm: 3 }, py: { xs: 3, md: 4 } }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ justifyContent: "space-between", alignItems: { xs: "stretch", sm: "center" } }}>
        <Box>
          <Typography component="h1" sx={{ fontFamily: "inherit", fontSize: { xs: 22, md: 24 }, fontWeight: 800, lineHeight: 1.6, color: "#172b2a" }}>
            {t("admin.bookings.title")}
          </Typography>
          <Typography sx={{ mt: 0.5, fontFamily: "inherit", fontSize: 14, lineHeight: 1.7, color: "#617472" }}>
            {t("admin.bookings.subtitle")}
          </Typography>
        </Box>
        <Chip
          label={`${numberFormatFa(page.items.length)} ${t("admin.bookings.resultCount")}`}
          sx={{ alignSelf: { xs: "flex-start", sm: "center" }, fontFamily: "inherit", fontSize: 12, fontWeight: 700, color: "#0f665f", backgroundColor: "#e6f4f1", borderRadius: 2 }}
        />
      </Stack>

      <Paper
        component="form"
        method="get"
        action="/admin/bookings"
        elevation={0}
        sx={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", "@media (min-width:768px)": { gridTemplateColumns: "minmax(0, 1fr) 220px 200px auto" }, gap: 1.5, alignItems: "center", mt: 3, p: { xs: 1.5, sm: 2 }, border: "1px solid #dce7e4", borderRadius: 3, backgroundColor: "#fff" }}
      >
        <Input
          id="admin-booking-query"
          name="q"
          type="search"
          label={t("admin.bookings.searchLabel")}
          placeholder={t("admin.bookings.searchPlaceholder")}
          defaultValue={q}
          compact
          reserveHelperText={false}
        />
        <Select
          id="admin-booking-status"
          name="status"
          label={t("admin.bookings.filterStatus")}
          placeholder={t("admin.bookings.allStatuses")}
          options={statusOptions}
          defaultValue={status ?? ""}
          compact
          reserveHelperText={false}
        />
        <label className="flex min-h-11 items-center gap-2 rounded-lg px-1 text-sm font-medium text-text">
          <input type="checkbox" name="refundable" value="true" defaultChecked={refundable} className="size-4 accent-teal-700" />
          {t("admin.bookings.refundableOnly")}
        </label>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
          <Button type="submit" variant="primary" className="min-h-11">{t("admin.users.filterSubmit")}</Button>
          <Link href="/admin/bookings" className="inline-flex min-h-11 items-center justify-center rounded-lg px-3 text-sm font-semibold text-text-muted transition-colors duration-150 hover:bg-surface hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none">
            {t("admin.users.clearFilter")}
          </Link>
        </Stack>
      </Paper>

      {page.items.length === 0 ? (
        <EmptyBookingsState />
      ) : (
        <>
          <TableContainer
            component={Paper}
            role="region"
            aria-label={t("admin.bookings.title")}
            tabIndex={0}
            elevation={0}
            sx={{ display: "none", "@media (min-width:768px)": { display: "block" }, mt: 3, maxHeight: "min(70vh, 680px)", overflow: "auto", border: "1px solid #dce7e4", borderRadius: 3, boxShadow: "0 3px 14px rgba(23, 43, 42, 0.05)", "&:focus-visible": { outline: "2px solid #0f766e", outlineOffset: 2 } }}
          >
            <Table stickyHeader aria-label={t("admin.bookings.title")} sx={{ minWidth: 1020, tableLayout: "fixed", "& .MuiTableCell-root": { verticalAlign: "middle", borderColor: "#e8efed", height: 64 } }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ ...headCellSx, width: "18%" }}>{t("admin.bookings.service")}</TableCell>
                  <TableCell sx={{ ...headCellSx, width: "16%" }}>{t("admin.bookings.client")}</TableCell>
                  <TableCell sx={{ ...headCellSx, width: "14%" }}>{t("admin.bookings.provider")}</TableCell>
                  <TableCell sx={{ ...headCellSx, width: "12%" }}>{t("admin.bookings.amount")}</TableCell>
                  <TableCell sx={{ ...headCellSx, width: "14%" }}>{t("admin.bookings.time")}</TableCell>
                  <TableCell sx={{ ...headCellSx, width: "13%" }}>{t("admin.bookings.status")}</TableCell>
                  <TableCell sx={{ ...headCellSx, width: "13%" }}>{t("admin.payouts.action")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {page.items.map((booking) => (
                  <TableRow key={booking.id} hover sx={{ transition: "background-color 150ms", "&:hover": { backgroundColor: "#f7faf9" }, "@media (prefers-reduced-motion: reduce)": { transition: "none" } }}>
                    <TableCell sx={bodyCellSx}>
                      <BookingServiceCell booking={booking} />
                    </TableCell>
                    <TableCell sx={bodyCellSx}>
                      <Typography dir="ltr" title={booking.client_email} sx={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "start", fontFamily: "inherit", fontSize: 13, color: "#172b2a" }}>
                        {booking.client_email}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ ...bodyCellSx, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{booking.provider_display_name}</TableCell>
                    <TableCell sx={{ ...bodyCellSx, whiteSpace: "nowrap" }}>{formatTomanFromRial(booking.price_irr)}</TableCell>
                    <TableCell sx={{ ...bodyCellSx, whiteSpace: "nowrap" }}>{dateFormatter.format(new Date(booking.starts_at))}</TableCell>
                    <TableCell sx={bodyCellSx}><BookingStatusPill status={booking.status} /></TableCell>
                    <TableCell sx={bodyCellSx}><AdminBookingActions booking={booking} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box component="ul" aria-label={t("admin.bookings.title")} sx={{ display: "grid", "@media (min-width:768px)": { display: "none" }, gridTemplateColumns: "minmax(0, 1fr)", gap: 1.5, listStyle: "none", p: 0, m: 0, mt: 2 }}>
            {page.items.map((booking) => (
              <Paper component="li" key={booking.id} elevation={0} sx={{ minWidth: 0, p: 2, border: "1px solid #dce7e4", borderRadius: 3, boxShadow: "0 2px 10px rgba(23, 43, 42, 0.04)" }}>
                <Stack spacing={1.5}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, minWidth: 0 }}>
                    <Typography sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "inherit", fontSize: 14, fontWeight: 700, color: "#172b2a" }}>{booking.service_name}</Typography>
                    <BookingStatusPill status={booking.status} />
                  </Box>
                  <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 1.5 }}>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={mobileLabelSx}>{t("admin.bookings.client")}</Typography>
                      <Typography dir="ltr" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "start", fontFamily: "inherit", fontSize: 13, color: "#172b2a" }}>{booking.client_email}</Typography>
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={mobileLabelSx}>{t("admin.bookings.provider")}</Typography>
                      <Typography sx={mobileValueSx}>{booking.provider_display_name}</Typography>
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={mobileLabelSx}>{t("admin.bookings.amount")}</Typography>
                      <Typography sx={mobileValueSx}>{formatTomanFromRial(booking.price_irr)}</Typography>
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={mobileLabelSx}>{t("admin.bookings.time")}</Typography>
                      <Typography sx={mobileValueSx}>{dateFormatter.format(new Date(booking.starts_at))}</Typography>
                    </Box>
                  </Box>
                  {(booking.refundable || booking.has_open_dispute) && (
                    <Box sx={{ pt: 1.25, borderTop: "1px solid #e8efed" }}>
                      <AdminBookingActions booking={booking} />
                    </Box>
                  )}
                </Stack>
              </Paper>
            ))}
          </Box>

          <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1.5, mt: 2 }}>
            {(cursor !== undefined || q || status || refundable) ? (
              <Link href="/admin/bookings" className="inline-flex min-h-11 items-center rounded-lg border border-border px-4 text-sm font-medium text-primary transition-colors duration-150 hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none">
                {t("admin.bookings.firstPage")}
              </Link>
            ) : <span />}
            {page.next_cursor !== null && page.next_cursor !== undefined && (
              <Link href={pageHref(page.next_cursor, q, status, refundable)} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium text-primary transition-colors duration-150 hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none">
                {t("admin.bookings.nextPage")}
                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 rotate-180" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
              </Link>
            )}
          </Stack>
        </>
      )}
    </Box>
  );
}

function BookingServiceCell({ booking }: { booking: AdminBooking }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "inherit", fontSize: 13, fontWeight: 600, color: "#172b2a" }}>{booking.service_name}</Typography>
      {booking.has_open_dispute && (
        <Chip
          size="small"
          label={t("admin.bookings.openDispute")}
          sx={{ mt: 0.5, fontFamily: "inherit", fontSize: 11, fontWeight: 600, color: "#8a3b00", backgroundColor: "#ffeee6", borderRadius: 1.5 }}
        />
      )}
    </Box>
  );
}

function BookingStatusPill({ status }: { status: AdminBooking["status"] }) {
  const tone = statusChips[status];
  return (
    <Box component="span" sx={{ display: "inline-flex", alignItems: "center", px: 1, py: 0.5, borderRadius: 99, color: tone.color, backgroundColor: tone.backgroundColor, fontFamily: "inherit", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
      <Box component="span" aria-hidden="true" sx={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: status === "completed" ? "#17804d" : status === "disputed" ? "#d94f00" : status === "cancelled" || status === "expired" ? "#8a9694" : "#3f7ea6" }} />
      {t(statusLabels[status])}
    </Box>
  );
}

function EmptyBookingsState() {
  return (
    <Paper elevation={0} sx={{ mt: 3, p: { xs: 4, sm: 7 }, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 1.5, border: "1px solid #dce7e4", borderRadius: 3, backgroundColor: "#fff" }}>
      <Box aria-hidden="true" sx={{ width: 56, height: 56, display: "grid", placeItems: "center", borderRadius: "50%", backgroundColor: "#f4f8f7", color: "#617472" }}>
        <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M8 3v4m8-4v4M4 10h16" /><path d="M3 3l18 16" strokeDasharray="2 2.5" /></svg>
      </Box>
      <Typography component="h2" sx={{ fontFamily: "inherit", fontSize: 18, fontWeight: 700, color: "#172b2a" }}>{t("admin.bookings.emptyTitle")}</Typography>
      <Typography sx={{ fontFamily: "inherit", fontSize: 14, color: "#617472" }}>{t("admin.bookings.emptyText")}</Typography>
      <Link href="/admin/bookings" className="mt-1 inline-flex min-h-11 items-center rounded-lg px-4 text-sm font-semibold text-primary transition-colors duration-150 hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none">
        {t("admin.users.clearFilters")}
      </Link>
    </Paper>
  );
}

function parseStatus(value: string | undefined): AdminBookingStatus | undefined {
  return statusValues.includes(value as AdminBookingStatus) ? (value as AdminBookingStatus) : undefined;
}

function pageHref(cursor: number, q: string, status: AdminBookingStatus | undefined, refundable: boolean): string {
  const query = new URLSearchParams({ cursor: String(cursor) });
  if (q) query.set("q", q);
  if (status) query.set("status", status);
  if (refundable) query.set("refundable", "true");
  return `/admin/bookings?${query.toString()}`;
}

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

const headCellSx = { position: "sticky", top: 0, zIndex: 1, backgroundColor: "#f3f6f5", fontFamily: "inherit", fontSize: 12, fontWeight: 700, color: "#526764", whiteSpace: "nowrap", textAlign: "start" as const };
const bodyCellSx = { fontFamily: "inherit", fontSize: 13, color: "#172b2a", textAlign: "start" as const };
const mobileLabelSx = { mb: 0.5, fontFamily: "inherit", fontSize: 11, fontWeight: 600, color: "#617472" };
const mobileValueSx = { overflow: "hidden", textOverflow: "ellipsis", fontFamily: "inherit", fontSize: 13, color: "#172b2a" };
