"use server";

import { z } from "zod";

import { env } from "@/config/env";
import { t } from "@/config/messages.fa";
import { registerUser } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/problem";
import { toAsciiDigits } from "@/lib/format/digits";

import { loginErrorState } from "./login-errors";
import { getAuthProvider } from "./provider";
import { sanitizeNextPath } from "./redirect";
import { parseRegisterForm, registerErrorState, type RegisterState } from "./register";
import { clearSessionCookies, getRefreshToken, setSessionCookies } from "./session";
import type { LoginInput } from "./types";

export type LoginState = {
  errors?: {
    email?: string;
    password?: string;
    phone?: string;
    code?: string;
    form?: string;
  };
  message?: string;
  success?: boolean;
  redirectTo?: string;
};

export type LogoutState = {
  message?: string;
  success?: boolean;
};

const realLoginSchema = z.object({
  email: z.email({ error: t("auth.email.invalid") }),
  password: z.string().min(8, { error: t("auth.password.invalid") }),
});

const mockLoginSchema = z.object({
  phone: z
    .string()
    .min(1, { error: t("validation.required") })
    .regex(/^09\d{9}$/, { error: t("auth.phone.invalid") }),
  code: z
    .string()
    .min(1, { error: t("validation.required") })
    .regex(/^\d{6}$/, { error: t("auth.code.invalid") }),
});

function readField(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function readPassword(formData: FormData): string {
  const value = formData.get("password");
  return typeof value === "string" ? value : "";
}

function parseLogin(formData: FormData): { input: LoginInput } | { errors: LoginState["errors"] } {
  if (env.AUTH_PROVIDER === "real") {
    const parsed = realLoginSchema.safeParse({
      email: readField(formData, "email"),
      password: readPassword(formData),
    });
    if (!parsed.success) {
      const { fieldErrors } = z.flattenError(parsed.error);
      return { errors: { email: fieldErrors.email?.[0], password: fieldErrors.password?.[0] } };
    }
    return { input: parsed.data };
  }

  const parsed = mockLoginSchema.safeParse({
    phone: toAsciiDigits(readField(formData, "phone")),
    code: toAsciiDigits(readField(formData, "code")),
  });
  if (!parsed.success) {
    const { fieldErrors } = z.flattenError(parsed.error);
    return { errors: { phone: fieldErrors.phone?.[0], code: fieldErrors.code?.[0] } };
  }
  return { input: parsed.data };
}

export async function loginAction(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = parseLogin(formData);
  if ("errors" in parsed) {
    return { errors: parsed.errors };
  }

  let result;
  try {
    result = await getAuthProvider().login(parsed.input);
  } catch (error) {
    return loginErrorState(error);
  }

  await setSessionCookies(result);
  return {
    message: t("auth.login.success"),
    success: true,
    redirectTo: sanitizeNextPath(readField(formData, "next")),
  };
}

export async function registerAction(
  _previous: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const parsed = parseRegisterForm(formData);
  if ("errors" in parsed) {
    return { errors: parsed.errors };
  }

  try {
    await registerUser(parsed.input);
  } catch (error) {
    if (error instanceof ApiError) {
      return registerErrorState(error);
    }
    return { errors: { form: t("auth.register.invalid") } };
  }

  const next = sanitizeNextPath(readField(formData, "next"));
  const query = new URLSearchParams();
  if (next !== "/") query.set("next", next);
  const queryString = query.toString();
  const suffix = queryString ? `?${queryString}` : "";

  return {
    message: t("auth.register.success"),
    success: true,
    redirectTo: `/login${suffix}`,
  };
}

export async function logoutAction(): Promise<LogoutState> {
  const refreshToken = await getRefreshToken();
  try {
    await getAuthProvider().logout(refreshToken);
  } finally {
    await clearSessionCookies();
  }
  return { message: t("auth.logout.success"), success: true };
}
