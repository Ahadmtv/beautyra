"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { isServiceCategory, t, type ServiceCategory } from "@/config/messages.fa";
import {
  createProviderService,
  deactivateProviderService,
  updateProviderService,
} from "@/lib/api/provider";
import { ApiError, problemMessage } from "@/lib/api/problem";
import { parseServiceId } from "@/lib/api/service-id";
import { requireRole, redirectOnUnauthorized } from "@/lib/auth/session";
import { toAsciiDigits } from "@/lib/format/digits";

const integerSchema = z
  .string()
  .regex(/^\d+$/)
  .transform(Number)
  .refine(Number.isSafeInteger);

const serviceCategorySchema = z
  .string()
  .refine(isServiceCategory)
  .transform((value) => value as ServiceCategory);

const serviceFieldsSchema = z.object({
  name: z.string().trim().min(1).max(160),
  description: z.string(),
  category: serviceCategorySchema,
  duration_minutes: integerSchema.refine((value) => value >= 1 && value <= 1440),
  price_irr: integerSchema.refine((value) => value >= 0),
  buffer_minutes: integerSchema.refine((value) => value >= 0 && value <= 1440),
});

export type ProviderServiceActionState = {
  message?: string;
};

export async function saveProviderServiceAction(
  _previous: ProviderServiceActionState,
  formData: FormData,
): Promise<ProviderServiceActionState> {
  await requireRole("provider");

  const result = serviceFieldsSchema.safeParse({
    name: readString(formData, "name"),
    description: readString(formData, "description"),
    category: readString(formData, "category"),
    duration_minutes: toAsciiDigits(readString(formData, "duration_minutes")),
    price_irr: toAsciiDigits(readString(formData, "price_irr")),
    buffer_minutes: toAsciiDigits(readString(formData, "buffer_minutes")),
  });
  if (!result.success) return { message: t("provider.services.saveError") };

  const rawId = readString(formData, "service_id");
  const serviceId = rawId === "" ? null : parseServiceId(rawId);
  if (rawId !== "" && serviceId === null) return { message: t("api.field.invalid") };

  try {
    const service = serviceId === null
      ? await createProviderService({ ...result.data, is_active: formData.get("is_active") === "on" })
      : await updateProviderService(serviceId, result.data);
    revalidateTag("services", { expire: 0 });
    revalidateTag(`service-${service.id}`, { expire: 0 });
  } catch (error) {
    redirectOnUnauthorized(error);
    if (error instanceof ApiError) return { message: problemMessage(error) };
    throw error;
  }

  revalidatePath("/provider/services");
  redirect("/provider/services");
}

export async function mutateProviderServiceAction(
  _previous: ProviderServiceActionState,
  formData: FormData,
): Promise<ProviderServiceActionState> {
  await requireRole("provider");

  const serviceId = parseServiceId(readString(formData, "service_id"));
  const intent = readString(formData, "intent");
  if (serviceId === null || (intent !== "toggle" && intent !== "deactivate")) {
    return { message: t("api.field.invalid") };
  }

  try {
    if (intent === "deactivate") {
      await deactivateProviderService(serviceId);
    } else {
      const currentActive = readString(formData, "is_active") === "true";
      await updateProviderService(serviceId, { is_active: !currentActive });
    }
    revalidateTag("services", { expire: 0 });
    revalidateTag(`service-${serviceId}`, { expire: 0 });
  } catch (error) {
    redirectOnUnauthorized(error);
    if (error instanceof ApiError) return { message: problemMessage(error) };
    throw error;
  }

  revalidatePath("/provider/services");
  redirect("/provider/services");
}

function readString(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}
