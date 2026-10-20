import "server-only";

import { apiFetch, apiFetchWithStatus } from "./client";
import type { AuthRegisterInput, OperationResult, User } from "./types";

export function registerUser(input: AuthRegisterInput): Promise<{ data: OperationResult; status: number }> {
  return apiFetchWithStatus<OperationResult>("/api/v1/auth/register", {
    method: "POST",
    body: input,
    cache: "no-store",
  });
}

export function getCurrentUser(): Promise<User> {
  return apiFetch<User>("/api/v1/me", { auth: true, cache: "no-store" });
}
