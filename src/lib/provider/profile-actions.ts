"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";

import { t } from "@/config/messages.fa";
import { saveProviderProfile } from "@/lib/api/provider";
import { ApiError, problemMessage } from "@/lib/api/problem";
import { requireRole, redirectOnUnauthorized } from "@/lib/auth/session";
import { isIanaTimeZone } from "@/config/time-zones";
import type { ProviderProfileInput } from "@/lib/api/types";

const profileSchema = z.object({
  display_name: z.string().trim().min(1).max(160),
  description: z.string(),
  time_zone: z.string().refine(isIanaTimeZone),
  is_active: z.boolean(),
});

export type ProfileActionState = {
  message?: string;
  success?: boolean;
};

export async function saveProfileAction(
  _previous: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  await requireRole("provider");

  const result = profileSchema.safeParse({
    display_name: readString(formData, "display_name"),
    description: readString(formData, "description"),
    time_zone: readString(formData, "time_zone"),
    is_active: formData.get("is_active") === "on",
  });

  if (!result.success) {
    return { message: t("provider.profile.saveError") };
  }

  const input: ProviderProfileInput = result.data;
  try {
    await saveProviderProfile(input);
  } catch (error) {
    redirectOnUnauthorized(error);
    if (error instanceof ApiError) return { message: problemMessage(error) };
    throw error;
  }

  revalidateTag("services", { expire: 0 });
  return { message: t("provider.profile.saveSuccess"), success: true };
}

function readString(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}
