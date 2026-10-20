import { t } from "@/config/messages.fa";
import { ApiError } from "@/lib/api/problem";

import { InvalidCredentialsError } from "./types";

export type LoginErrorState = {
  errors: { form: string };
};

export function loginErrorState(error: unknown): LoginErrorState {
  if (error instanceof InvalidCredentialsError) {
    return { errors: { form: t("auth.invalidCredentials") } };
  }
  if (error instanceof ApiError) {
    if (error.status === 400 || error.status === 401) {
      return { errors: { form: t("auth.invalidCredentials") } };
    }
    if (error.code === "rate_limited" || error.status === 429) {
      return { errors: { form: t("auth.rateLimited") } };
    }
    if (error.code === "upstream_unreachable" || error.status === 503) {
      return { errors: { form: t("auth.unavailable") } };
    }
  }
  return { errors: { form: t("auth.genericError") } };
}
