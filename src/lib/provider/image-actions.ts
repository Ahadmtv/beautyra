"use server";

import { revalidateTag } from "next/cache";

import { t } from "@/config/messages.fa";
import { uploadCoverImage, deleteCoverImage } from "@/lib/api/images";
import { ApiError, problemMessage } from "@/lib/api/problem";
import { requireRole, redirectOnUnauthorized } from "@/lib/auth/session";
import type { ImageActionState } from "@/lib/auth/image-actions";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function uploadCoverImageAction(
  _previous: ImageActionState,
  formData: FormData,
): Promise<ImageActionState> {
  await requireRole("provider");

  const file = formData.get("file");
  if (!file || !(file instanceof File) || file.size === 0) {
    return { message: t("image.upload.error") };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { message: t("image.upload.tooLarge") };
  }
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return { message: t("image.upload.invalidType") };
  }

  try {
    await uploadCoverImage(formData);
  } catch (error) {
    redirectOnUnauthorized(error);
    if (error instanceof ApiError) return { message: problemMessage(error) };
    return { message: t("image.upload.error") };
  }

  revalidateTag("services", { expire: 0 });
  return { message: t("image.upload.success"), success: true };
}

export async function deleteCoverImageAction(
  _previous: ImageActionState,
  _formData: FormData,
): Promise<ImageActionState> {
  await requireRole("provider");

  try {
    await deleteCoverImage();
  } catch (error) {
    redirectOnUnauthorized(error);
    if (error instanceof ApiError) return { message: problemMessage(error) };
    return { message: t("image.upload.deleteError") };
  }

  revalidateTag("services", { expire: 0 });
  return { message: t("image.upload.deleteSuccess"), success: true };
}

