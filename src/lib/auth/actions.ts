"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { t } from "@/config/messages.fa";
import { toAsciiDigits } from "@/lib/format/digits";

import { getAuthProvider } from "./provider";
import { sanitizeNextPath } from "./redirect";
import { clearSessionCookie, getSessionToken, setSessionCookie } from "./session";
import { InvalidCredentialsError, type LoginResult } from "./types";

export type LoginState = {
  errors?: { phone?: string; code?: string; form?: string };
};

const loginSchema = z.object({
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

export async function loginAction(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    phone: toAsciiDigits(readField(formData, "phone")),
    code: toAsciiDigits(readField(formData, "code")),
  });
  if (!parsed.success) {
    const { fieldErrors } = z.flattenError(parsed.error);
    return { errors: { phone: fieldErrors.phone?.[0], code: fieldErrors.code?.[0] } };
  }

  let result: LoginResult;
  try {
    result = await getAuthProvider().login(parsed.data);
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return { errors: { form: t("auth.invalidCredentials") } };
    }
    throw error;
  }

  await setSessionCookie(result.token, result.expiresAt);
  redirect(sanitizeNextPath(readField(formData, "next")));
}

export async function logoutAction(): Promise<void> {
  const token = await getSessionToken();
  if (token) {
    await getAuthProvider().logout(token);
  }
  await clearSessionCookie();
  redirect("/");
}
