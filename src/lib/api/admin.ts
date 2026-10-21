import { apiFetch } from "./client";
import type { AdminUser, AdminUserPage } from "./types";

export type AdminRole = "provider" | "admin";
export type AdminUserFilterRole = "client" | AdminRole;

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

export function setAdminUserRole(userId: number, role: AdminRole, granted: boolean): Promise<AdminUser> {
  return apiFetch<AdminUser>(`/api/v1/admin/users/${userId}/roles/${role}`, {
    method: "PUT",
    body: { granted },
    auth: true,
    cache: "no-store",
  });
}
