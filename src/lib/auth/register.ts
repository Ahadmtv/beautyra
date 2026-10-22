import { z } from "zod";

import { t } from "@/config/messages.fa";
import type { AuthRegisterInput } from "@/lib/api/types";
import { ApiError } from "@/lib/api/problem";
import { toAsciiDigits } from "@/lib/format/digits";

export type RegisterState = {
  errors?: {
    email?: string;
    phone?: string;
    password?: string;
    form?: string;
  };
  message?: string;
  success?: boolean;
  redirectTo?: string;
};

export const registerSchema = z.object({
  email: z.email({ error: t("auth.email.invalid") }).max(254, { error: t("auth.email.invalid") }),
  phone: z.string().optional(),
  password: z.string().min(8, { error: t("auth.password.invalid") }),
});

function readField(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function readPassword(formData: FormData): string {
  const value = formData.get("password");
  return typeof value === "string" ? value : "";
}

export function parseRegisterForm(
  formData: FormData,
): { input: AuthRegisterInput } | { errors: RegisterState["errors"] } {
  const phone = toAsciiDigits(readField(formData, "phone"));
  const parsed = registerSchema.safeParse({
    email: readField(formData, "email"),
    phone,
    password: readPassword(formData),
  });
  if (!parsed.success) {
    const { fieldErrors } = z.flattenError(parsed.error);
    return {
      errors: {
        email: fieldErrors.email?.[0],
        phone: fieldErrors.phone?.[0],
        password: fieldErrors.password?.[0],
      },
    };
  }

  return {
    input: {
      email: parsed.data.email,
      password: parsed.data.password,
      ...(parsed.data.phone ? { phone: parsed.data.phone } : {}),
    },
  };
}

const fieldNames = new Set(["email", "phone", "password"]);

export function registerErrorState(error: ApiError): RegisterState {
  const errors: NonNullable<RegisterState["errors"]> = {};
  for (const item of error.fieldErrors) {
    if (fieldNames.has(item.field) && !errors[item.field as keyof typeof errors]) {
      errors[item.field as keyof typeof errors] =
        item.code === "required" ? t("validation.required") : t("api.field.invalid");
    }
  }
  if (errors.email || errors.phone || errors.password) {
    return { errors };
  }

  switch (error.code) {
    case "invalid_email":
      return { errors: { email: t("auth.email.invalid") } };
    case "invalid_password":
      return { errors: { password: t("auth.password.invalid") } };
    case "invalid_credentials":
      return { errors: { form: t("auth.register.existsOrInvalid") } };
    case "rate_limited":
      return { errors: { form: t("auth.register.rateLimited") } };
    case "upstream_unreachable":
      return { errors: { form: t("auth.register.unavailable") } };
    default:
      return { errors: { form: t("auth.register.invalid") } };
  }
}
