import { apiFetch } from "./client";
import type {
  AdminBookingPage,
  AdminProviderPage,
  AdminPayoutPage,
  AdminUser,
  AdminUserPage,
} from "./types";

export type AdminRole = "provider" | "admin";
export type AdminUserFilterRole = "client" | AdminRole;
export type AdminProviderVerificationStatus = "pending" | "verified" | "rejected";
export type AdminBookingStatus =
  | "pending_payment"
  | "confirmed"
  | "in_progress"
  | "completion_pending"
  | "disputed"
  | "completed"
  | "cancelled"
  | "expired";
export type AdminPayoutStatus = "requested" | "approved" | "processing" | "paid" | "rejected" | "failed";

export type AdminUserQuery = {
  cursor?: number;
  q?: string;
  role?: AdminUserFilterRole;
  limit?: number;
};

export function getAdminUsers({ cursor, q, role, limit = 50 }: AdminUserQuery = {}): Promise<AdminUserPage> {
  const query = new URLSearchParams({ limit: String(limit) });
  if (cursor !== undefined) query.set("cursor", String(cursor));
  if (q) query.set("q", q);
  if (role) query.set("role", role);
  return apiFetch<AdminUserPage>("/api/v1/admin/users", {
    auth: true,
    cache: "no-store",
    query,
  });
}

export type AdminProviderQuery = {
  cursor?: number;
  verificationStatus?: AdminProviderVerificationStatus;
  q?: string;
  limit?: number;
};

export function getAdminProviders({
  cursor,
  verificationStatus,
  q,
  limit = 50,
}: AdminProviderQuery = {}): Promise<AdminProviderPage> {
  const query = new URLSearchParams({ limit: String(limit) });
  if (cursor !== undefined) query.set("cursor", String(cursor));
  if (verificationStatus) query.set("verification_status", verificationStatus);
  if (q) query.set("q", q);
  return apiFetch<AdminProviderPage>("/api/v1/admin/providers", {
    auth: true,
    cache: "no-store",
    query,
  });
}

export type AdminBookingQuery = {
  cursor?: number;
  status?: AdminBookingStatus;
  q?: string;
  refundable?: boolean;
  limit?: number;
};

export function getAdminBookings({
  cursor,
  status,
  q,
  refundable,
  limit = 50,
}: AdminBookingQuery = {}): Promise<AdminBookingPage> {
  const query = new URLSearchParams({ limit: String(limit) });
  if (cursor !== undefined) query.set("cursor", String(cursor));
  if (status) query.set("status", status);
  if (q) query.set("q", q);
  if (refundable) query.set("refundable", "true");
  return apiFetch<AdminBookingPage>("/api/v1/admin/bookings", {
    auth: true,
    cache: "no-store",
    query,
  });
}

export type AdminPayoutQuery = {
  cursor?: number;
  status?: AdminPayoutStatus;
  limit?: number;
};

export function getAdminPayouts({ cursor, status, limit = 50 }: AdminPayoutQuery = {}): Promise<AdminPayoutPage> {
  const query = new URLSearchParams({ limit: String(limit) });
  if (cursor !== undefined) query.set("cursor", String(cursor));
  if (status) query.set("status", status);
  return apiFetch<AdminPayoutPage>("/api/v1/admin/payouts", {
    auth: true,
    cache: "no-store",
    query,
  });
}

export function setAdminUserRole(userId: number, role: AdminRole, granted: boolean): Promise<AdminUser> {
  return apiFetch<AdminUser>(`/api/v1/admin/users/${userId}/roles/${role}`, {
    method: "PUT",
    body: { granted },
    auth: true,
    cache: "no-store",
  });
}
